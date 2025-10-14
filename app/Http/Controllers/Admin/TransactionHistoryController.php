<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class TransactionHistoryController extends Controller
{
    /**
     * Tampilkan semua transaksi (completed & cancelled)
     */
    public function index()
    {
        try {
            $transactions = Order::with(['user', 'orderItems.book', 'shippingAddress'])
                ->whereIn('status', ['completed', 'cancelled'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $transactions
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch transaction history: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch transaction history.'
            ], 500);
        }
    }

    /**
     * Detail transaksi berdasarkan ID
     */
    public function show($id)
    {
        try {
            $transaction = Order::with(['user', 'orderItems.book', 'shippingAddress'])
                ->whereIn('status', ['completed', 'cancelled'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $transaction
            ]);
        } catch (\Exception $e) {
            Log::error('Transaction not found: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found.'
            ], 404);
        }
    }
}
