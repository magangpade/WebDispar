const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function scan() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'sulteng_tourism'
  });

  const [tables] = await conn.query('SHOW TABLES');
  const urlMap = new Map(); // url -> Array of { table, id, column }

  for (const t of tables) {
    const table = Object.values(t)[0];
    const [cols] = await conn.query(`DESCRIBE \`${table}\``);
    const textCols = cols.filter(c => /char|text/i.test(c.Type)).map(c => c.Field);
    if (textCols.length === 0) continue;

    for (const col of textCols) {
      const [rows] = await conn.query(`SELECT id, \`${col}\` as val FROM \`${table}\` WHERE \`${col}\` LIKE '%pariwisata.sultengprov.go.id%'`);
      for (const r of rows) {
        const text = r.val || '';
        // Extract all URLs matching pariwisata.sultengprov.go.id
        const regex = /https?:\/\/pariwisata\.sultengprov\.go\.id\/([^\s"'<>)]+)/gi;
        let match;
        while ((match = regex.exec(text)) !== null) {
          const fullUrl = match[0];
          const subPath = match[1];
          if (!urlMap.has(fullUrl)) {
            urlMap.set(fullUrl, { subPath, references: [] });
          }
          urlMap.get(fullUrl).references.push({ table, id: r.id, column: col });
        }
      }
    }
  }

  console.log(`Ditemukan ${urlMap.size} unique URL dari pariwisata.sultengprov.go.id di database!`);
  
  // Categorize by extension
  const extensions = {};
  for (const [url, data] of urlMap.entries()) {
    const ext = path.extname(data.subPath.split('?')[0]).toLowerCase() || 'no-ext';
    extensions[ext] = (extensions[ext] || 0) + 1;
  }
  console.log('Ekstensi file:', extensions);

  // Write full list to file for inspection
  const list = Array.from(urlMap.entries()).map(([url, d]) => ({
    url,
    subPath: d.subPath,
    refCount: d.references.length,
    sampleRef: d.references[0]
  }));

  fs.writeFileSync(path.join(__dirname, 'urls_to_download.json'), JSON.stringify(list, null, 2));
  console.log('Daftar URL disimpan ke backend/scripts/urls_to_download.json');

  await conn.end();
}

scan().catch(console.error);
