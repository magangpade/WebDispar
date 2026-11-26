const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  getKategori, getItemsByKategori, createItem, deleteItem,
  getRegulasi, createRegulasi, deleteRegulasi,
  getSK, createSK, deleteSK,
  getLaporanTahunan,
  createPermohonan, createKeberatan, createSurvey,
  getBerkala
} = require('../controllers/ppidController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Terlalu banyak pengiriman formulir. Silakan coba lagi beberapa saat.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/kategori', getKategori);
router.get('/berkala', getBerkala);
router.get('/items/:kategoriId', getItemsByKategori);
router.post('/items', verifyToken, isAdmin, upload.single('file'), createItem);
router.delete('/items/:id', verifyToken, isAdmin, deleteItem);
router.get('/regulasi', getRegulasi);
router.post('/regulasi', verifyToken, isAdmin, upload.single('file'), createRegulasi);
router.delete('/regulasi/:id', verifyToken, isAdmin, deleteRegulasi);
router.get('/sk', getSK);
router.post('/sk', verifyToken, isAdmin, upload.single('file'), createSK);
router.delete('/sk/:id', verifyToken, isAdmin, deleteSK);
router.get('/laporan-tahunan', getLaporanTahunan);
router.post('/permohonan', publicFormLimiter, createPermohonan);
router.post('/keberatan', publicFormLimiter, createKeberatan);
router.post('/survey', publicFormLimiter, createSurvey);

module.exports = router;