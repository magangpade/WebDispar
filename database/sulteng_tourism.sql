-- database/sulteng_tourism.sql
CREATE DATABASE IF NOT EXISTS sulteng_tourism;
USE sulteng_tourism;

-- Users (Admin)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Berita
CREATE TABLE berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  konten LONGTEXT NOT NULL,
  gambar VARCHAR(255),
  penulis VARCHAR(100) DEFAULT 'Admin',
  tanggal DATE NOT NULL,
  dilihat INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profil (Sejarah, Visi Misi, Tupoksi, dll)
CREATE TABLE profil (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kategori VARCHAR(50) NOT NULL, -- 'sejarah', 'visi_misi', 'tupoksi', 'profil_pimpinan', 'majalah', 'logo', 'hubungi_kami'
  judul VARCHAR(255),
  konten LONGTEXT,
  gambar VARCHAR(255),
  file_pdf VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pejabat (Profil Pimpinan)
CREATE TABLE pejabat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  nip VARCHAR(30),
  jabatan VARCHAR(100) NOT NULL,
  foto VARCHAR(255),
  urutan INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PPID - Daftar Informasi Publik (kategori & item)
CREATE TABLE ppid_kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  urutan INT DEFAULT 0
);

CREATE TABLE ppid_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kategori_id INT,
  judul VARCHAR(255) NOT NULL,
  file VARCHAR(255),
  link VARCHAR(255),
  tahun VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES ppid_kategori(id) ON DELETE CASCADE
);

-- PPID - Regulasi
CREATE TABLE ppid_regulasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  file VARCHAR(255),
  kategori VARCHAR(50) DEFAULT 'umum', -- 'umum', 'pedoman'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PPID - SK
CREATE TABLE ppid_sk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  tahun VARCHAR(10),
  file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - DTW
CREATE TABLE dtw (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kabupaten VARCHAR(100) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi LONGTEXT,
  gambar VARCHAR(255),
  dilihat INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - Desa Wisata
CREATE TABLE desa_wisata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kabupaten VARCHAR(100) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  deskripsi LONGTEXT,
  gambar VARCHAR(255),
  dilihat INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - Paket Wisata
CREATE TABLE paket_wisata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255),
  file_pdf VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - Kalender Event
CREATE TABLE kalender_event (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  tanggal DATE,
  lokasi VARCHAR(255),
  deskripsi TEXT,
  gambar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - Statistik Kunjungan
CREATE TABLE statistik_kunjungan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tahun VARCHAR(10) NOT NULL,
  bulan VARCHAR(20),
  domestik INT DEFAULT 0,
  mancanegara INT DEFAULT 0,
  total INT GENERATED ALWAYS AS (domestik + mancanegara) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - Ekonomi Kreatif
CREATE TABLE ekonomi_kreatif (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Info Pariwisata - Sumber Daya
CREATE TABLE sumber_daya (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rencana Terbit
CREATE TABLE rencana_terbit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  jadwal_rilis DATE,
  status ENUM('Rilis', 'Belum Rilis') DEFAULT 'Belum Rilis',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Statistik Pengunjung Website
CREATE TABLE pengunjung (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip VARCHAR(50),
  tanggal DATE,
  hits INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Survey Kepuasan (PPID)
CREATE TABLE survey_kepuasan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  nik VARCHAR(20),
  jawaban JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form Permohonan Informasi
CREATE TABLE permohonan_informasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  alamat TEXT,
  email VARCHAR(100),
  no_telp VARCHAR(20),
  rincian TEXT,
  cara_mendapatkan VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form Keberatan
CREATE TABLE keberatan_informasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanggal DATE,
  nomor_registrasi VARCHAR(50),
  nomor_permohonan VARCHAR(50),
  tujuan TEXT,
  nama VARCHAR(100),
  alamat TEXT,
  no_telp VARCHAR(20),
  alasan TEXT,
  kasus_posisi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin default (password: admin123)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfgqQ6z0l1q1q1q1q1q1q1q1q1q1q1q', 'superadmin');

-- Insert contoh data
INSERT INTO ppid_kategori (nama, slug, urutan) VALUES
('Data Kepegawaian', 'data-kepegawaian', 1),
('Dokumen SAKIP', 'dokumen-sakip', 2),
('Laporan Keuangan & Aset', 'laporan-keuangan-aset', 3),
('Laporan Kegiatan', 'laporan-kegiatan', 4),
('PPID', 'ppid', 5),
('SK Informasi Publik', 'sk-informasi-publik', 6);

INSERT INTO berita (judul, slug, konten, tanggal, penulis, dilihat) VALUES
('Kadis Pariwisata Sulteng Hadiri Rapat Paripurna DPRD Bahas Perubahan KUA-PPAS 2026', 'kadis-paripurna-kua-ppas-2026', 'Palu, 28 Agustus 2026 - Kepala Dinas Pariwisata...', '2026-08-28', 'Admin', 80),
('Semangat Kemerdekaan ke-81: Dinas Pariwisata Sulteng Genjot Sektor Pariwisata dan Kebudayaan', 'semangat-kemerdekaan-81', 'Palu, 17 Agustus 2026 - Peringatan HUT...', '2026-08-17', 'Admin', 88);