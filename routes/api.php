<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\CheckoutController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\Admin\OrderControllerAdmin;
use App\Http\Controllers\User\BookUserController;
use App\Events\StockUpdatedEvent;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Http\Request;
use Cloudinary\Cloudinary;
use App\Http\Controllers\Admin\TransactionHistoryController;

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/transactions', [TransactionHistoryController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionHistoryController::class, 'show']);
});


// ============================================
// 🧪 TESTING & DEBUG ROUTES (Remove in Production)
// ============================================
Route::post('/test-upload', function (Request $request) {
    try {
        if (!$request->hasFile('image')) {
            return response()->json(['status' => 'error', 'message' => 'No file uploaded'], 400);
        }

        $file = $request->file('image');
        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => ['secure' => true]
        ]);

        $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
            'folder' => 'books_test',
            'resource_type' => 'image',
        ]);

        return response()->json([
            'status' => 'success',
            'secure_url' => $result['secure_url'],
            'public_id' => $result['public_id'],
            'message' => '✅ Upload berhasil!'
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Upload failed', 'error' => $e->getMessage()], 500);
    }
});

Route::get('/debug-env', function () {
    return response()->json([
        'CLOUDINARY_CLOUD_NAME' => env('CLOUDINARY_CLOUD_NAME'),
        'CLOUDINARY_API_KEY' => env('CLOUDINARY_API_KEY'),
        'CLOUDINARY_API_SECRET' => env('CLOUDINARY_API_SECRET') ? 'SET ✅' : 'NOT SET ❌',
    ]);
});

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

// ============================================
// 👑 ADMIN ONLY ROUTES
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'edit']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });


    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderControllerAdmin::class, 'index']); // ✅ Semua orders
        Route::get('/{id}', [OrderControllerAdmin::class, 'show']); // ✅ Detail order by ID
        Route::patch('/{id}/status', [OrderControllerAdmin::class, 'updateStatus']);
        Route::patch('/{id}/tracking-notes', [OrderControllerAdmin::class, 'updateTrackingAndNotes']);
        Route::delete('/{id}', [OrderControllerAdmin::class, 'destroy']); // ✅ Delete order
    });

});

// ============================================
// 👤 USER ROUTES (role: user)
// ============================================
Route::middleware(['auth:sanctum', 'role:user'])->prefix('user')->group(function () {

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
        Route::get('/', [CartController::class, 'index']); // Get cart
        Route::post('/add', [CartController::class, 'add']); // Add to cart
        Route::put('/{id}', [CartController::class, 'update']); // Update quantity
        Route::delete('/{id}', [CartController::class, 'destroy']); // Remove item
        Route::delete('/', [CartController::class, 'clear']); // Clear cart
    });

    // Checkout Routes
    Route::prefix('checkout')->group(function () {
        Route::post('/create-order', [CheckoutController::class, 'createOrderFromCart']);
        Route::post('/buy-now', [CheckoutController::class, 'buyNow']);
    });

    // Payment Routes
    Route::prefix('payment')->group(function () {
        Route::get('/{orderId}', [PaymentController::class, 'getSnapToken']); // Get Midtrans token
        Route::post('/{orderId}/update-status', [PaymentController::class, 'updateStatus']); // Update payment status
    });

    // Order Routes (User)
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']); // User's orders
        Route::get('/{id}', [OrderController::class, 'show']); // Order detail
        Route::post('/{id}/cancel', [OrderController::class, 'cancel']); // Cancel order
        Route::delete('/{id}', [OrderController::class, 'destroy']); // Delete cancelled order
    });
});
Route::post('/user/simulate-expire/{id}', function ($id) {
    $order = auth()->user()->orders()->findOrFail($id);
    if ($order->status === 'pending') {
        foreach ($order->orderItems as $item) {
            $item->book->increment('stock', $item->quantity);
            \Log::info('Triggering StockUpdatedEvent for cancelled order', ['book_id' => $item->book->id, 'stock' => $item->book->stock]);
            event(new StockUpdatedEvent($item->book));
        }
        $order->update(['status' => 'cancelled']);
        return response()->json(['success' => true, 'message' => 'Order cancelled, stock restored']);
    }
    return response()->json(['message' => 'Order cannot be cancelled'], 400);
})->middleware('auth:sanctum');
// ============================================
// 📚 MEMBER ROUTES (Read Only - role: member)
// ============================================
Route::middleware(['auth:sanctum', 'role:member,admin,librarian'])->prefix('public')->group(function () {

    // Public Books (Read only)
    Route::prefix('books')->group(function () {
        Route::get('/', [BookController::class, 'index']);
        Route::get('/{id}', [BookController::class, 'show']);
    });

    // Public Categories (Read only)
    Route::get('/categories', [CategoryController::class, 'publicIndex']);
});


Broadcast::routes();
