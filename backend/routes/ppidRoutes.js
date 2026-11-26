const express = require('express');
const router = express.Router();
const {
  getKategori, getAllItems, getItemsByKategori, createItem, updateItem, deleteItem,
  getRegulasi, createRegulasi, updateRegulasi, deleteRegulasi,
  getSK, createSK, updateSK, deleteSK,
  getLaporanTahunan,
  createPermohonan, createKeberatan, createSurvey,
  getBerkala
} = require('../controllers/ppidController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/kategori', getKategori);
router.get('/berkala', getBerkala);
router.get('/items', getAllItems);
router.get('/items/:kategoriId', getItemsByKategori);
router.post('/items', verifyToken, isAdmin, upload.single('file'), createItem);
router.put('/items/:id', verifyToken, isAdmin, upload.single('file'), updateItem);
router.delete('/items/:id', verifyToken, isAdmin, deleteItem);
router.get('/regulasi', getRegulasi);
router.post('/regulasi', verifyToken, isAdmin, upload.single('file'), createRegulasi);
router.put('/regulasi/:id', verifyToken, isAdmin, upload.single('file'), updateRegulasi);
router.delete('/regulasi/:id', verifyToken, isAdmin, deleteRegulasi);
router.get('/sk', getSK);
router.post('/sk', verifyToken, isAdmin, upload.single('file'), createSK);
router.put('/sk/:id', verifyToken, isAdmin, upload.single('file'), updateSK);
router.delete('/sk/:id', verifyToken, isAdmin, deleteSK);
router.get('/laporan-tahunan', getLaporanTahunan);
router.post('/permohonan', createPermohonan);
router.post('/keberatan', createKeberatan);
router.post('/survey', createSurvey);

module.exports = router;