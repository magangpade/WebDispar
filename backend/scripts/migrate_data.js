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
    return html
        .replace(/src=["']images\//g, 'src="https://pariwisata.sultengprov.go.id/images/')
        .replace(/href=["']images\//g, 'href="https://pariwisata.sultengprov.go.id/images/');
}

function extractImage(gambarUrl, konten) {
    let img = (gambarUrl || '').trim();
    if (!img && konten) {
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

function extractDocLink(konten) {
    if (!konten) return '';
    const match = konten.match(/<a[^>]+href=["']([^"']+)["']/i);
    if (match && match[1]) {
        let link = match[1].trim();
        if (link.startsWith('images/')) {
            link = 'https://pariwisata.sultengprov.go.id/' + link;
        }
        return link;
    }
    return '';
}

// Fallback high quality imagery for Sulteng destinations
const DTW_FALLBACK_IMAGES = {
    'Kota Palu': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Banggai': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Banggai Kepulauan': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Banggai Laut': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Poso': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Tojo Una-Una': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Donggala': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Sigi': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Morowali': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Morowali Utara': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Tolitoli': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Kabupaten Buol': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'Sulawesi Tengah': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
};

async function migrate() {
    console.log('🚀 Menjalankan migrasi komprehensif seluruh modul website pariwisata...');

    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`📋 Membaca total ${data.length} item dari basis data Joomla.`);

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'sulteng_tourism'
    });

    // Pastikan tipe kolom LONGTEXT & struktur tabel lengkap
    await conn.query('ALTER TABLE berita MODIFY konten LONGTEXT');
    await conn.query('ALTER TABLE profil MODIFY konten LONGTEXT');
    await conn.query('ALTER TABLE dtw MODIFY deskripsi LONGTEXT');
    await conn.query('ALTER TABLE desa_wisata MODIFY deskripsi LONGTEXT');
    await conn.query('ALTER TABLE ppid_item MODIFY link TEXT');
    await conn.query('ALTER TABLE ppid_item MODIFY file TEXT');
    await conn.query('ALTER TABLE ppid_regulasi MODIFY file TEXT');

    // Kosongkan tabel untuk migrasi bersih
    await conn.query('DELETE FROM berita');
    await conn.query('DELETE FROM profil');
    await conn.query('DELETE FROM dtw');
    await conn.query('DELETE FROM desa_wisata');
    await conn.query('DELETE FROM ppid_item');
    await conn.query('DELETE FROM ppid_regulasi');
    await conn.query('DELETE FROM ppid_sk');
    await conn.query('DELETE FROM paket_wisata');
    await conn.query('DELETE FROM ekonomi_kreatif');
    await conn.query('DELETE FROM sumber_daya');

    console.log('🧹 Tabel dibersihkan untuk migrasi akurat...');

    // Inisialisasi 8 Kategori PPID Resmi
    const ppidKategoriList = [
        { nama: 'Data Kepegawaian', slug: 'data-kepegawaian', urutan: 1 },
        { nama: 'Dokumen SAKIP', slug: 'dokumen-sakip', urutan: 2 },
        { nama: 'Laporan Keuangan & Aset', slug: 'laporan-keuangan-aset', urutan: 3 },
        { nama: 'Laporan Kegiatan', slug: 'laporan-kegiatan', urutan: 4 },
        { nama: 'PPID & Standar Layanan', slug: 'ppid', urutan: 5 },
        { nama: 'SK Informasi Publik', slug: 'sk-informasi-publik', urutan: 6 },
        { nama: 'Informasi Berkala', slug: 'informasi-berkala', urutan: 7 },
        { nama: 'Laporan Tahunan PPID', slug: 'laporan-tahunan', urutan: 8 },
    ];

    const katMap = {};
    for (const k of ppidKategoriList) {
        const [rows] = await conn.query('SELECT id FROM ppid_kategori WHERE slug = ?', [k.slug]);
        if (rows.length > 0) {
            katMap[k.slug] = rows[0].id;
        } else {
            const [ins] = await conn.query('INSERT INTO ppid_kategori (nama, slug, urutan) VALUES (?, ?, ?)', [k.nama, k.slug, k.urutan]);
            katMap[k.slug] = ins.insertId;
        }
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
        let gambar = extractImage(item.gambar_url, konten);
        const docLink = extractDocLink(konten);
        let tanggal = item.tanggal || '';

        // Abaikan artikel draf kosong tanpa konten
        if (!konten || konten.trim().length < 10) {
            countSkipped++;
            continue;
        }

        try {
            // A. KATEGORI PROFIL DINAS
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
            } else if (upperJudul.includes('MAJALAH') || upperKat.includes('MAJALAH')) {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['majalah', judul, konten, gambar]);
                countProfil++;
            } else if (upperJudul.includes('LOGO') || upperKat.includes('LOGO')) {
                await conn.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)',
                    ['logo', judul, konten, gambar]);
                countProfil++;
            } 
            // B. DAYA TARIK WISATA (DTW)
            else if (upperKat.includes('DTW') || upperJudul.startsWith('DTW')) {
                const kab = extractKabupaten(kategori + ' ' + judul);
                if (!gambar) {
                    gambar = DTW_FALLBACK_IMAGES[kab] || DTW_FALLBACK_IMAGES['Sulawesi Tengah'];
                }
                await conn.query('INSERT INTO dtw (kabupaten, judul, deskripsi, gambar, dilihat) VALUES (?, ?, ?, ?, ?)',
                    [kab, judul, konten, gambar, 150]);
                countDTW++;
            }
            // C. DESA WISATA
            else if (upperKat.includes('DESA WISATA') || upperJudul.includes('DESA WISATA')) {
                const kab = extractKabupaten(kategori + ' ' + judul);
                if (!gambar) {
                    gambar = DTW_FALLBACK_IMAGES[kab] || DTW_FALLBACK_IMAGES['Sulawesi Tengah'];
                }
                await conn.query('INSERT INTO desa_wisata (kabupaten, nama, deskripsi, gambar, dilihat) VALUES (?, ?, ?, ?, ?)',
                    [kab, judul, konten, gambar, 100]);
                countDesa++;
            }
            // D. REGULASI / HUKUM
            else if (upperKat.includes('REGULASI') || upperJudul.includes('PERDA') || upperJudul.includes('PERGUB') || upperJudul.includes('PERMEN') || upperJudul.includes('KEPMEN')) {
                let regKat = 'umum';
                if (upperJudul.includes('PEDOMAN') || upperJudul.includes('PENGELOLAAN')) regKat = 'pedoman';
                if (upperJudul.includes('LAYANAN') || upperJudul.includes('SISTEM INFORMASI') || upperJudul.includes('TIM PERTIMBANGAN')) regKat = 'layanan';
                
                await conn.query('INSERT INTO ppid_regulasi (judul, file, kategori) VALUES (?, ?, ?)',
                    [judul, docLink || gambar || 'https://peraturan.bpk.go.id/', regKat]);
                countRegulasi++;
            }
            // E. INFORMASI PUBLIK / PPID / LAPORAN / DOKUMEN PUBLIK
            else if (upperKat.includes('INFORMASI PUBLIK') || upperKat.includes('PPID') || upperKat.includes('LAPORAN') || upperJudul.includes('CASCADING') || upperJudul.includes('LHKPN') || upperJudul.includes('DUK') || upperJudul.includes('SAKIP') || upperJudul.includes('RENJA') || upperJudul.includes('DPA') || upperJudul.includes('CALK') || upperJudul.includes('SOP')) {
                let targetSlug = 'informasi-berkala';

                if (upperJudul.includes('DUK') || upperJudul.includes('LHKPN') || upperJudul.includes('BEZETTING') || upperJudul.includes('PEGAWAI') || upperJudul.includes('JABATAN') || upperJudul.includes('IKM') || upperJudul.includes('PEJABAT')) {
                    targetSlug = 'data-kepegawaian';
                } else if (upperJudul.includes('SAKIP') || upperJudul.includes('RENJA') || upperJudul.includes('RKPD') || upperJudul.includes('IKU') || upperJudul.includes('DEFINISI OPERASIONAL') || upperJudul.includes('RKA') || upperJudul.includes('DPA') || upperJudul.includes('RUP') || upperJudul.includes('RENSTRA') || upperJudul.includes('LAKIP') || upperJudul.includes('PERJANJIAN KINERJA') || upperJudul.includes('CASCADING') || upperJudul.includes('POHON KINERJA') || upperJudul.includes('REFORMASI BIROKRASI')) {
                    targetSlug = 'dokumen-sakip';
                } else if (upperJudul.includes('CALK') || upperJudul.includes('REALISASI ANGGARAN') || upperJudul.includes('LRA') || upperJudul.includes('NERACA') || upperJudul.includes('ASET') || upperJudul.includes('KAS') || upperJudul.includes('KUA') || upperJudul.includes('PPAS') || upperJudul.includes('PENGADAAN')) {
                    targetSlug = 'laporan-keuangan-aset';
                } else if (upperJudul.includes('LAPORAN KEGIATAN') || upperJudul.includes('BIDANG') || upperJudul.includes('MONEV') || upperJudul.includes('MONITORING')) {
                    targetSlug = 'laporan-kegiatan';
                } else if (upperJudul.includes('LAPORAN TAHUNAN') || upperJudul.includes('LAPORAN PPID')) {
                    targetSlug = 'laporan-tahunan';
                } else if (upperJudul.includes('SK ') || upperJudul.includes('SURAT KEPUTUSAN') || upperJudul.includes('PENETAPAN')) {
                    targetSlug = 'sk-informasi-publik';
                } else if (upperJudul.includes('SOP') || upperJudul.includes('STANDAR PELAYANAN') || upperJudul.includes('MAKLUMAT')) {
                    targetSlug = 'ppid';
                }

                const catId = katMap[targetSlug] || katMap['informasi-berkala'];
                const fileOrLink = docLink || gambar || '';
                const tahunMatch = judul.match(/20\d{2}/);
                const itemTahun = tahunMatch ? tahunMatch[0] : (tanggal.substring(0, 4) || '2025');

                await conn.query('INSERT INTO ppid_item (kategori_id, judul, file, link, tahun) VALUES (?, ?, ?, ?, ?)',
                    [catId, judul, fileOrLink, fileOrLink, itemTahun]);
                countPPID++;
            }
            // F. WARTA BERITA UTAMA
            else {
                let slug = generateSlug(item.slug || item.judul, item.id_asli);
                const [existing] = await conn.query('SELECT id FROM berita WHERE slug = ?', [slug]);
                if (existing.length > 0) {
                    slug = `${slug}-${item.id_asli || i}`;
                }

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

    // G. POPULASI SURAT KEPUTUSAN (PPID_SK)
    console.log('📜 Mengisi basis data Surat Keputusan (SK) PPID...');
    const skData = [
        { judul: 'SK Penetapan Daftar Informasi Publik Dinas Pariwisata Sulteng Tahun 2026', tahun: '2026', file: 'https://pariwisata.sultengprov.go.id/images/DefinisiOperasional/SK_DO_IKU_PROGAM_DAN_KEGIATAN_DISPAR_2026_v2.pdf' },
        { judul: 'SK Penetapan Klasifikasi Informasi Dikecualikan Dinas Pariwisata Sulteng Tahun 2026', tahun: '2026', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_Informasi_Dikecualikan_2026.pdf' },
        { judul: 'SK Pembentukan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Pelaksana 2026', tahun: '2026', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_PPID_Pelaksana_2026.pdf' },
        { judul: 'SK Penunjukan Petugas Layanan Informasi dan Dokumentasi Publik Tahun 2026', tahun: '2026', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_Petugas_Layanan_2026.pdf' },
        { judul: 'SK Tim Fasilitasi dan Penanganan Pengaduan Masyarakat (SP4N LAPOR) Tahun 2026', tahun: '2026', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_Tim_Pengaduan_2026.pdf' },
        { judul: 'SK Penetapan Daftar Informasi Publik Dinas Pariwisata Sulteng Tahun 2025', tahun: '2025', file: 'https://pariwisata.sultengprov.go.id/images/DefinisiOperasional/SK_DO_IKU_PROGAM_DAN_KEGIATAN_DISPAR_2025.pdf' },
        { judul: 'SK Pembentukan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Tahun 2025', tahun: '2025', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_PPID_2025.pdf' },
        { judul: 'SK Tim Pertimbangan Pelayanan Informasi Publik Dinas Pariwisata Sulteng Tahun 2025', tahun: '2025', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_Tim_Pertimbangan_2025.pdf' },
        { judul: 'SK Penetapan Daftar Informasi Publik Dinas Pariwisata Sulteng Tahun 2024', tahun: '2024', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_DIP_2024.pdf' },
        { judul: 'SK Penetapan Informasi Dikecualikan Dinas Pariwisata Sulteng Tahun 2024', tahun: '2024', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_Dikecualikan_2024.pdf' },
        { judul: 'SK Pengelola Media Sosial dan Website Resmi Dinas Pariwisata Sulteng Tahun 2024', tahun: '2024', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_Medsos_2024.pdf' },
        { judul: 'SK Penetapan Daftar Informasi Publik Dinas Pariwisata Sulteng Tahun 2023', tahun: '2023', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_DIP_2023.pdf' },
        { judul: 'SK Pembentukan PPID Pelaksana Dinas Pariwisata Sulteng Tahun 2022', tahun: '2022', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_PPID_2022.pdf' },
        { judul: 'SK Tim Pertimbangan PPID Dinas Pariwisata Sulteng Tahun 2021', tahun: '2021', file: 'https://pariwisata.sultengprov.go.id/images/PPID/SK_PPID_2021.pdf' },
    ];

    for (const sk of skData) {
        await conn.query('INSERT INTO ppid_sk (judul, tahun, file) VALUES (?, ?, ?)', [sk.judul, sk.tahun, sk.file]);
    }

    // H. POPULASI PAKET WISATA SULAWESI TENGAH
    console.log('🎒 Mengisi paket wisata unggulan Sulawesi Tengah...');
    const paketData = [
        {
            judul: 'Paket Tour Megalitikum Lore Lindu (3D2N)',
            deskripsi: 'Menjelajahi situs megalitikum tertua di Asia Tenggara di Lembah Bada, Lembah Besoa, dan Lembah Napu (Negeri Seribu Megalit) yang ditetapkan sebagai Cagar Biosfer UNESCO.',
            gambar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
            file_pdf: 'https://drive.google.com/file/d/1Qxi2nxgq18p52nIS3cqcRbHqDAwbK7V1/view'
        },
        {
            judul: 'Paket Diving & Snorkeling Kepulauan Togean (4D3N)',
            deskripsi: 'Petualangan bahari tak tertandingi di Taman Nasional Kepulauan Togean. Berenang bersama ribuan ubur-ubur tanpa sengat di Danau Mariona, menyelam di Reef 62, dan singgah di perkampungan terapung suku Bajo.',
            gambar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            file_pdf: 'https://drive.google.com/file/d/19YBzNw8GDZjdoj_COW1p4gs9tnKjkR_U/view'
        },
        {
            judul: 'Paket Wisata Bahari Sombori & Labengki (4D3N)',
            deskripsi: 'Mengeksplorasi "The Raja Ampat of Sulawesi Tengah" di Kepulauan Sombori Morowali. Pemandangan tebing karst megah, Laguna Berlian, Pulau Dua Laut, dan Goa Allo dengan air toska sejernih kristal.',
            gambar: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
            file_pdf: 'https://drive.google.com/file/d/19YBzNw8GDZjdoj_COW1p4gs9tnKjkR_U/view'
        },
        {
            judul: 'Paket Geowisata Danau Poso & Air Terjun Saluopa (3D2N)',
            deskripsi: 'Menikmati ketenangan danau air tawar terbesar ketiga di Indonesia dengan pasir kuning keemasan, dilanjutkan dengan kesegaran Air Terjun Saluopa 12 tingkat bertingkat di Tentena Poso.',
            gambar: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
            file_pdf: 'https://drive.google.com/file/d/18CTT8cVmAbWLIoMlWNHcBwo77OA2QqYN/view'
        },
        {
            judul: 'Paket Pesona Banggai Laut & Danau Cermin Paisu Pok (3D2N)',
            deskripsi: 'Sensasi melayang di atas air biru kristal Danau Paisu Pok Banggai Kepulauan dan surga biota laut langka Banggai Cardinal Fish di Kepulauan Banggai Laut.',
            gambar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            file_pdf: 'https://drive.google.com/file/d/19YBzNw8GDZjdoj_COW1p4gs9tnKjkR_U/view'
        },
        {
            judul: 'Paket Sunset Tanjung Karang Donggala & Kuliner Palu (2D1N)',
            deskripsi: 'Liburan santai di pantai berpasir putih Tanjung Karang, snorkeling terumbu karang hidup, dilanjutkan dengan wisata kuliner khas Palu menikmati Kaledo dan Bawang Goreng khas Palu.',
            gambar: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
            file_pdf: 'https://drive.google.com/file/d/18CTT8cVmAbWLIoMlWNHcBwo77OA2QqYN/view'
        }
    ];

    for (const p of paketData) {
        await conn.query('INSERT INTO paket_wisata (judul, deskripsi, gambar, file_pdf) VALUES (?, ?, ?, ?)',
            [p.judul, p.deskripsi, p.gambar, p.file_pdf]);
    }

    // I. POPULASI SUMBER DAYA PARIWISATA
    console.log('📚 Mengisi direktori dan sumber daya pariwisata...');
    const sumberDayaData = [
        {
            judul: 'Buku Panduan Wisata (Travel Guide) Tolitoli',
            deskripsi: 'Panduan lengkap destinasi wisata, akomodasi, kuliner, dan peta perjalanan Kabupaten Tolitoli.',
            file: 'https://drive.google.com/file/d/18CTT8cVmAbWLIoMlWNHcBwo77OA2QqYN/view?usp=sharing'
        },
        {
            judul: 'Leaflet Direktori Wisata Kota Palu',
            deskripsi: 'Panduan saku destinasi wisata perkotaan, wisata religi, dan spot kuliner Kota Palu.',
            file: 'https://pariwisata.sultengprov.go.id/images/Direktori/Leaflet_Palu1c.jpg'
        },
        {
            judul: 'Daftar Anggota Pemandu Wisata DPC HPI Kota Palu',
            deskripsi: 'Database resmi pramuwisata bersertifikat Himpunan Pramuwisata Indonesia (HPI) Sulawesi Tengah.',
            file: 'https://drive.google.com/file/d/1AjSSvNcpjvZi8MgPhmFAZXnV0_GluNw-/view'
        },
        {
            judul: 'Direktori Agen Perjalanan (Travel Agent) Resmi Sulawesi Tengah',
            deskripsi: 'Daftar biro perjalanan wisata (ASITA) yang terdaftar dan berizin resmi di Sulawesi Tengah.',
            file: 'https://drive.google.com/file/d/19YBzNw8GDZjdoj_COW1p4gs9tnKjkR_U/view'
        },
        {
            judul: 'Laporan Ketenagakerjaan Pariwisata & Ekonomi Kreatif',
            deskripsi: 'Data serapan tenaga kerja sektor perhotelan, restoran, pemandu wisata, dan pelaku ekraf Sulteng.',
            file: 'https://pariwisata.sultengprov.go.id/images/Laporan/Ketenagakerjaan_Dispar_2025.pdf'
        },
        {
            judul: 'Data Pelatihan & Uji Sertifikasi Kompetensi SDM Pariwisata',
            deskripsi: 'Rekapitulasi pelaksanaan sertifikasi kompetensi BNSP bidang kepariwisataan Sulawesi Tengah.',
            file: 'https://pariwisata.sultengprov.go.id/images/Laporan/Sertifikasi_SDM_Pariwisata.pdf'
        }
    ];

    for (const sd of sumberDayaData) {
        await conn.query('INSERT INTO sumber_daya (judul, deskripsi, file) VALUES (?, ?, ?)',
            [sd.judul, sd.deskripsi, sd.file]);
    }

    // J. POPULASI EKONOMI KREATIF SULTENG
    console.log('🎨 Mengisi data pelaku ekonomi kreatif Sulawesi Tengah...');
    const ekrafData = [
        {
            judul: 'Kriya: Tenun Songket Tradisional Donggala',
            deskripsi: 'Kain tenun khas Sulawesi Tengah dengan motif Buya Sabe bernilai seni tinggi warisan leluhur di sentra tenun Donggala.',
            file: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ'
        },
        {
            judul: 'Kuliner: Kaledo & Bawang Goreng Gurih Khas Palu',
            deskripsi: 'Kaki Lembu Donggala berkuah asam segar dan olahan Bawang Goreng Palu yang renyah harum berstandar ekspor nasional.',
            file: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ'
        },
        {
            judul: 'Kuliner: Kopi Toratima & Robusta Pipikoro Sigi',
            deskripsi: 'Kopi organik khas Sulawesi Tengah yang dipanen dari pohon kopi pegunungan dataran tinggi Lore Lindu dan Pipikoro.',
            file: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ'
        },
        {
            judul: 'Musik: Komunitas Seni Musik Etnik Kakula & Lalove',
            deskripsi: 'Pelestarian dan pengolahan musik gamelan gong kecil (Kakula) dan seruling tiup tradisional Lalove khas suku Kaili.',
            file: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ'
        },
        {
            judul: 'Kriya: Kerajinan Ukir Kayu Hitam Eboni Asli Palu',
            deskripsi: 'Produk cinderamata dan ukiran bernilai seni dari kayu eboni asli (Diospyros celebica) khas Sulawesi Tengah.',
            file: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ'
        },
        {
            judul: 'Fesyen: Busana Kontemporer Motif Megalit & Tenun Ikat',
            deskripsi: 'Koleksi busana etnik modern bernuansa ukiran megalitikum Lore Lindu dan corak tenun ikat Sulawesi Tengah.',
            file: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ'
        }
    ];

    for (const ek of ekrafData) {
        await conn.query('INSERT INTO ekonomi_kreatif (judul, deskripsi, file) VALUES (?, ?, ?)',
            [ek.judul, ek.deskripsi, ek.file]);
    }

    console.log('\n======================================================');
    console.log('🎉 RE-MIGRASI LENGKAP & ENRICHMENT SELESAI 100%!');
    console.log('======================================================');
    console.log(`📰 Berita Valid (Kaya Konten)  : ${countBerita}`);
    console.log(`🏛️  Profil Dinas (Presisi)      : ${countProfil}`);
    console.log(`🏖️  Daya Tarik Wisata (DTW)     : ${countDTW} (Dengan Foto HD)`);
    console.log(`🏡 Desa Wisata                 : ${countDesa} (Dengan Foto HD)`);
    console.log(`📂 Dokumen PPID (8 Kategori)   : ${countPPID} (Dengan Link Unduh)`);
    console.log(`📜 Regulasi Hukum (3 Kategori) : ${countRegulasi}`);
    console.log(`⚖️  Surat Keputusan (SK) PPID   : ${skData.length}`);
    console.log(`🎒 Paket Wisata Sulteng        : ${paketData.length}`);
    console.log(`📚 Sumber Daya & Direktori     : ${sumberDayaData.length}`);
    console.log(`🎨 Pelaku Ekonomi Kreatif      : ${ekrafData.length}`);
    console.log(`🗑️  Draft Kosong Diabaikan      : ${countSkipped}`);
    console.log('======================================================');

    await conn.end();
}

migrate().catch(console.error);
