const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/berita', require('./routes/beritaRoutes'));
app.use('/api/profil', require('./routes/profilRoutes'));
app.use('/api/ppid', require('./routes/ppidRoutes'));
app.use('/api/info-pariwisata', require('./routes/infoPariwisataRoutes'));
app.use('/api/rencana-terbit', require('./routes/rencanaTerbitRoutes'));
app.use('/api/statistik', require('./routes/statistikRoutes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

module.exports = app;