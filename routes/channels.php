<?php

use Illuminate\Support\Facades\Broadcast;

/**
 * Public channel untuk semua produk
 * Semua user bisa listen tanpa autentikasi
 */
Broadcast::channel('products', function () {
    return true; // Public channel
});
