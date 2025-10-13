<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        // Pastikan tabel ada sebelum mengubahnya
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                // tambahkan kolom jika belum ada (menghindari error saat migrate di lingkungan aneh)
                if (!Schema::hasColumn('orders', 'snap_token')) {
                    $table->string('snap_token')->nullable()->after('total_price');
                }
                if (!Schema::hasColumn('orders', 'payment_type')) {
                    $table->string('payment_type')->nullable()->after('snap_token');
                }
                if (!Schema::hasColumn('orders', 'paid_at')) {
                    $table->dateTime('paid_at')->nullable()->after('payment_type');
                }
            });
        }
    }

    public function down(): void
    {
        // Hati-hati: cek dulu tabel & kolom sebelum drop
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                // dropColumn menerima array; drop hanya yang ada
                $drop = [];
                if (Schema::hasColumn('orders', 'snap_token')) {
                    $drop[] = 'snap_token';
                }
                if (Schema::hasColumn('orders', 'payment_type')) {
                    $drop[] = 'payment_type';
                }
                if (Schema::hasColumn('orders', 'paid_at')) {
                    $drop[] = 'paid_at';
                }
                if (!empty($drop)) {
                    $table->dropColumn($drop);
                }
            });
        }
    }
};
