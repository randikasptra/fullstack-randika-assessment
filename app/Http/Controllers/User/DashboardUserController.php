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
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;

class DashboardUserController extends Controller
{
    /**
     * Get user's dashboard data with statistics, orders, books, and analytics.
     *
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function index(): JsonResponse
    {
        try {
            $this->authorizeUser(); // Ensure authenticated user

            $userId = auth()->id();

            return response()->json([
                'success' => true,
                'data' => [
                    'statistics' => $this->getStatistics($userId),
                    'recent_orders' => $this->getRecentOrders($userId),
                    'popular_books' => $this->getPopularBooks($userId),
                    'monthly_spending' => $this->getMonthlySpending($userId),
                    'suggested_books' => $this->getSuggestedBooks($userId),
                ],
            ]);
        } catch (AuthorizationException $e) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            // Log error in production: \Log::error('Dashboard error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    /**
     * Get user statistics (orders, spending, cart).
     *
     * @param int $userId
     * @return array
     */
    private function getStatistics(int $userId): array
    {
        $totalOrders = Order::where('user_id', $userId)->count();
        $paidOrders = Order::where('user_id', $userId)
            ->whereIn('status', ['paid', 'completed'])
            ->count();
        $totalSpending = Order::where('user_id', $userId)
            ->whereIn('status', ['paid', 'completed'])
            ->sum('total_price');
        $cartItemsCount = Cart::where('user_id', $userId)->count();

        return [
            'total_orders' => $totalOrders,
            'total_spending' => (float) $totalSpending,
            'cart_items_count' => $cartItemsCount,
            'paid_orders' => $paidOrders,
        ];
    }

    /**
     * Get recent orders with limited items.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getRecentOrders(int $userId)
    {
        return Order::with(['orderItems.book', 'shippingAddress'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                $order->orderItems = $order->orderItems->take(3);
                return $order;
            });
    }

    /**
     * Get popular books purchased by user.
     *
     * @param int $userId
     * @return \Illuminate\Support\Collection
     */
    private function getPopularBooks(int $userId)
    {
        return OrderItem::select('book_id', DB::raw('SUM(quantity) as total_purchased'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id') // Explicit join to avoid issues
            ->where('orders.user_id', $userId)
            ->whereIn('orders.status', ['paid', 'completed'])
            ->groupBy('book_id')
            ->orderBy('total_purchased', 'desc')
            ->limit(5)
            ->with('book')
            ->get()
            ->pluck('book')
            ->values(); // Avoid map() re-query; use join sum directly
    }

    /**
     * Get monthly spending for last 6 months, filling gaps with 0.
     *
     * @param int $userId
     * @return array
     */
    private function getMonthlySpending(int $userId): array
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subMonths(5);

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

        // Sort chronologically
        usort($monthlySpending, function ($a, $b) {
            $dateA = Carbon::createFromFormat('M Y', $a['month']);
            $dateB = Carbon::createFromFormat('M Y', $b['month']);
            return $dateA->timestamp <=> $dateB->timestamp;
        });

        // Fill missing months
        $allMonths = [];
        $currentDate = $startDate->copy();
        for ($i = 0; $i < 6; $i++) {
            $monthKey = $currentDate->format('M Y');
            $allMonths[] = ['month' => $monthKey, 'total' => 0];
            $currentDate->addMonth();
        }

        foreach ($monthlySpending as $spend) {
            $key = array_search($spend['month'], array_column($allMonths, 'month'));
            if ($key !== false) {
                $allMonths[$key]['total'] = (float) $spend['total'];
            }
        }

        return $allMonths;
    }

    /**
     * Get suggested books based on user categories.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getSuggestedBooks(int $userId)
    {
        $userCategories = OrderItem::join('books', 'order_items.book_id', '=', 'books.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.user_id', $userId)
            ->whereIn('orders.status', ['paid', 'completed'])
            ->distinct()
            ->pluck('books.category_id');

        $query = Book::where('stock', '>', 0);
        if ($userCategories->isNotEmpty()) {
            $query->whereIn('category_id', $userCategories);
        }

        return $query->inRandomOrder()->limit(4)->get();
    }

    /**
     * Authorize the request for authenticated user only.
     *
     * @return void
     * @throws AuthorizationException
     */
    private function authorizeUser(): void
    {
        if (!auth()->check()) {
            throw new AuthorizationException('User not authenticated.');
        }
    }

    // Contoh Unit Test (implement di tests/Feature/DashboardUserControllerTest.php)
    // public function test_dashboard_returns_data_for_authenticated_user() { ... }
}
