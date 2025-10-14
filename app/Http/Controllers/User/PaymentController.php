<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function getSnapToken($orderId)
    {
        $order = Order::with(['orderItems.book', 'shippingAddress', 'user'])
            ->where('user_id', auth()->id())
            ->findOrFail($orderId);

        // Allow generate/regenerate kalau pending, cancelled, atau expired (buat retry)
        if (!in_array($order->status, ['pending', 'cancelled', 'expired'])) {
            return response()->json([
                'success' => false,
                'message' => 'Order sudah diproses atau dibatalkan',
            ], 400);
        }

        // Reset status ke pending kalau cancelled/expired (buat retry, stok udah balik via webhook)
        if ($order->status !== 'pending') {
            $order->update(['status' => 'pending', 'snap_token' => null]);
            Log::info('Reset order for retry', ['order_id' => $orderId]);
        }

        // Jika sudah ada snap token, return yang lama
        if ($order->snap_token) {
            return response()->json([
                'success' => true,
                'snap_token' => $order->snap_token,
                'order' => $order,
            ]);
        }

        // Build item details
        $itemDetails = [];
        foreach ($order->orderItems as $item) {
            $itemDetails[] = [
                'id' => $item->book_id,
                'price' => (int) $item->price,
                'quantity' => $item->quantity,
                'name' => $item->book->title,
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => 'ORDER-' . $order->id . '-' . time(),
                'gross_amount' => (int) $order->total_price,
            ],
            'item_details' => $itemDetails,
            'customer_details' => [
                'first_name' => $order->shippingAddress->recipient_name,
                'email' => $order->user->email,
                'phone' => $order->shippingAddress->phone,
                'shipping_address' => [
                    'first_name' => $order->shippingAddress->recipient_name,
                    'phone' => $order->shippingAddress->phone,
                    'address' => $order->shippingAddress->address,
                    'city' => $order->shippingAddress->city,
                    'postal_code' => $order->shippingAddress->postal_code,
                ],
            ],
            // Custom expiry 15 menit (tanpa start_time biar default current time)
            'expiry' => [
                'duration' => 15,
                'unit' => 'minute',  // Lowercase sesuai doc Midtrans
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            // Save snap token
            $order->update(['snap_token' => $snapToken]);

            Log::info('Snap token generated', ['order_id' => $orderId]);

            return response()->json([
                'success' => true,
                'snap_token' => $snapToken,
                'order' => $order->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Snap token error', ['order_id' => $orderId, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat payment token: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $orderId)
    {
        $validated = $request->validate([
            'status' => 'required|in:paid,pending,cancelled,expired',
            'transaction_id' => 'nullable|string',
            'payment_type' => 'nullable|string',
        ]);

        $order = Order::where('user_id', auth()->id())
            ->findOrFail($orderId);

        if ($order->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Order sudah dibayar',
            ], 400);
        }

        $updateData = [
            'status' => $validated['status'],
        ];

        if ($validated['status'] === 'paid') {
            $updateData['paid_at'] = now();

            if (isset($validated['payment_type'])) {
                $updateData['payment_type'] = $validated['payment_type'];
            }
        }

        $order->update($updateData);

        Log::info('Status updated from frontend', ['order_id' => $orderId, 'new_status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diupdate',
            'order' => $order->fresh(),
        ]);
    }

    public function notification(Request $request)
    {
        try {
            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status;
            $paymentType = $notification->payment_type;

            // Extract order ID dari order_id format: ORDER-{id}-{timestamp}
            preg_match('/ORDER-(\d+)-/', $orderId, $matches);
            $orderIdNumber = $matches[1] ?? null;

            if (!$orderIdNumber) {
                Log::warning('Invalid order ID in webhook', ['order_id' => $orderId]);
                return response('OK', 200);  // Plain OK biar Midtrans gak retry
            }

            $order = Order::with('orderItems.book')->find($orderIdNumber);

            if (!$order) {
                Log::warning('Order not found in webhook', ['order_id' => $orderIdNumber]);
                return response('OK', 200);
            }

            DB::beginTransaction();  // Safety buat update & stock
            try {
                if ($transactionStatus == 'capture') {
                    if ($fraudStatus == 'accept') {
                        $order->update([
                            'status' => 'paid',
                            'payment_type' => $paymentType,
                            'paid_at' => now(),
                        ]);
                        Log::info('Payment captured (success)', ['order_id' => $orderIdNumber]);
                    }
                } elseif ($transactionStatus == 'settlement') {
                    $order->update([
                        'status' => 'paid',
                        'payment_type' => $paymentType,
                        'paid_at' => now(),
                    ]);
                    Log::info('Payment settled (success)', ['order_id' => $orderIdNumber]);
                } elseif ($transactionStatus == 'pending') {
                    Log::info('Payment pending', ['order_id' => $orderIdNumber]);
                } elseif ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
                    $order->update(['status' => 'cancelled']);  // Atau 'expired' kalau enum mu beda

                    // Kembalikan stok
                    foreach ($order->orderItems as $item) {
                        $item->book->increment('stock', $item->quantity);
                        Log::info('Stock restored on expire', [
                            'order_id' => $orderIdNumber,
                            'book_id' => $item->book_id,
                            'quantity' => $item->quantity,
                        ]);
                    }
                    Log::info('Order expired/cancelled & stock restored', ['order_id' => $orderIdNumber]);
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Webhook transaction failed', ['error' => $e->getMessage(), 'order_id' => $orderIdNumber]);
            }

            return response('OK', 200);  // Plain OK
        } catch (\Exception $e) {
            Log::error('Webhook error', ['error' => $e->getMessage()]);
            return response('OK', 200);  // Selalu OK biar gak retry
        }
    }
}
