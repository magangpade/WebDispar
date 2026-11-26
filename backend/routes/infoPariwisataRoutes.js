const express = require('express');
const router = express.Router();
const {
  getDTW, getDTWById, createDTW, updateDTW, deleteDTW,
  getDesaWisata, getDesaWisataById, createDesaWisata, updateDesaWisata, deleteDesaWisata,
  getPaketWisata, createPaketWisata,
  getKalenderEvent, createKalenderEvent,
  getDataHunian, createDataHunian,
  getStatistikKunjungan, getStatistikTahun,
  getEkonomiKreatif, createEkonomiKreatif,
  getSumberDaya, createSumberDaya
} = require('../controllers/infoPariwisataController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/dtw', getDTW);
router.get('/dtw/:id', getDTWById);
router.post('/dtw', verifyToken, isAdmin, upload.single('gambar'), createDTW);
router.put('/dtw/:id', verifyToken, isAdmin, upload.single('gambar'), updateDTW);
router.delete('/dtw/:id', verifyToken, isAdmin, deleteDTW);

router.get('/desa-wisata', getDesaWisata);
router.get('/desa-wisata/:id', getDesaWisataById);
router.post('/desa-wisata', verifyToken, isAdmin, upload.single('gambar'), createDesaWisata);
router.put('/desa-wisata/:id', verifyToken, isAdmin, upload.single('gambar'), updateDesaWisata);
router.delete('/desa-wisata/:id', verifyToken, isAdmin, deleteDesaWisata);
router.get('/paket-wisata', getPaketWisata);
router.post('/paket-wisata', verifyToken, isAdmin, upload.fields([{ name: 'gambar', maxCount: 1 }, { name: 'file_pdf', maxCount: 1 }]), createPaketWisata);
router.get('/kalender-event', getKalenderEvent);
router.post('/kalender-event', verifyToken, isAdmin, upload.single('gambar'), createKalenderEvent);
router.get('/data-hunian', getDataHunian);
router.post('/data-hunian', verifyToken, isAdmin, upload.single('file'), createDataHunian);
router.get('/statistik-kunjungan/tahun', getStatistikTahun);
router.get('/statistik-kunjungan', getStatistikKunjungan);
router.get('/ekonomi-kreatif', getEkonomiKreatif);
router.post('/ekonomi-kreatif', verifyToken, isAdmin, upload.single('file'), createEkonomiKreatif);
router.get('/sumber-daya', getSumberDaya);
router.post('/sumber-daya', verifyToken, isAdmin, upload.single('file'), createSumberDaya);

module.exports = router;