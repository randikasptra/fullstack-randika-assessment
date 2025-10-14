<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get user's order list
     */
    public function index()
    {
        $orders = Order::with(['orderItems.book', 'shippingAddress'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Get order detail
     */
    public function show($orderId)
    {
        $order = Order::with(['orderItems.book', 'shippingAddress', 'user'])
            ->where('user_id', auth()->id())
            ->findOrFail($orderId);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Cancel order (only for pending status)
     */
    public function cancel($orderId)
    {
        $order = Order::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->findOrFail($orderId);

        DB::beginTransaction();
        try {
            // Kembalikan stok buku
            foreach ($order->orderItems as $item) {
                $item->book->increment('stock', $item->quantity);
            }

            // Update status order
            $order->update(['status' => 'cancelled']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibatalkan',
                'data' => $order->fresh(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membatalkan pesanan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Delete order (only for cancelled status)
     */
    public function destroy($orderId)
    {
        $order = Order::where('user_id', auth()->id())
            ->findOrFail($orderId);

        // Hanya order dengan status 'cancelled' yang bisa dihapus
        if ($order->status !== 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya pesanan yang dibatalkan yang dapat dihapus',
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Hapus order items dulu (cascade akan handle ini jika sudah setup di migration)
            $order->orderItems()->delete();

            // Hapus shipping address jika ada
            if ($order->shippingAddress) {
                $order->shippingAddress->delete();
            }

            // Hapus order
            $order->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dihapus dari riwayat',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pesanan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
