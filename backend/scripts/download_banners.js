const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BANNER_JSON = 'D:/Download/data_banner_beranda.json';
const TARGET_DIR = path.join(__dirname, '../frontend/public/slider');

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const banners = JSON.parse(fs.readFileSync(BANNER_JSON, 'utf8'));

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            rejectUnauthorized: false,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };

        const file = fs.createWriteStream(dest);
        client.get(url, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect
                return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return reject(new Error(`Status ${res.statusCode} for ${url}`));
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve());
            });
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            reject(err);
        });
    });
}

async function run() {
    console.log('🖼️  Mendownload 8 banner beranda ke frontend/public/slider...');
    const results = [];

    for (let i = 0; i < banners.length; i++) {
        const b = banners[i];
        const ext = path.extname(new URL(b.url_gambar).pathname) || '.jpg';
        const filename = `banner_${b.banner_ke}${ext}`;
        const dest = path.join(TARGET_DIR, filename);

        try {
            console.log(`[${i + 1}/${banners.length}] Mengunduh: ${b.judul} (${filename})`);
            await downloadFile(b.url_gambar, dest);
            results.push({
                ...b,
                local_path: `/slider/${filename}`
            });
            console.log(`  ✅ Berhasil disimpan ke ${filename}`);
        } catch (err) {
            console.warn(`  ⚠️ Gagal download banner ${b.banner_ke}:`, err.message);
            // Tetap catat URL gambarnya
            results.push({
                ...b,
                local_path: b.url_gambar
            });
        }
    }

    fs.writeFileSync(
        path.join(__dirname, '../frontend/src/assets/banners.json'),
        JSON.stringify(results, null, 2)
    );
    console.log('✅ File banners.json tersimpan di frontend/src/assets/banners.json');
}

run();
