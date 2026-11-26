const db = require('../config/db');

exports.getAllProfil = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profil ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByKategori = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profil WHERE kategori = ?', [req.params.kategori]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPejabat = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pejabat ORDER BY urutan ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProfil = async (req, res) => {
  const { kategori, judul, konten } = req.body;
  const gambar = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO profil (kategori, judul, konten, gambar) VALUES (?, ?, ?, ?)', [kategori, judul, konten, gambar]);
    res.status(201).json({ message: 'Profil berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfil = async (req, res) => {
  const { judul, konten } = req.body;
  const gambar = req.file ? req.file.filename : req.body.gambar_lama;
  try {
    await db.query('UPDATE profil SET judul=?, konten=?, gambar=? WHERE id=?', [judul, konten, gambar, req.params.id]);
    res.json({ message: 'Profil berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProfil = async (req, res) => {
  try {
    await db.query('DELETE FROM profil WHERE id = ?', [req.params.id]);
    res.json({ message: 'Profil berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePejabat = async (req, res) => {
  const { nama, nip, jabatan, urutan } = req.body;
  const foto = req.file ? req.file.filename : req.body.foto_lama;
  try {
    await db.query('UPDATE pejabat SET nama=?, nip=?, jabatan=?, foto=?, urutan=? WHERE id=?', [nama, nip, jabatan, foto, urutan || 0, req.params.id]);
    res.json({ message: 'Pejabat berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPejabat = async (req, res) => {
  const { nama, nip, jabatan, urutan } = req.body;
  const foto = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO pejabat (nama, nip, jabatan, foto, urutan) VALUES (?, ?, ?, ?, ?)', [nama, nip, jabatan, foto, urutan || 0]);
    res.status(201).json({ message: 'Pejabat berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePejabat = async (req, res) => {
  try {
    await db.query('DELETE FROM pejabat WHERE id = ?', [req.params.id]);
    res.json({ message: 'Pejabat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPesanKontak = async (req, res) => {
  const { nama, email, subjek, pesan } = req.body;
  if (!nama || !email || !subjek || !pesan) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi' });
  }
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS pesan_kontak (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        subjek VARCHAR(255) NOT NULL,
        pesan TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await db.query(
      'INSERT INTO pesan_kontak (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)',
      [nama.trim(), email.trim(), subjek.trim(), pesan.trim()]
    );
    res.status(201).json({ message: 'Pesan berhasil dikirim' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPesanKontak = async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS pesan_kontak (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        subjek VARCHAR(255) NOT NULL,
        pesan TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    const [rows] = await db.query('SELECT * FROM pesan_kontak ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};