const db = require('../config/db');
const cache = require('../utils/cache');

// Daftar Informasi Publik
exports.getKategori = async (req, res) => {
  try {
    const cached = cache.get('ppid:kategori');
    if (cached) return res.json(cached);
    const [rows] = await db.query('SELECT * FROM ppid_kategori ORDER BY urutan ASC');
    cache.set('ppid:kategori', rows, 300000);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT i.*, k.nama AS kategori_nama
       FROM ppid_item i
       LEFT JOIN ppid_kategori k ON i.kategori_id = k.id
       ORDER BY i.tahun DESC, i.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItemsByKategori = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ppid_item WHERE kategori_id = ?', [req.params.kategoriId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  const { kategori_id, judul, link, tahun } = req.body;
  const file = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO ppid_item (kategori_id, judul, file, link, tahun) VALUES (?, ?, ?, ?, ?)', [kategori_id, judul, file, link, tahun]);
    cache.delByPrefix('ppid:');
    res.status(201).json({ message: 'Item berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  const { kategori_id, judul, link, tahun, file_lama } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM ppid_item WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Item tidak ditemukan' });
    const current = rows[0];
    const file = req.file ? req.file.filename : (file_lama ?? current.file);
    await db.query(
      'UPDATE ppid_item SET kategori_id = ?, judul = ?, file = ?, link = ?, tahun = ? WHERE id = ?',
      [kategori_id ?? current.kategori_id, judul ?? current.judul, file, link ?? current.link, tahun ?? current.tahun, req.params.id]
    );
    cache.delByPrefix('ppid:');
    res.json({ message: 'Item berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await db.query('DELETE FROM ppid_item WHERE id = ?', [req.params.id]);
    cache.delByPrefix('ppid:');
    res.json({ message: 'Item berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Regulasi
exports.getRegulasi = async (req, res) => {
  try {
    const cached = cache.get('ppid:regulasi');
    if (cached) return res.json(cached);
    const [rows] = await db.query('SELECT * FROM ppid_regulasi ORDER BY id ASC');
    cache.set('ppid:regulasi', rows, 300000);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRegulasi = async (req, res) => {
  const { judul, kategori } = req.body;
  const file = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO ppid_regulasi (judul, file, kategori) VALUES (?, ?, ?)', [judul, file, kategori || 'umum']);
    cache.delByPrefix('ppid:');
    res.status(201).json({ message: 'Regulasi berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRegulasi = async (req, res) => {
  const { judul, kategori, file_lama } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM ppid_regulasi WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Regulasi tidak ditemukan' });
    const current = rows[0];
    const file = req.file ? req.file.filename : (file_lama ?? current.file);
    await db.query(
      'UPDATE ppid_regulasi SET judul = ?, file = ?, kategori = ? WHERE id = ?',
      [judul ?? current.judul, file, kategori ?? current.kategori, req.params.id]
    );
    cache.delByPrefix('ppid:');
    res.json({ message: 'Regulasi berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRegulasi = async (req, res) => {
  try {
    await db.query('DELETE FROM ppid_regulasi WHERE id = ?', [req.params.id]);
    cache.delByPrefix('ppid:');
    res.json({ message: 'Regulasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SK
exports.getSK = async (req, res) => {
  try {
    const cached = cache.get('ppid:sk');
    if (cached) return res.json(cached);
    const [rows] = await db.query('SELECT * FROM ppid_sk ORDER BY tahun DESC');
    cache.set('ppid:sk', rows, 300000);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSK = async (req, res) => {
  const { judul, tahun } = req.body;
  const file = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO ppid_sk (judul, tahun, file) VALUES (?, ?, ?)', [judul, tahun, file]);
    cache.delByPrefix('ppid:');
    res.status(201).json({ message: 'SK berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSK = async (req, res) => {
  const { judul, tahun, file_lama } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM ppid_sk WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'SK tidak ditemukan' });
    const current = rows[0];
    const file = req.file ? req.file.filename : (file_lama ?? current.file);
    await db.query(
      'UPDATE ppid_sk SET judul = ?, tahun = ?, file = ? WHERE id = ?',
      [judul ?? current.judul, tahun ?? current.tahun, file, req.params.id]
    );
    cache.delByPrefix('ppid:');
    res.json({ message: 'SK berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSK = async (req, res) => {
  try {
    await db.query('DELETE FROM ppid_sk WHERE id = ?', [req.params.id]);
    cache.delByPrefix('ppid:');
    res.json({ message: 'SK berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Laporan Tahunan
exports.getLaporanTahunan = async (req, res) => {
  try {
    const cached = cache.get('ppid:laporan-tahunan');
    if (cached) return res.json(cached);
    const [rows] = await db.query("SELECT * FROM ppid_item WHERE kategori_id = (SELECT id FROM ppid_kategori WHERE slug='laporan-tahunan') ORDER BY tahun DESC");
    cache.set('ppid:laporan-tahunan', rows, 300000);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Form Permohonan
exports.createPermohonan = async (req, res) => {
  const { nama, alamat, email, no_telp, rincian, cara_mendapatkan } = req.body;
  try {
    await db.query('INSERT INTO permohonan_informasi (nama, alamat, email, no_telp, rincian, cara_mendapatkan) VALUES (?, ?, ?, ?, ?, ?)', [nama, alamat, email, no_telp, rincian, cara_mendapatkan]);
    res.status(201).json({ message: 'Permohonan berhasil dikirim' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Form Keberatan
exports.createKeberatan = async (req, res) => {
  const { tanggal, nomor_registrasi, nomor_permohonan, tujuan, nama, alamat, no_telp, alasan, kasus_posisi } = req.body;
  try {
    await db.query('INSERT INTO keberatan_informasi (tanggal, nomor_registrasi, nomor_permohonan, tujuan, nama, alamat, no_telp, alasan, kasus_posisi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [tanggal, nomor_registrasi, nomor_permohonan, tujuan, nama, alamat, no_telp, alasan, kasus_posisi]);
    res.status(201).json({ message: 'Keberatan berhasil dikirim' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Survey Kepuasan
exports.createSurvey = async (req, res) => {
  const { nama, nik, jawaban } = req.body;
  try {
    await db.query('INSERT INTO survey_kepuasan (nama, nik, jawaban) VALUES (?, ?, ?)', [nama, nik, JSON.stringify(jawaban)]);
    res.status(201).json({ message: 'Survey berhasil dikirim' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Informasi Secara Berkala
exports.getBerkala = async (req, res) => {
  try {
    const { kategori, subkategori, tahun, q } = req.query;
    let query = `
      SELECT i.*, k.nama as kategori_nama, k.slug as kategori_slug
      FROM ppid_item i
      JOIN ppid_kategori k ON i.kategori_id = k.id
      WHERE k.slug IN ('data-kepegawaian', 'dokumen-sakip', 'laporan-keuangan-aset', 'laporan-kegiatan', 'informasi-berkala')
    `;
    const params = [];

    if (kategori) {
      query += ` AND k.slug = ?`;
      params.push(kategori);
    }
    if (subkategori) {
      query += ` AND (i.subkategori = ? OR LOWER(i.judul) LIKE ?)`;
      params.push(subkategori, `%${subkategori.replace(/-/g, ' ')}%`);
    }
    if (tahun) {
      query += ` AND i.tahun = ?`;
      params.push(tahun);
    }
    if (q) {
      query += ` AND (LOWER(i.judul) LIKE ? OR LOWER(k.nama) LIKE ?)`;
      params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
    }

    query += ` ORDER BY i.tahun DESC, i.id DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
