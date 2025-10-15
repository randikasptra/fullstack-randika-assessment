# 📚 MouraBook Store

**MouraBook Store** adalah aplikasi **mini e-commerce** untuk penjualan buku yang dikembangkan menggunakan **Laravel 12** dan **React (Vite)**.  
Proyek ini dirancang untuk menjadi platform modern dan ringan bagi pengguna untuk menjelajahi, membeli, dan mengelola data buku, lengkap dengan fitur **real-time update** menggunakan **WebSocket (Laravel Reverb)**.

---

## 🚀 Teknologi yang Digunakan

### 🧩 Backend
- ⚙️ **Laravel 12** — RESTful API & manajemen data utama  
- 🗄️ **MySQL** — Basis data utama  
- 🔔 **Laravel Reverb / WebSocket** — Komunikasi real-time (notifikasi pesanan, update stok)  
- 📦 **Composer** — Manajemen dependensi PHP  

### ⚛️ Frontend
- ⚛️ **React (Vite)** — Antarmuka pengguna interaktif  
- 🎨 **Tailwind CSS** — Styling cepat & responsif  
- 💡 **Lucide Icons** & **React Icons** — Ikon modern dan ringan  
- 🔌 **Axios** — Konsumsi API Laravel  
- 🌐 **React Router DOM** — Navigasi SPA (Single Page Application)  

---

## 🧠 Fitur Utama

✅ Autentikasi pengguna (Admin & Customer)  
✅ CRUD Buku (tambah, edit, hapus, stok otomatis)  
✅ Sistem keranjang belanja (add to cart, checkout, riwayat)  
✅ Real-time update stok & status pesanan menggunakan WebSocket  
✅ Dashboard Admin dengan chart penjualan interaktif  
✅ Desain modern & responsif (Tailwind)  
✅ Notifikasi & ikon dengan Lucide / React Icons  

---

## 🧱 Struktur Proyek

```
MOURABOOK-STORE/
├── backend/ (Laravel 12)
│   ├── app/                  # Controller, Models, Events, dll
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   │   └── uploads/          # Gambar buku
│   ├── resources/
│   │   ├── views/
│   │   ├── css/
│   │   └── js/               # Jika Laravel Mix digunakan
│   ├── routes/
│   │   ├── api.php           # Endpoint utama untuk React
│   │   └── web.php
│   ├── tests/
│   ├── .env.example
│   └── composer.json
│
├── frontend/ (React + Vite)
│   ├── src/
│   │   ├── assets/           # Gambar, ikon, dll
│   │   ├── components/       # Komponen UI reusable
│   │   ├── context/          # Context API (Auth, Cart)
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Layout utama (Admin/User)
│   │   ├── pages/            # Halaman (Dashboard, Buku, Checkout, dll)
│   │   ├── routes/           # Routing React Router
│   │   ├── services/         # API calls ke Laravel (axios)
│   │   ├── utils/            # Helper / formatter
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── LICENSE
```

---
## 💻 Instalasi Manual (Tanpa Docker)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/randikasptra/fullstack-randika-assessment.git
cd mourabook-store
```

### 2️⃣ Setup Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Untuk WebSocket:
```bash
php artisan reverb:start
```

### 3️⃣ Setup Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di:
```
http://localhost:5173
```




### 3️⃣ Akses Aplikasi
| Service | URL | Deskripsi |
|----------|-----|-----------|
| Laravel API | http://localhost:8000 | Backend API |
| React Frontend | http://localhost:5173 | Tampilan utama |
| WebSocket | ws://localhost:6001 | Komunikasi real-time |

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

---

## 🧩 WebSocket Integration

Fitur real-time digunakan untuk:
- Update stok otomatis setiap pesanan dilakukan.
- Notifikasi pelanggan tentang perubahan status pesanan (“Pesananmu sedang dikirim 📦”).
- Notifikasi admin saat stok buku menipis.

---

## 🧑‍💻 Kontributor

**👨‍💻 Randika Saputra**  
> Mahasiswa Teknik Informatika | Fullstack Developer Enthusiast  
> Proyek ini dibuat untuk latihan pengembangan aplikasi fullstack modern menggunakan Laravel + React.  

📧 [saputrarandika857@gmail.com]  

---

## 🪪 Lisensi

Proyek ini bersifat **open-source** dan bebas dikembangkan untuk keperluan pembelajaran.

---

