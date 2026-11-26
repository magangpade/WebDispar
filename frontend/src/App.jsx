import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail';

// Profil
import Sejarah from './pages/Profil/Sejarah';
import VisiMisi from './pages/Profil/VisiMisi';
import ProfilPimpinan from './pages/Profil/ProfilPimpinan';
import Tupoksi from './pages/Profil/Tupoksi';
import Majalah from './pages/Profil/Majalah';
import Logo from './pages/Profil/Logo';
import HubungiKami from './pages/Profil/HubungiKami';

// PPID
import DaftarInformasiPublik from './pages/PPID/DaftarInformasiPublik';
import InformasiSetiapSaat from './pages/PPID/InformasiSetiapSaat';
import InformasiSertaMerta from './pages/PPID/InformasiSertaMerta';
import InformasiDikecualikan from './pages/PPID/InformasiDikecualikan';
import ProfilPPID from './pages/PPID/ProfilPPID';
import StrukturOrganisasiPPID from './pages/PPID/StrukturOrganisasiPPID';
import VisiMisiPPID from './pages/PPID/VisiMisiPPID';
import MaklumatPelayanan from './pages/PPID/MaklumatPelayanan';
import TugasPPID from './pages/PPID/TugasPPID';
import LaporanTahunan from './pages/PPID/LaporanTahunan';
import SuratKeputusan from './pages/PPID/SuratKeputusan';
import StandarPelayanan from './pages/PPID/StandarPelayanan';
import FormPermohonan from './pages/PPID/LayananPublik/FormPermohonan';
import FormKeberatan from './pages/PPID/LayananPublik/FormKeberatan';
import ProsedurPengaduan from './pages/PPID/LayananPublik/ProsedurPengaduan';
import SurveyKepuasan from './pages/PPID/LayananPublik/SurveyKepuasan';
import Regulasi from './pages/PPID/LayananPublik/Regulasi';
import InformasiSecaraBerkala from './pages/PPID/InformasiSecaraBerkala';

// Info Pariwisata
import DayaTarikWisata from './pages/InfoPariwisata/Destinasi/DayaTarikWisata';
import DesaWisata from './pages/InfoPariwisata/Destinasi/DesaWisata';
import PaketWisata from './pages/InfoPariwisata/Pemasaran/PaketWisata';
import KalenderEvent from './pages/InfoPariwisata/Pemasaran/KalenderEvent';
import DataHunian from './pages/InfoPariwisata/Pemasaran/DataHunian';
import StatistikKunjungan from './pages/InfoPariwisata/Pemasaran/StatistikKunjungan';
import EkonomiKreatif from './pages/InfoPariwisata/EkonomiKreatif';
import SumberDaya from './pages/InfoPariwisata/SumberDaya';

// Lain
import RencanaTerbit from './pages/RencanaTerbit';
import Lapor from './pages/Lapor';

// Admin
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminSlider from './pages/Admin/Slider';
import AdminBerita from './pages/Admin/Berita';
import AdminDTW from './pages/Admin/DTW';
import AdminDesaWisata from './pages/Admin/DesaWisata';
import AdminPPID from './pages/Admin/PPID';
import AdminProfil from './pages/Admin/Profil';
import AdminTema from './pages/Admin/Tema';

import api from './services/api';
import { useLanguage } from './context/LanguageContext';

// Route Guard untuk Admin Internal
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/portal-internal-dispar/login" replace />;
  }
  return children;
};

function App() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/portal-internal-dispar');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    api.post('/statistik/track').catch(() => {});
  }, [location.pathname]);

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/portal-internal-dispar" element={<Navigate to="/portal-internal-dispar/login" replace />} />
        <Route path="/portal-internal-dispar/login" element={<AdminLogin />} />
        <Route path="/portal-internal-dispar/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/slider" element={<ProtectedRoute><AdminSlider /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/berita" element={<ProtectedRoute><AdminBerita /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/dtw" element={<ProtectedRoute><AdminDTW /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/desa-wisata" element={<ProtectedRoute><AdminDesaWisata /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/profil" element={<ProtectedRoute><AdminProfil /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/ppid" element={<ProtectedRoute><AdminPPID /></ProtectedRoute>} />
        <Route path="/portal-internal-dispar/tema" element={<ProtectedRoute><AdminTema /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/portal-internal-dispar/login" replace />} />
      </Routes>
    );
  }

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <Routes>
        {/* Anti-Scraping / Obfuscation: Blokir dan redirect rute admin umum ke beranda */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/administrator" element={<Navigate to="/" replace />} />
        <Route path="/administrator/*" element={<Navigate to="/" replace />} />
        <Route path="/wp-admin" element={<Navigate to="/" replace />} />
        <Route path="/wp-admin/*" element={<Navigate to="/" replace />} />

        <Route path="/" element={<Home language={language} />} />
        <Route path="/berita" element={<Berita language={language} />} />
        <Route path="/berita/:slug" element={<BeritaDetail language={language} />} />

        {/* Profil */}
        <Route path="/profil/sejarah" element={<Sejarah language={language} />} />
        <Route path="/profil/visi-misi" element={<VisiMisi language={language} />} />
        <Route path="/profil/profil-pimpinan" element={<ProfilPimpinan language={language} />} />
        <Route path="/profil/tupoksi" element={<Tupoksi language={language} />} />
        <Route path="/profil/majalah" element={<Majalah language={language} />} />
        <Route path="/profil/logo" element={<Logo language={language} />} />
        <Route path="/profil/hubungi-kami" element={<HubungiKami language={language} />} />

        {/* PPID */}
        <Route path="/ppid/profil" element={<ProfilPPID language={language} />} />
        <Route path="/ppid/daftar-informasi-publik" element={<DaftarInformasiPublik language={language} />} />
        <Route path="/ppid/informasi-setiap-saat" element={<InformasiSetiapSaat language={language} />} />
        <Route path="/ppid/informasi-serta-merta" element={<InformasiSertaMerta language={language} />} />
        <Route path="/ppid/informasi-dikecualikan" element={<InformasiDikecualikan language={language} />} />
        <Route path="/ppid/profil/struktur-organisasi" element={<StrukturOrganisasiPPID language={language} />} />
        <Route path="/ppid/profil/visi-misi" element={<VisiMisiPPID language={language} />} />
        <Route path="/ppid/profil/maklumat-pelayanan" element={<MaklumatPelayanan language={language} />} />
        <Route path="/ppid/profil/tugas-ppid" element={<TugasPPID language={language} />} />
        <Route path="/ppid/laporan-tahunan" element={<LaporanTahunan language={language} />} />
        <Route path="/ppid/surat-keputusan" element={<SuratKeputusan language={language} />} />
        <Route path="/ppid/standar-pelayanan" element={<StandarPelayanan language={language} />} />
        <Route path="/ppid/layanan-publik/form-permohonan" element={<FormPermohonan language={language} />} />
        <Route path="/ppid/layanan-publik/form-keberatan" element={<FormKeberatan language={language} />} />
        <Route path="/ppid/layanan-publik/prosedur-pengaduan" element={<ProsedurPengaduan language={language} />} />
        <Route path="/ppid/layanan-publik/survey-kepuasan" element={<SurveyKepuasan language={language} />} />
        <Route path="/ppid/informasi-secara-berkala" element={<InformasiSecaraBerkala language={language} />} />
        <Route path="/ppid/informasi-berkala" element={<InformasiSecaraBerkala language={language} />} />
        <Route path="/ppid/layanan-publik/regulasi" element={<Regulasi language={language} />} />
        <Route path="/ppid/regulasi" element={<Regulasi language={language} />} />

        {/* Info Pariwisata */}
        <Route path="/info-pariwisata/destinasi/daya-tarik-wisata" element={<DayaTarikWisata language={language} />} />
        <Route path="/info-pariwisata/destinasi/daya-tarik-wisata/:kabupaten" element={<DayaTarikWisata language={language} />} />
        <Route path="/info-pariwisata/destinasi/desa-wisata" element={<DesaWisata language={language} />} />
        <Route path="/info-pariwisata/destinasi/desa-wisata/:kabupaten" element={<DesaWisata language={language} />} />
        <Route path="/info-pariwisata/pemasaran/paket-wisata" element={<PaketWisata language={language} />} />
        <Route path="/info-pariwisata/pemasaran/kalender-event" element={<KalenderEvent language={language} />} />
        <Route path="/info-pariwisata/pemasaran/data-hunian" element={<DataHunian language={language} />} />
        <Route path="/info-pariwisata/pemasaran/statistik-kunjungan" element={<StatistikKunjungan language={language} />} />
        <Route path="/info-pariwisata/ekonomi-kreatif" element={<EkonomiKreatif language={language} />} />
        <Route path="/info-pariwisata/sumber-daya" element={<SumberDaya language={language} />} />

        {/* Lain */}
        <Route path="/rencana-terbit" element={<RencanaTerbit language={language} />} />
        <Route path="/lapor" element={<Lapor language={language} />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
