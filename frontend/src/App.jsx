import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import MainLayout from './components/MainLayout';
import Loader from './components/Loader';
import Home from './pages/Home';

// Public pages (Lazy-loaded per rute agar bundle awal ringan)
const Berita = lazy(() => import('./pages/Berita'));
const BeritaDetail = lazy(() => import('./pages/BeritaDetail'));

// Profil
const Sejarah = lazy(() => import('./pages/Profil/Sejarah'));
const VisiMisi = lazy(() => import('./pages/Profil/VisiMisi'));
const ProfilPimpinan = lazy(() => import('./pages/Profil/ProfilPimpinan'));
const Tupoksi = lazy(() => import('./pages/Profil/Tupoksi'));
const Majalah = lazy(() => import('./pages/Profil/Majalah'));
const Logo = lazy(() => import('./pages/Profil/Logo'));
const HubungiKami = lazy(() => import('./pages/Profil/HubungiKami'));

// PPID
const DaftarInformasiPublik = lazy(() => import('./pages/PPID/DaftarInformasiPublik'));
const InformasiSetiapSaat = lazy(() => import('./pages/PPID/InformasiSetiapSaat'));
const InformasiSertaMerta = lazy(() => import('./pages/PPID/InformasiSertaMerta'));
const InformasiDikecualikan = lazy(() => import('./pages/PPID/InformasiDikecualikan'));
const ProfilPPID = lazy(() => import('./pages/PPID/ProfilPPID'));
const StrukturOrganisasiPPID = lazy(() => import('./pages/PPID/StrukturOrganisasiPPID'));
const VisiMisiPPID = lazy(() => import('./pages/PPID/VisiMisiPPID'));
const MaklumatPelayanan = lazy(() => import('./pages/PPID/MaklumatPelayanan'));
const TugasPPID = lazy(() => import('./pages/PPID/TugasPPID'));
const LaporanTahunan = lazy(() => import('./pages/PPID/LaporanTahunan'));
const SuratKeputusan = lazy(() => import('./pages/PPID/SuratKeputusan'));
const StandarPelayanan = lazy(() => import('./pages/PPID/StandarPelayanan'));
const FormPermohonan = lazy(() => import('./pages/PPID/LayananPublik/FormPermohonan'));
const FormKeberatan = lazy(() => import('./pages/PPID/LayananPublik/FormKeberatan'));
const ProsedurPengaduan = lazy(() => import('./pages/PPID/LayananPublik/ProsedurPengaduan'));
const SurveyKepuasan = lazy(() => import('./pages/PPID/LayananPublik/SurveyKepuasan'));
const Regulasi = lazy(() => import('./pages/PPID/LayananPublik/Regulasi'));
const InformasiSecaraBerkala = lazy(() => import('./pages/PPID/InformasiSecaraBerkala'));

// Info Pariwisata
const DayaTarikWisata = lazy(() => import('./pages/InfoPariwisata/Destinasi/DayaTarikWisata'));
const DesaWisata = lazy(() => import('./pages/InfoPariwisata/Destinasi/DesaWisata'));
const PaketWisata = lazy(() => import('./pages/InfoPariwisata/Pemasaran/PaketWisata'));
const KalenderEvent = lazy(() => import('./pages/InfoPariwisata/Pemasaran/KalenderEvent'));
const DataHunian = lazy(() => import('./pages/InfoPariwisata/Pemasaran/DataHunian'));
const StatistikKunjungan = lazy(() => import('./pages/InfoPariwisata/Pemasaran/StatistikKunjungan'));
const EkonomiKreatif = lazy(() => import('./pages/InfoPariwisata/EkonomiKreatif'));
const SumberDaya = lazy(() => import('./pages/InfoPariwisata/SumberDaya'));

// Lain
const RencanaTerbit = lazy(() => import('./pages/RencanaTerbit'));
const Lapor = lazy(() => import('./pages/Lapor'));

// Admin (Lazy-loaded agar tidak membebani ukuran bundle halaman publik)
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminSlider = lazy(() => import('./pages/Admin/Slider'));
const AdminBerita = lazy(() => import('./pages/Admin/Berita'));
const AdminDTW = lazy(() => import('./pages/Admin/DTW'));
const AdminDesaWisata = lazy(() => import('./pages/Admin/DesaWisata'));
const AdminPPID = lazy(() => import('./pages/Admin/PPID'));
const AdminProfil = lazy(() => import('./pages/Admin/Profil'));
const AdminTema = lazy(() => import('./pages/Admin/Tema'));

import api from './services/api';
import { useLanguage } from './context/LanguageContext';

// Cek apakah token JWT valid & belum kedaluwarsa
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Route Guard untuk Admin Internal
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    return <Navigate to="/portal-internal-dispar/login" replace />;
  }
  return children;
};

// Halaman 404 untuk rute publik yang tidak ditemukan
const NotFoundPage = ({ language }) => {
  const isEn = language === 'EN';
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-black text-amber-500 mb-3">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {isEn ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {isEn
          ? 'The page you are looking for does not exist or has been moved.'
          : 'Halaman yang Anda cari tidak tersedia atau telah dipindahkan.'}
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-[#1F5BA6] hover:bg-[#164480] text-white text-sm font-bold transition-colors shadow-sm"
      >
        {isEn ? 'Back to Home' : 'Kembali ke Beranda'}
      </Link>
    </div>
  );
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">Memuat Portal Admin...</div>}>
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
      </Suspense>
    );
  }

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <Suspense fallback={<Loader text={language === 'EN' ? 'Loading page...' : 'Memuat halaman...'} />}>
      <Routes>
        {/* Anti-Scraping / Obfuscation: Blokir dan redirect rute admin umum ke beranda */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/administrator" element={<Navigate to="/" replace />} />
        <Route path="/administrator/*" element={<Navigate to="/" replace />} />
        <Route path="/wp-admin" element={<Navigate to="/" replace />} />
        <Route path="/wp-admin/*" element={<Navigate to="/" replace />} />

        {/* Alias Rute Kontak / Pengaduan agar tidak 404 jika diakses langsung */}
        <Route path="/kontak" element={<Navigate to="/profil/hubungi-kami" replace />} />
        <Route path="/pengaduan" element={<Navigate to="/ppid/layanan-publik/prosedur-pengaduan" replace />} />

        <Route path="/" element={<Home language={language} />} />
        <Route path="/berita" element={<Berita language={language} />} />
        <Route path="/berita/:slug" element={<BeritaDetail language={language} />} />

        {/* Profil */}
        <Route path="/profil" element={<Navigate to="/profil/sejarah" replace />} />
        <Route path="/profil/sejarah" element={<Sejarah language={language} />} />
        <Route path="/profil/visi-misi" element={<VisiMisi language={language} />} />
        <Route path="/profil/profil-pimpinan" element={<ProfilPimpinan language={language} />} />
        <Route path="/profil/tupoksi" element={<Tupoksi language={language} />} />
        <Route path="/profil/majalah" element={<Majalah language={language} />} />
        <Route path="/profil/logo" element={<Logo language={language} />} />
        <Route path="/profil/hubungi-kami" element={<HubungiKami language={language} />} />

        {/* PPID */}
        <Route path="/ppid" element={<Navigate to="/ppid/profil" replace />} />
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
        <Route path="*" element={<NotFoundPage language={language} />} />
      </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
