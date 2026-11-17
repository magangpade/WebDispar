import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: '/images/slider2/62_sulteng-dispar_2026_edit_copy_2.jpg',
    alt: 'Dinas Pariwisata Sulawesi Tengah 2026',
    title: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    subtitle: 'Mewujudkan Pariwisata Sulteng yang Maju, Berdaya Saing, dan Berkelanjutan',
    link: '#',
  },
  {
    image: '/images/komitmen-ppid.jpg',
    alt: 'Komitmen Keterbukaan Informasi Publik PPID',
    title: 'Komitmen Keterbukaan Informasi Publik',
    subtitle: 'Layanan Transparan, Akuntabel, dan Terpercaya',
    link: '/ppid',
  },
  {
    image: '/images/SLIDER-PPID.jpg',
    alt: 'PPID Dinas Pariwisata Sulawesi Tengah',
    title: 'PPID Dinas Pariwisata Sulteng',
    subtitle: 'Akses Dokumen, Regulasi, dan Pelayanan Informasi Publik',
    link: '/ppid',
  },
  {
    image: '/images/slider2/iku_dispar_26.jpg',
    alt: 'Indikator Kinerja Utama Dispar 2026',
    title: 'Indikator Kinerja Utama (IKU) 2026',
    subtitle: 'Target dan Capaian Pembangunan Kepariwisataan',
    link: '#',
  },
  {
    image: '/images/command_center_-_berani_samporoa_2025_edit.jpg',
    alt: 'Command Center Berani Samporoa',
    title: 'Command Center BERANI - SAMPOROA',
    subtitle: 'Hotline Layanan Cepat Tanggap Pariwisata Sulteng',
    link: 'https://wa.me/08116662222',
    isExternal: true,
  },
  {
    image: '/images/2025/sp4l-2025.png',
    alt: 'SP4N-LAPOR Pengaduan Pelayanan Publik',
    title: 'Layanan Aspirasi & Pengaduan SP4N-LAPOR',
    subtitle: 'Sampaikan Aspirasi dan Laporan Anda Secara Online',
    link: 'https://www.lapor.go.id/instansi/pemerintah-provinsi-sulawesi-tengah',
    isExternal: true,
  },
  {
    image: '/images/no_4_1.png',
    alt: 'Kampanye Pariwisata Anti Korupsi',
    title: 'Pariwisata Berintegritas & Anti Korupsi',
    subtitle: 'Menjaga Tata Kelola Pemerintahan yang Bersih dan Berwibawa',
    link: '#',
  },
  {
    image: '/images/cekidot.jpg',
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
      className="relative w-full h-[400px] md:h-[480px] bg-[#0F172A] overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Background Image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.88, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = '/slider/Slider.jpg';
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Glass Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="group z-20 absolute left-4 md:left-6 w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="group z-20 absolute right-4 md:right-6 w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </button>

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
