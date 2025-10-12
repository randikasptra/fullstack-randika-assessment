<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    // Ambil semua user
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    // Simpan user baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in(['admin','user'])],
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User berhasil ditambahkan!',
            'user' => $user,
        ], 201);
    }

    // Ambil user untuk edit
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // 🚫 Cegah admin ubah admin lain
        if ($user->role === 'admin' && auth()->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Maaf, Anda tidak bisa mengubah data admin lain!',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin','user'])],
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'User berhasil diperbarui!',
            'user' => $user,
        ]);
    }

    // Hapus user
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // 🚫 Cegah admin hapus admin lain
        if ($user->role === 'admin' && auth()->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Maaf, Anda tidak bisa menghapus admin lain!',
            ], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus!']);
    }
}
