<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    /**
     * Display the specified order's details.
     *
     * @param  int  $orderId
     * @return \Illuminate\Http\Response
     */
    public function show($orderId)
    {
        $order = Order::with('user', 'orderItems.book')->findOrFail($orderId);
        $orderItems = $order->orderItems; // Relasi ke OrderItem

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
                'order_items' => $orderItems
            ]
        ]);
    }
}
