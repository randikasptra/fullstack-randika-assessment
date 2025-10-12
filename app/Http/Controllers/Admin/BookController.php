<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    private function getCloudinary()
    {
        return new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true
            ]
        ]);
    }

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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'nullable|integer|digits:4',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'description' => 'nullable|string',
        ]);

        $imageUrl = null;
        $publicId = null;

        if ($request->hasFile('image')) {
            try {
                $file = $request->file('image');
                $cloudinary = $this->getCloudinary();

                $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                    'folder' => 'books',
                    'resource_type' => 'image',
                ]);

                $imageUrl = $result['secure_url'];
                $publicId = $result['public_id'];

                Log::info('✅ Upload berhasil', ['url' => $imageUrl, 'public_id' => $publicId]);

            } catch (\Exception $e) {
                Log::error("❌ Cloudinary upload failed: " . $e->getMessage());
                return response()->json(['message' => 'Gagal mengupload gambar.'], 500);
            }
        }

        $book = Book::create([
            'title' => $validated['title'],
            'author' => $validated['author'] ?? null,
            'publisher' => $validated['publisher'] ?? null,
            'year' => $validated['year'] ?? null,
            'price' => $validated['price'] ?? 0,
            'stock' => $validated['stock'] ?? 0,
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
            'year' => 'nullable|integer|digits:4',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'description' => 'nullable|string',
        ]);

        $data = $validated;

        // Jika ada gambar baru
        if ($request->hasFile('image')) {
            $cloudinary = $this->getCloudinary();

            // Hapus gambar lama
            if ($book->image_public_id) {
                try {
                    $cloudinary->uploadApi()->destroy($book->image_public_id);
                    Log::info('🗑️ Gambar lama dihapus', ['public_id' => $book->image_public_id]);
                } catch (\Exception $e) {
                    Log::warning("⚠️ Gagal hapus gambar lama: " . $e->getMessage());
                }
            }

            // Upload gambar baru
            try {
                $file = $request->file('image');
                $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                    'folder' => 'books',
                    'resource_type' => 'image',
                ]);

                $data['image_url'] = $result['secure_url'];
                $data['image_public_id'] = $result['public_id'];

                Log::info('✅ Upload baru berhasil', ['url' => $result['secure_url']]);

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
                $cloudinary = $this->getCloudinary();
                $cloudinary->uploadApi()->destroy($book->image_public_id);
                Log::info('🗑️ Gambar dihapus dari Cloudinary', ['public_id' => $book->image_public_id]);
            } catch (\Exception $e) {
                Log::warning("⚠️ Gagal hapus gambar: " . $e->getMessage());
            }
        }

        $book->delete();

        return response()->json(['message' => '🗑️ Buku berhasil dihapus!']);
    }
}
