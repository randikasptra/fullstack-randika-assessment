<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
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

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Order sudah diproses',
            ], 400);
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
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            // Save snap token
            $order->update(['snap_token' => $snapToken]);

            return response()->json([
                'success' => true,
                'snap_token' => $snapToken,
                'order' => $order,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat payment token: ' . $e->getMessage(),
            ], 500);
        }
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
                return response()->json(['success' => false, 'message' => 'Invalid order ID'], 400);
            }

            $order = Order::find($orderIdNumber);

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            // Handle status berdasarkan response Midtrans
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $order->update([
                        'status' => 'paid',
                        'payment_type' => $paymentType,
                        'paid_at' => now(),
                    ]);
                }
            } elseif ($transactionStatus == 'settlement') {
                $order->update([
                    'status' => 'paid',
                    'payment_type' => $paymentType,
                    'paid_at' => now(),
                ]);
            } elseif ($transactionStatus == 'pending') {
                // Keep as pending
            } elseif ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
                $order->update(['status' => 'cancelled']);

                // Kembalikan stok
                foreach ($order->orderItems as $item) {
                    $item->book->increment('stock', $item->quantity);
                }
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
