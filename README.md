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
```

---

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
# Database
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
composer install
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

## ✨ Kontributor

**👨‍💻 Randika Saputra**  
> Mahasiswa Teknik Informatika | Fullstack Developer Enthusiast  
> Proyek ini dibuat untuk latihan pengembangan aplikasi fullstack modern menggunakan Laravel + React.

---

## 📄 Lisensi

Proyek ini bersifat **open-source** dan bebas dikembangkan untuk keperluan pembelajaran.
