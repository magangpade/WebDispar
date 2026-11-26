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
import { useLanguage } from '../context/LanguageContext';
import { UI_STRINGS } from '../utils/translations';

const IMAGES = {
  news1: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  news2: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
  news3: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
  calendarBanner: '/images/banner-event-wisata-sulteng.jpg', // Gambar wisata Sulawesi Tengah (Jembatan & Laut Pesisir)
  videoPariwisata: 'https://i.ytimg.com/vi/voGg26hCInU/hqdefault.jpg',
  videoDesaWisata: 'https://i.ytimg.com/vi/42oGdqocrlw/hqdefault.jpg',
};

// ==========================================
// SECTION 1: WARTA PARIWISATA DAERAH (BERITA TERBARU)
// ==========================================
const getNewsTag = (b) => {
  if (b.kategori && b.kategori !== 'Berita' && b.kategori !== 'WARTA PARIWISATA') {
    return b.kategori;
  }
  const j = (b.judul || '').toUpperCase();
  if (j.includes('HARI PAHLAWAN')) return 'HARI PAHLAWAN';
  if (j.includes('PPID') || j.includes('TRANSPARANSI') || j.includes('KETERBUKAAN INFORMASI')) return 'INFORMASI PUBLIK';
  if (j.includes('PARIPURNA') || j.includes('KUA-PPAS') || j.includes('DPRD')) return 'RAPAT PARIPURNA';
  if (j.includes('NOMENKLATUR') || j.includes('EKONOMI KREATIF') || j.includes('EKRAF')) return 'EKONOMI KREATIF';
  if (j.includes('SP4N') || j.includes('LAPOR') || j.includes('PELAYANAN PUBLIK')) return 'PELAYANAN PUBLIK';
  if (j.includes('OTONOMI DAERAH') || j.includes('OTDA')) return 'OTONOMI DAERAH';
  if (j.includes('BMKG') || j.includes('MITIGASI')) return 'MITIGASI & BMKG';
  if (j.includes('RENUNGAN SUCI') || j.includes('HUT KE-81 RI') || j.includes('HUT RI') || j.includes('KEMERDEKAAN')) return 'HUT RI';
  if (j.includes('SELEKSI JPT') || j.includes('ASN') || j.includes('PEGAWAI')) return 'KEPEGAWAIAN';
  if (j.includes('GUANGZHOU') || j.includes('CHARTER FLIGHT') || j.includes('PENERBANGAN')) return 'KONEKTIVITAS';
  if (j.includes('KPK') || j.includes('KORUPSI')) return 'TATA KELOLA';
  if (j.includes('INVESTASI') || j.includes('UEA')) return 'INVESTASI';
  if (j.includes('DANAU LINDU') || j.includes('FDL')) return 'FESTIVAL DANAU LINDU';
  if (j.includes('BUYA SUBI') || j.includes('TENUN')) return 'TENUN DONGGALA';
  if (j.includes('FESTIVAL') || j.includes('FEST') || j.includes('KARNAVAL')) return 'FESTIVAL DAERAH';
  if (j.includes('HUT PROVINSI') || j.includes('HUT SULTENG') || j.includes('HUT KE-62')) return 'HUT SULTENG';
  if (j.includes('PARALAYANG') || j.includes('SERTIFIKASI') || j.includes('SDM')) return 'SDM PARIWISATA';
  if (j.includes('DESA WISATA')) return 'DESA WISATA';
  if (j.includes('BAHARI') || j.includes('PANTAI') || j.includes('PULAU')) return 'DESTINASI BAHARI';
  if (j.includes('MEGALIT')) return 'CAGAR BUDAYA';
  return b.kategori || 'WARTA DAERAH';
};

const getTagColor = (tag = '') => {
  const t = tag.toUpperCase();
  if (t.includes('PAHLAWAN') || t.includes('HUT RI') || t.includes('KEMERDEKAAN')) {
    return 'bg-[#DC2626]'; // Merah patriotik
  }
  if (t.includes('INFORMASI') || t.includes('PPID') || t.includes('PELAYANAN')) {
    return 'bg-[#059669]'; // Hijau informasi/pelayanan publik
  }
  if (t.includes('PARIPURNA') || t.includes('DPRD') || t.includes('PEMDA') || t.includes('KINERJA')) {
    return 'bg-[#0F172A]'; // Dark Navy elegan formal
  }
  if (t.includes('EKONOMI') || t.includes('EKRAF') || t.includes('INVESTASI') || t.includes('KONEKTIVITAS')) {
    return 'bg-[#2563EB]'; // Biru dinamis
  }
  if (t.includes('FESTIVAL') || t.includes('TENUN') || t.includes('BUDAYA') || t.includes('EVENT')) {
    return 'bg-[#D97706]'; // Amber festival seni budaya
  }
  if (t.includes('BAHARI') || t.includes('WISATA') || t.includes('DESTINASI')) {
    return 'bg-[#0284C7]'; // Sky blue destinasi alam
  }
  return 'bg-[#1E293B]'; // Slate dark navy
};

const LatestNewsSection = ({ berita, loading, strings, isEn }) => {
  const [newsPage, setNewsPage] = useState(0);
  const fallbackNews = [
    {
      image: IMAGES.news1,
      tag: 'HARI PAHLAWAN',
      tagColor: 'bg-[#DC2626]',
      title: 'Dinas Pariwisata Sulteng Hadiri Upacara Hari Pahlawan 2026: Gelorakan Semangat Perjuangan Lewat Pembangunan',
      date: '10 November 2026',
    },
    {
      image: IMAGES.news2,
      tag: 'INFORMASI PUBLIK',
      tagColor: 'bg-[#059669]',
      title: 'Perkuat Transparansi Informasi Publik, PPID Utama Diskominfo Sulteng Gelar Monitoring dan Evaluasi di Dinas Pariwisata',
      date: '2 November 2026',
    },
    {
      image: IMAGES.news3,
      tag: 'RAPAT PARIPURNA',
      tagColor: 'bg-[#0F172A]',
      title: 'Kadis Pariwisata Sulteng Hadiri Rapat Paripurna DPRD Bahas Perubahan KUA-PPAS 2026',
      date: '27 Agustus 2026',
    },
  ];

  const getNewsImage = (b, idx) => {
    const img = b.gambar || b.foto;
    if (!img) return fallbackNews[idx % 3].image;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `/uploads/${img}`;
  };

  const totalPages = berita.length > 0 ? Math.max(1, Math.ceil(berita.length / 3)) : 1;
  const safePage = Math.min(newsPage, totalPages - 1);

  const newsItems = berita.length > 0
    ? berita.slice(safePage * 3, safePage * 3 + 3).map((b, idx) => {
        const tag = getNewsTag(b);
        return {
          image: getNewsImage(b, idx),
          tag,
          tagColor: getTagColor(tag),
          title: b.judul,
          date: new Date(b.tanggal || b.created_at || Date.now()).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          slug: b.slug,
        };
      })
    : fallbackNews;

  return (
    <section className="flex flex-col gap-5 w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[#D97706] font-bold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>{strings?.regionalNewsTag || 'WARTA PARIWISATA DAERAH'}</span>
          </div>
          <h2 className="text-[#0F172A] text-2xl font-extrabold tracking-tight">
            {strings?.latestNews || 'Berita Terbaru'}
          </h2>
        </div>

        {/* Pagination Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNewsPage((p) => (p - 1 + totalPages) % totalPages)}
            disabled={totalPages <= 1}
            aria-label={isEn ? 'Previous news' : 'Berita sebelumnya'}
            className="w-9 h-9 rounded-lg bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setNewsPage((p) => (p + 1) % totalPages)}
            disabled={totalPages <= 1}
            aria-label={isEn ? 'Next news' : 'Berita berikutnya'}
            className="w-9 h-9 rounded-lg bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-default"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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
                  loading="lazy"
                  decoding="async"
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
const AgendaAndIKMSection = ({ strings, isEn }) => {
  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-0.5">
        <span className="text-[#D97706] font-bold text-xs tracking-wider uppercase">
          {strings?.servicesTag || 'PELAYANAN & KEGIATAN'}
        </span>
        <h2 className="text-[#0F172A] text-2xl font-extrabold tracking-tight">
          {strings?.servicesTitle || 'Agenda Kegiatan & Kepuasan Publik'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Banner Kalender Event Daerah (Kiri) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.7)] min-h-[340px] flex flex-col justify-between p-8 group">
          <img
            src={IMAGES.calendarBanner}
            alt="Kalender Event Wisata Sulawesi Tengah"
            className="absolute inset-0 w-full h-full object-cover filter blur-[2.5px] scale-105 group-hover:scale-110 transition-transform duration-700 select-none"
          />
          {/* Glassmorphic frosted layer - 100% uniform across the entire image (sama rata) */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/35 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/80 shadow-xs">
              <img
                src="/dinas-pariwisata-logo-clean.png"
                alt="Logo Dinas Pariwisata Sulteng"
                className="h-7 w-auto object-contain shrink-0 drop-shadow-xs"
              />
              <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">{strings?.disparSulteng || 'DINAS PARIWISATA SULTENG'}</span>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/80 text-amber-800 font-bold text-xs shadow-xs">
              {strings?.year2026 || 'Tahun 2026'}
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-2.5 my-auto max-w-lg">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              {isEn ? (
                <>
                  Regional Event <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
                    Calendar
                  </span>
                </>
              ) : (
                <>
                  Kalender <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
                    Event Daerah
                  </span>
                </>
              )}
            </h3>
            <p className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              {strings?.calendarDesc || 'Provinsi Sulawesi Tengah — Beragam festival budaya, karnaval bahari, dan atraksi tradisi tahun berjalan.'}
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <Link
              to="/info-pariwisata/pemasaran/kalender-event"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white font-bold text-xs md:text-sm shadow-md hover:shadow-xl transition-all hover:gap-3 group-hover:scale-[1.02] border border-white/20"
            >
              <span>{strings?.exploreAllAgenda || 'Jelajahi Semua Agenda'}</span>
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
const StatisticsAndVideosSection = ({ stats, strings, isEn }) => {
  const domestic = stats?.domestic ?? 11668933;
  const international = stats?.international ?? 28165;
  const tahun = stats?.tahun || '2025';
  const growth = stats?.growth ?? 26.6;
  const total = domestic + international;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
      {/* Kolom Kiri: Statistik Wisatawan Card */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col justify-between gap-5 group hover:border-primary-400 transition-all duration-300">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[#D97706] font-bold text-[10px] tracking-wider uppercase">
              {strings?.officialDataTag || 'DATA BERKALA RESMI'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              +{growth}% vs {stats?.prevTahun || '2023'}
            </span>
          </div>
          <h3 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
            {strings?.touristStats || 'Statistik Wisatawan'}
          </h3>
          <p className="text-[#94A3B8] text-xs">
            {strings?.touristStatsDesc || 'Realisasi kunjungan wisatawan resmi Dispar Sulteng'}
          </p>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] text-xs font-bold text-[#94A3B8]">
          <span>{strings?.visitorCategory || 'Kategori Wisatawan'}</span>
          <span className="text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md font-semibold">
            {strings?.period || 'Periode'} {tahun}
          </span>
        </div>

        {/* Baris Domestik (Wisnus) */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-sky-50/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
              <Building2 className="w-5 h-5 text-sky-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#0F172A] leading-tight">
                {domestic.toLocaleString(isEn ? 'en-US' : 'id-ID')}
              </span>
              <span className="text-[#64748B] text-xs font-medium">{strings?.domesticVisitors || 'Nusantara (Domestik)'}</span>
            </div>
          </div>
          {/* Persentase */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-sky-700">
              {total > 0 ? ((domestic / total) * 100).toFixed(1) : 99.7}%
            </span>
            <span className="text-[10px] text-slate-400">{strings?.share || 'Pangsa'}</span>
          </div>
        </div>

        {/* Baris Internasional (Wisman) */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-amber-50/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Globe className="w-5 h-5 text-[#D97706]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#0F172A] leading-tight">
                {international.toLocaleString(isEn ? 'en-US' : 'id-ID')}
              </span>
              <span className="text-[#64748B] text-xs font-medium">{strings?.internationalVisitors || 'Mancanegara (Internasional)'}</span>
            </div>
          </div>
          {/* Persentase */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-amber-700">
              {total > 0 ? ((international / total) * 100).toFixed(1) : 0.3}%
            </span>
            <span className="text-[10px] text-slate-400">{strings?.share || 'Pangsa'}</span>
          </div>
        </div>

        {/* Tombol Tautan ke Halaman Statistik Lengkap */}
        <Link
          to="/info-pariwisata/pemasaran/statistik-kunjungan"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-sky-50 border border-primary-200 text-primary-700 hover:from-primary-600 hover:to-navy-800 hover:text-white transition-all duration-300 font-semibold text-xs group/btn shadow-xs"
        >
          <span>{strings?.openFullStats || 'Buka Analisis & Grafik Lengkap'} ({tahun})</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        {/* Sumber Info */}
        <div className="flex items-center gap-2 pt-1 text-[#94A3B8] text-[11px] border-t border-slate-100">
          <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
          <span>{strings?.statsSource || 'Sumber: Dokumen Resmi Analisis Dispar & BPS Sulteng'}</span>
        </div>
      </div>

      {/* Kolom Kanan: Dokumentasi Visual Video Pariwisata */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col justify-between gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[#D97706] font-bold text-[10px] tracking-wider uppercase">
              {strings?.visualDocTag || 'DOKUMENTASI VISUAL'}
            </span>
            <h3 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
              {strings?.videoTitle || 'Video Pariwisata & Desa Wisata'}
            </h3>
            <p className="text-[#94A3B8] text-xs max-w-md">
              {strings?.videoDesc || 'Sinematik keajaiban alam, ragam tradisi, dan daya tarik desa wisata unggulan Sulawesi Tengah'}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-bold text-center leading-tight">
            {strings?.videoGallery || 'Galeri Video'}
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
                {strings?.video1Title || 'Video Pariwisata Sulawesi Tengah'}
              </h4>
              <p className="text-[#64748B] text-xs line-clamp-2">
                {strings?.video1Desc || 'Tonton dokumentasi pariwisata langsung di YouTube.'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-[#D97706] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {strings?.regionalProfile || 'Profil Daerah'}
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
                {strings?.video2Title || 'Video Desa Wisata Sulawesi Tengah'}
              </h4>
              <p className="text-[#64748B] text-xs line-clamp-2">
                {strings?.video2Desc || 'Tonton dokumentasi desa wisata langsung di YouTube.'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-[#059669] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {strings?.exploreVillage || 'Jelajah Desa'}
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
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const strings = UI_STRINGS[language] || UI_STRINGS.ID;

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
        <title>
          {isEn
            ? 'Department of Tourism Central Sulawesi - Official Portal'
            : 'Dinas Pariwisata Provinsi Sulawesi Tengah - Portal Resmi'}
        </title>
        <meta
          name="description"
          content={
            isEn
              ? 'Official portal of the Department of Tourism of Central Sulawesi Province. Information on tourist destinations, event calendar, regional tourism news, and public services.'
              : 'Portal resmi Dinas Pariwisata Provinsi Sulawesi Tengah. Informasi destinasi wisata, kalender event, warta pariwisata daerah, dan pelayanan publik.'
          }
        />
      </Helmet>

      {/* Hero Banner Slider */}
      <Hero />

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-10">
        <LatestNewsSection berita={berita} loading={loading} strings={strings} isEn={isEn} />
        <AgendaAndIKMSection strings={strings} isEn={isEn} />
        <StatisticsAndVideosSection stats={stats} strings={strings} isEn={isEn} />
      </div>
    </>
  );
};

export default Home;
