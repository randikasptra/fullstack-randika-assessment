<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;

class CartController extends Controller
{
    private const MAX_CART_ITEMS = 100; // Scalability limit

    /**
     * Get user's cart items with total.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $cartItems = Cart::with('book')
                ->where('user_id', auth()->id())
                ->limit(self::MAX_CART_ITEMS)
                ->get();

            $total = $cartItems->sum(fn ($item) => $item->book->price * $item->quantity);

            return response()->json([
                'success' => true,
                'data' => $cartItems,
                'total' => (float) $total,
            ]);
        } catch (AuthorizationException $e) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            // \Log::error('Cart index error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch cart'], 500);
        }
    }

    /**
     * Add or update item in cart.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function add(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'book_id' => 'required|exists:books,id',
                'quantity' => 'integer|min:1|max:50', // Per add limit
            ]);

            $userId = auth()->id();
            $bookId = $request->book_id;
            $quantity = $request->quantity ?? 1;

            $book = Book::findOrFail($bookId);

            DB::beginTransaction();
            try {
                $this->validateStock($book, $quantity, $userId, $bookId);

                Cart::updateOrCreate(
                    ['user_id' => $userId, 'book_id' => $bookId],
                    ['quantity' => DB::raw('quantity + ' . $quantity)]
                );

                DB::commit();

                $cart = Cart::with('book')->where('user_id', $userId)->where('book_id', $bookId)->first();

                return response()->json([
                    'success' => true,
                    'message' => 'Added to cart successfully',
                    'data' => $cart,
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to add to cart: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update cart item quantity.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate(['quantity' => 'required|integer|min:1|max:50']);

            $cart = Cart::where('user_id', auth()->id())->findOrFail($id);
            $book = $cart->book;

            DB::beginTransaction();
            try {
                $this->validateStock($book, $request->quantity, auth()->id(), $book->id);

                $cart->update(['quantity' => $request->quantity]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Cart updated successfully',
                    'data' => $cart->load('book'),
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update cart'], 500);
        }
    }

    /**
     * Remove cart item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $cart = Cart::where('user_id', auth()->id())->findOrFail($id);
            $cart->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to remove item'], 500);
        }
    }

    /**
     * Clear entire cart.
     *
     * @return JsonResponse
     */
    public function clear(): JsonResponse
    {
        try {
            DB::transaction(fn () => Cart::where('user_id', auth()->id())->delete());

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to clear cart'], 500);
        }
    }

    /**
     * Validate stock availability.
     *
     * @param Book $book
     * @param int $quantity
     * @param int $userId
     * @param int $bookId
     * @return void
     * @throws ValidationException
     */
    private function validateStock(Book $book, int $quantity, int $userId, int $bookId): void
    {
        $currentQuantity = Cart::where('user_id', $userId)->where('book_id', $bookId)->value('quantity') ?? 0;
        $totalQuantity = $currentQuantity + $quantity;

        if ($book->stock < $totalQuantity) {
            throw ValidationException::withMessages(['quantity' => 'Insufficient stock. Available: ' . $book->stock]);
        }
    }

    // Contoh Test (tests/Feature/CartControllerTest.php)
    // public function test_add_to_cart_with_low_stock() { ... expect 422; }
}
