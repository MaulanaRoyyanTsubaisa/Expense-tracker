add .# Aplikasi Manajemen Keuangan Pribadi

Aplikasi web sederhana untuk mengelola keuangan pribadi dengan fitur login, register, dan pencatatan pengeluaran.

## Teknologi yang Digunakan

### Frontend

- HTML5
- CSS (Tailwind CSS)
- JavaScript (Vanilla)
- SweetAlert2 untuk notifikasi

### Backend

- Node.js
- Express.js
- JWT untuk autentikasi
- Bcrypt untuk enkripsi password

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- Python 3 (opsional, untuk menjalankan frontend)
- Web browser modern

## Cara Menjalankan Aplikasi

### 1. Menjalankan Backend

1. Buka terminal/command prompt
2. Navigasi ke folder backend:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   npm start
   ```
5. Backend akan berjalan di `http://localhost:3000`

### 2. Menjalankan Frontend

Ada beberapa cara untuk menjalankan frontend:

#### Menggunakan Python (Cara Termudah)

1. Buka terminal/command prompt baru
2. Navigasi ke folder root proyek (folder yang berisi file index.html)
3. Jalankan perintah:

   ```bash
   # Untuk Python 3
   python -m http.server 8080

   # Untuk Python 2
   python -m SimpleHTTPServer 8080
   ```

#### Menggunakan Node.js

1. Install http-server secara global:
   ```bash
   npm install -g http-server
   ```
2. Navigasi ke folder root proyek
3. Jalankan:
   ```bash
   http-server -p 8080
   ```

#### Menggunakan Visual Studio Code

1. Install ekstensi "Live Server"
2. Buka folder proyek di VS Code
3. Klik kanan pada file `index.html`
4. Pilih "Open with Live Server"

## Mengakses Aplikasi

1. Buka browser dan akses `http://localhost:8080`
2. Register akun baru atau login jika sudah memiliki akun
3. Mulai mencatat pengeluaran Anda

## Fitur Aplikasi

- Register akun baru
- Login dengan akun yang sudah ada
- Menambah pengeluaran baru
- Melihat daftar pengeluaran
- Menghapus pengeluaran
- Melihat total pengeluaran
- Logout

## Catatan Penting

- Pastikan backend berjalan di port 3000 sebelum menggunakan frontend
- Jika port 8080 sudah digunakan, Anda bisa menggunakan port lain (misal 8081, 8082, dll)
- Data disimpan dalam memori server, sehingga akan hilang jika server di-restart
- Untuk penggunaan produksi, disarankan untuk:
  - Menggunakan database (MongoDB, PostgreSQL, dll)
  - Menyimpan JWT_SECRET di environment variable
  - Menambahkan validasi input yang lebih ketat
  - Meningkatkan penanganan error

## Troubleshooting

### Backend tidak bisa dijalankan

- Pastikan Node.js terinstall dengan benar
- Pastikan semua dependencies terinstall
- Periksa apakah port 3000 sudah digunakan oleh aplikasi lain

### Frontend tidak bisa dijalankan

- Pastikan backend sudah berjalan
- Periksa apakah port 8080 sudah digunakan
- Coba gunakan port lain jika diperlukan

### Error CORS

- Pastikan backend berjalan di port 3000
- Periksa konfigurasi CORS di backend

### Error localStorage

- Pastikan menggunakan browser modern
- Coba bersihkan cache browser
