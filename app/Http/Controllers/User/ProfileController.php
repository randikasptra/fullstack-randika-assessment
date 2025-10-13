<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Get user profile.
     */
    public function show()
    {
        $user = auth()->user(); // Hapus ->load('profile') — langsung return user

        Log::info('User Profile Viewed', ['user_id' => $user->id]);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update user profile info.
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'phone' => 'nullable|string|max:20', // Kalo gak ada kolom, skip atau tambah migration
            'address' => 'nullable|string', // Sama
        ]);

        try {
            $user = auth()->user();
            $updateData = $request->only(['name', 'email']);
            if ($request->filled('phone')) {
                $updateData['phone'] = $request->phone;
            }
            if ($request->filled('address')) {
                $updateData['address'] = $request->address;
            }

            $user->update($updateData);

            Log::info('User Profile Updated', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diupdate',
                'data' => $user->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error Updating User Profile', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal update profil',
            ], 500);
        }
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => ['required', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()],
        ]);

        try {
            $user = auth()->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password saat ini salah',
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->new_password),
            ]);

            Log::info('User Password Changed', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diubah',
            ]);
        } catch (\Exception $e) {
            Log::error('Error Changing User Password', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal ubah password',
            ], 500);
        }
    }
}
