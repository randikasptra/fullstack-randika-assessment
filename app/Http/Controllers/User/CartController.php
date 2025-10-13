<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::with('book')
            ->where('user_id', auth()->id())
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->book->price * $item->quantity;
        });

        return response()->json([
            'success' => true,
            'data' => $cartItems,
            'total' => $total,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'integer|min:1',
        ]);

        $book = Book::findOrFail($request->book_id);

        // Cek stok
        if ($book->stock < ($request->quantity ?? 1)) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }

        $cart = Cart::where('user_id', auth()->id())
            ->where('book_id', $request->book_id)
            ->first();

        if ($cart) {
            // Update quantity
            $newQuantity = $cart->quantity + ($request->quantity ?? 1);

            if ($book->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi',
                ], 400);
            }

            $cart->update(['quantity' => $newQuantity]);
        } else {
            // Create new cart item
            $cart = Cart::create([
                'user_id' => auth()->id(),
                'book_id' => $request->book_id,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil ditambahkan ke keranjang',
            'data' => $cart->load('book'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', auth()->id())
            ->findOrFail($id);

        $book = $cart->book;

        if ($book->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil diupdate',
            'data' => $cart->load('book'),
        ]);
    }

    public function destroy($id)
    {
        $cart = Cart::where('user_id', auth()->id())
            ->findOrFail($id);

        $cart->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil dihapus dari keranjang',
        ]);
    }

    public function clear()
    {
        Cart::where('user_id', auth()->id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil dikosongkan',
        ]);
    }
}
