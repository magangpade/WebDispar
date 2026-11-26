const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
require('../backend/node_modules/dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const database = process.env.DB_NAME || 'sulteng_tourism';
if (!/^[a-zA-Z0-9_]+$/.test(database)) {
  throw new Error('DB_NAME hanya boleh berisi huruf, angka, dan garis bawah');
}

const commonArgs = [
  '--host', process.env.DB_HOST || 'localhost',
  '--port', process.env.DB_PORT || '3306',
  '--user', process.env.DB_USER || 'root',
  '--default-character-set=utf8mb4',
];

const mysqlBin = process.env.MYSQL_BIN || (
  process.platform === 'win32' &&
  fs.existsSync('C:\\laragon\\bin\\mysql\\mysql-8.4.3-winx64\\bin\\mysql.exe')
    ? 'C:\\laragon\\bin\\mysql\\mysql-8.4.3-winx64\\bin\\mysql.exe'
    : 'mysql'
);

function runMysql(args, inputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(mysqlBin, [...commonArgs, ...args], {
      env: { ...process.env, MYSQL_PWD: process.env.DB_PASSWORD || '' },
      stdio: [inputPath ? 'pipe' : 'inherit', 'inherit', 'inherit'],
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`mysql selesai dengan kode ${code}`));
    });
    if (inputPath) {
      const input = fs.createReadStream(inputPath);
      input.on('error', reject);
      input.pipe(child.stdin);
    }
  });
}

function runScript(scriptRelativePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, scriptRelativePath);
    console.log(`\n▶ Menjalankan ${path.basename(scriptRelativePath)}...`);
    const child = spawn(process.execPath, [fullPath], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptRelativePath} selesai dengan kode ${code}`));
    });
  });
}

async function main() {
  const sqlPath = path.join(__dirname, 'sulteng_tourism.sql');
  await runMysql(['-e', `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`]);
  await runMysql([database], sqlPath);
  console.log(`✅ Database ${database} berhasil diimpor dari ${sqlPath}`);

  // Menjalankan migrasi dan seeding modul lanjutan secara otomatis
  await runScript('../backend/scripts/migrate_admin_theme_slider.js');
  await runScript('../backend/scripts/seed_no3_no4.js');
  await runScript('../backend/scripts/seed_paket_dan_hunian.js');
  await runScript('../backend/scripts/seed_regulasi_local.js');
  await runScript('../backend/scripts/sync_all_authentic_files.js');
  await runScript('../backend/scripts/sync_real_stats.js');

  console.log('\n🎉 SELURUH DATABASE DAN DATA FITUR WEB BERHASIL DIMIGRASI LENGKAP!');
}

main().catch((err) => {
  console.error('Impor database gagal:', err.message);
  process.exitCode = 1;
});
