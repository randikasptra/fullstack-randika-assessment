<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookUserController extends Controller
{
    private const PER_PAGE = 20; // Scalability: Default pagination

    /**
     * Get books with pagination, search, filter, sort.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Book::with('category');

            // Search
            if ($search = $request->get('q')) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('author', 'like', "%{$search}%")
                      ->orWhere('publisher', 'like', "%{$search}%")
                      ->orWhereHas('category', fn ($cat) => $cat->where('name', 'like', "%{$search}%"));
                });
            }

            // Category filter
            if ($category = $request->get('category')) {
                $query->whereHas('category', fn ($q) => $q->where('name', $category));
            }

            // Price range
            $minPrice = $request->get('min_price', 0);
            $maxPrice = $request->get('max_price', PHP_INT_MAX);
            $query->whereBetween('price', [$minPrice, $maxPrice]);

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');
            $query->orderBy($sortBy, $sortDir);

            $books = $query->paginate($request->get('per_page', self::PER_PAGE));

            return response()->json([
                'success' => true,
                'data' => $books->items(),
                'meta' => [
                    'current_page' => $books->currentPage(),
                    'last_page' => $books->lastPage(),
                    'total' => $books->total(),
                ],
            ]);
        } catch (\Exception $e) {
            // \Log::error('Books index error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch books'], 500);
        }
    }

    /**
     * Get single book detail.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $book = Book::with('category')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $book,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Book not found'], 404);
        }
    }

    // Contoh Test (tests/Feature/BookUserControllerTest.php)
    // public function test_search_books_returns_paginated_results() { ... }
}
