import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Play,
  Building2, Globe, TrendingUp, Sparkles, MapPin, Eye
} from 'lucide-react';
import Hero from '../components/Hero';
import IKMChart from '../components/IKMChart';
import api from '../services/api';

const IMAGES = {
  news1: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  news2: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
  news3: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
  calendarBanner: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  videoPariwisata: 'https://i.ytimg.com/vi/voGg26hCInU/hqdefault.jpg',
  videoDesaWisata: 'https://i.ytimg.com/vi/42oGdqocrlw/hqdefault.jpg',
};

// ==========================================
// SECTION 1: WARTA PARIWISATA DAERAH (BERITA TERBARU)
// ==========================================
const LatestNewsSection = ({ berita, loading }) => {
  const fallbackNews = [
    {
      image: IMAGES.news1,
      tag: 'PEMERINTAHAN',
      tagColor: 'bg-[#0F172A]',
      title: 'Kadis Pariwisata Sulteng Pimpin Rapat Koordinasi…',
      date: '17 Agustus 2024',
    },
    {
      image: IMAGES.news2,
      tag: 'KEMERDEKAAN',
      tagColor: 'bg-[#DC2626]',
      title: 'Semangat Kemerdekaan Menggelora di Sektor Pariwisata',
      date: '17 Agustus 2024',
    },
    {
      image: IMAGES.news3,
      tag: 'DESTINASI BAHARI',
      tagColor: 'bg-[#2563EB]',
      title: 'Semangat Kemerdekaan Menggelora di Sektor Pariwisata',
      date: '17 Agustus 2024',
    },
  ];

  const getNewsImage = (b, idx) => {
    const img = b.gambar || b.foto;
    if (!img) return fallbackNews[idx % 3].image;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `/uploads/${img}`;
  };

  const newsItems = berita.length > 0
    ? berita.slice(0, 3).map((b, idx) => ({
        image: getNewsImage(b, idx),
        tag: b.kategori || fallbackNews[idx % 3].tag,
        tagColor: idx === 0 ? 'bg-[#0F172A]' : idx === 1 ? 'bg-[#DC2626]' : 'bg-[#2563EB]',
        title: b.judul,
        date: new Date(b.tanggal || b.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        slug: b.slug,
      }))
    : fallbackNews;

  return (
    <section className="flex flex-col gap-5 w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[#D97706] font-bold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>WARTA PARIWISATA DAERAH</span>
          </div>
          <h2 className="text-[#0F172A] text-2xl font-extrabold tracking-tight">
            Berita Terbaru
          </h2>
        </div>

        {/* Pagination Arrows */}
        <div className="flex items-center gap-2">
          <Link
            to="/berita"
            className="w-9 h-9 rounded-lg bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <Link
            to="/berita"
            className="w-9 h-9 rounded-lg bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Grid 3 Kartu Berita */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((news, idx) => (
            <article
              key={idx}
              className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 px-2.5 py-1 text-white font-bold text-[10px] tracking-wider rounded-md backdrop-blur-xs ${news.tagColor}`}>
                  {news.tag}
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                {news.slug ? (
                  <Link to={`/berita/${news.slug}`}>
                    <h3 className="font-bold text-[#1E293B] text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="font-bold text-[#1E293B] text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                )}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-[#94A3B8] text-xs font-medium">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{news.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

// ==========================================
// SECTION 2: PELAYANAN & KEGIATAN KALENDER
// ==========================================
const AgendaAndIKMSection = () => {
  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-0.5">
        <span className="text-[#D97706] font-bold text-xs tracking-wider uppercase">
          PELAYANAN &amp; KEGIATAN
        </span>
        <h2 className="text-[#0F172A] text-2xl font-extrabold tracking-tight">
          Agenda Kegiatan &amp; Kepuasan Publik
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Banner Kalender Event Daerah (Kiri) */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-h-[320px] bg-gradient-to-r from-amber-50 to-orange-100 flex flex-col justify-between p-8 group">
          <img
            src={IMAGES.calendarBanner}
            alt="Kalender Event Sulawesi Tengah"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-25 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/dinas pariwisata-COLOR WHITE.png" alt="Logo" className="h-8 w-auto invert drop-shadow" />
              <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">DINAS PARIWISATA SULTENG</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-800 font-bold text-xs">
              Tahun 2026
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-2 my-auto">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              Kalender <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Event Daerah
              </span>
            </h3>
            <p className="text-xs md:text-sm text-slate-600 max-w-md font-medium">
              Provinsi Sulawesi Tengah — Beragam festival budaya, karnaval bahari, dan atraksi tradisi tahun berjalan.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <Link
              to="/info-pariwisata/pemasaran/kalender-event"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:gap-3"
            >
              <span>Jelajahi Semua Agenda</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Gauge Card Kepuasan IKM (Kanan) */}
        <div className="lg:col-span-4 flex">
          <IKMChart />
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 3: STATISTIK WISATAWAN & VIDEO TOURISM
// ==========================================
const StatisticsAndVideosSection = ({ stats }) => {
  const domestic = stats?.domestic ?? 56348;
  const international = stats?.international ?? 1887;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
      {/* Kolom Kiri: Statistik Wisatawan Card */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-[#D97706] font-bold text-[10px] tracking-wider uppercase">
            DATA BERKALA
          </span>
          <h3 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
            Statistik Wisatawan
          </h3>
          <p className="text-[#94A3B8] text-xs">
            Estimasi kunjungan wisatawan tahun berjalan
          </p>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] text-xs font-bold text-[#94A3B8]">
          <span>Wisata Status</span>
          <span>Periode 2024</span>
        </div>

        {/* Baris Domestik */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-700">
              <Building2 className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#0F172A] leading-tight">
                {domestic.toLocaleString('id-ID')}
              </span>
              <span className="text-[#64748B] text-xs font-medium">Domestic</span>
            </div>
          </div>
          {/* Grafik Bar Mini */}
          <div className="flex items-end gap-1 h-7">
            <div className="w-1.5 h-3 rounded-xs bg-[#FBBF24]" />
            <div className="w-1.5 h-6 rounded-xs bg-[#1E293B]" />
            <div className="w-1.5 h-4 rounded-xs bg-[#3B82F6]" />
          </div>
        </div>

        {/* Baris Internasional */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Globe className="w-5 h-5 text-[#D97706]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#0F172A] leading-tight">
                {international.toLocaleString('id-ID')}
              </span>
              <span className="text-[#64748B] text-xs font-medium">International</span>
            </div>
          </div>
          {/* Grafik Bar Mini */}
          <div className="flex items-end gap-1 h-7">
            <div className="w-1.5 h-3 rounded-xs bg-[#2DD4BF]" />
            <div className="w-1.5 h-7 rounded-xs bg-[#0F172A]" />
            <div className="w-1.5 h-5 rounded-xs bg-[#FBBF24]" />
          </div>
        </div>

        {/* Sumber Info */}
        <div className="flex items-center gap-2 pt-2 text-[#94A3B8] text-[11px]">
          <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
          <span>Sumber: Sistem Informasi Kepariwisataan Sulawesi Tengah</span>
        </div>
      </div>

      {/* Kolom Kanan: Dokumentasi Visual Video Pariwisata */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col justify-between gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[#D97706] font-bold text-[10px] tracking-wider uppercase">
              DOKUMENTASI VISUAL
            </span>
            <h3 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
              Video Pariwisata &amp; Desa Wisata
            </h3>
            <p className="text-[#94A3B8] text-xs max-w-md">
              Sinematik keajaiban alam, ragam tradisi, dan daya tarik desa wisata unggulan Sulawesi Tengah
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-bold text-center leading-tight">
            Galeri<br />Video
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Video 1 */}
          <article className="flex flex-col rounded-xl overflow-hidden border border-[#F1F5F9] bg-white group">
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              <img
                src={IMAGES.videoPariwisata}
                alt="Thumbnail video pariwisata Sulawesi Tengah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-black/25" />
              {/* Tag Pariwisata Sulteng */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[#FCD34D] text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                PARIWISATA SULTENG
              </span>
              {/* Play Button */}
              <a
                href="https://www.youtube.com/watch?v=voGg26hCInU"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Putar video pariwisata di YouTube"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-12 h-10 rounded-xl bg-[#DC2626] hover:scale-110 transition-transform shadow-lg flex items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </a>
            </div>
            <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
              <h4 className="font-bold text-[#1E293B] text-sm leading-snug line-clamp-1">
                Video Pariwisata Sulawesi Tengah
              </h4>
              <p className="text-[#64748B] text-xs line-clamp-2">
                Tonton dokumentasi pariwisata langsung di YouTube.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-[#D97706] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Profil Daerah
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#EF4444] text-white font-bold text-[10px]">
                  YouTube
                </span>
              </div>
            </div>
          </article>

          {/* Video 2 */}
          <article className="flex flex-col rounded-xl overflow-hidden border border-[#F1F5F9] bg-white group">
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              <img
                src={IMAGES.videoDesaWisata}
                alt="Thumbnail video desa wisata Sulawesi Tengah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-black/25" />
              {/* Tag Desa Wisata */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-900/90 backdrop-blur-xs text-[#A7F3D0] text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                DESA WISATA
              </span>
              {/* Play Button */}
              <a
                href="https://www.youtube.com/watch?v=42oGdqocrlw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Putar video desa wisata di YouTube"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-12 h-10 rounded-xl bg-[#DC2626] hover:scale-110 transition-transform shadow-lg flex items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </a>
            </div>
            <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
              <h4 className="font-bold text-[#1E293B] text-sm leading-snug line-clamp-1">
                Video Desa Wisata Sulawesi Tengah
              </h4>
              <p className="text-[#64748B] text-xs line-clamp-2">
                Tonton dokumentasi desa wisata langsung di YouTube.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-[#059669] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Jelajah Desa
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#EF4444] text-white font-bold text-[10px]">
                  YouTube
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// HOME PAGE ROOT
// ==========================================
const Home = () => {
  const [berita, setBerita] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/berita?limit=6').catch(() => ({ data: { data: [] } })),
      api.get('/statistik/wisatawan').catch(() => ({ data: null })),
    ])
      .then(([beritaRes, statsRes]) => {
        setBerita(beritaRes.data?.data || []);
        setStats(statsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Dinas Pariwisata Provinsi Sulawesi Tengah - Portal Resmi</title>
        <meta
          name="description"
          content="Portal resmi Dinas Pariwisata Provinsi Sulawesi Tengah. Informasi destinasi wisata, kalender event, warta pariwisata daerah, dan pelayanan publik."
        />
      </Helmet>

      {/* Hero Banner Slider */}
      <Hero />

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-10">
        <LatestNewsSection berita={berita} loading={loading} />
        <AgendaAndIKMSection />
        <StatisticsAndVideosSection stats={stats} />
      </div>
    </>
  );
};

export default Home;
