<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Book;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get user dashboard statistics
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Total orders by status
        $totalOrders = Order::where('user_id', $user->id)->count();
        $pendingOrders = Order::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();
        $paidOrders = Order::where('user_id', $user->id)
            ->where('status', 'paid')
            ->count();
        $cancelledOrders = Order::where('user_id', $user->id)
            ->where('status', 'cancelled')
            ->count();

        // Total spending
        $totalSpending = Order::where('user_id', $user->id)
            ->where('status', 'paid')
            ->sum('total_price');

        // Cart items count
        $cartItemsCount = Cart::where('user_id', $user->id)->count();

        // Recent orders (last 5)
        $recentOrders = Order::with(['orderItems.book'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Most purchased books (top 5)
        $popularBooks = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('books', 'order_items.book_id', '=', 'books.id')
            ->where('orders.user_id', $user->id)
            ->where('orders.status', 'paid')
            ->select(
                'books.id',
                'books.title',
                'books.author',
                'books.image_url',
                'books.price',
                DB::raw('SUM(order_items.quantity) as total_purchased')
            )
            ->groupBy('books.id', 'books.title', 'books.author', 'books.image_url', 'books.price')
            ->orderBy('total_purchased', 'desc')
            ->limit(5)
            ->get();

        // Monthly spending (last 6 months)
        $monthlySpending = Order::where('user_id', $user->id)
            ->where('status', 'paid')
            ->where('paid_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw('DATE_FORMAT(paid_at, "%Y-%m") as month'),
                DB::raw('SUM(total_price) as total')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        // Latest available books (suggestions)
        $suggestedBooks = Book::where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => [
                    'total_orders' => $totalOrders,
                    'pending_orders' => $pendingOrders,
                    'paid_orders' => $paidOrders,
                    'cancelled_orders' => $cancelledOrders,
                    'total_spending' => (int) $totalSpending, // Cast ke int
                    'cart_items_count' => $cartItemsCount,
                ],
                'recent_orders' => $recentOrders,
                'popular_books' => $popularBooks,
                'monthly_spending' => $monthlySpending,
                'suggested_books' => $suggestedBooks,
            ],
        ]);
    }

    /**
     * Get order statistics by status
     */
    public function orderStats(Request $request)
    {
        $user = $request->user();

        $stats = Order::where('user_id', $user->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->keyBy('status')
            ->map(fn ($item) => $item->count);

        return response()->json([
            'success' => true,
            'data' => [
                'pending' => $stats['pending'] ?? 0,
                'paid' => $stats['paid'] ?? 0,
                'cancelled' => $stats['cancelled'] ?? 0,
                'shipped' => $stats['shipped'] ?? 0,
                'completed' => $stats['completed'] ?? 0,
            ],
        ]);
    }

    /**
     * Get spending analytics
     */
    public function spendingAnalytics(Request $request)
    {
        $user = $request->user();
        $months = $request->input('months', 12); // Default 12 months

        $analytics = Order::where('user_id', $user->id)
            ->where('status', 'paid')
            ->where('paid_at', '>=', now()->subMonths($months))
            ->select(
                DB::raw('DATE_FORMAT(paid_at, "%Y-%m") as month'),
                DB::raw('SUM(total_price) as total'),
                DB::raw('COUNT(*) as order_count')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $analytics,
        ]);
    }
}
