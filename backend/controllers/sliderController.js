const db = require('../config/db');
const cache = require('../utils/cache');

exports.getAll = async (req, res) => {
  try {
    const cached = cache.get('slider:all');
    if (cached) return res.json(cached);
    const [rows] = await db.query('SELECT * FROM slider ORDER BY urutan ASC, created_at DESC');
    cache.set('slider:all', rows, 300000);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActive = async (req, res) => {
  try {
    const cached = cache.get('slider:active');
    if (cached) return res.json(cached);
    const [rows] = await db.query('SELECT * FROM slider WHERE aktif = 1 ORDER BY urutan ASC');
    cache.set('slider:active', rows, 300000);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { judul, urutan } = req.body;
  const gambar = req.file ? req.file.filename : null;
  if (!gambar) {
    return res.status(400).json({ message: 'Gambar slider wajib diunggah' });
  }
  try {
    await db.query('INSERT INTO slider (judul, gambar, urutan, aktif) VALUES (?, ?, ?, 1)', [
      judul || '',
      gambar,
      parseInt(urutan) || 1
    ]);
    cache.delByPrefix('slider:');
    res.status(201).json({ message: 'Slider berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggle = async (req, res) => {
  const { aktif } = req.body;
  try {
    await db.query('UPDATE slider SET aktif = ? WHERE id = ?', [aktif ? 1 : 0, req.params.id]);
    cache.delByPrefix('slider:');
    res.json({ message: 'Status slider berhasil diubah' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { judul, urutan, aktif, gambar_lama } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM slider WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Slider tidak ditemukan' });
    }
    const current = rows[0];
    const gambar = req.file ? req.file.filename : (gambar_lama || current.gambar);
    const nextAktif = aktif !== undefined ? (aktif === '1' || aktif === 1 || aktif === true || aktif === 'Aktif' ? 1 : 0) : current.aktif;
    await db.query(
      'UPDATE slider SET judul = ?, urutan = ?, aktif = ?, gambar = ? WHERE id = ?',
      [judul ?? current.judul, parseInt(urutan, 10) || current.urutan, nextAktif, gambar, req.params.id]
    );
    cache.delByPrefix('slider:');
    res.json({ message: 'Slider berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM slider WHERE id = ?', [req.params.id]);
    cache.delByPrefix('slider:');
    res.json({ message: 'Slider berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
