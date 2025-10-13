<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
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

    public function show($id)
    {
        $order = Order::with(['orderItems.book', 'shippingAddress'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function cancel($id)
    {
        $order = Order::with('orderItems.book')
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Order tidak dapat dibatalkan',
            ], 400);
        }

        $order->update(['status' => 'cancelled']);

        // Kembalikan stok
        foreach ($order->orderItems as $item) {
            $item->book->increment('stock', $item->quantity);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order berhasil dibatalkan',
        ]);
    }
}
