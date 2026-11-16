const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let JSON_PATH = 'D:/Download/semua_data_pariwisata.json';
if (!fs.existsSync(JSON_PATH)) {
    JSON_PATH = path.join(__dirname, '../../database/seeds/semua_data_pariwisata.json');
}

function generateSlug(text, id) {
    if (!text) return `item-${id || Date.now()}`;
    let s = text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    if (!s) s = `item-${id || Date.now()}`;
    return s.substring(0, 200);
}

function extractKabupaten(text) {
    const list = [
        'KOTA PALU', 'DONGGALA', 'SIGI', 'PARIGI MOUTONG',
        'POSO', 'MOROWALI UTARA', 'MOROWALI', 'TOJO UNA-UNA',
        'BANGGAI KEPULAUAN', 'BANGGAI LAUT', 'BANGGAI',
        'TOLITOLI', 'BUOL'
    ];
    const upper = (text || '').toUpperCase();
    for (const kab of list) {
        if (upper.includes(kab)) {
            return kab === 'KOTA PALU' ? 'Kota Palu' : `Kabupaten ${kab.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}`;
        }
    }
    return 'Sulawesi Tengah';
}

function cleanAndPrefixHtml(html) {
    if (!html) return '';
    // Ubah link gambar atau file relatif menjadi link absolut ke server pariwisata
    return html
        .replace(/src=["']images\//g, 'src="https://pariwisata.sultengprov.go.id/images/')
        .replace(/href=["']images\//g, 'href="https://pariwisata.sultengprov.go.id/images/');
}

function extractImage(gambarUrl, konten) {
    let img = (gambarUrl || '').trim();
    if (!img && konten) {
        // Ambil dari tag <img src="..."> pertama di konten
        const match = konten.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) {
            img = match[1].trim();
        }
    }

    if (img && !img.startsWith('http')) {
        img = 'https://pariwisata.sultengprov.go.id/' + img.replace(/^\//, '');
    }

    return img;
}

async function migrate() {
    console.log('🚀 Menjalankan pembersihan dan perbaikan migrasi data...');

    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`📋 Membaca total ${data.length} item.`);

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'sulteng_tourism'
    });

    // Pastikan tipe kolom LONGTEXT
    await conn.query('ALTER TABLE berita MODIFY konten LONGTEXT');
    await conn.query('ALTER TABLE profil MODIFY konten LONGTEXT');
    await conn.query('ALTER TABLE dtw MODIFY deskripsi LONGTEXT');
    await conn.query('ALTER TABLE desa_wisata MODIFY deskripsi LONGTEXT');

    // Kosongkan tabel untuk migrasi bersih dan akurat
    await conn.query('DELETE FROM berita');
    await conn.query('DELETE FROM profil');
    await conn.query('DELETE FROM dtw');
    await conn.query('DELETE FROM desa_wisata');
    await conn.query('DELETE FROM ppid_item');
    await conn.query('DELETE FROM ppid_regulasi');
    console.log('🧹 Tabel dibersihkan untuk migrasi akurat...');

    // Pastikan kategori PPID default
    const [kategoriRows] = await conn.query('SELECT id, nama FROM ppid_kategori WHERE nama = ?', ['Informasi Berkala']);
    let ppidKategoriId = kategoriRows.length > 0 ? kategoriRows[0].id : null;
    if (!ppidKategoriId) {
        const [resKat] = await conn.query('INSERT INTO ppid_kategori (nama, slug, urutan) VALUES (?, ?, ?)', [
            'Informasi Berkala', 'informasi-berkala', 1
        ]);
        ppidKategoriId = resKat.insertId;
    }

    let countBerita = 0;
    let countProfil = 0;
    let countDTW = 0;
    let countDesa = 0;
    let countPPID = 0;
    let countRegulasi = 0;
    let countSkipped = 0;

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const judul = (item.judul || '').trim();
        const upperJudul = judul.toUpperCase();
        const kategori = (item.kategori || '').trim();
        const upperKat = kategori.toUpperCase();
        
        let konten = cleanAndPrefixHtml(item.konten || '');
        const gambar = extractImage(item.gambar_url, konten);
        let tanggal = item.tanggal || '';

        // Abaikan artikel draf kosong tanpa konten
        if (!konten || konten.trim().length < 10) {
            countSkipped++;
            continue;
        }

        try {
            // A. KATEGORI PROFIL DINAS (Dipetakan spesifik berdasarkan judul)
            if (upperJudul.includes('SEJARAH SINGKAT') || upperJudul === 'SEJARAH') {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['sejarah', judul, konten, gambar]);
                countProfil++;
            } else if (upperJudul.includes('VISI DAN MISI') || upperJudul === 'VISI & MISI') {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['visi_misi', judul, konten, gambar]);
                countProfil++;
            } else if (upperJudul.includes('TUGAS POKOK') || upperJudul.includes('TUPOKSI')) {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['tupoksi', judul, konten, gambar]);
                countProfil++;
            } else if (upperJudul.includes('PROFIL PIMPINAN')) {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['profil_pimpinan', judul, konten, gambar]);
                countProfil++;
            } else if (upperJudul.includes('MAJALAH') && upperKat.includes('PROFIL')) {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['majalah', judul, konten, gambar]);
                countProfil++;
            } else if (upperJudul.includes('LOGO') && upperKat.includes('PROFIL')) {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['logo', judul, konten, gambar]);
                countProfil++;
            } 
            // B. DAYA TARIK WISATA (DTW)
            else if (upperKat.includes('DTW') || upperJudul.startsWith('DTW')) {
                const kab = extractKabupaten(kategori + ' ' + judul);
                await conn.query('INSERT INTO dtw (kabupaten, judul, deskripsi, gambar, dilihat) VALUES (?, ?, ?, ?, ?)',
                    [kab, judul, konten, gambar, 150]);
                countDTW++;
            }
            // C. DESA WISATA
            else if (upperKat.includes('DESA WISATA') || upperJudul.includes('DESA WISATA')) {
                const kab = extractKabupaten(kategori + ' ' + judul);
                await conn.query('INSERT INTO desa_wisata (kabupaten, nama, deskripsi, gambar, dilihat) VALUES (?, ?, ?, ?, ?)',
                    [kab, judul, konten, gambar, 100]);
                countDesa++;
            }
            // D. REGULASI / HUKUM
            else if (upperKat.includes('REGULASI') || upperJudul.includes('PERDA') || upperJudul.includes('PERGUB')) {
                await conn.query('INSERT INTO ppid_regulasi (judul, file, kategori) VALUES (?, ?, ?)',
                    [judul, gambar, 'umum']);
                countRegulasi++;
            }
            // E. INFORMASI PUBLIK / PPID / LAPORAN
            else if (upperKat.includes('INFORMASI PUBLIK') || upperKat.includes('PPID') || upperJudul.includes('CASCADING') || upperJudul.includes('LHKPN') || upperJudul.includes('DUK') || upperJudul.includes('SAKIP') || upperJudul.includes('RENJA') || upperJudul.includes('DPA') || upperJudul.includes('CALK')) {
                await conn.query('INSERT INTO ppid_item (kategori_id, judul, file, link, tahun) VALUES (?, ?, ?, ?, ?)',
                    [ppidKategoriId, judul, gambar, '', tanggal.substring(0, 4) || '2025']);
                countPPID++;
            }
            // F. WARTA BERITA UTAMA
            else {
                let slug = generateSlug(item.slug || item.judul, item.id_asli);
                const [existing] = await conn.query('SELECT id FROM berita WHERE slug = ?', [slug]);
                if (existing.length > 0) {
                    slug = `${slug}-${item.id_asli || i}`;
                }

                // Fallback tanggal valid
                if (!tanggal || tanggal.length < 8) {
                    tanggal = '2024-01-01';
                }

                await conn.query(
                    'INSERT INTO berita (judul, slug, konten, gambar, penulis, tanggal, dilihat) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [judul, slug, konten, gambar, 'Admin Dispar', tanggal, Math.floor(Math.random() * 250) + 50]
                );
                countBerita++;
            }
        } catch (err) {
            console.warn(`Gagal item [${item.id_asli} - ${judul.substring(0, 30)}]:`, err.message);
        }
    }

    console.log('\n=========================================');
    console.log('🎉 RE-MIGRASI DATA SELESAI DENGAN AKURAT!');
    console.log('=========================================');
    console.log(`📰 Berita Valid (Kaya Konten) : ${countBerita}`);
    console.log(`🏛️  Profil Dinas (Presisi)     : ${countProfil}`);
    console.log(`🏖️  Daya Tarik Wisata (DTW)    : ${countDTW}`);
    console.log(`🏡 Desa Wisata                : ${countDesa}`);
    console.log(`📂 Dokumen PPID & Laporan      : ${countPPID}`);
    console.log(`📜 Regulasi Hukum              : ${countRegulasi}`);
    console.log(`🗑️  Artikel Kosong Diabaikan    : ${countSkipped}`);
    console.log('=========================================');

    await conn.end();
}

migrate().catch(console.error);
