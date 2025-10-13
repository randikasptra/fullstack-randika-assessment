<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Book;

class BookUserController extends Controller
{
    public function index()
    {
        $books = Book::with('category')
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        // Return langsung seperti admin controller
        return response()->json($books);
    }

    public function show($id)
    {
        $book = Book::with('category')->findOrFail($id);

        // Return langsung
        return response()->json($book);
    }
}
