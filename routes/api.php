<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

// 🧪 Debug Config Cloudinary

Route::get('/debug-cloudinary', function () {
    return response()->json([
        'source' => app()->configurationIsCached() ? 'CONFIG CACHE ACTIVE' : 'NO CACHE',
        'config' => [
            'cloud_name' => config('cloudinary.cloud.cloud_name'),
            'api_key'    => config('cloudinary.cloud.api_key'),
            'api_secret' => config('cloudinary.cloud.api_secret') ? 'SET' : 'MISSING',
        ],
    ], 200, [], JSON_PRETTY_PRINT);
});


// 🧪 Test Upload Cloudinary
Route::post('/test-upload', function (Request $request) {
    try {
        // Validasi file
        if (!$request->hasFile('image')) {
            return response()->json([
                'status' => 'error',
                'message' => 'No file uploaded'
            ], 400);
        }

        $file = $request->file('image');

        // Validasi tipe file
        if (!in_array($file->extension(), ['jpg', 'jpeg', 'png', 'webp'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid file type. Only JPG, PNG, WEBP allowed.'
            ], 400);
        }

        // Upload ke Cloudinary
        $upload = Cloudinary::upload($file->getRealPath(), [
            'folder' => 'books_test',
            'resource_type' => 'image',
        ]);

        return response()->json([
            'status' => 'success',
            'secure_url' => $upload->getSecurePath(),
            'public_id' => $upload->getPublicId(),
            'message' => '✅ Upload berhasil!'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Upload failed',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => basename($e->getFile()),
        ], 500);
    }
});





// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Protected Routes (butuh authentication)
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
