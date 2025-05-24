# MS. Puff Laundry

MS. Puff Laundry adalah aplikasi web yang dirancang untuk mempermudah pengelolaan layanan laundry. Aplikasi ini mencakup fitur menampilkan layanan laundry dan pesan layanan redirect to whattsapp.

## Teknologi yang Digunakan

* **Vite** - Build tool yang cepat dan efisien.
* **React JS** - Library JavaScript untuk membangun antarmuka pengguna yang interaktif.
* **Strapi** - Headless CMS yang mudah digunakan untuk mengatur data konten.

## Fitur

* Menampilkan Layanan Laundry
* Pesan Layanan Redirect to Whattsapp
* Mengatur data kontent web

## Cara Menjalankan Proyek

Pastikan Anda sudah menginstal **Node.js** dan **npm** di perangkat Anda.

### Menjalankan Projek Backend

1. Clone repository:

   ```bash
   git clone https://github.com/username/ms-puff-laundry.git
   cd ms-puff-laundry
   cd backend
   ```

2. Menyiapkan database:

   Jika sudah memiliki file database projek backend ini bisa langsung di import saja pada database server MySQL nya. Jika belum maka ikuti langkah ini:

   * Buat database pada server MySQL, sesuaikan nama database dengan nama database yang diisi di file .env projek backend.
   * Jika sudah, maka lanjut pada langkah selanjutnya

3. Install dependencies:

   ```bash
   npm install
   ```

4. Jalankan aplikasi:

   ```bash
   npm run develop
   ```

5. Buka di browser:

   ```
   http://localhost:1337
   ```

### Menjalankan Projek Frontend

1. Clone repository:

   ```bash
   git clone https://github.com/username/ms-puff-laundry.git
   cd ms-puff-laundry
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

4. Buka di browser:

   ```
   http://localhost:5173
   ```

**Catatan: Buat file .env pada masing-masing projek dan isi variable environment sesuai yang ada pada file .env.example**

## Struktur Proyek

```
ms-puff-laundry/
│
├── backend/             
├── frontend
├── README.md         
```

## Pengembangan Selanjutnya

* Memperbagus Style Web Frontend
* Tampilan Laporan Omset untuk Owner
* Memperbaiki Tampilan Admin Panel

## Kontribusi

Kontribusi terbuka untuk siapa saja. Silakan fork repository ini dan buat pull request.

