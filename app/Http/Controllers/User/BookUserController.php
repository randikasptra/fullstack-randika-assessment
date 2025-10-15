<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Book;

class BookUserController extends Controller
{
    public function index()
    {
        // ✅ PERBAIKAN: Tampilkan SEMUA buku agar WebSocket bisa subscribe
        // Filter di frontend saja untuk UI
        $books = Book::with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($books);
    }

    public function show($id)
    {
        $book = Book::with('category')->findOrFail($id);
        return response()->json($book);
    }
}
