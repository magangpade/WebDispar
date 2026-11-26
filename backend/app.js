const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Gzip/Deflate compression untuk memperkecil payload JSON & asset
app.use(compression());

// Security headers (ringan, tanpa dependensi tambahan)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS: batasi origin jika FRONTEND_URL diset di .env production
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin tidak diizinkan oleh CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const staticCacheOptions = {
  maxAge: '7d',
  etag: true,
  lastModified: true,
};
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticCacheOptions));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images'), staticCacheOptions));

// Global API rate limiter untuk mencegah scraping/abuse yang membuat server down
const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
  message: { message: 'Terlalu banyak permintaan. Silakan coba lagi sebentar.' },
});
app.use('/api', globalApiLimiter);

// Monitoring waktu respons & deteksi request lambat/error di production
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 500 || duration > 1000) {
      console.warn(`[MONITOR] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint (sesuai README.md)
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/berita', require('./routes/beritaRoutes'));
app.use('/api/profil', require('./routes/profilRoutes'));
app.use('/api/ppid', require('./routes/ppidRoutes'));
app.use('/api/info-pariwisata', require('./routes/infoPariwisataRoutes'));
app.use('/api/rencana-terbit', require('./routes/rencanaTerbitRoutes'));
app.use('/api/statistik', require('./routes/statistikRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/slider', require('./routes/sliderRoutes'));
app.use('/api/tema', require('./routes/temaRoutes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

module.exports = app;