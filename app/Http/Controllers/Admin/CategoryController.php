<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // 🟢 Ambil semua kategori (Untuk Admin & Librarian)
    public function index()
    {
        $categories = Category::withCount('books')->orderBy('name', 'asc')->get();
        return response()->json($categories);
    }

    // 🟢 Ambil semua kategori (Public - untuk member/guest)
    public function publicIndex()
    {
        $categories = Category::withCount('books')->orderBy('name', 'asc')->get();
        return response()->json($categories);
    }

    // 🟢 Simpan kategori baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'message' => '✅ Kategori berhasil ditambahkan!',
            'category' => $category,
        ], 201);
    }

    // 🟢 Update kategori
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($request->all());

        return response()->json([
            'message' => '✅ Kategori berhasil diperbarui!',
            'category' => $category,
        ]);
    }

    // 🟢 Hapus kategori
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Cek apakah ada buku di kategori ini
        if ($category->books()->count() > 0) {
            return response()->json([
                'message' => '❌ Kategori tidak bisa dihapus karena masih ada buku di dalamnya!',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => '🗑️ Kategori berhasil dihapus!',
        ]);
    }
}
