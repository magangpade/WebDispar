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

function extractKabupaten(kategori) {
    const list = [
        'KOTA PALU', 'DONGGALA', 'SIGI', 'PARIGI MOUTONG',
        'POSO', 'MOROWALI UTARA', 'MOROWALI', 'TOJO UNA-UNA',
        'BANGGAI KEPULAUAN', 'BANGGAI LAUT', 'BANGGAI',
        'TOLITOLI', 'BUOL'
    ];
    const upper = (kategori || '').toUpperCase();
    for (const kab of list) {
        if (upper.includes(kab)) {
            return kab === 'KOTA PALU' ? 'Kota Palu' : `Kabupaten ${kab.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}`;
        }
    }
    return 'Sulawesi Tengah';
}

async function migrate() {
    console.log('🚀 Memulai migrasi data ke MySQL sulteng_tourism...');
    
    if (!fs.existsSync(JSON_PATH)) {
        console.error('❌ File JSON tidak ditemukan di:', JSON_PATH);
        return;
    }

    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`📋 Membaca ${data.length} item dari file JSON.`);

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'sulteng_tourism'
    });

    console.log('✅ Terhubung ke MySQL database:', process.env.DB_NAME);

    // Pastikan tipe kolom cukup besar untuk artikel panjang
    await conn.query('ALTER TABLE berita MODIFY konten LONGTEXT');
    await conn.query('ALTER TABLE profil MODIFY konten LONGTEXT');
    await conn.query('ALTER TABLE dtw MODIFY deskripsi LONGTEXT');
    await conn.query('ALTER TABLE desa_wisata MODIFY deskripsi LONGTEXT');

    // Bersihkan data awal agar migrasi bersih tanpa duplikat
    await conn.query('DELETE FROM berita');
    await conn.query('DELETE FROM profil');
    await conn.query('DELETE FROM dtw');
    await conn.query('DELETE FROM desa_wisata');
    await conn.query('DELETE FROM ppid_item');
    await conn.query('DELETE FROM ppid_regulasi');
    console.log('🧹 Tabel dibersihkan untuk migrasi bersih...');

    let countBerita = 0;
    let countProfil = 0;
    let countDTW = 0;
    let countDesa = 0;
    let countPPID = 0;
    let countRegulasi = 0;

    // Pastikan kategori PPID default tersedia
    const [kategoriRows] = await conn.query('SELECT id, nama FROM ppid_kategori WHERE nama = ?', ['Informasi Berkala']);
    let ppidKategoriId = kategoriRows.length > 0 ? kategoriRows[0].id : null;
    if (!ppidKategoriId) {
        const [resKat] = await conn.query('INSERT INTO ppid_kategori (nama, slug, urutan) VALUES (?, ?, ?)', [
            'Informasi Berkala', 'informasi-berkala', 1
        ]);
        ppidKategoriId = resKat.insertId;
    }

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const judul = item.judul || 'Tanpa Judul';
        let slug = generateSlug(item.slug || item.judul, item.id_asli);
        const konten = item.konten || '';
        const gambar = item.gambar_url || '';
        const tanggal = item.tanggal || new Date().toISOString().split('T')[0];
        const kategori = (item.kategori || '').trim();
        const upperKat = kategori.toUpperCase();

        try {
            // 1. Daya Tarik Wisata (DTW)
            if (upperKat.includes('DTW')) {
                const kab = extractKabupaten(kategori);
                await conn.query(`
                    INSERT INTO dtw (kabupaten, judul, deskripsi, gambar, dilihat)
                    VALUES (?, ?, ?, ?, ?)
                `, [kab, judul, konten, gambar, 100]);
                countDTW++;
            }
            // 2. Desa Wisata
            else if (upperKat.includes('DESA WISATA')) {
                const kab = extractKabupaten(kategori);
                await conn.query(`
                    INSERT INTO desa_wisata (kabupaten, nama, deskripsi, gambar, dilihat)
                    VALUES (?, ?, ?, ?, ?)
                `, [kab, judul, konten, gambar, 50]);
                countDesa++;
            }
            // 3. Profil Dinas (Visi Misi, Sejarah, Tupoksi, dll)
            else if (upperKat.includes('PROFIL') || upperKat.includes('SEJARAH') || upperKat.includes('VISI') || upperKat.includes('TUPOKSI')) {
                let katProfil = 'sejarah';
                if (upperKat.includes('VISI')) katProfil = 'visi_misi';
                else if (upperKat.includes('TUPOKSI')) katProfil = 'tupoksi';
                else if (upperKat.includes('PIMPINAN') || upperKat.includes('PEJABAT')) katProfil = 'profil_pimpinan';
                else if (upperKat.includes('MAJALAH')) katProfil = 'majalah';
                else if (upperKat.includes('LOGO')) katProfil = 'logo';

                await conn.query(`
                    INSERT INTO profil (kategori, judul, konten, gambar)
                    VALUES (?, ?, ?, ?)
                `, [katProfil, judul, konten, gambar]);
                countProfil++;
            }
            // 4. Regulasi
            else if (upperKat.includes('REGULASI') || upperKat.includes('SK')) {
                await conn.query(`
                    INSERT INTO ppid_regulasi (judul, file, kategori)
                    VALUES (?, ?, ?)
                `, [judul, gambar, 'umum']);
                countRegulasi++;
            }
            // 5. Informasi Publik / PPID
            else if (upperKat.includes('INFORMASI PUBLIK') || upperKat.includes('PPID') || upperKat.includes('LAPORAN')) {
                await conn.query(`
                    INSERT INTO ppid_item (kategori_id, judul, file, link, tahun)
                    VALUES (?, ?, ?, ?, ?)
                `, [ppidKategoriId, judul, gambar, '', tanggal.substring(0, 4)]);
                countPPID++;
            }
            // 6. Sisanya masuk ke Berita Utama
            else {
                // Pastikan slug unik untuk berita
                let uniqueSlug = slug;
                const [existing] = await conn.query('SELECT id FROM berita WHERE slug = ?', [uniqueSlug]);
                if (existing.length > 0) {
                    uniqueSlug = `${slug}-${item.id_asli || i}`;
                }

                await conn.query(`
                    INSERT INTO berita (judul, slug, konten, gambar, penulis, tanggal, dilihat)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [judul, uniqueSlug, konten, gambar, 'Admin Dispar', tanggal, Math.floor(Math.random() * 200) + 20]);
                countBerita++;
            }
        } catch (err) {
            console.warn(`Gagal migrasi item [${item.id_asli} - ${judul.substring(0, 30)}]:`, err.message);
        }
    }

    console.log('\n=========================================');
    console.log('🎉 MIGRASI DATABASE SUKSES SELESAI!');
    console.log('=========================================');
    console.log(`📰 Berita Dimasukkan      : ${countBerita}`);
    console.log(`🏛️  Profil Dinas Dimasukkan : ${countProfil}`);
    console.log(`🏖️  Destinasi DTW          : ${countDTW}`);
    console.log(`🏡 Desa Wisata            : ${countDesa}`);
    console.log(`📂 PPID Informasi Publik  : ${countPPID}`);
    console.log(`📜 PPID Regulasi          : ${countRegulasi}`);
    console.log('=========================================');

    await conn.end();
}

migrate().catch(console.error);
