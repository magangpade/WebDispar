import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: '/images/slider2/62_sulteng-dispar_2026_edit_copy_2.jpg',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/slider2/62_sulteng-dispar_2026_edit_copy_2.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'Dinas Pariwisata Sulawesi Tengah 2026',
    title: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    subtitle: 'Mewujudkan Pariwisata Sulteng yang Maju, Berdaya Saing, dan Berkelanjutan',
    link: '#',
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/komitmen-ppid.jpg',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/komitmen-ppid.jpg',
    fallbackImage: '/images/2026/desk_ppid.jpg',
    alt: 'Komitmen Keterbukaan Informasi Publik PPID',
    title: 'Komitmen Keterbukaan Informasi Publik',
    subtitle: 'Layanan Transparan, Akuntabel, dan Terpercaya',
    link: '/ppid',
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/SLIDER-PPID.jpg',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/SLIDER-PPID.jpg',
    fallbackImage: '/images/2026/MONEV_PPID_Diskominfo.jpeg',
    alt: 'PPID Dinas Pariwisata Sulawesi Tengah',
    title: 'PPID Dinas Pariwisata Sulteng',
    subtitle: 'Akses Dokumen, Regulasi, dan Pelayanan Informasi Publik',
    link: '/ppid',
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/slider2/iku_dispar_26.jpg',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/slider2/iku_dispar_26.jpg',
    fallbackImage: '/images/2026/Gemini_Generated_Image_wtrawnwtrawnwtra.png',
    alt: 'Indikator Kinerja Utama Dispar 2026',
    title: 'Indikator Kinerja Utama (IKU) 2026',
    subtitle: 'Target dan Capaian Pembangunan Kepariwisataan',
    link: '#',
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/command_center_-_berani_samporoa_2025_edit.jpg',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/command_center_-_berani_samporoa_2025_edit.jpg',
    fallbackImage: '/images/2026/struktur_organisasi_2026_copy.jpg',
    alt: 'Command Center Berani Samporoa',
    title: 'Command Center BERANI - SAMPOROA',
    subtitle: 'Hotline Layanan Cepat Tanggap Pariwisata Sulteng',
    link: 'https://wa.me/08116662222',
    isExternal: true,
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/2025/sp4l-2025.png',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/2025/sp4l-2025.png',
    fallbackImage: '/images/SP4N-LAPOR-768x500.jpg',
    alt: 'SP4N-LAPOR Pengaduan Pelayanan Publik',
    title: 'Layanan Aspirasi & Pengaduan SP4N-LAPOR',
    subtitle: 'Sampaikan Aspirasi dan Laporan Anda Secara Online',
    link: 'https://www.lapor.go.id/instansi/pemerintah-provinsi-sulawesi-tengah',
    isExternal: true,
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/no_4_1.png',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/no_4_1.png',
    fallbackImage: '/images/2025/Anti_Korupsi1.jpg',
    alt: 'Kampanye Pariwisata Anti Korupsi',
    title: 'Pariwisata Berintegritas & Anti Korupsi',
    subtitle: 'Menjaga Tata Kelola Pemerintahan yang Bersih dan Berwibawa',
    link: '#',
  },
  {
    image: 'https://pariwisata.sultengprov.go.id/images/cekidot.jpg',
    remoteImage: 'https://pariwisata.sultengprov.go.id/images/cekidot.jpg',
    fallbackImage: '/images/2025/Sisparnas2.jpg',
    alt: 'Aplikasi Cekidot Persuratan Dispar',
    title: 'Layanan Cekidot Dispar Sulteng',
    subtitle: 'Digitalisasi Persuratan dan Pelayanan Dinas',
    link: 'https://cekidot.dispar.my.id/kirim-surat',
    isExternal: true,
  },
];

const AUTOPLAY_INTERVAL = 5000;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (isPaused || SLIDES.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  const slide = SLIDES[current] ?? SLIDES[0];

  return (
    <section
      aria-label="Hero Banner"
      className="relative w-full aspect-[12/5] max-h-[800px] bg-slate-950 overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Background Image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              const fallback = slide.fallbackImage || '/slider/Slider.jpg';
              if (!e.currentTarget.src.endsWith(fallback)) {
                e.currentTarget.src = fallback;
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Glass Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="group z-20 absolute left-3 md:left-6 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-white/25 to-white/5 hover:from-white/35 hover:to-white/10 border border-white/30 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="group z-20 absolute right-3 md:right-6 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-white/25 to-white/5 hover:from-white/35 hover:to-white/10 border border-white/30 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="z-20 absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15">
        {SLIDES.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}: ${s.title}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <motion.div
          key={`progress-${current}`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-amber-400 z-20"
        />
      )}
    </section>
  );
};

export default Hero;
