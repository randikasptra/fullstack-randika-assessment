<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

// 🧪 Test Upload dengan SDK Langsung
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
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME', 'diwbgp4bu'),
                'api_key'    => env('CLOUDINARY_API_KEY', '171689433731249'),
                'api_secret' => env('CLOUDINARY_API_SECRET', 'WmkaC6hMu6KjJQdNoJ_IRKQp_14'),
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
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});

// 🧪 Debug Environment
Route::get('/debug-env', function () {
    return response()->json([
        'CLOUDINARY_CLOUD_NAME' => env('CLOUDINARY_CLOUD_NAME'),
        'CLOUDINARY_API_KEY' => env('CLOUDINARY_API_KEY'),
        'CLOUDINARY_API_SECRET' => env('CLOUDINARY_API_SECRET') ? 'SET' : 'NOT SET',
    ]);
});

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'edit']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Books
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::post('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
