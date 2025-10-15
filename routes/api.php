<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\DashboardController; // ⭐ TAMBAHKAN INI
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\CheckoutController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\Admin\OrderControllerAdmin;
use App\Http\Controllers\User\BookUserController;
use App\Http\Controllers\User\DashboardUserController;
use App\Http\Controllers\Admin\TransactionHistoryController;
use App\Events\StockUpdatedEvent;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

// ============================================
// 🔓 PUBLIC ROUTES (No Authentication)
// ============================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Midtrans Webhook (Public - untuk callback dari Midtrans)
Route::post('/payment/notification', [PaymentController::class, 'notification']);

// ============================================
// 🔒 AUTHENTICATED ROUTES (All Roles)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Settings Routes (All authenticated users)
    Route::prefix('settings')->group(function () {
        Route::get('/profile', [SettingsController::class, 'profile']);
        Route::put('/update-name', [SettingsController::class, 'updateName']);
        Route::put('/update-password', [SettingsController::class, 'updatePassword']);
    });
});

// ============================================
// 👑 ADMIN ONLY ROUTES
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // ⭐ DASHBOARD ADMIN - PASTIKAN INI ADA
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Transaction History
    Route::get('/transactions', [TransactionHistoryController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionHistoryController::class, 'show']);

    // Admin Orders Management
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderControllerAdmin::class, 'index']);
        Route::get('/{id}', [OrderControllerAdmin::class, 'show']);
        Route::patch('/{id}/status', [OrderControllerAdmin::class, 'updateStatus']);
        Route::patch('/{id}/tracking-notes', [OrderControllerAdmin::class, 'updateTrackingAndNotes']);
        Route::delete('/{id}', [OrderControllerAdmin::class, 'destroy']);
    });
});

// ============================================
// 👑 ADMIN & LIBRARIAN ROUTES
// ============================================
Route::middleware(['auth:sanctum', 'role:admin,librarian'])->group(function () {

    // Categories Management
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    // Books Management
    Route::prefix('books')->group(function () {
        Route::get('/', [BookController::class, 'index']);
        Route::post('/', [BookController::class, 'store']);
        Route::get('/{id}', [BookController::class, 'show']);
        Route::post('/{id}', [BookController::class, 'update']); // POST karena file upload
        Route::delete('/{id}', [BookController::class, 'destroy']);
    });
});

// User Management (Admin Only - di luar prefix admin)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'edit']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

// ============================================
// 👤 USER ROUTES (role: user)
// ============================================
Route::middleware(['auth:sanctum', 'role:user'])->prefix('user')->group(function () {

    // Dashboard Route
    Route::get('/dashboard', [DashboardUserController::class, 'index']);

    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/change-password', [ProfileController::class, 'changePassword']);
    });

    // Books Routes (User view)
    Route::prefix('books')->group(function () {
        Route::get('/', [BookUserController::class, 'index']);
        Route::get('/{id}', [BookUserController::class, 'show']);
    });

    // Cart Routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
        Route::delete('/', [CartController::class, 'clear']);
    });

    // Checkout Routes
    Route::prefix('checkout')->group(function () {
        Route::post('/create-order', [CheckoutController::class, 'createOrderFromCart']);
        Route::post('/buy-now', [CheckoutController::class, 'buyNow']);
    });

    // Payment Routes
    Route::prefix('payment')->group(function () {
        Route::get('/{orderId}', [PaymentController::class, 'getSnapToken']);
        Route::post('/{orderId}/update-status', [PaymentController::class, 'updateStatus']);
    });

    // Order Routes (User)
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/{id}/cancel', [OrderController::class, 'cancel']);
        Route::delete('/{id}', [OrderController::class, 'destroy']);
        Route::post('/{id}/confirm', [OrderController::class, 'confirmOrder']);
    });
});

// ============================================
// 📚 MEMBER ROUTES (Read Only - role: member)
// ============================================
Route::middleware(['auth:sanctum', 'role:member,admin,librarian'])->prefix('public')->group(function () {
    Route::prefix('books')->group(function () {
        Route::get('/', [BookController::class, 'index']);
        Route::get('/{id}', [BookController::class, 'show']);
    });
    Route::get('/categories', [CategoryController::class, 'publicIndex']);
});

Broadcast::routes();
