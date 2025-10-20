<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class DashboardController extends Controller
{
    private const PER_PAGE_ACTIVITY = 7;

    /**
     * Get admin dashboard with statistics and trends.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();

            $statistics = $this->getStatistics();
            $recentActivity = $this->getRecentActivity($request); // Pass $request
            $monthlyRevenue = $this->getMonthlyRevenue();
            $lowStockBooks = Book::where('stock', '<', 5)->count();

            Log::info('Admin Dashboard Loaded', [
                'admin_id' => $userId,
                'stats' => $statistics,
                'activity_count' => $recentActivity->total(),
                'monthly_revenue_count' => count($monthlyRevenue),
                'low_stock_books' => $lowStockBooks,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'statistics' => array_merge($statistics, ['low_stock_books' => $lowStockBooks]),
                    'recent_activity' => $recentActivity->items(),
                    'monthly_revenue' => $monthlyRevenue,
                    'meta' => [
                        'activity' => [
                            'current_page' => $recentActivity->currentPage(),
                            'last_page' => $recentActivity->lastPage(),
                            'total' => $recentActivity->total(),
                            'per_page' => $recentActivity->perPage(),
                        ],
                    ],
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Admin Dashboard Error', [
                'admin_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard',
                'error' => app()->environment('local') ? $e->getMessage() : 'Internal Error',
            ], 500);
        }
    }

    /**
     * Get core statistics.
     */
    private function getStatistics(): array
    {
        return [
            'total_books' => Book::count(),
            'total_users' => User::whereIn('role', ['user', 'member'])->count(),
            'total_orders' => Order::count(),
            'today_revenue' => Order::whereIn('status', ['paid', 'processing', 'shipped', 'completed'])
                ->whereDate('created_at', Carbon::today())
                ->sum('total_price'),
            'new_users_today' => User::whereIn('role', ['user', 'member'])
                ->whereDate('created_at', Carbon::today())
                ->count(),
        ];
    }

    /**
     * Get recent activity with pagination.
     * Fixed: Pass Request object to access url()
     */
    private function getRecentActivity(Request $request): LengthAwarePaginator
    {
        $page = $request->get('page', 1);
        $perPage = self::PER_PAGE_ACTIVITY;

        // Get orders and users
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(50) // Limit total records for performance
            ->get()
            ->map(fn ($order) => [
                'type' => 'order',
                'title' => 'Pesanan Baru #' . $order->id,
                'description' => ($order->user?->name ?? 'Unknown') . ' - ' . $order->status,
                'time' => $order->created_at->diffForHumans(),
                'created_at' => $order->created_at,
            ]);

        $recentUsers = User::whereIn('role', ['user', 'member'])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(fn ($user) => [
                'type' => 'user',
                'title' => 'Pengguna Baru',
                'description' => $user->name . ' - ' . $user->email,
                'time' => $user->created_at->diffForHumans(),
                'created_at' => $user->created_at,
            ]);

        // Merge and sort
        $activity = $recentOrders->merge($recentUsers)
            ->sortByDesc('created_at');

        // Manual pagination
        $paginatedItems = $activity->forPage($page, $perPage)->values();

        return new LengthAwarePaginator(
            $paginatedItems,
            $activity->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'pageName' => 'page']
        );
    }

    /**
     * Get monthly revenue for last 6 months.
     */
    private function getMonthlyRevenue(): array
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subMonths(5);

        return Order::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('SUM(total_price) as revenue')
        )
            ->whereIn('status', ['paid', 'completed'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($item) => [
                'month' => Carbon::createFromFormat('Y-m', $item->month)->format('M Y'),
                'revenue' => (float) $item->revenue,
            ])
            ->toArray();
    }
}
