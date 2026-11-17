const db = require('../config/db');

// DTW
exports.getDTW = async (req, res) => {
  try {
    const { kabupaten } = req.query;
    let query = 'SELECT * FROM dtw';
    let params = [];
    if (kabupaten) {
      query += ' WHERE kabupaten = ?';
      params.push(kabupaten);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
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

// Desa Wisata
exports.getDesaWisata = async (req, res) => {
  try {
    const { kabupaten } = req.query;
    let query = 'SELECT * FROM desa_wisata';
    let params = [];
    if (kabupaten) {
      query += ' WHERE kabupaten = ?';
      params.push(kabupaten);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
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

// Statistik Kunjungan
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