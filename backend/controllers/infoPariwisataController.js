const db = require('../config/db');

// DTW
exports.getDTW = async (req, res) => {
  try {
    const { kabupaten } = req.query;
    let query = 'SELECT * FROM dtw';
    let params = [];
    if (kabupaten && kabupaten !== 'Semua' && kabupaten !== 'All') {
      query += ' WHERE LOWER(kabupaten) = LOWER(?)';
      params.push(kabupaten);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDTWById = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE dtw SET dilihat = COALESCE(dilihat, 0) + 1 WHERE id = ?', [id]);
    const [rows] = await db.query('SELECT * FROM dtw WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Destinasi wisata tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDTW = async (req, res) => {
  const { kabupaten, judul, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO dtw (kabupaten, judul, deskripsi, gambar) VALUES (?, ?, ?, ?)', [kabupaten, judul, deskripsi, gambar]);
    res.status(201).json({ message: 'DTW berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDTW = async (req, res) => {
  const { kabupaten, judul, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : req.body.gambar_lama;
  try {
    await db.query('UPDATE dtw SET kabupaten=?, judul=?, deskripsi=?, gambar=? WHERE id=?', [kabupaten, judul, deskripsi, gambar, req.params.id]);
    res.json({ message: 'DTW berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDTW = async (req, res) => {
  try {
    await db.query('DELETE FROM dtw WHERE id = ?', [req.params.id]);
    res.json({ message: 'DTW berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Desa Wisata
exports.getDesaWisata = async (req, res) => {
  try {
    const { kabupaten } = req.query;
    let query = 'SELECT * FROM desa_wisata';
    let params = [];
    if (kabupaten && kabupaten !== 'Semua' && kabupaten !== 'All') {
      query += ' WHERE LOWER(kabupaten) = LOWER(?)';
      params.push(kabupaten);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDesaWisataById = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE desa_wisata SET dilihat = COALESCE(dilihat, 0) + 1 WHERE id = ?', [id]);
    const [rows] = await db.query('SELECT * FROM desa_wisata WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Desa wisata tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDesaWisata = async (req, res) => {
  const { kabupaten, nama, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO desa_wisata (kabupaten, nama, deskripsi, gambar) VALUES (?, ?, ?, ?)', [kabupaten, nama, deskripsi, gambar]);
    res.status(201).json({ message: 'Desa Wisata berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDesaWisata = async (req, res) => {
  const { kabupaten, nama, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : req.body.gambar_lama;
  try {
    await db.query('UPDATE desa_wisata SET kabupaten=?, nama=?, deskripsi=?, gambar=? WHERE id=?', [kabupaten, nama, deskripsi, gambar, req.params.id]);
    res.json({ message: 'Desa Wisata berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDesaWisata = async (req, res) => {
  try {
    await db.query('DELETE FROM desa_wisata WHERE id = ?', [req.params.id]);
    res.json({ message: 'Desa Wisata berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Paket Wisata
exports.getPaketWisata = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM paket_wisata ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPaketWisata = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : null;
  const file_pdf = req.files && req.files.file_pdf ? req.files.file_pdf[0].filename : null;
  try {
    await db.query('INSERT INTO paket_wisata (judul, deskripsi, gambar, file_pdf) VALUES (?, ?, ?, ?)', [judul, deskripsi, gambar, file_pdf]);
    res.status(201).json({ message: 'Paket Wisata berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Kalender Event
exports.getKalenderEvent = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kalender_event ORDER BY tanggal DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createKalenderEvent = async (req, res) => {
  const { judul, tanggal, lokasi, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO kalender_event (judul, tanggal, lokasi, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)', [judul, tanggal, lokasi, deskripsi, gambar]);
    res.status(201).json({ message: 'Event berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Data Hunian Hotel
exports.getDataHunian = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM data_hunian ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDataHunian = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const file = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO data_hunian (judul, deskripsi, file) VALUES (?, ?, ?)', [judul, deskripsi, file]);
    res.status(201).json({ message: 'Data Hunian berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Statistik Kunjungan
exports.getStatistikTahun = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT tahun FROM statistik_kunjungan ORDER BY CAST(tahun AS UNSIGNED) DESC');
    res.json(rows.map((r) => r.tahun));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStatistikKunjungan = async (req, res) => {
  try {
    const { tahun } = req.query;
    let query = 'SELECT * FROM statistik_kunjungan';
    let params = [];
    if (tahun) {
      query += ' WHERE tahun = ?';
      params.push(tahun);
    }
    query += " ORDER BY tahun DESC, FIELD(bulan, 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember') ASC";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ekonomi Kreatif
exports.getEkonomiKreatif = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ekonomi_kreatif ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEkonomiKreatif = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const file = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO ekonomi_kreatif (judul, deskripsi, file) VALUES (?, ?, ?)', [judul, deskripsi, file]);
    res.status(201).json({ message: 'Ekonomi Kreatif berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sumber Daya
exports.getSumberDaya = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sumber_daya ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSumberDaya = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const file = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO sumber_daya (judul, deskripsi, file) VALUES (?, ?, ?)', [judul, deskripsi, file]);
    res.status(201).json({ message: 'Sumber Daya berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};