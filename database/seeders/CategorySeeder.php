<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Pemrograman',
                'description' => 'Buku seputar pemrograman, bahasa coding, dan pengembangan software.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Kecerdasan Buatan',
                'description' => 'Buku mengenai Artificial Intelligence, Machine Learning, dan Data Science.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Jaringan Komputer',
                'description' => 'Membahas arsitektur jaringan, keamanan siber, dan protokol komunikasi data.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Basis Data',
                'description' => 'Dasar hingga lanjutan dalam perancangan dan pengelolaan database.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Teknologi Informasi',
                'description' => 'Buku umum tentang tren dan konsep teknologi informasi modern.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
