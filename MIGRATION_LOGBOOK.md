# 📖 Logbook Migrasi Web Dinas Pariwisata Provinsi Sulawesi Tengah

Dokumentasi resmi pembaruan arsitektur sistem dan migrasi basis data dari CMS Warisan (Joomla! 3.9 EOL) menuju Stack Modern (React 19 + Express.js + MySQL).

---

## 🎯 Latar Belakang & Urgensi
1. **Keamanan Sistem:** CMS lama menggunakan versi PHP 8.0 dan Joomla 3.9.26 yang telah melewati masa dukungan resmi (*End-of-Life* / EOL), menimbulkan celah keamanan siber pada domain pemerintah `.go.id`.
2. **Efisiensi Anggaran (APBD):** Mengakhiri ketergantungan kontrak pemeliharaan vendor lama sebesar Rp 20.000.000,- / tahun melalui pengembangan mandiri (*in-house*).
3. **Kedaulatan Data:** Memulihkan kendali penuh atas seluruh arsip publikasi dinas tanpa pembatasan hak akses (*vendor lock-in*).

---

## 📊 Inventaris Data yang Berhasil Dimigrasi
Total **406 entitas konten** berhasil diekstraksi dan distrukturkan ke dalam database `sulteng_tourism`:

| No | Modul / Kategori | Jumlah Record | Status Migrasi |
| :---: | :--- | :---: | :---: |
| 1 | Warta Berita Pariwisata | 264 | ✅ 100% Berhasil |
| 2 | Informasi Publik & PPID | 72 | ✅ 100% Berhasil |
| 3 | Daya Tarik Wisata (DTW 13 Kab/Kota) | 44 | ✅ 100% Berhasil |
| 4 | Profil Dinas (Visi, Misi, Tupoksi, Sejarah) | 14 | ✅ 100% Berhasil |
| 5 | Regulasi & Produk Hukum Daerah | 11 | ✅ 100% Berhasil |
| 6 | Desa Wisata Terpadu | 1 | ✅ 100% Berhasil |
| 7 | Struktur Navigasi Menu | 185 | ✅ 100% Dipetakan |
| 8 | Banner Hero Carousel | 8 | ✅ 100% Diintegrasikan |

---

## 🏗️ Komparasi Arsitektur

```mermaid
graph TD
    subgraph Arsitektur Lama (Joomla 3.9 EOL)
        J1[Client Browser] -->|Reload Lambat| J2[Monolithic Apache + PHP 8.0]
        J2 --> J3[(MySQL Old)]
    end

    subgraph Arsitektur Baru (Modern Stack)
        N1[Client Browser / Mobile] -->|SPA Cepat| N2[React 19 + Vite + Tailwind CSS]
        N2 -->|REST API JWT| N3[Node.js + Express.js Service]
        N3 --> N4[(MySQL Database sulteng_tourism)]
    end
```

---

## 📝 Catatan Implementasi Teknis
- **Database:** Kolom konten dan deskripsi dikonfigurasi menggunakan `LONGTEXT` untuk memastikan seluruh format teks artikel utuh tanpa pemotongan.
- **Frontend Media:** Komponen `Hero.jsx`, `BeritaCard.jsx`, dan `BeritaDetail.jsx` telah dilengkapi *error boundary* dan fallback cerdas terhadap aset media.
- **Identitas Lembaga:** Sinkronisasi alamat resmi kantor (Jl. Dewi Sartika No. 45 Palu), kanal aduan WhatsApp Hotline `08116662222`, dan integrasi SP4N-LAPOR nasional.
