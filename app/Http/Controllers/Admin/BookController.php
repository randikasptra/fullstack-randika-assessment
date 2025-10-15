<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Events\StockUpdatedEvent;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    /**
     * Inisialisasi instance Cloudinary dengan konfigurasi dari .env
     *
     * @return Cloudinary
     */
    private function getCloudinary()
    {
        return new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true
            ]
        ]);
    }

    /**
     * Menampilkan daftar semua buku dengan kategori, diurutkan berdasarkan created_at
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $books = Book::with('category')->orderBy('created_at', 'desc')->get();
            Log::info('Fetched all books for admin', ['count' => $books->count()]);
            return response()->json($books);
        } catch (\Exception $e) {
            Log::error('Failed to fetch books', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memuat daftar buku.'], 500);
        }
    }

    /**
     * Menampilkan detail buku berdasarkan ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $book = Book::with('category')->findOrFail($id);
            Log::info('Fetched book details', ['book_id' => $id]);
            return response()->json($book);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Book not found', ['book_id' => $id]);
            return response()->json(['message' => 'Buku tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch book', ['book_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memuat detail buku.'], 500);
        }
    }

    /**
     * Menambahkan buku baru dengan validasi dan upload gambar ke Cloudinary
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:books,title',
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

        // Upload gambar ke Cloudinary jika ada
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
                Log::info('Image uploaded to Cloudinary', ['url' => $imageUrl, 'public_id' => $publicId]);
            } catch (\Exception $e) {
                Log::error('Cloudinary upload failed', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Gagal mengupload gambar.'], 500);
            }
        }

        try {
            // Membuat buku baru
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

            // Trigger event untuk buku baru
            Log::info('Triggering StockUpdatedEvent for new book', ['book_id' => $book->id, 'stock' => $book->stock]);
            event(new StockUpdatedEvent($book));

            return response()->json([
                'message' => '✅ Buku berhasil ditambahkan!',
                'book' => $book->load('category'),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create book', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menambahkan buku.'], 500);
        }
    }

    /**
     * Memperbarui buku berdasarkan ID
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $book = Book::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:255|unique:books,title,' . $id,
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
            $stockChanged = $request->has('stock') && $book->stock !== ($validated['stock'] ?? $book->stock);

            // Upload gambar baru jika ada
            if ($request->hasFile('image')) {
                $cloudinary = $this->getCloudinary();

                // Hapus gambar lama jika ada
                if ($book->image_public_id) {
                    try {
                        $cloudinary->uploadApi()->destroy($book->image_public_id);
                        Log::info('Deleted old image from Cloudinary', ['public_id' => $book->image_public_id]);
                    } catch (\Exception $e) {
                        Log::warning('Failed to delete old image', ['public_id' => $book->image_public_id, 'error' => $e->getMessage()]);
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
                    Log::info('New image uploaded to Cloudinary', ['url' => $result['secure_url'], 'public_id' => $result['public_id']]);
                } catch (\Exception $e) {
                    Log::error('Failed to upload new image', ['error' => $e->getMessage()]);
                    return response()->json(['message' => 'Gagal mengupload gambar baru.'], 500);
                }
            }

            // Update buku
            $book->update($data);

            // Trigger event jika stok berubah
            if ($stockChanged) {
                Log::info('Triggering StockUpdatedEvent for updated book', ['book_id' => $book->id, 'stock' => $book->stock]);
                event(new StockUpdatedEvent($book));
            }

            return response()->json([
                'message' => '✅ Buku berhasil diperbarui!',
                'book' => $book->fresh()->load('category'),
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Book not found for update', ['book_id' => $id]);
            return response()->json(['message' => 'Buku tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update book', ['book_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memperbarui buku.'], 500);
        }
    }

    /**
     * Menghapus buku berdasarkan ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $book = Book::findOrFail($id);

            // Hapus gambar dari Cloudinary jika ada
            if ($book->image_public_id) {
                try {
                    $cloudinary = $this->getCloudinary();
                    $cloudinary->uploadApi()->destroy($book->image_public_id);
                    Log::info('Deleted image from Cloudinary', ['public_id' => $book->image_public_id]);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete image from Cloudinary', ['public_id' => $book->image_public_id, 'error' => $e->getMessage()]);
                }
            }

            // Trigger event dengan stok 0 sebelum hapus
            $book->stock = 0;
            Log::info('Triggering StockUpdatedEvent for deleted book', ['book_id' => $book->id, 'stock' => 0]);
            event(new StockUpdatedEvent($book));

            // Hapus buku
            $book->delete();

            return response()->json(['message' => '🗑️ Buku berhasil dihapus!']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Book not found for deletion', ['book_id' => $id]);
            return response()->json(['message' => 'Buku tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete book', ['book_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menghapus buku.'], 500);
        }
    }
}
