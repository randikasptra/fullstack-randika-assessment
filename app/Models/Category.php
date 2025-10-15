<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description'];

    // Relationship dengan Books
    public function books()
    {
        return $this->hasMany(Book::class, 'category_id');
    }
}
