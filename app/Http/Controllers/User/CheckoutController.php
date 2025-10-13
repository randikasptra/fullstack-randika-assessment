<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingAddress;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function createOrderFromCart(Request $request)
    {
        $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
        ]);

        $cartItems = Cart::with('book')
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang kosong',
            ], 400);
        }

        return DB::transaction(function () use ($request, $cartItems) {
            // Validasi stok & hitung total
            $totalPrice = 0;
            foreach ($cartItems as $item) {
                if ($item->book->stock < $item->quantity) {
                    throw new \Exception("Stok buku '{$item->book->title}' tidak mencukupi");
                }
                $totalPrice += $item->book->price * $item->quantity;
            }

            // Create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_date' => now(),
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            // Create order items & kurangi stok
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'book_id' => $item->book_id,
                    'quantity' => $item->quantity,
                    'price' => $item->book->price,
                ]);

                // Kurangi stok
                $item->book->decrement('stock', $item->quantity);
            }

            // Create shipping address
            ShippingAddress::create([
                'order_id' => $order->id,
                'recipient_name' => $request->recipient_name,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'province' => $request->province,
                'postal_code' => $request->postal_code,
            ]);

            // Kosongkan cart
            Cart::where('user_id', auth()->id())->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil dibuat',
                'data' => $order->load(['orderItems.book', 'shippingAddress']),
            ]);
        });
    }

    public function buyNow(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
        ]);

        $book = Book::findOrFail($request->book_id);

        if ($book->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }

        return DB::transaction(function () use ($request, $book) {
            $totalPrice = $book->price * $request->quantity;

            // Create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_date' => now(),
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            // Create order item & kurangi stok
            OrderItem::create([
                'order_id' => $order->id,
                'book_id' => $book->id,
                'quantity' => $request->quantity,
                'price' => $book->price,
            ]);

            $book->decrement('stock', $request->quantity);

            // Create shipping address
            ShippingAddress::create([
                'order_id' => $order->id,
                'recipient_name' => $request->recipient_name,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'province' => $request->province,
                'postal_code' => $request->postal_code,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil dibuat',
                'data' => $order->load(['orderItems.book', 'shippingAddress']),
            ]);
        });
    }
}
