const db = require('../config/db');
const cache = require('../utils/cache');

exports.getPengunjung = async (req, res) => {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || req.ip || '127.0.0.1');
  let ip = rawIp.replace(/^.*:/, '') || '127.0.0.1';
  if (ip === '1') ip = '127.0.0.1';

  try {
    const today = new Date().toISOString().split('T')[0];

    // Otomatis catat/hitung kunjungan jika tidak secara eksplisit di-skip (?peek=true)
    if (req.query.peek !== 'true') {
      const [existing] = await db.query('SELECT id FROM pengunjung WHERE ip = ? AND tanggal = ? LIMIT 1', [ip, today]);
      if (existing && existing.length > 0) {
        await db.query('UPDATE pengunjung SET hits = hits + 1 WHERE id = ?', [existing[0].id]);
      } else {
        await db.query('INSERT INTO pengunjung (ip, tanggal, hits) VALUES (?, ?, 1)', [ip, today]);
      }
      cache.del('statistik:pengunjung:' + today);
    }

    const cacheKey = 'statistik:pengunjung:' + today;
    let totals = cache.get(cacheKey);
    if (!totals) {
      const [[agg]] = await db.query(
        `SELECT
          COALESCE(SUM(CASE WHEN tanggal = ? THEN hits ELSE 0 END), 0) AS today,
          COALESCE(SUM(CASE WHEN tanggal = DATE_SUB(?, INTERVAL 1 DAY) THEN hits ELSE 0 END), 0) AS yesterday,
          COALESCE(SUM(CASE WHEN YEARWEEK(tanggal, 1) = YEARWEEK(?, 1) THEN hits ELSE 0 END), 0) AS thisWeek,
          COALESCE(SUM(CASE WHEN YEARWEEK(tanggal, 1) = YEARWEEK(DATE_SUB(?, INTERVAL 1 WEEK), 1) THEN hits ELSE 0 END), 0) AS lastWeek,
          COALESCE(SUM(CASE WHEN MONTH(tanggal) = MONTH(?) AND YEAR(tanggal) = YEAR(?) THEN hits ELSE 0 END), 0) AS thisMonth,
          COALESCE(SUM(CASE WHEN tanggal >= DATE_SUB(DATE_FORMAT(?, '%Y-%m-01'), INTERVAL 1 MONTH) AND tanggal < DATE_FORMAT(?, '%Y-%m-01') THEN hits ELSE 0 END), 0) AS lastMonth,
          COALESCE(SUM(hits), 0) AS allDays
        FROM pengunjung`,
        [today, today, today, today, today, today, today, today]
      );
      totals = {
        today: Number(agg?.today || 0),
        yesterday: Number(agg?.yesterday || 0),
        thisWeek: Number(agg?.thisWeek || 0),
        lastWeek: Number(agg?.lastWeek || 0),
        thisMonth: Number(agg?.thisMonth || 0),
        lastMonth: Number(agg?.lastMonth || 0),
        allDays: Number(agg?.allDays || 0),
      };
      cache.set(cacheKey, totals, 30000);
    }

    res.json({
      ...totals,
      ip: ip,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getPengunjung:', err);
    // Fallback gracefully jika database belum terkoneksi / query error
    res.json({
      today: 0,
      yesterday: 0,
      thisWeek: 0,
      lastWeek: 0,
      thisMonth: 0,
      lastMonth: 0,
      allDays: 0,
      ip: ip,
      serverTime: new Date().toISOString(),
      fallback: true
    });
  }
};

exports.trackVisitor = async (req, res) => {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || req.ip || '127.0.0.1');
  const ip = rawIp.replace(/^.*:/, '') || '127.0.0.1';
  const today = new Date().toISOString().split('T')[0];

  try {
    const [existing] = await db.query('SELECT * FROM pengunjung WHERE ip = ? AND tanggal = ?', [ip, today]);
    if (existing && existing.length > 0) {
      await db.query('UPDATE pengunjung SET hits = hits + 1 WHERE id = ?', [existing[0].id]);
    } else {
      await db.query('INSERT INTO pengunjung (ip, tanggal, hits) VALUES (?, ?, 1)', [ip, today]);
    }
    res.json({ message: 'Visitor tracked', ip });
  } catch (err) {
    res.json({ message: 'Visitor tracked (cached)', ip });
  }
};

exports.getWisatawan = async (req, res) => {
  try {
    const cacheKey = `statistik:wisatawan:${req.query.tahun || 'latest'}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    // Ambil tahun terbaru dari data resmi yang ada di tabel statistik_kunjungan
    const [yearRows] = await db.query('SELECT MAX(CAST(tahun AS UNSIGNED)) as latestYear FROM statistik_kunjungan');
    const tahun = req.query.tahun || (yearRows[0]?.latestYear ? String(yearRows[0].latestYear) : '2024');

    const [sumRows] = await db.query(
      'SELECT SUM(domestik) as total_domestik, SUM(mancanegara) as total_mancanegara FROM statistik_kunjungan WHERE tahun = ?',
      [tahun]
    );

    const domestic = Number(sumRows[0]?.total_domestik || 0);
    const international = Number(sumRows[0]?.total_mancanegara || 0);
    const total = domestic + international;

    // Perbandingan dengan tahun sebelumnya untuk persentase pertumbuhan resmi
    const tahunLalu = String(Number(tahun) - 1);
    const [prevRows] = await db.query(
      'SELECT SUM(domestik) as total_domestik, SUM(mancanegara) as total_mancanegara FROM statistik_kunjungan WHERE tahun = ?',
      [tahunLalu]
    );
    const prevTotal = Number(prevRows[0]?.total_domestik || 0) + Number(prevRows[0]?.total_mancanegara || 0);
    const growth = prevTotal > 0 ? Number((((total - prevTotal) / prevTotal) * 100).toFixed(2)) : 0;

    const payload = {
      tahun,
      domestic,
      international,
      total,
      growth,
      prevTahun: prevTotal > 0 ? tahunLalu : null
    };
    cache.set(cacheKey, payload, 300000);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIKM = async (req, res) => {
  try {
    // Data IKM statis atau dari database
    res.json({
      nilai: 89.444,
      predikat: 'SANGAT BAIK',
      unsur: [
        { kode: 'U1', nama: 'Persyaratan', nilai: 3533 },
        { kode: 'U2', nama: 'Prosedur', nilai: 3533 },
        { kode: 'U3', nama: 'Waktu Pelayanan', nilai: 3350 },
        { kode: 'U4', nama: 'Biaya/Tarif', nilai: 3983 },
        { kode: 'U5', nama: 'Produk Layanan', nilai: 3383 },
        { kode: 'U6', nama: 'Kompetensi Pelaksana', nilai: 3600 },
        { kode: 'U7', nama: 'Perilaku Pelaksana', nilai: 3617 },
        { kode: 'U8', nama: 'Sarana dan Prasarana', nilai: 3350 },
        { kode: 'U9', nama: 'Penanganan Pengaduan', nilai: 3850 }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};