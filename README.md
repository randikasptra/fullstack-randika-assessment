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
✅ Notifikasi & ikon dengan Lucide / React Icons / Toast

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
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:DWongMZ1AtWdmH1va83JzZUi1S9u15HWZ2L0NrjVRUM=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fullstack_randika_assessment
DB_USERNAME=root
DB_PASSWORD=

CLOUDINARY_CLOUD_NAME=diwbgp4bu
CLOUDINARY_API_KEY=825115676879777
CLOUDINARY_API_SECRET=J3SZQqyPB2pY1HrkLktkT6Ba45Y

MIDTRANS_MERCHANT_ID=G946627421
MIDTRANS_CLIENT_KEY=Mid-client-Vf8NgZIDyCcELaga
MIDTRANS_SERVER_KEY=Mid-server-dcOT9_Aa5Nsdq0UkbpG4LOPY
MIDTRANS_IS_PRODUCTION=false

SESSION_DOMAIN=127.0.0.1
SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=127.0.0.1:5173,127.0.0.1:8000

GOOGLE_CLIENT_ID=75870578295-nj1ip4l4uguudcovar8neuf78m7738dd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback

BROADCAST_CONNECTION=reverb

REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
VITE_API_URL=http://127.0.0.1:8000



FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"


BROADCAST_CONNECTION=reverb


REVERB_APP_ID=855548
REVERB_APP_KEY=fhh7crjmhvqmb4ljnnlf
REVERB_APP_SECRET=uz3dnfyz51nrobaq62al
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http
---
## 💻 Instalasi Manual (Tanpa Docker)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/randikasptra/fullstack-randika-assessment.git
cd fullstack-randika-assessment
```

### 2️⃣ Setup Backend (Laravel)
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

