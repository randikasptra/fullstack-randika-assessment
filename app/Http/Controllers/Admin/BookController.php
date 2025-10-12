<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    // 🔹 Ambil semua buku
    public function index()
    {
        $books = Book::with('category')->orderBy('created_at', 'desc')->get();
        return response()->json($books);
    }

    // 🔹 Ambil detail 1 buku
    public function show($id)
    {
        $book = Book::with('category')->findOrFail($id);
        return response()->json($book);
    }

    // 🔹 Tambah buku baru
    public function store(Request $request)
    {
        Log::info('Cloudinary ENV:', [
            'url' => env('CLOUDINARY_URL'),
            'preset' => env('CLOUDINARY_UPLOAD_PRESET'),
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'required|integer|digits:4',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'description' => 'nullable|string',
        ]);

        $imageUrl = null;
        $publicId = null;

        if ($request->hasFile('image')) {
            try {
                $file = $request->file('image');

                // ✅ Gunakan upload preset dari .env
                $uploaded = Cloudinary::upload($file->getRealPath(), [
                    'folder' => 'Laravel/Images', // folder sesuai preset
                    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'), // pakai "Randi_Project"
                    'resource_type' => 'image',
                ]);

                $imageUrl = $uploaded->getSecurePath();
                $publicId = $uploaded->getPublicId();

            } catch (\Exception $e) {
                Log::error("❌ Cloudinary upload failed: " . $e->getMessage(), [
                    'file' => $file ? $file->getClientOriginalName() : 'no file',
                ]);
                return response()->json(['message' => 'Gagal mengupload gambar. Coba lagi nanti.'], 500);
            }
        }

        $book = Book::create([
            'title' => $validated['title'],
            'author' => $validated['author'],
            'publisher' => $validated['publisher'] ?? null,
            'year' => $validated['year'],
            'price' => $validated['price'] ?? null,
            'stock' => $validated['stock'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_url' => $imageUrl,
            'image_public_id' => $publicId,
        ]);

        return response()->json([
            'message' => '✅ Buku berhasil ditambahkan!',
            'book' => $book->load('category'),
        ], 201);
    }

    // 🔹 Update buku
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'nullable|digits:4|integer',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'description' => 'nullable|string',
        ]);

        $data = $validated;

        // Jika ada gambar baru
        if ($request->hasFile('image')) {
            if ($book->image_public_id) {
                try {
                    Cloudinary::destroy($book->image_public_id);
                } catch (\Exception $e) {
                    Log::warning("⚠️ Gagal hapus gambar lama: " . $e->getMessage());
                }
            }

            try {
                $file = $request->file('image');
                $uploaded = Cloudinary::upload($file->getRealPath(), [
                    'folder' => 'Laravel/Images',
                    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                    'resource_type' => 'image',
                ]);

                $data['image_url'] = $uploaded->getSecurePath();
                $data['image_public_id'] = $uploaded->getPublicId();
            } catch (\Exception $e) {
                Log::error("❌ Upload baru gagal: " . $e->getMessage());
                return response()->json(['message' => 'Gagal mengupload gambar baru.'], 500);
            }
        }

        $book->update($data);

        return response()->json([
            'message' => '✅ Buku berhasil diperbarui!',
            'book' => $book->fresh()->load('category'),
        ]);
    }

    // 🔹 Hapus buku
    public function destroy($id)
    {
        $book = Book::findOrFail($id);

        if ($book->image_public_id) {
            try {
                Cloudinary::destroy($book->image_public_id);
            } catch (\Exception $e) {
                Log::warning("⚠️ Gagal hapus gambar dari Cloudinary: " . $e->getMessage());
            }
        }

        $book->delete();

        return response()->json(['message' => '🗑️ Buku berhasil dihapus!']);
    }
}
