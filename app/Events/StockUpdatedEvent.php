<?php

namespace App\Events;

use App\Models\Book;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StockUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $book;

    public function __construct(Book $book)
    {
        $this->book = $book;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('products.' . $this->book->id);
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
        ];
    }
}
