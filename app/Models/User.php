<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens;
    use Notifiable;

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
