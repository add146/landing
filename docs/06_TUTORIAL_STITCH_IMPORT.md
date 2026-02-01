# Tutorial: Import Desain dari Google Stitch ke Landing Page Builder

Panduan ini akan menjelaskan cara mengambil hasil desain (UI) dari **Google Stitch** (atau tools AI generator HTML/CSS lainnya seperti v0.dev, Bolt.new) dan memasukkannya ke dalam Landing Page Builder kami.

## Apa yang Anda Butuhkan?

1.  Akses ke **Google Stitch** (atau tool AI pilihan Anda).
2.  Akses ke **Landing Page Builder** (aplikasi ini).

## Langkah 1: Generate Desain di Google Stitch

1.  Buka **Google Stitch**.
2.  Masukkan prompt deskripsi website yang ingin Anda buat.
    *   *Contoh: "Buatkan landing page untuk jasa cleaning service dengan hero section, list fitur, dan form kontak. Gunakan nuansa warna biru dan putih."*
3.  Tunggu hingga Stitch menghasilkan preview desain.
4.  Jika diminta memilih mode, pilih yang menghasilkan **HTML & CSS**.
5.  Setelah puas dengan tampilannya, cari tombol **"Code"**, **"Export"**, atau icon **"Salin Kode" (Copy Code)**.
    *   **Salin seluruh kode (HTML + CSS) yang diberikan.**

## Langkah 2: Buka Landing Page Builder

1.  Buka aplikasi Landing Page Builder.
2.  Masuk ke halaman editor salah satu website/page Anda.
3.  Di bagian atas (Header), klik tombol **"Import Code"** (ikon kode/kurung siku `< >`).

## Langkah 3: Paste Kode

Akan muncul popup **Import Design Code**:

1.  Paste **seluruh kode** yang Anda salin dari Stitch ke dalam kotak input yang tersedia.
    *   Termasuk jika ada tag `<style>`.
    *   Termasuk jika menggunakan **Tailwind CSS**.
2.  Sistem kami otomatis mengenali dan memproses kode tersebut.

## Langkah 4: Klik "Import"

1.  Klik tombol **Import Code** di bagian bawah popup.
2.  Desain Anda akan otomatis muncul di canvas editor!
    *   *Note: Jika desain menggunakan Tailwind, tampilannya kini akan sesuai (tidak berantakan) karena kami sudah mendukung Tailwind secara native.*

## Langkah 5: Edit & Sesuaikan

Sekarang desain tersebut sudah menjadi bagian dari editor GrapesJS kami:

*   **Ubah Teks**: Klik dua kali pada teks untuk mengubah isinya.
*   **Ganti Gambar**: Klik gambar, lalu gunakan panel Settings (kanan) untuk mengganti URL gambar.
*   **Drag & Drop**: Anda bisa menambahkan blok baru dari sidebar kiri ke dalam desain yang baru di-import.
*   **Simpan**: Jangan lupa klik **Save** di pojok kanan atas.
