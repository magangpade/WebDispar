const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'sulteng_tourism'
  });

  console.log('🏨 1. Menyiapkan tabel & data_hunian (Data Hunian Hotel)...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS data_hunian (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      deskripsi TEXT,
      file VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query('DELETE FROM data_hunian');

  const hunianList = [
    {
      judul: 'Data Tingkat Penghunian Kamar (TPK) Hotel Provinsi Sulawesi Tengah',
      deskripsi: 'Rekapitulasi resmi tingkat penghunian kamar hotel berbintang dan non-bintang serta jumlah akomodasi per Kabupaten/Kota di Provinsi Sulawesi Tengah.',
      file: '/images/2026/02Pemasaran/Data_Tingkat_Penghunian_Hotel_-_02_feb.pdf'
    },
    {
      judul: 'Data Statistik Sektoral Pariwisata, Akomodasi & Rumah Makan Sulawesi Tengah',
      deskripsi: 'Data statistik sektoral jumlah sarana akomodasi, rumah makan/restoran menurut Kabupaten/Kota serta perkembangan kunjungan wisatawan di Sulawesi Tengah.',
      file: '/images/2026/02Pemasaran/DATA_STATISTIK_SEKTORAL.pdf'
    },
    {
      judul: 'Rekapitulasi Kunjungan & Hunian Wisatawan Sulawesi Tengah Tahun 2025',
      deskripsi: 'Laporan rekapitulasi capaian kunjungan wisatawan nusantara dan mancanegara pada akomodasi dan daya tarik wisata Sulawesi Tengah.',
      file: '/images/2026/02Pemasaran/Rekap_Kunjungan_Wisatawan_Thn_2025_edit.pdf'
    },
    {
      judul: 'Analisis Data Kunjungan & Akomodasi Wisatawan Tahun 2024',
      deskripsi: 'Dokumen analisis resmi perkembangan kunjungan dan tingkat hunian wisatawan Provinsi Sulawesi Tengah Tahun 2024.',
      file: '/images/Wisatawan/ANALISIS_KUNJUNGAN_WISATAWAN_2024.pdf'
    },
    {
      judul: 'Analisis Data Kunjungan & Akomodasi Wisatawan Tahun 2023',
      deskripsi: 'Dokumen analisis resmi perkembangan kunjungan dan tingkat hunian wisatawan Provinsi Sulawesi Tengah Tahun 2023.',
      file: '/images/Wisatawan/ANALISIS_DATA_KUNJUNGAN_WISATAWAN_TAHUN_2023_1.pdf'
    }
  ];

  for (const h of hunianList) {
    await conn.query(
      'INSERT INTO data_hunian (judul, deskripsi, file) VALUES (?, ?, ?)',
      [h.judul, h.deskripsi, h.file]
    );
  }
  console.log(`✅ Berhasil mengisi ${hunianList.length} dokumen resmi di tabel data_hunian!`);

  console.log('\n🎒 2. Mengisi 19 Paket Wisata Resmi (dari Item 130 semua_data_pariwisata.json)...');
  await conn.query('DELETE FROM paket_wisata');

  const paketList = [
    {
      judul: 'Paket Wisata Bahari Kepulauan Sombori Morowali',
      deskripsi: 'Eksplorasi gugusan pulau karst, laguna biru kristal, Goa Berlian, Puncak Khayangan, dan wisata bawah laut Kepulauan Sombori Kabupaten Morowali.',
      gambar: '/images/PaketWisata/WISATA_SOMBORI.jpg',
      file_pdf: '/images/PaketWisata/pdf/Wisata_Bahari_Sombori.pdf'
    },
    {
      judul: 'Paket Wisata Megalith Taman Nasional Lore Lindu (TNLL)',
      deskripsi: 'Jelajah warisan purbakala Negeri Seribu Megalit di Lembah Bada, Besoa, dan Napu serta keanekaragaman hayati Cagar Biosfer UNESCO Taman Nasional Lore Lindu.',
      gambar: '/images/PaketWisata/tnll.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Megalith_TNLL.pdf'
    },
    {
      judul: 'Prince John Dive Resort - Paket Wisata Selam Tanjung Karang Donggala',
      deskripsi: 'Paket wisata diving, snorkeling, dan resort tepi pantai berpasir putih di kawasan wisata bahari Tanjung Karang, Kabupaten Donggala.',
      gambar: '/images/PaketWisata/prince_john.jpg',
      file_pdf: '/images/PaketWisata/pdf/Prince_John_Dive_Resort.pdf'
    },
    {
      judul: 'Tour Packages Central Sulawesi - Pesona Destinasi Unggulan',
      deskripsi: 'Katalog resmi paket tur wisata terpadu menjelajahi destinasi alam, budaya, dan bahari unggulan di Provinsi Sulawesi Tengah.',
      gambar: '/images/PaketWisata/tour-packages-1_001.jpg',
      file_pdf: '/images/PaketWisata/pdf/Tour_Packages_Sulteng.pdf'
    },
    {
      judul: 'Profil & Paket Ekowisata Desa Wisata Malangga Tolitoli',
      deskripsi: 'Paket wisata alam pedesaan, air terjun, agrowisata, dan kearifan budaya lokal di Desa Wisata Malangga, Kabupaten Tolitoli.',
      gambar: '/images/PaketWisata/01_Desa_Malangga_002.jpg',
      file_pdf: '/images/PaketWisata/pdf/01_Desa_Malangga.pdf'
    },
    {
      judul: 'Brosur Paket Perjalanan Desa Wisata Malangga',
      deskripsi: 'Rincian itinerary dan paket aktivitas wisata keluarga serta petualangan alam di Desa Wisata Malangga.',
      gambar: '/images/PaketWisata/desa_malangga_paket.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Desa_Malangga.pdf'
    },
    {
      judul: 'Paket Wisata Nusantara (PAK WISNU) Sulawesi Tengah',
      deskripsi: 'Program paket perjalanan wisata nusantara menyusuri ragam pesona bahari, pegunungan, dan kuliner khas Sulawesi Tengah.',
      gambar: '/images/PaketWisata/PAK_WISNU_000.jpg',
      file_pdf: '/images/PaketWisata/pdf/PAK_WISNU.pdf'
    },
    {
      judul: 'Paket Wisata Diving (Selam) Spot Terbaik Sulawesi Tengah',
      deskripsi: 'Paket penyelaman eksplorasi terumbu karang dan biota laut endemik di perairan Sulawesi Tengah.',
      gambar: '/images/PaketWisata/wisata_diving.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Diving.pdf'
    },
    {
      judul: 'Paket Wisata Memancing (Fishing Tour) Sulawesi Tengah',
      deskripsi: 'Paket wisata minat khusus olahraga memancing (sport fishing) di perairan potensial Sulawesi Tengah.',
      gambar: '/images/PaketWisata/wisata_mancing.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Memancing.pdf'
    },
    {
      judul: 'City Tour Package - Jelajah Wisata Kota Palu',
      deskripsi: 'Paket tur keliling Kota Palu mengunjungi ikon wisata sejarah, religi, kuliner Kaledo, sentra tenun Bomba, dan panorama Teluk Palu.',
      gambar: '/images/PaketWisata/paket_tour.jpg',
      file_pdf: '/images/PaketWisata/pdf/City_Tour_Package.pdf'
    },
    {
      judul: 'Paket Wisata Bahari Pusat Laut (Pusentasi) Donggala',
      deskripsi: 'Wisata keluarga dan bahari di sumur raksasa berair jernih alami Pusat Laut (Pusentasi) dan pesisir pantai Kabupaten Donggala.',
      gambar: '/images/PaketWisata/pusat_laut_-_preview.jpg',
      file_pdf: '/images/PaketWisata/pdf/Pusat_Laut_Donggala.pdf'
    },
    {
      judul: 'Paket Wisata Bahari Desa Wisata Mbuang-Mbuang Banggai Laut',
      deskripsi: 'Menjelajahi keindahan bawah laut, konservasi Banggai Cardinal Fish, dan wisata pulau eksotis di Desa Wisata Mbuang-Mbuang, Kabupaten Banggai Laut.',
      gambar: '/images/PaketWisata/mbuang-mbuang_-_preview.jpg',
      file_pdf: '/images/PaketWisata/pdf/Desa_Wisata_Mbuang_Mbuang.pdf'
    },
    {
      judul: 'Paket Wisata Sejarah & Budaya Kerajaan Banggai',
      deskripsi: 'Menelusuri jejak sejarah Keraton Kerajaan Banggai, budaya adat, dan peninggalan bersejarah di Kabupaten Banggai Laut.',
      gambar: '/images/PaketWisata/kerajaan_banggai_-_preview.jpg',
      file_pdf: '/images/PaketWisata/pdf/Wisata_Sejarah_Kerajaan_Banggai.pdf'
    },
    {
      judul: 'Explore Tana Taa - Paket Wisata Budaya & Alam Morowali Utara',
      deskripsi: 'Petualangan budaya Suku Wana (Tana Taa), cagar alam Morowali, dan pesona Teluk Tomori di Kabupaten Morowali Utara.',
      gambar: '/images/PaketWisata/explore_tana_taa.jpg',
      file_pdf: '/images/PaketWisata/pdf/Explore_Tana_Taa_Morowali_Utara.pdf'
    },
    {
      judul: 'Paket Wisata Kayak & Olahraga Air Bahari',
      deskripsi: 'Aktivitas wisata petualangan mendayung kayak menyusuri perairan tenang, hutan mangrove, dan pesisir pulau Sulawesi Tengah.',
      gambar: '/images/PaketWisata/kayak.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Kayak_Bahari.pdf'
    },
    {
      judul: 'Paket Wisata Alam & Budaya Mataruttung',
      deskripsi: 'Paket perjalanan wisata eksplorasi keindahan alam, air terjun, dan tradisi masyarakat lokal di kawasan wisata Mataruttung.',
      gambar: '/images/PaketWisata/mataruttung.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Mataruttung.pdf'
    },
    {
      judul: 'Paket Ekowisata Hutan & Tradisi Wana Posangke',
      deskripsi: 'Ekspedisi ekowisata hutan tropis dan pengenalan kehidupan harmonis masyarakat adat Wana Posangke.',
      gambar: '/images/PaketWisata/wana_posangke.jpg',
      file_pdf: '/images/PaketWisata/pdf/Paket_Wisata_Wana_Posangke.pdf'
    },
    {
      judul: 'Travel Guide Kabupaten Tolitoli',
      deskripsi: 'Buku panduan perjalanan wisata lengkap destinasi, akomodasi, kuliner, dan budaya di Kabupaten Tolitoli.',
      gambar: '/images/TRAVEL_GUIDE_001.jpg',
      file_pdf: '/images/Direktori/Leaflet_Palu1c.jpg'
    },
    {
      judul: 'Leaflet Panduan Wisata Kota Palu',
      deskripsi: 'Leaflet direktori peta wisata, destinasi unggulan, kuliner, dan akomodasi di Kota Palu.',
      gambar: '/images/Direktori/Leaflet_Palu1c.jpg',
      file_pdf: '/images/Direktori/Leaflet_Palu1c.jpg'
    }
  ];

  for (const p of paketList) {
    await conn.query(
      'INSERT INTO paket_wisata (judul, deskripsi, gambar, file_pdf) VALUES (?, ?, ?, ?)',
      [p.judul, p.deskripsi, p.gambar, p.file_pdf]
    );
  }
  console.log(`✅ Berhasil mengisi ${paketList.length} paket wisata resmi di tabel paket_wisata!`);

  await conn.end();
}

seed().catch(console.error);
