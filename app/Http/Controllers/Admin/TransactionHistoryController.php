<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TransactionHistoryController extends Controller
{
    /**
     * Display transaction history with filters and pagination
     */
    public function index(Request $request)
    {
        try {
            $query = Order::with(['user', 'orderItems.book', 'shippingAddress'])
                ->orderBy('created_at', 'desc');

            // Filter by status
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
            }

            // Search by user name or email
            if ($request->has('search') && $request->search !== '') {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            // Pagination
            $perPage = $request->input('per_page', 20);
            $orders = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch transaction history: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch transaction history'
            ], 500);
        }
    }

    /**
     * Export transaction history to CSV
     */
    public function export(Request $request)
    {
        try {
            $query = Order::with(['user', 'orderItems.book'])
                ->orderBy('created_at', 'desc');

            // Apply same filters as index
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
            }

            if ($request->has('search') && $request->search !== '') {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            $orders = $query->get();

            // Prepare CSV data
            $csvData = [];
            $csvData[] = ['Order ID', 'User', 'Email', 'Total', 'Status', 'Date', 'Tracking Number', 'Notes'];

            foreach ($orders as $order) {
                $csvData[] = [
                    $order->id,
                    $order->user->name ?? 'N/A',
                    $order->user->email ?? 'N/A',
                    number_format($order->orderItems->sum(function ($item) {
                        return $item->price * $item->quantity;
                    }), 2),
                    $order->status,
                    $order->created_at->toDateTimeString(),
                    $order->tracking_number ?? 'N/A',
                    $order->notes ?? 'N/A'
                ];
            }

            // Generate CSV
            $filename = 'transaction_history_' . now()->format('Ymd_His') . '.csv';
            $handle = fopen('php://temp', 'r+');
            foreach ($csvData as $row) {
                fputcsv($handle, $row);
            }
            rewind($handle);
            $csvContent = stream_get_contents($handle);
            fclose($handle);

            return response($csvContent, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"$filename\""
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to export transaction history: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to export transaction history'
            ], 500);
        }
    }
}
