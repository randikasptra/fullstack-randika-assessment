<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Book;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function index(Request $request)
    {
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
    }
}
