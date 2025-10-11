<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens;
    use Notifiable;
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // kalau kamu tambahkan
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];
}
