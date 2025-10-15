<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    public function up(): void
    {
        // Ubah enum di kolom 'status'
        DB::statement("ALTER TABLE orders MODIFY status ENUM(
            'pending',
            'paid',
            'processing',
            'shipped',
            'delivered',
            'completed',
            'cancelled'
        ) DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Rollback ke enum lama
        DB::statement("ALTER TABLE orders MODIFY status ENUM(
            'pending',
            'paid',
            'shipped',
            'completed',
            'cancelled'
        ) DEFAULT 'pending'");
    }
};
