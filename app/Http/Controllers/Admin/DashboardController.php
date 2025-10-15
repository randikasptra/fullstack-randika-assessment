<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function index(Request $request)
    {
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
    }
}
