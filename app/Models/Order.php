<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_date',
        'status',
        'total_price',
        'snap_token', // Dari screenshot lu ada
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'total_price' => 'decimal:2',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->hasOne(ShippingAddress::class); // Asumsi model ShippingAddress ada
    }
}
