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
    *   Biasanya Stitch memberikan **satu file HTML** yang sudah berisi CSS (di dalam tag `<style>`).
    *   **Salin seluruh kode tersebut.**

## Langkah 2: Buka Landing Page Builder

1.  Buka aplikasi Landing Page Builder.
2.  Masuk ke halaman editor salah satu website/page Anda.
3.  Di bagian atas (Header), klik tombol **"Import Code"** (ikon kode/kurung siku `< >`).

## Langkah 3: Paste Kode

Akan muncul popup **Import Code**:

1.  **Tab HTML**: Paste **seluruh kode** yang Anda salin dari Stitch ke kolom ini.
    *   *Sistem kami cerdas!* Jika ada kode CSS (dalam tag `<style>`) yang tercampur, sistem akan otomatis memisahkannya.
    *   Jadi Anda tidak perlu repot memisahkan HTML dan CSS manual.
2.  **Tab CSS**: (Opsional) Biarkan kosong jika CSS Anda sudah menyatu di HTML tadi.

## Langkah 4: Klik "Import"

1.  Klik tombol **Import** di bagian bawah popup.
2.  Desain Anda akan otomatis muncul di canvas editor!

## Langkah 5: Edit & Sesuaikan

Sekarang desain tersebut sudah menjadi bagian dari editor GrapesJS kami:

*   **Ubah Teks**: Klik dua kali pada teks untuk mengubah isinya.
*   **Ganti Gambar**: Klik gambar, lalu gunakan panel Settings (kanan) untuk mengganti URL gambar.
*   **Drag & Drop**: Anda bisa menambahkan blok baru dari sidebar kiri ke dalam desain yang baru di-import.
*   **Simpan**: Jangan lupa klik **Save** di pojok kanan atas.

---

**Catatan Tambahan:**
*   Fitur ini mendukung **Tailwind CSS** jika desain Anda menggunakannya (pastikan class-nya valid).
*   Jika tampilan sedikit berantakan, cek kembali kode HTML/CSS Anda, mungkin ada tag yang belum tertutup.
