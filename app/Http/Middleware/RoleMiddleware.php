<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fix: Split comma-separated roles (e.g., 'admin,librarian' -> ['admin', 'librarian'])
        $allowedRoles = [];
        foreach ($roles as $roleString) {
            $allowedRoles = array_merge($allowedRoles, explode(',', $roleString));
        }
        $allowedRoles = array_map('trim', $allowedRoles);  // Trim whitespace

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'message' => 'Forbidden: Access denied',
                'your_role' => $user->role,
                'required_roles' => $allowedRoles  // Debug info (hapus di prod)
            ], 403);
        }

        return $next($request);
    }
}
