<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'publisher',
        'year',
        'price',
        'stock',
        'category_id',
        'image_url',
        'image_public_id',
        'description',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
