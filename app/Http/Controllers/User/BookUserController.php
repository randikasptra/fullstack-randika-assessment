<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with('category')
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $books,
        ]);
    }

    public function show($id)
    {
        $book = Book::with('category')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $book,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        $books = Book::with('category')
            ->where('stock', '>', 0)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('author', 'like', "%{$query}%")
                  ->orWhere('publisher', 'like', "%{$query}%");
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $books,
        ]);
    }
}
