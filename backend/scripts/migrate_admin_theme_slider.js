const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sulteng_tourism'
  });

  console.log('Migrating tables for Admin Theme & Slider...');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`pengaturan_tema\` (
      \`id\` INT(11) NOT NULL PRIMARY KEY DEFAULT 1,
      \`primary_color\` VARCHAR(50) DEFAULT '#1F5BA6',
      \`secondary_color\` VARCHAR(50) DEFAULT '#383087',
      \`accent_color\` VARCHAR(50) DEFAULT '#5C2180',
      \`highlight_color\` VARCHAR(50) DEFAULT '#f59e0b',
      \`nama_tema\` VARCHAR(100) DEFAULT 'Sulteng Biru Ungu',
      \`badge_icon\` VARCHAR(50) DEFAULT 'none',
      \`seasonal_badge\` VARCHAR(255) DEFAULT '',
      \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Table pengaturan_tema ready');

  await connection.query(`
    INSERT INTO \`pengaturan_tema\` (\`id\`, \`primary_color\`, \`secondary_color\`, \`accent_color\`, \`highlight_color\`, \`nama_tema\`, \`badge_icon\`, \`seasonal_badge\`)
    VALUES (1, '#1F5BA6', '#383087', '#5C2180', '#f59e0b', 'Sulteng Biru Ungu', 'none', '')
    ON DUPLICATE KEY UPDATE \`id\` = \`id\`;
  `);
  console.log('✅ Default tema row ready');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`slider\` (
      \`id\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`judul\` VARCHAR(255) DEFAULT '',
      \`gambar\` VARCHAR(255) NOT NULL,
      \`urutan\` INT(11) DEFAULT 1,
      \`aktif\` TINYINT(1) DEFAULT 1,
      \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Table slider ready');

  const [existingSliders] = await connection.query('SELECT COUNT(*) as c FROM `slider`');
  if (existingSliders[0].c === 0) {
    const defaultSliders = [
      ['Dinas Pariwisata Provinsi Sulawesi Tengah', '/images/slider/slider-1-kantor-dispar.jpg', 1, 1],
      ['Komitmen Keterbukaan Informasi Publik PPID', '/images/slider/slider2.jpg', 2, 1],
      ['PPID Dinas Pariwisata Sulteng', '/images/slider/slider3.jpg', 3, 1],
      ['Indikator Kinerja Utama (IKU) 2026', '/images/slider/slider4.jpg', 4, 1],
      ['Command Center BERANI - SAMPOROA', '/images/slider/slider5.jpg', 5, 1],
      ['Layanan Aspirasi & Pengaduan SP4N-LAPOR', '/images/slider/slider6.png', 6, 1],
      ['Dispar Sulteng Anti Korupsi & BerAKHLAK', '/images/slider/slider7.jpg', 7, 1],
      ['Portal Layanan Persuratan Digital CEKIDOT Dispar', '/images/slider/slider8.jpg', 8, 1],
    ];
    for (const [judul, gambar, urutan, aktif] of defaultSliders) {
      await connection.query('INSERT INTO `slider` (`judul`, `gambar`, `urutan`, `aktif`) VALUES (?, ?, ?, ?)', [judul, gambar, urutan, aktif]);
    }
    console.log('✅ Default sliders seeded (8 slides)');
  }

  await connection.end();
  console.log('🎉 Migration completed successfully!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
