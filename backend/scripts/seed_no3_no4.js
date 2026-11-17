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

  console.log('🚀 Mulai seeding data No. 3 dan No. 4...');

  // ==========================================
  // 1. UPDATE PEJABAT (FOTO PEJABAT)
  // ==========================================
  console.log('\n📸 1. Mengupdate foto pejabat...');
  const fotoMapping = [
    { namePattern: '%Diah Agustiningsih%', foto: 'kadis_diah.jpg' },
    { namePattern: '%Nency Ainun%', foto: 'nency-ainun.jpg' },
    { namePattern: '%Hasna%', foto: 'hasna.jpg' },
    { namePattern: '%Joyce Sagita%', foto: 'joyce.jpg' },
    { namePattern: '%Ilham Arifin%', foto: 'ilham.jpg' },
    { namePattern: '%Widyawati%', foto: 'widyawati.jpg' },
    { namePattern: '%Yunita%', foto: 'yunita.jpg' },
    { namePattern: '%Satrisni%', foto: 'satrisni.jpg' },
    { namePattern: '%Max William%', foto: 'Max.jpg' },
    { namePattern: '%Gafriani%', foto: 'gafriani.jpg' },
    { namePattern: '%Husen%', foto: 'husein.jpg' }
  ];

  for (const m of fotoMapping) {
    const [res] = await conn.query('UPDATE pejabat SET foto = ? WHERE nama LIKE ?', [m.foto, m.namePattern]);
    console.log(`Updated ${m.foto}: ${res.affectedRows} row(s)`);
  }

  // ==========================================
  // 2. UPDATE KALENDER EVENT (FOTO FLYER / BANNER)
  // ==========================================
  console.log('\n🎪 2. Mengupdate gambar kalender event & menambah event unggulan...');
  await conn.query('UPDATE kalender_event SET gambar = ? WHERE judul LIKE ?', ['event_danau_lindu.jpeg', '%Danau Lindu%']);
  await conn.query('UPDATE kalender_event SET gambar = ? WHERE judul LIKE ?', ['event_danau_poso.png', '%Danau Poso%']);
  await conn.query('UPDATE kalender_event SET gambar = ? WHERE judul LIKE ?', ['event_palu_festival.jpg', '%Palu%']);

  // Tambahkan event baru jika belum ada
  const [existingPulo] = await conn.query('SELECT id FROM kalender_event WHERE judul LIKE ?', ['%Pulo Dua%']);
  if (existingPulo.length === 0) {
    await conn.query(
      'INSERT INTO kalender_event (judul, tanggal, lokasi, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)',
      [
        'Festival Pulo Dua 2026',
        '2026-09-18 10:00:00',
        'Kabupaten Banggai',
        'Festival bahari spektakuler di Pulau Dua Luwuk Banggai dengan panorama bawah laut kelas dunia dan parade perahu tradisional.',
        'event_pulo_dua.jpg'
      ]
    );
    console.log('✅ Menambahkan Festival Pulo Dua 2026');
  }

  const [existingBuya] = await conn.query('SELECT id FROM kalender_event WHERE judul LIKE ?', ['%Buya Sabe%']);
  if (existingBuya.length === 0) {
    await conn.query(
      'INSERT INTO kalender_event (judul, tanggal, lokasi, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)',
      [
        'Festival Tenun Buya Sabe 2026',
        '2026-07-08 09:00:00',
        'Kabupaten Donggala',
        'Pesta budaya perayaan tenun khas Donggala Buya Sabe yang memadukan fashion show etnik internasional, pameran kriya, dan pertunjukan seni musik pesisir.',
        'event_buya_sabe.jpeg'
      ]
    );
    console.log('✅ Menambahkan Festival Tenun Buya Sabe 2026');
  }

  // ==========================================
  // 3. STATISTIK KUNJUNGAN (2022, 2023, 2024, 2025)
  // ==========================================
  console.log('\n📊 3. Menambahkan data statistik kunjungan 2022 - 2025...');
  const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const seedStatistikTahun = async (tahun, baseDom, baseMan, growth) => {
    const [exist] = await conn.query('SELECT COUNT(*) as c FROM statistik_kunjungan WHERE tahun = ?', [tahun]);
    if (exist[0].c === 0) {
      console.log(`Menambahkan data statistik tahun ${tahun}...`);
      for (let i = 0; i < bulanList.length; i++) {
        const factor = 1 + (i * 0.04) + ((i % 3 === 0) ? 0.08 : 0);
        const dom = Math.round(baseDom * factor);
        const man = Math.round(baseMan * factor);
        await conn.query(
          'INSERT INTO statistik_kunjungan (tahun, bulan, domestik, mancanegara) VALUES (?, ?, ?, ?)',
          [tahun, bulanList[i], dom, man]
        );
      }
    } else {
      console.log(`Tahun ${tahun} sudah memiliki ${exist[0].c} data.`);
    }
  };

  await seedStatistikTahun('2022', 85000, 240, 1.05);
  await seedStatistikTahun('2023', 98000, 310, 1.08);
  await seedStatistikTahun('2024', 115000, 380, 1.10);
  await seedStatistikTahun('2025', 132000, 440, 1.12);

  // ==========================================
  // 4. RENCANA TERBIT LENGKAP
  // ==========================================
  console.log('\n📅 4. Memperbarui Rencana Terbit publikasi...');
  const rencanaData = [
    { judul: 'Kalender Event Pariwisata Sulawesi Tengah 2026', jadwal: '2026-01-15 00:00:00', status: 'Rilis' },
    { judul: 'Laporan Kinerja Instansi Pemerintah (LKjIP) Tahun 2025', jadwal: '2026-02-28 00:00:00', status: 'Rilis' },
    { judul: 'Data Statistik Kunjungan Wisatawan Tahun 2025', jadwal: '2026-03-10 00:00:00', status: 'Rilis' },
    { judul: 'Dokumen Rencana Strategis (Renstra) Dinas Pariwisata 2026-2031', jadwal: '2026-07-15 00:00:00', status: 'Rilis' },
    { judul: 'Majalah Pariwisata Pesona Sulawesi Tengah Edisi II', jadwal: '2026-12-20 00:00:00', status: 'Belum Rilis' },
    { judul: 'Data Statistik Kunjungan Wisatawan Tahun 2026', jadwal: '2027-03-10 00:00:00', status: 'Belum Rilis' }
  ];

  for (const r of rencanaData) {
    const [exist] = await conn.query('SELECT id FROM rencana_terbit WHERE judul = ?', [r.judul]);
    if (exist.length === 0) {
      await conn.query('INSERT INTO rencana_terbit (judul, jadwal_rilis, status) VALUES (?, ?, ?)', [r.judul, r.jadwal, r.status]);
      console.log(`✅ Ditambahkan rencana terbit: ${r.judul}`);
    } else {
      await conn.query('UPDATE rencana_terbit SET jadwal_rilis = ?, status = ? WHERE id = ?', [r.jadwal, r.status, exist[0].id]);
    }
  }

  // ==========================================
  // 5. PPID - LAPORAN TAHUNAN RESMI
  // ==========================================
  console.log('\n📄 5. Memperbarui Laporan Tahunan PPID...');
  const laporanPpid = [
    {
      judul: 'Laporan Tahunan PPID Dinas Pariwisata Prov. Sulteng Tahun 2024',
      link: 'https://drive.google.com/file/d/1SLzvvxdFWWJP532G-4YxRDhRowoOihn1/view?usp=sharing',
      tahun: '2024'
    },
    {
      judul: 'Laporan Tahunan Pelayanan Informasi Publik (PPID) Tahun 2023',
      link: 'https://pariwisata.sultengprov.go.id/images/PPID/LAPORAN_TAHUNAN_PPID_2023.pdf',
      tahun: '2023'
    },
    {
      judul: 'Laporan Tahunan Pelayanan Informasi Publik (PPID) Tahun 2022',
      link: 'https://drive.google.com/file/d/1SLzvvxdFWWJP532G-4YxRDhRowoOihn1/view?usp=sharing',
      tahun: '2022'
    },
    {
      judul: 'Laporan Monitoring dan Evaluasi Keterbukaan Informasi Publik (Monev KIP)',
      link: 'https://pariwisata.sultengprov.go.id/images/2026/MONEV_PPID_Diskominfo.jpeg',
      tahun: '2024'
    }
  ];

  for (const lp of laporanPpid) {
    const [exist] = await conn.query('SELECT id FROM ppid_item WHERE kategori_id = 8 AND judul = ?', [lp.judul]);
    if (exist.length === 0) {
      await conn.query(
        'INSERT INTO ppid_item (kategori_id, judul, file, link, tahun) VALUES (?, ?, ?, ?, ?)',
        [8, lp.judul, lp.link, lp.link, lp.tahun]
      );
      console.log(`✅ Ditambahkan Laporan PPID: ${lp.judul} (${lp.tahun})`);
    }
  }

  console.log('\n🎉 SELESAI! Data No. 3 dan No. 4 berhasil diperbarui.');
  await conn.end();
}

seed().catch(console.error);
