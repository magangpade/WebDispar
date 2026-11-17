const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const urlsList = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls_to_download.json'), 'utf8'));
const basePublicDir = path.join(__dirname, '../../frontend/public');

async function downloadFile(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
    return { status: 'already_exists', size: fs.statSync(destPath).size };
  }
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      return { status: 'failed', code: res.status };
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return { status: 'downloaded', size: buffer.byteLength };
  } catch (err) {
    clearTimeout(timeout);
    return { status: 'error', error: err.message };
  }
}

async function run() {
  console.log(`🚀 Memulai pengunduhan ${urlsList.length} file aset dari website dispar...`);

  let successCount = 0;
  let alreadyCount = 0;
  let failCount = 0;

  // Process in batches of 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < urlsList.length; i += BATCH_SIZE) {
    const batch = urlsList.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (item) => {
        let sub = item.subPath.split('?')[0];
        // Clean URL encoded characters if any
        sub = decodeURIComponent(sub);
        const dest = path.join(basePublicDir, sub);

        const res = await downloadFile(item.url, dest);
        if (res.status === 'downloaded') {
          successCount++;
        } else if (res.status === 'already_exists') {
          alreadyCount++;
        } else {
          failCount++;
          console.warn(`[GAGAL] ${item.url} -> ${res.status} (${res.code || res.error})`);
        }
      })
    );

    const progress = Math.min(i + BATCH_SIZE, urlsList.length);
    if (progress % 50 === 0 || progress === urlsList.length) {
      console.log(`[Progres: ${progress}/${urlsList.length}] Berhasil: ${successCount}, Ada: ${alreadyCount}, Gagal: ${failCount}`);
    }
  }

  console.log(`\n🎉 SELESAI PENGUNDUHAN! Berhasil: ${successCount}, Sudah Ada: ${alreadyCount}, Gagal: ${failCount}`);

  // ==========================================
  // UPDATE DATABASE TO POINT TO LOCAL /images/
  // ==========================================
  console.log('\n🔄 Memperbarui seluruh tautan di database MySQL agar mengarah ke file lokal...');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'sulteng_tourism'
  });

  const [tables] = await conn.query('SHOW TABLES');
  for (const t of tables) {
    const table = Object.values(t)[0];
    const [cols] = await conn.query(`DESCRIBE \`${table}\``);
    const textCols = cols.filter(c => /char|text/i.test(c.Type)).map(c => c.Field);

    for (const col of textCols) {
      const [res1] = await conn.query(
        `UPDATE \`${table}\` SET \`${col}\` = REPLACE(\`${col}\`, 'https://pariwisata.sultengprov.go.id/images/', '/images/') WHERE \`${col}\` LIKE '%https://pariwisata.sultengprov.go.id/images/%'`
      );
      const [res2] = await conn.query(
        `UPDATE \`${table}\` SET \`${col}\` = REPLACE(\`${col}\`, 'http://pariwisata.sultengprov.go.id/images/', '/images/') WHERE \`${col}\` LIKE '%http://pariwisata.sultengprov.go.id/images/%'`
      );
      const affected = res1.affectedRows + res2.affectedRows;
      if (affected > 0) {
        console.log(`✅ [${table}.${col}] Diperbarui ${affected} baris data ke file lokal.`);
      }
    }
  }

  await conn.end();
  console.log('✨ Basis data sudah 100% menggunakan file lokal!');
}

run().catch(console.error);
