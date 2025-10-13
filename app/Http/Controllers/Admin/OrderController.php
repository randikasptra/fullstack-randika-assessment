<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Tambah import ini untuk logging

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        Log::info('Admin Orders Index Called', [
            'user_id' => auth()->id(),
            'params' => $request->all(),
        ]);

        try {
            $query = Order::with(['user', 'orderItems.book'])
                ->orderBy('created_at', 'desc');

            // Search and filter
            if ($search = $request->get('search')) {
                Log::info('Applying search filter', ['search' => $search]);
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%")
                                    ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            }

            if ($status = $request->get('status')) {
                Log::info('Applying status filter', ['status' => $status]);
                $query->where('status', $status);
            }

            $orders = $query->paginate(10);
            Log::info('Orders Query Executed', [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
            ]);

            return response()->json([
                'success' => true,
                'data' => $orders,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in Admin Orders Index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat pesanan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        Log::info('Admin Order Show Called', ['order_id' => $id, 'user_id' => auth()->id()]);

        try {
            $order = Order::with(['user', 'orderItems.book'])
                ->findOrFail($id);

            Log::info('Order Found', ['order_id' => $id, 'status' => $order->status]);

            return response()->json([
                'success' => true,
                'data' => $order,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in Admin Order Show', [
                'order_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, $id)
    {
        Log::info('Admin Update Status Called', ['order_id' => $id, 'new_status' => $request->status]);

        $request->validate([
            'status' => 'required|in:pending,paid,shipped,completed,cancelled',
        ]);

        try {
            $order = Order::findOrFail($id);

            // Handle stock return on cancel
            if ($request->status === 'cancelled' && $order->status !== 'cancelled') {
                Log::info('Returning stock for cancel', ['order_id' => $id]);
                foreach ($order->orderItems as $item) {
                    $item->book->increment('stock', $item->quantity);
                }
            }

            $order->update([
                'status' => $request->status,
            ]);

            Log::info('Status Updated Successfully', ['order_id' => $id, 'old_status' => $order->getOriginal('status'), 'new_status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Status pesanan berhasil diupdate',
                'data' => $order->load(['orderItems.book']),
            ]);
        } catch (\Exception $e) {
            Log::error('Error in Admin Update Status', [
                'order_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal update status',
            ], 500);
        }
    }

    /**
     * Cancel order.
     */
    public function cancel($id)
    {
        Log::info('Admin Cancel Order Called', ['order_id' => $id]);

        try {
            $order = Order::with('orderItems.book')->findOrFail($id);

            if ($order->status === 'cancelled') {
                Log::warning('Order already cancelled', ['order_id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Pesanan sudah dibatalkan',
                ], 400);
            }

            $order->update(['status' => 'cancelled']);

            // Return stock
            foreach ($order->orderItems as $item) {
                $item->book->increment('stock', $item->quantity);
                Log::info('Stock returned', ['book_id' => $item->book_id, 'quantity' => $item->quantity]);
            }

            Log::info('Order Cancelled Successfully', ['order_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibatalkan',
                'data' => $order,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in Admin Cancel Order', [
                'order_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal membatalkan pesanan',
            ], 500);
        }
    }

    /**
     * Get order statistics for admin dashboard.
     */
    public function stats()
    {
        Log::info('Admin Order Stats Called', ['user_id' => auth()->id()]);

        try {
            $totalOrders = Order::count();
            $pendingOrders = Order::where('status', 'pending')->count();
            $paidOrders = Order::where('status', 'paid')->count();
            $totalRevenue = Order::where('status', 'paid')->sum('total_price');

            Log::info('Order Stats Generated', [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_revenue' => $totalRevenue,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'total_orders' => $totalOrders,
                    'pending_orders' => $pendingOrders,
                    'paid_orders' => $paidOrders,
                    'total_revenue' => $totalRevenue,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in Admin Order Stats', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat statistik',
            ], 500);
        }
    }
}
