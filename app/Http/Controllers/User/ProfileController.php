<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Auth\Events\PasswordUpdated; // Asumsi event untuk notify

class ProfileController extends Controller
{
    /**
     * Get authenticated user profile.
     *
     * @return JsonResponse
     */
    public function show(): JsonResponse
    {
        try {
            $user = auth()->user();

            Log::info('User Profile Viewed', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Profile show error', ['user_id' => auth()->id(), 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Failed to fetch profile'], 500);
        }
    }

    /**
     * Update user profile information.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $this->validateUpdateData($request);

            $user = auth()->user();
            $oldEmail = $user->email;

            $user->update($validated);

            // Trigger email verification if email changed
            if ($oldEmail !== $validated['email']) {
                $user->sendEmailVerificationNotification();
            }

            Log::info('User Profile Updated', ['user_id' => $user->id, 'changes' => array_keys($validated)]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user->fresh(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Profile update error', ['user_id' => auth()->id(), 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Failed to update profile'], 500);
        }
    }

    /**
     * Change user password.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'new_password' => ['required', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()],
            ]);

            $user = auth()->user();
            $user->update(['password' => Hash::make($request->new_password)]);

            // Fire event for logging/notifications
            event(new PasswordUpdated($user));

            Log::info('User Password Changed', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Password change error', ['user_id' => auth()->id(), 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Failed to change password'], 500);
        }
    }

    /**
     * Validate update data.
     *
     * @param Request $request
     * @return array
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateUpdateData(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'phone' => 'nullable|string|max:20', // Asumsi kolom ada; tambah migration kalau belum
            'address' => 'nullable|string|max:500',
            // Tambah city, province, postal_code kalau ada kolom
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|size:5',
        ]);
    }

    // Contoh Test (tests/Feature/ProfileControllerTest.php)
    // public function test_update_profile_validates_email_unique() { ... expect 422; }
}
