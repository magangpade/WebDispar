const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    const q = (req.query.q || '').trim();

    let whereClause = '';
    const params = [];
    if (q) {
      whereClause = ' WHERE judul LIKE ? OR konten LIKE ?';
      const like = `%${q}%`;
      params.push(like, like);
    }

    const [rows] = await db.query(
      `SELECT * FROM berita${whereClause} ORDER BY tanggal DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM berita${whereClause}`, params);
    res.json({ data: rows, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM berita WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    await db.query('UPDATE berita SET dilihat = dilihat + 1 WHERE id = ?', [rows[0].id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { judul, slug, konten, tanggal, penulis, kategori } = req.body;
  const gambar = req.file ? req.file.filename : null;
  try {
    await db.query('INSERT INTO berita (judul, slug, konten, gambar, tanggal, penulis, kategori) VALUES (?, ?, ?, ?, ?, ?, ?)', [judul, slug, konten, gambar, tanggal, penulis || 'Admin', kategori || 'WARTA PARIWISATA']);
    res.status(201).json({ message: 'Berita berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { judul, slug, konten, tanggal, penulis, kategori } = req.body;
  const gambar = req.file ? req.file.filename : req.body.gambar_lama;
  try {
    await db.query('UPDATE berita SET judul=?, slug=?, konten=?, gambar=?, tanggal=?, penulis=?, kategori=? WHERE id=?', [judul, slug, konten, gambar, tanggal, penulis, kategori, req.params.id]);
    res.json({ message: 'Berita berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM berita WHERE id = ?', [req.params.id]);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};