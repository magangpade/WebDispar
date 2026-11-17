const express = require('express');
const router = express.Router();
const {
  getDTW, createDTW,
  getDesaWisata, createDesaWisata,
  getPaketWisata, createPaketWisata,
  getKalenderEvent, createKalenderEvent,
  getDataHunian, createDataHunian,
  getStatistikKunjungan,
  getEkonomiKreatif, createEkonomiKreatif,
  getSumberDaya, createSumberDaya
} = require('../controllers/infoPariwisataController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/dtw', getDTW);
router.post('/dtw', verifyToken, isAdmin, upload.single('gambar'), createDTW);
router.get('/desa-wisata', getDesaWisata);
router.post('/desa-wisata', verifyToken, isAdmin, upload.single('gambar'), createDesaWisata);
router.get('/paket-wisata', getPaketWisata);
router.post('/paket-wisata', verifyToken, isAdmin, upload.fields([{ name: 'gambar', maxCount: 1 }, { name: 'file_pdf', maxCount: 1 }]), createPaketWisata);
router.get('/kalender-event', getKalenderEvent);
router.post('/kalender-event', verifyToken, isAdmin, upload.single('gambar'), createKalenderEvent);
router.get('/data-hunian', getDataHunian);
router.post('/data-hunian', verifyToken, isAdmin, upload.single('file'), createDataHunian);
router.get('/statistik-kunjungan', getStatistikKunjungan);
router.get('/ekonomi-kreatif', getEkonomiKreatif);
router.post('/ekonomi-kreatif', verifyToken, isAdmin, upload.single('file'), createEkonomiKreatif);
router.get('/sumber-daya', getSumberDaya);
router.post('/sumber-daya', verifyToken, isAdmin, upload.single('file'), createSumberDaya);

module.exports = router;