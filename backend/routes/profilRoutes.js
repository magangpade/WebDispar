const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  getAllProfil, getByKategori, getPejabat,
  createProfil, updateProfil, deleteProfil,
  createPejabat, updatePejabat, deletePejabat,
  createPesanKontak, getPesanKontak
} = require('../controllers/profilController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Terlalu banyak pengiriman pesan. Silakan coba lagi beberapa saat.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific routes first
router.get('/all', getAllProfil);
router.get('/pejabat', getPejabat);
router.get('/pejabat/all', getPejabat);
router.post('/pejabat', verifyToken, isAdmin, upload.single('foto'), createPejabat);
router.put('/pejabat/:id', verifyToken, isAdmin, upload.single('foto'), updatePejabat);
router.delete('/pejabat/:id', verifyToken, isAdmin, deletePejabat);
router.post('/pesan', contactLimiter, createPesanKontak);
router.get('/pesan', verifyToken, isAdmin, getPesanKontak);

// Parameterized route after specific routes
router.get('/:kategori', getByKategori);
router.post('/', verifyToken, isAdmin, upload.single('gambar'), createProfil);
router.put('/:id', verifyToken, isAdmin, upload.single('gambar'), updateProfil);
router.delete('/:id', verifyToken, isAdmin, deleteProfil);

module.exports = router;