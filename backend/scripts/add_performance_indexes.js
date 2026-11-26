const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');

const INDEXES = [
  { table: 'berita', name: 'idx_berita_tanggal', columns: '(tanggal)' },
  { table: 'dtw', name: 'idx_dtw_kabupaten', columns: '(kabupaten)' },
  { table: 'desa_wisata', name: 'idx_desa_wisata_kabupaten', columns: '(kabupaten)' },
  { table: 'pengunjung', name: 'idx_pengunjung_ip_tanggal', columns: '(ip, tanggal)' },
  { table: 'pengunjung', name: 'idx_pengunjung_tanggal', columns: '(tanggal)' },
  { table: 'statistik_kunjungan', name: 'idx_statistik_tahun', columns: '(tahun)' },
  { table: 'ppid_item', name: 'idx_ppid_item_kat_tahun', columns: '(kategori_id, tahun)' },
];

(async () => {
  try {
    for (const idx of INDEXES) {
      const [existing] = await db.query(
        `SHOW INDEX FROM \`${idx.table}\` WHERE Key_name = ?`,
        [idx.name]
      );
      if (existing.length > 0) {
        console.log(`[SKIP] ${idx.table}.${idx.name} sudah ada`);
        continue;
      }
      await db.query(`ALTER TABLE \`${idx.table}\` ADD INDEX \`${idx.name}\` ${idx.columns}`);
      console.log(`[OK]   ${idx.table}.${idx.name} ${idx.columns} ditambahkan`);
    }
    console.log('Selesai menerapkan semua index performa.');
    process.exit(0);
  } catch (err) {
    console.error('Gagal menambahkan index:', err.message);
    process.exit(1);
  }
})();
