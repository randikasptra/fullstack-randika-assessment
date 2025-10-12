<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

// 🧪 Test Upload dengan SDK Langsung (Untuk Testing)
Route::post('/test-upload', function (Request $request) {
    try {
        if (!$request->hasFile('image')) {
            return response()->json([
                'status' => 'error',
                'message' => 'No file uploaded'
            ], 400);
        }

        $file = $request->file('image');

        // Inisialisasi Cloudinary SDK langsung
        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true
            ]
        ]);

        // Upload file
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
        return response()->json([
            'status' => 'error',
            'message' => 'Upload failed',
            'error' => $e->getMessage(),
        ], 500);
    }
});

// 🧪 Debug Environment (Untuk Testing)
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

// ============================================
// 🔒 AUTHENTICATED ROUTES (All Roles)
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
});

// ============================================
// 👑 ADMIN & LIBRARIAN ROUTES
// ============================================
Route::middleware(['auth:sanctum', 'role:admin,librarian'])->group(function () {

    // Categories Management
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Books Management
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::post('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
});

// ============================================
// 👑 ADMIN ONLY ROUTES
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // Users Management (Only Admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'edit']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// ============================================
// 📚 MEMBER ROUTES (Read Only Books & Categories)
// ============================================
Route::middleware(['auth:sanctum', 'role:member,admin,librarian'])->group(function () {
    Route::get('/books/public', [BookController::class, 'index']); // Members bisa lihat buku
    Route::get('/books/public/{id}', [BookController::class, 'show']); // Members bisa lihat detail
    Route::get('/categories/public', [CategoryController::class, 'publicIndex']); // Members bisa lihat kategori
});
