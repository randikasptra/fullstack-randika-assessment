<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;

class CartController extends Controller
{
    private const MAX_CART_ITEMS = 100;

    /**
     * Get user's cart items with total.
     * Fixed: Handle deleted books gracefully
     */
    public function index(): JsonResponse
    {
        try {
            $userId = auth()->id();

            // Get cart items with books
            $cartItems = Cart::with('book')
                ->where('user_id', $userId)
                ->limit(self::MAX_CART_ITEMS)
                ->get();

            // Remove cart items where book is null (deleted)
            $invalidItems = $cartItems->filter(fn ($item) => is_null($item->book));

            if ($invalidItems->isNotEmpty()) {
                Log::warning('Removing cart items with deleted books', [
                    'user_id' => $userId,
                    'count' => $invalidItems->count(),
                    'cart_ids' => $invalidItems->pluck('id')->toArray()
                ]);

                // Delete invalid cart items
                Cart::whereIn('id', $invalidItems->pluck('id'))->delete();

                // Reload cart items
                $cartItems = Cart::with('book')
                    ->where('user_id', $userId)
                    ->limit(self::MAX_CART_ITEMS)
                    ->get();
            }

            // Calculate total safely
            $total = $cartItems->sum(function ($item) {
                return $item->book ? ($item->book->price * $item->quantity) : 0;
            });

            return response()->json([
                'success' => true,
                'data' => $cartItems,
                'total' => (float) $total,
            ]);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized cart access', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            Log::error('Cart index error', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Add or update item in cart.
     */
    public function add(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'book_id' => 'required|exists:books,id',
                'quantity' => 'nullable|integer|min:1|max:50',
            ]);

            $userId = auth()->id();
            $bookId = $request->book_id;
            $quantity = $request->quantity ?? 1;

            $book = Book::findOrFail($bookId);

            DB::beginTransaction();
            try {
                // Check if item already in cart
                $existingCart = Cart::where('user_id', $userId)
                    ->where('book_id', $bookId)
                    ->first();

                $currentQuantity = $existingCart ? $existingCart->quantity : 0;
                $newQuantity = $currentQuantity + $quantity;

                // Validate stock
                if ($book->stock < $newQuantity) {
                    throw ValidationException::withMessages([
                        'quantity' => "Stok tidak cukup. Tersedia: {$book->stock}"
                    ]);
                }

                // Update or create cart item
                Cart::updateOrCreate(
                    ['user_id' => $userId, 'book_id' => $bookId],
                    ['quantity' => $newQuantity]
                );

                DB::commit();

                $cart = Cart::with('book')
                    ->where('user_id', $userId)
                    ->where('book_id', $bookId)
                    ->first();

                Log::info('Item added to cart', [
                    'user_id' => $userId,
                    'book_id' => $bookId,
                    'quantity' => $newQuantity
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Berhasil ditambahkan ke keranjang',
                    'data' => $cart,
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Add to cart error', [
                'user_id' => auth()->id(),
                'book_id' => $request->book_id ?? null,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan ke keranjang'
            ], 500);
        }
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:50'
            ]);

            $cart = Cart::where('user_id', auth()->id())->findOrFail($id);
            $book = $cart->book;

            if (!$book) {
                // Book deleted, remove cart item
                $cart->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'Buku sudah tidak tersedia'
                ], 404);
            }

            DB::beginTransaction();
            try {
                // Validate stock
                if ($book->stock < $request->quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => "Stok tidak cukup. Tersedia: {$book->stock}"
                    ]);
                }

                $cart->update(['quantity' => $request->quantity]);

                DB::commit();

                Log::info('Cart updated', [
                    'user_id' => auth()->id(),
                    'cart_id' => $id,
                    'quantity' => $request->quantity
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Keranjang berhasil diperbarui',
                    'data' => $cart->load('book'),
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Update cart error', [
                'user_id' => auth()->id(),
                'cart_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui keranjang'
            ], 500);
        }
    }

    /**
     * Remove cart item.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $cart = Cart::where('user_id', auth()->id())->findOrFail($id);
            $cart->delete();

            Log::info('Cart item removed', [
                'user_id' => auth()->id(),
                'cart_id' => $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Item berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            Log::error('Remove cart item error', [
                'user_id' => auth()->id(),
                'cart_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus item'
            ], 500);
        }
    }

    /**
     * Clear entire cart.
     */
    public function clear(): JsonResponse
    {
        try {
            $userId = auth()->id();

            DB::transaction(function () use ($userId) {
                Cart::where('user_id', $userId)->delete();
            });

            Log::info('Cart cleared', ['user_id' => $userId]);

            return response()->json([
                'success' => true,
                'message' => 'Keranjang berhasil dikosongkan',
            ]);
        } catch (\Exception $e) {
            Log::error('Clear cart error', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengosongkan keranjang'
            ], 500);
        }
    }
}
