<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Book;
use App\Models\User;
<<<<<<< HEAD
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
=======
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
>>>>>>> b5820b4 (fix(admin): redesign booklist view)

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function index(Request $request)
    {
<<<<<<< HEAD
        try {
            // Total books
            $totalBooks = Book::count();

            // Total users (exclude admin/librarian)
            $totalUsers = User::whereIn('role', ['user', 'member'])->count();

            // Total orders
            $totalOrders = Order::count();

            // Revenue today (paid/completed orders only)
            $todayRevenue = Order::whereIn('status', ['paid', 'processing', 'shipped', 'completed'])
                ->whereDate('created_at', Carbon::today())
                ->sum('total_price');

            // New users today
            $newUsersToday = User::whereDate('created_at', Carbon::today())
                ->whereIn('role', ['user', 'member'])
                ->count();

            // Recent Orders Activity
            $recentOrders = Order::with(['user'])
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($order) {
                    return [
                        'type' => 'order',
                        'title' => 'Pesanan Baru #' . $order->id,
                        'description' => ($order->user ? $order->user->name : 'Pengguna Tidak Diketahui') . ' - ' . $order->status,
                        'time' => $order->created_at->diffForHumans(),
                        'created_at' => $order->created_at,
                    ];
                });

            // Recent Users Activity
            $recentUsers = User::whereIn('role', ['user', 'member'])
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($user) {
                    return [
                        'type' => 'user',
                        'title' => 'Pengguna Baru',
                        'description' => $user->name . ' - ' . $user->email,
                        'time' => $user->created_at->diffForHumans(),
                        'created_at' => $user->created_at,
                    ];
                });

            // Combine and sort activities
            $recentActivity = $recentOrders->merge($recentUsers)
                ->sortByDesc('created_at')
                ->take(5)
                ->values()
                ->map(function ($item) {
                    unset($item['created_at']);
                    return $item;
                })
                ->toArray();

            Log::info('Dashboard data loaded successfully', [
                'total_books' => $totalBooks,
                'total_users' => $totalUsers,
                'total_orders' => $totalOrders,
                'today_revenue' => $todayRevenue,
                'new_users_today' => $newUsersToday,
                'recent_activity_count' => count($recentActivity),
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'statistics' => [
                        'total_books' => $totalBooks,
                        'total_users' => $totalUsers,
                        'total_orders' => $totalOrders,
                        'today_revenue' => (float) $todayRevenue,
                        'new_users_today' => $newUsersToday,
                    ],
                    'recent_activity' => $recentActivity,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data dashboard. Silakan coba lagi nanti.',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal Server Error',
            ], 500);
        }
=======
        // Total books
        $totalBooks = Book::count();

        // Total users
        $totalUsers = User::count();

        // Total orders
        $totalOrders = Order::count();

        // Revenue today (paid/completed orders)
        $todayRevenue = Order::whereIn('status', ['paid', 'completed'])
            ->whereDate('order_date', Carbon::today())
            ->sum('total_price');

        // New users today
        $newUsersToday = User::whereDate('created_at', Carbon::today())->count();

        // Recent activity: Last 5 orders (or mix with user registrations)
        $recentOrders = Order::with(['user', 'orderItems.book'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'type' => 'order',
                    'title' => 'Pembelian baru - Order #' . $order->id,
                    'description' => $order->user->name . ' membeli ' . ($order->orderItems->count() ?? 0) . ' item',
                    'time' => $order->created_at->diffForHumans(),
                ];
            });

        // Recent users (last 5 registrations)
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'user',
                    'title' => 'Pelanggan baru terdaftar',
                    'description' => $user->name . ' (' . $user->email . ')',
                    'time' => $user->created_at->diffForHumans(),
                ];
            });

        // Combine recent activity (orders + users, limit 5 total)
        $recentActivity = collect($recentOrders)->merge($recentUsers)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => [
                    'total_books' => $totalBooks,
                    'total_users' => $totalUsers,
                    'total_orders' => $totalOrders,
                    'today_revenue' => (float) $todayRevenue,
                    'new_users_today' => $newUsersToday,
                ],
                'recent_activity' => $recentActivity,
            ],
        ]);
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
    }
}
