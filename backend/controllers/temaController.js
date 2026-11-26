const db = require('../config/db');
const cache = require('../utils/cache');

exports.getTema = async (req, res) => {
  try {
    const cached = cache.get('tema:current');
    if (cached) return res.json(cached);

    const [rows] = await db.query('SELECT * FROM pengaturan_tema WHERE id = 1');
    const result = rows.length === 0 ? {
      id: 1,
      primary_color: '#1F5BA6',
      secondary_color: '#383087',
      accent_color: '#5C2180',
      highlight_color: '#f59e0b',
      nama_tema: 'Sulteng Biru Ungu',
      badge_icon: 'none',
      seasonal_badge: ''
    } : rows[0];
    cache.set('tema:current', result, 300000);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTema = async (req, res) => {
  const { primary_color, secondary_color, accent_color, highlight_color, nama_tema, badge_icon, seasonal_badge } = req.body;
  try {
    await db.query(
      `INSERT INTO pengaturan_tema (id, primary_color, secondary_color, accent_color, highlight_color, nama_tema, badge_icon, seasonal_badge)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       primary_color = VALUES(primary_color),
       secondary_color = VALUES(secondary_color),
       accent_color = VALUES(accent_color),
       highlight_color = VALUES(highlight_color),
       nama_tema = VALUES(nama_tema),
       badge_icon = VALUES(badge_icon),
       seasonal_badge = VALUES(seasonal_badge)`,
      [
        primary_color || '#1F5BA6',
        secondary_color || '#383087',
        accent_color || '#5C2180',
        highlight_color || '#f59e0b',
        nama_tema || 'Tema Kustom',
        badge_icon || 'none',
        seasonal_badge || ''
      ]
    );

    const [updated] = await db.query('SELECT * FROM pengaturan_tema WHERE id = 1');
    cache.delByPrefix('tema:');
    res.json({ message: 'Tema website berhasil diperbarui', data: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetTema = async (req, res) => {
  const defaultTema = {
    primary_color: '#1F5BA6',
    secondary_color: '#383087',
    accent_color: '#5C2180',
    highlight_color: '#f59e0b',
    nama_tema: 'Sulteng Biru Ungu (Default)',
    badge_icon: 'none',
    seasonal_badge: ''
  };
  try {
    await db.query(
      `UPDATE pengaturan_tema SET
       primary_color = ?,
       secondary_color = ?,
       accent_color = ?,
       highlight_color = ?,
       nama_tema = ?,
       badge_icon = ?,
       seasonal_badge = ?
       WHERE id = 1`,
      [
        defaultTema.primary_color,
        defaultTema.secondary_color,
        defaultTema.accent_color,
        defaultTema.highlight_color,
        defaultTema.nama_tema,
        defaultTema.badge_icon,
        defaultTema.seasonal_badge
      ]
    );
    cache.delByPrefix('tema:');
    res.json({ message: 'Tema berhasil dikembalikan ke default', data: defaultTema });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
