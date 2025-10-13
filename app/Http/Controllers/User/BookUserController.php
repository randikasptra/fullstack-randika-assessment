<?php

namespace App\Http\Controllers\User;

use App\Models\Book;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BookUserController extends Controller
{
    public function index()
    {
        try {
            // Ambil buku dengan nama kategori
            $books = Book::with('category:id,name')->get();

            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memuat buku: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $book = Book::with('category:id,name')->findOrFail($id);
            return response()->json($book, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }
    }
}
