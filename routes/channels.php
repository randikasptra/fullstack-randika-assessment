<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('products.{id}', function ($user, $id) {
    return true;
});
