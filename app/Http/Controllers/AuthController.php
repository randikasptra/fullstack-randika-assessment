<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * REGISTER MANUAL
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully',
            'user'    => $user,
            'token'   => $token,
        ], 201);
        return redirect()->route('/');
    }

    /**
     * LOGIN MANUAL
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    /**
     * REDIRECT KE GOOGLE (untuk login/register via Google)
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * HANDLE CALLBACK DARI GOOGLE
     */
    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'     => $googleUser->getName(),
                'password' => Hash::make(Str::random(24)),
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return redirect("http://127.0.0.1:8000/google-success?token={$token}");
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        if (!$request->user()) {
            return response()->json([
                'status'  => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $request->user()->tokens()->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Logged out successfully'
        ]);
    }

}
