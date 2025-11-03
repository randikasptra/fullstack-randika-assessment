# 📚 MouraBook Store

Mini E-Commerce untuk penjualan buku yang dikembangkan menggunakan **Laravel 12** dan **React** (Fullstack).  
Project ini dirancang untuk menyediakan platform sederhana dan modern bagi pengguna untuk menjelajahi, membeli, serta mengelola data buku.  

---

## 🚀 Teknologi yang Digunakan

### 🧩 Backend
- **Laravel 12** — API utama & manajemen data
- **MySQL** — Basis data
- **Laravel Reverb / WebSocket** — Komunikasi real-time (update stok, notifikasi pesanan)
- **Composer** — Manajemen dependensi PHP

### ⚛️ Frontend
- **React (Vite)** — Antarmuka pengguna interaktif
- **Lucide Icons** & **React Icons** — Ikon modern & ringan
- **Tailwind CSS** — Styling responsif dan cepat
- **Axios** — Konsumsi API Laravel

---

## 🧱 Struktur Proyek

```
FULLSTACK-RANDIKA-ASSESSMENT/
├── app/                   # Kode backend Laravel
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
│   ├── css/               # File CSS
│   ├── images/            # Asset gambar
│   └── js/                # Source React App
│       ├── auth/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.jsx
│       ├── bootstrap.js
│       └── main.jsx
├── lib/
├── views/
└── docker-compose.yml
```

---

## 🐳 Menjalankan dengan Docker

### 1️⃣ Pastikan sudah terpasang:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js 20+](https://nodejs.org/)
- [Composer](https://getcomposer.org/)

### 2️⃣ Build dan Jalankan
```bash
docker-compose up --build
```

### 3️⃣ Akses Aplikasi
| Service | URL | Deskripsi |
|----------|-----|-----------|
| Laravel API | http://localhost:8000 | Backend API |
| React Frontend | http://localhost:5173 | Tampilan utama |
| WebSocket | ws://localhost:6001 | Komunikasi real-time |

---

## ⚙️ Environment

Contoh file `.env` untuk koneksi antar service:

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

REVERB_APP_ID=app
REVERB_APP_KEY=key
REVERB_APP_SECRET=secret
REVERB_HOST=0.0.0.0
REVERB_PORT=6001
```

---

## 🧠 Fitur Utama

✅ Autentikasi pengguna (Admin & Customer)  
✅ CRUD Buku (tambah, ubah, hapus, stok otomatis)  
✅ Sistem keranjang belanja  
✅ Real-time update stok menggunakan WebSocket  
✅ Dashboard admin dengan chart interaktif  
✅ Desain modern & responsif menggunakan Tailwind  
✅ Notifikasi dan ikon menggunakan Lucide & React Icons  

---

## 🧰 Perintah Penting

### Backend
```bash
php artisan migrate
php artisan serve
php artisan reverb:start
```

### Frontend
```bash
npm install
npm run dev
```

### Docker
```bash
docker-compose up -d
docker-compose down
```

---

## ✨ Kontributor

**👨‍💻 Randika Saputra**  
> Mahasiswa Teknik Informatika | Fullstack Developer Enthusiast  
> Proyek ini dibuat untuk latihan pengembangan aplikasi fullstack modern menggunakan Laravel + React.

---

## 📄 Lisensi

Proyek ini bersifat **open-source** dan bebas dikembangkan untuk keperluan pembelajaran.
