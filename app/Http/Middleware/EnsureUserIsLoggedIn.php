<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsLoggedIn
{
    public function handle(Request $request, Closure $next)
    {
        // Periksa apakah pengguna sudah terautentikasi
        if (!Auth::check()) {
            // Jika request mengharapkan JSON (untuk API)
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please login first.'
                ], 401);
            }

            // Untuk web, redirect ke halaman login
            return redirect()->route('login');
        }

        // (Opsional) Tambahan pemeriksaan, misalnya role
        $user = Auth::user();
        if ($user->role !== 'admin') { // Contoh: hanya admin yang bisa akses
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Forbidden. Admin access required.'
                ], 403);
            }
            return redirect()->route('home')->with('error', 'Akses ditolak. Hanya admin yang diperbolehkan.');
        }

        return $next($request);
    }
}
