import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Users, Download, Network, Award, FileText, CheckCircle2,
  RefreshCw, GraduationCap, Briefcase, X, Calendar, Building2,
  Sparkles, ChevronRight, Eye, ShieldCheck
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const JABATAN_MAP_EN = {
  'Kepala Dinas': 'Head of Department',
  'Sekretaris Dinas': 'Department Secretary',
  'Kepala Sub. Bagian Keuangan dan Aset': 'Head of Sub-Division for Finance & Assets',
  'Kepala Sub. Bagian Kepegawaian dan Umum': 'Head of Sub-Division for Personnel & General Affairs',
  'Kepala Bidang Pengembangan Destinasi Pariwisata': 'Head of Division for Tourism Destination Development',
  'Kepala Bidang Pengembangan Pemasaran Pariwisata': 'Head of Division for Tourism Marketing Development',
  'Kepala Bidang Pengembangan Ekonomi Kreatif, Pemanfaatan & Perlindungan HKI': 'Head of Division for Creative Economy Development, Utilization & IPR Protection',
  'Kepala Bidang Sumber Daya Pariwisata dan Ekonomi Kreatif': 'Head of Division for Tourism & Creative Economy Resources',
  'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda': 'Associate Tourism & Creative Economy Specialist',
  'Adyatama Kepariwisataan dan Ekonomi Kreatif': 'Tourism & Creative Economy Specialist',
};

const translateJabatan = (jabatan, lang) => {
  if (lang !== 'EN') return jabatan;
  return JABATAN_MAP_EN[jabatan] || jabatan;
};

// Data detail profil lengkap pimpinan berlatar putih (bersumber dari dokumen resmi & PDF kepegawaian)
export const DETAIL_PROFIL_PEJABAT = {
  '196808251994122006': {
    nip: '19680825 199412 2 006',
    nama: 'Dra. Diah Agustiningsih, M.Pd',
    jabatan: 'Kepala Dinas Pariwisata Provinsi Sulawesi Tengah',
    jabatanEn: 'Head of Tourism Department of Central Sulawesi Province',
    pangkat: 'Pembina Utama Madya (IV/d)',
    pangkatEn: 'Senior Principal (IV/d)',
    pendidikanTerakhir: 'S-2 Magister Pendidikan (Universitas Negeri Malang)',
    pendidikanTerakhirEn: 'Master of Education (State University of Malang)',
    masaKerja: '33 Tahun',
    masaKerjaEn: '33 Years',
    unitKerja: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    unitKerjaEn: 'Tourism Department of Central Sulawesi Province',
    ringkasan: 'Memimpin perencanaan, perumusan, dan pelaksanaan kebijakan strategis kepariwisataan dan ekonomi kreatif di seluruh wilayah Provinsi Sulawesi Tengah, termasuk penguatan promosi internasional dan program Negeri Seribu Megalit.',
    ringkasanEn: 'Leading strategic policy formulation, planning, and tourism & creative economy programs across Central Sulawesi Province, including global tourism marketing and the Land of a Thousand Megaliths initiative.',
    pdfUrl: '/images/ProfilPimpinan/01_-_kadis_diah.pdf',
    pendidikan: [
      { jenjang: 'SD', institusi: 'SD Negeri 3 Palu' },
      { jenjang: 'SMP', institusi: 'SMP Negeri 1 Palu' },
      { jenjang: 'SMA', institusi: 'SMA Negeri 1 Palu' },
      { jenjang: 'S-1', institusi: 'IKIP Ujung Pandang (Sarjana Pendidikan)' },
      { jenjang: 'S-2', institusi: 'Universitas Negeri Malang (Magister Pendidikan)' },
    ],
    pengalamanKerja: [
      { jabatan: 'Guru SLTPN 3 Ujung Pandang' },
      { jabatan: 'Guru SLTPN 4 Palu' },
      { jabatan: 'Guru SMP Negeri Madani' },
      { jabatan: 'Kepala Bidang PPTPK' },
      { jabatan: 'Kepala Bidang Pendidikan Dasar PKLK' },
      { jabatan: 'Sekretaris Dinas Pendidikan dan Kebudayaan Kota Palu' },
      { jabatan: 'Kepala Bidang Pendidikan Dasar' },
      { jabatan: 'Kepala Bidang Pengembangan Pemasaran dan Kemitraan Dinas Pariwisata Ekraf Kota Palu' },
      { jabatan: 'Staf Ahli Bidang Ekonomi, Keuangan dan Pembangunan pada Sekretariat Daerah Kab. Sigi' },
      { jabatan: 'Kepala Dinas Pariwisata Kab. Sigi' },
      { jabatan: 'Kepala Dinas Pariwisata Provinsi Sulawesi Tengah' },
    ],
    diklat: ['Diklat PIM IV (2005)', 'Diklat PIM III (2014)', 'Diklat PIM II (2018)'],
  },

  '198105012000122001': {
    nip: '19810501 200012 2 001',
    nama: 'Nency Ainun, S.STP, M.Si.',
    jabatan: 'Sekretaris Dinas Pariwisata Provinsi Sulawesi Tengah',
    jabatanEn: 'Secretary of Tourism Department of Central Sulawesi Province',
    pangkat: 'Pembina Tingkat I (IV/b)',
    pangkatEn: 'First Class Principal (IV/b)',
    pendidikanTerakhir: 'S-2 Administrasi Publik (Universitas Tadulako)',
    pendidikanTerakhirEn: 'Master of Public Administration (Tadulako University)',
    masaKerja: '20 Tahun',
    masaKerjaEn: '20 Years',
    unitKerja: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    unitKerjaEn: 'Tourism Department of Central Sulawesi Province',
    ringkasan: 'Mengkoordinasikan administrasi umum, perencanaan program, pengelolaan keuangan dan aset, kepegawaian, serta pelayanan informasi publik PPID Dinas Pariwisata Provinsi Sulawesi Tengah.',
    ringkasanEn: 'Coordinating general administration, program planning, asset & financial management, staffing, and public information services at the Department of Tourism of Central Sulawesi Province.',
    pdfUrl: '/images/ProfilPimpinan/profil_nency_ainun.pdf',
    pendidikan: [
      { jenjang: 'SD', institusi: 'SD Negeri 5 Palu' },
      { jenjang: 'SMP', institusi: 'SMP Negeri 1 Palu' },
      { jenjang: 'SMU', institusi: 'SMU Negeri 1 Palu' },
      { jenjang: 'D-IV', institusi: 'Sekolah Tinggi Pemerintahan Dalam Negeri (STPDN)' },
      { jenjang: 'S-2', institusi: 'Universitas Tadulako (S-2 Administrasi Publik)' },
    ],
    pengalamanKerja: [
      { jabatan: 'Kepala Seksi Pelaporan, Pengawasan Asset dan Investasi' },
      { jabatan: 'Kepala Sub Bidang Akuntansi Pelaporan' },
      { jabatan: 'Kepala Bidang Akuntansi' },
      { jabatan: 'Kepala Bidang Pengembangan Destinasi dan Industri Pariwisata' },
      { jabatan: 'Kepala Seksi Penyiapan Prasarana dan Sarana Permukiman dan Kawasan Transmigrasi' },
      { jabatan: 'Kepala Seksi Analisa Data Pasar dan Pengembangan Komunikasi Pemasaran Pariwisata' },
      { jabatan: 'Adyatama Kepariwisataan dan Ekonomi Kreatif Ahli Muda' },
      { jabatan: 'Sekretaris Dinas Pariwisata Prov. Sulteng' },
    ],
    diklat: ['Diklat PIM IV (2004)', 'Diklat PIM III (2019)'],
  },

  '197111212000122001': {
    nip: '19711121 200012 2 001',
    nama: 'Hasna, S.Sos., M.A.P.',
    jabatan: 'Kepala Bidang Pengembangan Destinasi Pariwisata',
    jabatanEn: 'Head of Tourism Destination Development Division',
    pangkat: 'Pembina Tingkat I (IV/b)',
    pangkatEn: 'First Class Principal (IV/b)',
    pendidikanTerakhir: 'S-2 Magister Ilmu Administrasi Publik (Universitas Tadulako)',
    pendidikanTerakhirEn: 'Master of Public Administration (Tadulako University)',
    masaKerja: '24 Tahun',
    masaKerjaEn: '24 Years',
    unitKerja: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    unitKerjaEn: 'Tourism Department of Central Sulawesi Province',
    ringkasan: 'Bertanggung jawab dalam perencanaan, pembangunan, perintisan destinasi wisata unggulan, penetapan daya tarik wisata (DTW), dan penguatan desa wisata berbasis kearifan lokal.',
    ringkasanEn: 'Responsible for strategic planning, infrastructure development, tourist attraction certification (DTW), and empowerment of community-based tourism villages.',
    pdfUrl: '/images/ProfilPimpinan/profil_hasna.pdf',
    pendidikan: [
      { jenjang: 'SD', institusi: 'SD Inpres Lasoani' },
      { jenjang: 'SMP', institusi: 'SMP Negeri 2 Palu' },
      { jenjang: 'SPG', institusi: 'SPG Negeri Palu' },
      { jenjang: 'S-1', institusi: 'Universitas Tadulako Palu (S-1 Sosial Politik)' },
      { jenjang: 'S-2', institusi: 'Universitas Tadulako Palu (S-2 Magister Ilmu Administrasi Publik)' },
    ],
    pengalamanKerja: [
      { jabatan: 'Kepala Sub Bagian Kepegawaian' },
      { jabatan: 'Kepala Sub Bagian Umum' },
      { jabatan: 'Kepala Bidang Rekam Medik dan Informasi' },
      { jabatan: 'Kepala Bidang Program dan Evaluasi' },
      { jabatan: 'Sekretaris' },
      { jabatan: 'Kepala Bidang Pengembangan Destinasi Pariwisata' },
    ],
    diklat: ['Diklat PIM IV', 'Diklat Teknis Kepariwisataan'],
  },

  '197811222009042001': {
    nip: '19781122 200904 2 001',
    nama: 'Joyce Sagita Novyanti, SE., M.M.',
    jabatan: 'Kepala Bidang Pengembangan Pemasaran Pariwisata',
    jabatanEn: 'Head of Tourism Marketing Development Division',
    pangkat: 'Penata Tingkat I (III/d)',
    pangkatEn: 'First Class Superintendent (III/d)',
    pendidikanTerakhir: 'S-2 Magister Manajemen (Universitas Tadulako)',
    pendidikanTerakhirEn: 'Master of Management (Tadulako University)',
    masaKerja: '16 Tahun',
    masaKerjaEn: '16 Years',
    unitKerja: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    unitKerjaEn: 'Tourism Department of Central Sulawesi Province',
    ringkasan: 'Mengoordinasikan promosi pariwisata nusantara dan mancanegara, penyelenggaraan Karisma Event Nusantara (KEN) Sulawesi Tengah, kemitraan agen travel, dan kampanye digital pariwisata.',
    ringkasanEn: 'Coordinating domestic & international tourism marketing, Central Sulawesi Event Calendar (KEN), travel industry partnerships, and digital campaigns.',
    pdfUrl: '/images/ProfilPimpinan/profil_joyce.pdf',
    pendidikan: [
      { jenjang: 'SD', institusi: 'SD Negeri Biro' },
      { jenjang: 'SMP', institusi: 'SMP Negeri 2 Palu' },
      { jenjang: 'SMA', institusi: 'SMA Negeri 1 Palu' },
      { jenjang: 'S-1', institusi: 'Universitas Tadulako Palu (S-1 Manajemen)' },
      { jenjang: 'S-2', institusi: 'Universitas Tadulako Palu (S-2 Magister Manajemen)' },
    ],
    pengalamanKerja: [
      { jabatan: 'Pengelola Bahan dan Data Penyusunan Anggaran' },
      { jabatan: 'Pengumpul dan Pengolah Data' },
      { jabatan: 'Kepala Sub Bagian Kepegawaian dan Umum' },
      { jabatan: 'Kepala Sub Bag Kepegawaian' },
      { jabatan: 'Kepala UPT Pelayanan Teknis Laboratorium' },
      { jabatan: 'Kepala Bidang Pemenuhan Hak Anak' },
      { jabatan: 'Kepala Bagian Fasilitasi Penganggaran dan Pengawasan' },
      { jabatan: 'Kepala Bidang Pengembangan Pemasaran Pariwisata' },
    ],
    diklat: ['Diklat PIM IV', 'Diklat Pemasaran Pariwisata Digital'],
  },

  '198701212006041008': {
    nip: '19870121 200604 1 008',
    nama: 'Ilham Arifin, SH.',
    jabatan: 'Kepala Bidang Pengembangan Ekonomi Kreatif, Pemanfaatan & Perlindungan HKI',
    jabatanEn: 'Head of Creative Economy Development, Utilization & IPR Protection Division',
    pangkat: 'Penata / Pembina',
    pangkatEn: 'Superintendent / Principal',
    pendidikanTerakhir: 'S-1 Ilmu Hukum (Universitas Tadulako)',
    pendidikanTerakhirEn: 'Bachelor of Laws (Tadulako University)',
    masaKerja: '18 Tahun',
    masaKerjaEn: '18 Years',
    unitKerja: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    unitKerjaEn: 'Tourism Department of Central Sulawesi Province',
    ringkasan: 'Mendorong pemberdayaan 17 subsektor ekonomi kreatif, fasilitasi pendaftaran Hak Kekayaan Intelektual (HKI) bagi UMKM dan pelaku kreatif, inkubasi bisnis, dan sinergi ekosistem ekraf lokal.',
    ringkasanEn: 'Fostering 17 creative economy subsectors, facilitating Intellectual Property Rights (IPR) registration for SMEs, creative incubation, and local creative ecosystem growth.',
    pdfUrl: '/images/ProfilPimpinan/profil_ilham.pdf',
    pendidikan: [
      { jenjang: 'SD', institusi: 'SD Negeri Inpres Lolu VI / Inti Palu' },
      { jenjang: 'SLTP', institusi: 'SLTP Negeri 1 Palu' },
      { jenjang: 'SMAN', institusi: 'SMAN 2 Palu' },
      { jenjang: 'S-1', institusi: 'Universitas Tadulako (S-1 Ilmu Hukum)' },
    ],
    pengalamanKerja: [
      { jabatan: 'Kepala Sub Bagian Pembangunan' },
      { jabatan: 'Kepala Seksi Perencanaan dan Pengadaan' },
      { jabatan: 'Kepala Seksi Ekonomi dan Pembangunan' },
      { jabatan: 'Kepala Sub Bagian Perencanaan Program' },
      { jabatan: 'Kepala Sub Bidang Pengembangan Partisipasi Masyarakat' },
      { jabatan: 'Kepala Seksi Pengembangan Destinasi dan Daya Tarik Wisata' },
      { jabatan: 'Kepala Seksi Kelembagaan Masyarakat (Non Aktif)' },
      { jabatan: 'Penyuluh Sosial Ahli Muda' },
      { jabatan: 'Kepala Bagian Administrasi Keuangan dan Aset' },
      { jabatan: 'Kepala Bidang Pengembangan Ekonomi Kreatif, Pemanfaatan dan Perlindungan Hak Kekayaan Intelektual' },
    ],
    diklat: ['Diklat PIM IV', 'Diklat Fasilitasi HKI & Ekonomi Kreatif'],
  },

  '197108222005022002': {
    nip: '19710822 200502 2 002',
    nama: 'Widyawati, SS., M.Sc.',
    jabatan: 'Kepala Bidang Sumber Daya Pariwisata dan Ekonomi Kreatif',
    jabatanEn: 'Head of Tourism & Creative Economy Resources Division',
    pangkat: 'Pembina (IV/a)',
    pangkatEn: 'Principal (IV/a)',
    pendidikanTerakhir: 'S-2 Teknik Arsitektur (Universitas Gadjah Mada)',
    pendidikanTerakhirEn: 'Master of Architecture Engineering (Gadjah Mada University)',
    masaKerja: '19 Tahun',
    masaKerjaEn: '19 Years',
    unitKerja: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    unitKerjaEn: 'Tourism Department of Central Sulawesi Province',
    ringkasan: 'Bertanggung jawab dalam peningkatan kapasitas dan kompetensi SDM kepariwisataan, sertifikasi tenaga kerja pariwisata, pelatihan pemandu wisata, dan kelembagaan masyarakat pariwisata.',
    ringkasanEn: 'Responsible for human resource capacity building in tourism, competency certifications, tour guide vocational training, and tourism community institutions.',
    pdfUrl: '/images/ProfilPimpinan/profil_widyawati.pdf',
    pendidikan: [
      { jenjang: 'SDN', institusi: 'SDN 5 Palu' },
      { jenjang: 'SMP', institusi: 'SMP Negeri 4 Palu' },
      { jenjang: 'SMA', institusi: 'SMA Negeri 1 Palu' },
      { jenjang: 'S-1', institusi: 'Sekolah Tinggi Bahasa Asing YAPARI (S-1 Bahasa Prancis)' },
      { jenjang: 'S-2', institusi: 'Universitas Gadjah Mada (S-2 Teknik Arsitektur)' },
    ],
    pengalamanKerja: [
      { jabatan: 'Kepala Sub Bagian Perencanaan Program' },
      { jabatan: '(PJ) Kepala Seksi Administrasi dan Manajemen Pendidikan Menengah' },
      { jabatan: 'Kepala Seksi Pendidikan SMA dan PKLK' },
      { jabatan: 'Penyusun Program Peningkatan Kompetensi SDM Kebudayaan' },
      { jabatan: 'Penyusun Rencana Kehumasan dan Perpustakaan' },
      { jabatan: 'Kepala Sub Bagian Program' },
      { jabatan: 'Kepala Bidang Pengembangan Sumber Daya Pariwisata dan Ekonomi Kreatif' },
    ],
    diklat: ['Diklat PIM IV (2023)', 'Diklat Sertifikasi Kompetensi Pariwisata'],
  },
};

// Data default (fallback)
const DEFAULT_PEJABAT = [
  { nama: 'Dra. Diah Agustiningsih, M.Pd', nip: '196808251994122006', jabatan: 'Kepala Dinas', foto: 'kadis_diah.jpg', urutan: 1 },
  { nama: 'Nency Ainun, S.Stp., M.Si', nip: '198105012000122001', jabatan: 'Sekretaris Dinas', foto: 'nency-ainun.jpg', urutan: 2 },
  { nama: 'Rani Adelia, SE, MM', nip: '198505022011012006', jabatan: 'Kepala Sub. Bagian Keuangan dan Aset', foto: null, urutan: 3 },
  { nama: 'Achmad Khomaini, S.Kom', nip: '198106172005011016', jabatan: 'Kepala Sub. Bagian Kepegawaian dan Umum', foto: null, urutan: 4 },
  { nama: 'Hasna, S.Sos., M.Ap', nip: '197111212000122001', jabatan: 'Kepala Bidang Pengembangan Destinasi Pariwisata', foto: 'hasna.jpg', urutan: 5 },
  { nama: 'Joyce Sagita Novyanti, SE., MM', nip: '197811222009042001', jabatan: 'Kepala Bidang Pengembangan Pemasaran Pariwisata', foto: 'joyce.jpg', urutan: 6 },
  { nama: 'Ilham Arifin, SH', nip: '198701212006041008', jabatan: 'Kepala Bidang Pengembangan Ekonomi Kreatif, Pemanfaatan & Perlindungan HKI', foto: 'ilham.jpg', urutan: 7 },
  { nama: 'Widyawati, SS., M.Sc', nip: '197108222005022002', jabatan: 'Kepala Bidang Sumber Daya Pariwisata dan Ekonomi Kreatif', foto: 'widyawati.jpg', urutan: 8 },
  { nama: 'Mohammad Arif, S.Sos., M.Ap', nip: '198105122006041018', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: null, urutan: 9 },
  { nama: 'Wahyu Sukmawan, ST', nip: '197611022008011011', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: null, urutan: 10 },
  { nama: 'Yunita, S.Sos', nip: '197306102001122003', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: 'yunita.jpg', urutan: 11 },
  { nama: 'Vera Christine Lasewa, S.PAR', nip: '198808022015032002', jabatan: 'Adyatama Kepariwisataan dan Ekonomi Kreatif', foto: null, urutan: 12 },
  { nama: 'Satrisni Bisno, SE', nip: '197710251999032005', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: 'satrisni.jpg', urutan: 13 },
  { nama: 'Max William Baginda, S.Sos., M.Si', nip: '197305142000031003', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: 'Max.jpg', urutan: 14 },
  { nama: 'Gafriani Lasawedi, SS., M.Si', nip: '197209181998032008', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: 'gafriani.jpg', urutan: 15 },
  { nama: 'Husen, S.Kom', nip: '197908112010011007', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', foto: 'husein.jpg', urutan: 16 },
];

// Modal Detail Profil Pimpinan
const PejabatDetailModal = ({ pejabat, detail, onClose, language }) => {
  const isEn = language === 'EN';
  const [activeTab, setActiveTab] = useState('identitas');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pejabat || !detail) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Banner Gradient */}
          <div className="relative bg-gradient-to-r from-[#1F5BA6] via-[#383087] to-[#5C2180] text-white p-6 sm:p-8 shrink-0">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-sm shadow-sm"
              title={isEn ? 'Close' : 'Tutup'}
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Photo with golden frame */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                <img
                  src={pejabat.foto ? `/images/ProfilPimpinan/${pejabat.foto}` : '/images/ProfilPimpinan/empty.png'}
                  alt={detail.nama}
                  onError={(e) => {
                    e.currentTarget.src = '/slider/Slider.jpg';
                  }}
                  className="w-full h-full object-cover rounded-2xl border-4 border-amber-400 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  {isEn ? 'Official' : 'Pimpinan'}
                </span>
              </div>

              {/* Identity summary */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
                  <ShieldCheck size={14} />
                  <span>{isEn ? detail.pangkatEn : detail.pangkat}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {detail.nama}
                </h2>
                <p className="text-amber-200 text-xs sm:text-sm font-semibold mt-1">
                  NIP. {detail.nip}
                </p>
                <p className="text-white/85 text-xs sm:text-sm mt-1 leading-snug">
                  {isEn ? detail.jabatanEn : detail.jabatan}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-white/15 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('identitas')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'identitas'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {isEn ? 'Identity & Rank' : 'Identitas & Pangkat'}
              </button>
              <button
                onClick={() => setActiveTab('pendidikan')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'pendidikan'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {isEn ? 'Education History' : 'Riwayat Pendidikan'}
              </button>
              <button
                onClick={() => setActiveTab('pengalaman')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'pengalaman'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {isEn ? 'Career & Experience' : 'Pengalaman Kerja'}
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {activeTab === 'identitas' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Ringkasan Peran */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isEn ? 'Leadership Role' : 'Deskripsi & Tugas Utama'}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {isEn ? detail.ringkasanEn : detail.ringkasan}
                  </p>
                </div>

                {/* Grid Identitas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Award size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">{isEn ? 'Rank / Grade' : 'Pangkat / Golongan'}</p>
                      <p className="text-sm font-bold text-navy-900">{isEn ? detail.pangkatEn : detail.pangkat}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Building2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">{isEn ? 'Agency / Office' : 'Unit Kerja'}</p>
                      <p className="text-sm font-bold text-navy-900">{isEn ? detail.unitKerjaEn : detail.unitKerja}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <GraduationCap size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">{isEn ? 'Highest Education' : 'Pendidikan Terakhir'}</p>
                      <p className="text-sm font-bold text-navy-900">{isEn ? detail.pendidikanTerakhirEn : detail.pendidikanTerakhir}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Calendar size={18} className="text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">{isEn ? 'Years of Service' : 'Masa Kerja'}</p>
                      <p className="text-sm font-bold text-navy-900">{isEn ? detail.masaKerjaEn : detail.masaKerja}</p>
                    </div>
                  </div>
                </div>

                {/* Diklat Kepemimpinan */}
                {detail.diklat && detail.diklat.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      {isEn ? 'Leadership Training & Certifications' : 'Diklat Kepemimpinan & Sertifikasi'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detail.diklat.map((d, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold border border-amber-200 shadow-2xs">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pendidikan' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {isEn ? 'Formal Education Timeline' : 'Riwayat Jenjang Pendidikan'}
                </p>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {detail.pendidikan.map((edu, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-primary-600 border-2 border-white shadow-xs" />
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors">
                        <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-800 font-bold text-[10px] uppercase">
                          {edu.jenjang}
                        </span>
                        <p className="font-bold text-slate-900 text-sm mt-1">{edu.institusi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'pengalaman' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {isEn ? 'Career History & Civil Service Experience' : 'Riwayat Jabatan & Pengalaman Kerja'}
                </p>
                <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {detail.pengalamanKerja.map((exp, idx) => {
                    const isCurrent = idx === detail.pengalamanKerja.length - 1;
                    return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                            isCurrent ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-slate-400'
                          }`}
                        />
                        <div
                          className={`p-3.5 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                              : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-bold ${isCurrent ? 'text-amber-950' : 'text-slate-800'}`}>
                              {exp.jabatan}
                            </p>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase shrink-0">
                                {isEn ? 'Active' : 'Saat Ini'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {detail.pdfUrl ? (
              <a
                href={detail.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs inline-flex items-center gap-2 py-2 px-4 shadow-sm"
              >
                <FileText size={15} />
                {isEn ? 'Download Official CV / Profile (PDF)' : 'Unduh Dokumen Profil Resmi (PDF)'}
              </a>
            ) : <div />}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Close' : 'Tutup'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ProfilPimpinan = ({ language: propLanguage }) => {
  const { language: contextLang } = useLanguage();
  const language = propLanguage || contextLang || 'ID';
  const isEn = language === 'EN';

  const [pejabat, setPejabat] = useState(DEFAULT_PEJABAT);
  const [loading, setLoading] = useState(true);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [selectedPejabat, setSelectedPejabat] = useState(null);

  const fetchPejabat = () => {
    setLoading(true);
    api.get('/profil/pejabat')
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setPejabat(res.data);
          setIsLiveFromDb(true);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat dari API /profil/pejabat, mencoba /profil/pejabat/all...', err);
        return api.get('/profil/pejabat/all').then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setPejabat(res.data);
            setIsLiveFromDb(true);
          }
        });
      })
      .catch((err) => {
        console.error('Tetap menggunakan data bawaan:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPejabat();
  }, []);

  const getInitials = (nama) =>
    nama.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');

  const getPhotoUrl = (foto) => {
    if (!foto) return null;
    if (foto.startsWith('http') || foto.startsWith('/')) return foto;
    return `/uploads/${foto}`;
  };

  // Cek apakah pejabat memiliki data profil lengkap (pejabat berlatar putih)
  const getDetail = (nip) => {
    if (!nip) return null;
    const cleanNip = String(nip).replace(/\s+/g, '');
    return DETAIL_PROFIL_PEJABAT[cleanNip] || null;
  };

  return (
    <>
      <Helmet>
        <title>{isEn ? 'Leadership Profile - Department of Tourism of Central Sulawesi' : 'Profil Pimpinan - Dinas Pariwisata Sulteng'}</title>
      </Helmet>

      <PageHeader
        badge={isEn ? "Department Leadership Profile" : "Profil Pimpinan Dinas"}
        title={isEn ? "Leadership Profile" : "Profil Pimpinan"}
        subtitle={isEn ? "Leadership Structure and Structural Officials of the Department of Tourism of Central Sulawesi Province" : "Struktur Kepemimpinan dan Pejabat Struktural Dinas Pariwisata Provinsi Sulawesi Tengah"}
        breadcrumbs={[
          { label: isEn ? 'Profile' : 'Profil', path: '/profil' },
          { label: isEn ? 'Leadership Profile' : 'Profil Pimpinan' }
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Header Actions */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <a
                href="/images/2026/Struktur_Organisasi_dan_Tugas_Fungsi_Dinas_Pariwisata.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Network size={18} /> {isEn ? 'View Organizational Structure' : 'Lihat Struktur Organisasi'}
              </a>
              <a
                href="/images/Kepegawaian/DUK_UPDATE_JANUARI_2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download size={18} /> {isEn ? 'Download DUK (Update 2025)' : 'Unduh DUK (Update 2025)'}
              </a>
            </div>
          </div>

          {/* Grid Pejabat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pejabat.map((p, idx) => {
              const photoUrl = getPhotoUrl(p.foto);
              const detail = getDetail(p.nip);
              const hasDetail = Boolean(detail);

              return (
                <motion.div
                  key={p.id || p.nip || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    if (hasDetail) setSelectedPejabat(p);
                  }}
                  className={`card p-5 text-center flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    hasDetail
                      ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary-400 group border-2 border-transparent'
                      : 'border border-slate-100 shadow-sm opacity-95'
                  }`}
                >
                  {/* Badge untuk pejabat yang memiliki detail (Latar Putih) */}
                  {hasDetail && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold border border-primary-200 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <Eye size={11} /> {isEn ? 'View Profile' : 'Profil Lengkap'}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={p.nama}
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallbackTried && p.foto) {
                              e.currentTarget.dataset.fallbackTried = 'true';
                              e.currentTarget.src = `/images/ProfilPimpinan/${p.foto}`;
                              return;
                            }
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.initials-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          className={`w-full h-full object-cover rounded-full border-4 shadow-md transition-transform duration-300 ${
                            hasDetail
                              ? 'border-amber-400 group-hover:scale-105'
                              : 'border-emerald-400'
                          }`}
                        />
                      ) : null}
                      <div
                        className="initials-fallback w-full h-full rounded-full bg-gradient-to-br from-primary-600 to-navy-800 border-4 border-gold-400 flex items-center justify-center text-white font-bold text-2xl shadow-md"
                        style={{ display: photoUrl ? 'none' : 'flex' }}
                      >
                        {getInitials(p.nama)}
                      </div>
                    </div>

                    <h3 className={`font-bold text-navy-900 text-sm mb-1 line-clamp-2 transition-colors ${
                      hasDetail ? 'group-hover:text-primary-600' : ''
                    }`}>
                      {p.nama}
                    </h3>

                    <p className="text-xs text-gray-500 mb-2">NIP. {p.nip || '-'}</p>

                    <p className="text-xs font-semibold text-primary-600 bg-primary-50 rounded-full px-3 py-1 inline-block">
                      {translateJabatan(p.jabatan, language)}
                    </p>
                  </div>

                  {/* Bagian Bawah Kartu */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center">
                    {hasDetail ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-primary-600 font-bold group-hover:underline">
                        <span>{isEn ? 'Click to see details' : 'Klik untuk rincian profil'}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">
                        {isEn ? 'Official Record' : 'Pejabat Struktural'}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Note Footer */}
          <div className="mt-10 p-4 bg-blue-50 border-l-4 border-primary-600 rounded-lg text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <Users size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <span>
                {isEn ? 'The officials above are directly integrated from the database system of the Department of Tourism of Central Sulawesi Province.' : 'Data pejabat di atas terintegrasi secara langsung dari database sistem Dinas Pariwisata Provinsi Sulawesi Tengah.'}
                {' '}
                {isEn ? 'For more information, please contact' : 'Untuk informasi lebih lanjut, silakan hubungi'} <a href="mailto:dispar@sultengprov.go.id" className="text-primary-600 underline">dispar@sultengprov.go.id</a>.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Modal Popup Rincian Profil Pimpinan */}
      {selectedPejabat && (
        <PejabatDetailModal
          pejabat={selectedPejabat}
          detail={getDetail(selectedPejabat.nip)}
          onClose={() => setSelectedPejabat(null)}
          language={language}
        />
      )}
    </>
  );
};

export default ProfilPimpinan;
