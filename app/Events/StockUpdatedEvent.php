<?php

namespace App\Events;

use App\Models\Book;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // Gunakan ShouldBroadcastNow untuk immediate broadcast
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StockUpdatedEvent implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $book;

    public function __construct(Book $book)
    {
        $this->book = $book;
    }

    /**
     * Broadcast ke channel publik untuk semua produk
     */
    public function broadcastOn(): Channel
    {
        // Gunakan channel publik untuk semua user bisa dengar
        return new Channel('products');
    }

    public function broadcastAs(): string
    {
        return 'stock.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->book->id,
            'title' => $this->book->title,
            'stock' => $this->book->stock,
            'price' => $this->book->price,
            'updated_at' => $this->book->updated_at->toISOString(),
        ];
    }
}
