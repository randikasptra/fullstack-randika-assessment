<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderLog;
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
            $order = Order::with(['user', 'orderItems.book', 'shippingAddress', 'orderLogs.updatedBy'])
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
     * Admin hanya bisa update dari: paid → shipped → completed
     * atau cancelled kapan saja. Auto-log ke order_logs.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:shipped,completed,cancelled'
        ]);

        DB::beginTransaction();

        try {
            $order = Order::with('orderItems.book')->findOrFail($id);
            $oldStatus = $order->status;
            $newStatus = $request->status;

            // Validasi: order harus sudah paid untuk bisa di-ship/complete
            if (in_array($newStatus, ['shipped', 'completed']) && $oldStatus !== 'paid') {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot update status. Order must be paid first.'
                ], 400);
            }

            // Jika order di-cancel, kembalikan stok (hanya jika sebelumnya paid/shipped)
            if ($newStatus === 'cancelled' && in_array($oldStatus, ['paid', 'shipped'])) {
                foreach ($order->orderItems as $item) {
                    $book = $item->book;
                    $book->stock += $item->quantity;
                    $book->save();
                }
            }

            // Update status
            $order->status = $newStatus;
            $order->save();

            // Auto-log ke order_logs
            OrderLog::create([
                'order_id' => $order->id,
                'status' => $newStatus,
                'updated_by' => Auth::id(), // Asumsi auth user adalah admin
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order->load(['user', 'orderItems.book', 'shippingAddress', 'orderLogs'])
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

            // Opsional: Log jika ada perubahan tracking (bisa extend OrderLog jika perlu)

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tracking and notes updated successfully',
                'data' => $order->load(['user', 'orderItems.book', 'shippingAddress', 'orderLogs'])
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
                    $book->stock += $item->quantity;
                    $book->save();
                }
            }

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
