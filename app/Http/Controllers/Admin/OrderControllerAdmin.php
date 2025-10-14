<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Ambil semua orders dengan relasi user dan items
     */
    public function index()
    {
        try {
            $orders = Order::with(['user', 'orderItems.book', 'shippingAddress'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch orders: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detail order by ID
     */
    public function show($id)
    {
        try {
            // hapus pemanggilan relasi orderLogs karena tidak ada
            $order = Order::with(['user', 'orderItems.book', 'shippingAddress'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Order not found: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
    }

    /**
     * Update status order (khusus untuk admin)
     * Allowed transitions: pending -> paid -> shipped -> completed
     * or cancelled anytime.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            // tambahkan 'paid' karena admin mungkin perlu set paid
            'status' => 'required|in:pending,paid,shipped,completed,cancelled'
        ]);

        DB::beginTransaction();

        try {
            $order = Order::with('orderItems.book')->findOrFail($id);
            $oldStatus = $order->status;
            $newStatus = $request->status;

            // Validasi: untuk shipped/completed harus sudah paid
            if (in_array($newStatus, ['shipped', 'completed']) && $oldStatus !== 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot update status. Order must be paid first.'
                ], 400);
            }

            // Jika order di-cancel, kembalikan stok (hanya jika sebelumnya paid/shipped)
            if ($newStatus === 'cancelled' && in_array($oldStatus, ['paid', 'shipped'])) {
                foreach ($order->orderItems as $item) {
                    $book = $item->book;
                    if ($book) {
                        // Pastikan field stock ada di model Book
                        $book->stock = $book->stock + $item->quantity;
                        $book->save();
                    }
                }
            }

            // Update status
            $order->status = $newStatus;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order->load(['user', 'orderItems.book', 'shippingAddress'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update order status: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update tracking number and notes
     */
    public function updateTrackingAndNotes(Request $request, $id)
    {
        $request->validate([
            'tracking_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::findOrFail($id);
            $order->tracking_number = $request->tracking_number ?? $order->tracking_number;
            $order->notes = $request->notes ?? $order->notes;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tracking and notes updated successfully',
                'data' => $order->load(['user', 'orderItems.book', 'shippingAddress'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update tracking/notes: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update tracking/notes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete order (opsional, untuk admin)
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $order = Order::with('orderItems.book')->findOrFail($id);

            // Kembalikan stok jika order sudah paid/shipped
            if (in_array($order->status, ['paid', 'shipped'])) {
                foreach ($order->orderItems as $item) {
                    $book = $item->book;
                    if ($book) {
                        $book->stock = $book->stock + $item->quantity;
                        $book->save();
                    }
                }
            }

            // Hapus order (pastikan relation cascade/foreign key di DB)
            $order->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete order: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order: ' . $e->getMessage()
            ], 500);
        }
    }
}
