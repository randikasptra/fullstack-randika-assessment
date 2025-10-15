<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardUserController extends Controller
{
    /**
     * Get user's dashboard data
     */
    public function index()
    {
        $userId = auth()->id();

        // Statistics
        $totalOrders = Order::where('user_id', $userId)->count();
        $paidOrders = Order::where('user_id', $userId)->whereIn('status', ['paid', 'completed'])->count();
        $totalSpending = Order::where('user_id', $userId)->whereIn('status', ['paid', 'completed'])->sum('total_price');
        $cartItemsCount = Cart::where('user_id', $userId)->count();

        $statistics = [
            'total_orders' => $totalOrders,
            'total_spending' => (float) $totalSpending,
            'cart_items_count' => $cartItemsCount,
            'paid_orders' => $paidOrders,
        ];

        // Recent orders (last 5)
        $recentOrders = Order::with(['orderItems.book', 'shippingAddress'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                $order->orderItems = $order->orderItems->take(3); // Limit items per order
                return $order;
            });

        // Popular books (buku yang paling sering dibeli user, last 5)
        $popularBooks = OrderItem::select('book_id', DB::raw('SUM(quantity) as total_purchased'))
            ->whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)->whereIn('status', ['paid', 'completed']);
            })
            ->groupBy('book_id')
            ->orderBy('total_purchased', 'desc')
            ->limit(5)
            ->with('book')
            ->get()
            ->pluck('book')
            ->map(function ($book) use ($userId) {
                $book->total_purchased = OrderItem::where('book_id', $book->id)
                    ->whereHas('order', function ($q) use ($userId) {
                        $q->where('user_id', $userId)->whereIn('status', ['paid', 'completed']);
                    })
                    ->sum('quantity');
                return $book;
            });

        // Monthly spending (last 6 months) - REVISI: GROUP BY expression langsung, sort di PHP
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subMonths(5); // 6 months including current

        $monthlySpending = Order::select(
            DB::raw('DATE_FORMAT(order_date, "%b %Y") as month'),
            DB::raw('SUM(total_price) as total')
        )
            ->where('user_id', $userId)
            ->whereIn('status', ['paid', 'completed'])
            ->whereBetween('order_date', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE_FORMAT(order_date, "%b %Y")'))
            ->get()
            ->toArray();

        // Sort by month chronologically (PHP)
        usort($monthlySpending, function ($a, $b) {
            $dateA = Carbon::createFromFormat('M Y', $a['month']);
            $dateB = Carbon::createFromFormat('M Y', $b['month']);
            return $dateA->timestamp <=> $dateB->timestamp;
        });

        // Fill missing months with 0
        $allMonths = [];
        $currentDate = $startDate->copy();
        for ($i = 0; $i < 6; $i++) {
            $monthKey = $currentDate->format('M Y');
            $allMonths[] = [
                'month' => $monthKey,
                'total' => 0,
            ];
            $currentDate->addMonth();
        }

        foreach ($monthlySpending as $spend) {
            $key = array_search($spend['month'], array_column($allMonths, 'month'));
            if ($key !== false) {
                $allMonths[$key]['total'] = (float) $spend['total'];
            }
        }

        $monthlySpending = $allMonths;

        // Suggested books (random 4 books from categories user has bought, or all if none) - REVISI: Explicit join untuk avoid column error
        $userCategories = OrderItem::join('books', 'order_items.book_id', '=', 'books.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.user_id', $userId)
            ->whereIn('orders.status', ['paid', 'completed'])
            ->select('books.category_id')
            ->distinct()
            ->pluck('category_id');

        $suggestedBooksQuery = Book::where('stock', '>', 0);
        if ($userCategories->isNotEmpty()) {
            $suggestedBooksQuery->whereIn('category_id', $userCategories);
        }

        $suggestedBooks = $suggestedBooksQuery->inRandomOrder()->limit(4)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $statistics,
                'recent_orders' => $recentOrders,
                'popular_books' => $popularBooks,
                'monthly_spending' => $monthlySpending,
                'suggested_books' => $suggestedBooks,
            ],
        ]);
    }
}
