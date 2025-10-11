<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // 🟢 Ambil semua kategori
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    // 🟢 Simpan kategori baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($request->all());
        return response()->json([
            'message' => 'Kategori berhasil ditambahkan!',
            'category' => $category,
        ], 201);
    }

    // 🟢 Update kategori
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->all());

        return response()->json([
            'message' => 'Kategori berhasil diperbarui!',
            'category' => $category,
        ]);
    }

    // 🟢 Hapus kategori
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus!',
        ]);
    }
}
