<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

// === Google OAuth Routes ===
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);



// === Catch-all untuk React SPA ===
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
