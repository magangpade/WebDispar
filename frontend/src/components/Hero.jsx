import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { getImageSrc } from '../utils/imageHelper';

const SLIDES = [
  {
    isDual: true,
    alt: 'Dinas Pariwisata Provinsi Sulawesi Tengah - Destinasi Wisata Unggulan',
    title: 'Destinasi Wisata Unggulan Sulawesi Tengah',
    subtitle: 'Pesona Megalit, Bukit Selena, Danau Paisupok, Lore Lindu, dan Kepulauan Togean',
    link: '/info-pariwisata/destinasi/daya-tarik-wisata',
  },
  {
    image: '/images/slider/slider-1-kantor-dispar.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'Kantor Dinas Pariwisata Provinsi Sulawesi Tengah',
    title: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    subtitle: 'Mewujudkan Pariwisata Sulteng yang Maju, Berdaya Saing, dan Berkelanjutan',
    link: '/profil/sejarah',
  },
  {
    image: '/images/slider/slider2.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'Komitmen Keterbukaan Informasi Publik PPID',
    title: 'Komitmen Keterbukaan Informasi Publik',
    subtitle: 'Layanan Transparan, Akuntabel, dan Terpercaya',
    link: '/ppid',
  },
  {
    image: '/images/slider/slider3.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'PPID Dinas Pariwisata Sulawesi Tengah',
    title: 'PPID Dinas Pariwisata Sulteng',
    subtitle: 'Akses Dokumen, Regulasi, dan Pelayanan Informasi Publik',
    link: '/ppid',
  },
  {
    image: '/images/slider/slider4.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'Indikator Kinerja Utama Dispar 2026',
    title: 'Indikator Kinerja Utama (IKU) 2026',
    subtitle: 'Target dan Capaian Pembangunan Kepariwisataan',
    link: '/ppid/informasi-secara-berkala?kategori=dokumen-sakip&sub=iku',
  },
  {
    image: '/images/slider/slider5.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'Command Center Berani Samporoa',
    title: 'Command Center BERANI - SAMPOROA',
    subtitle: 'Hotline Layanan Cepat Tanggap Pariwisata Sulteng',
    link: 'https://wa.me/628116662222',
    isExternal: true,
  },
  {
    image: '/images/slider/slider6.png',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'SP4N-LAPOR Pengaduan Pelayanan Publik',
    title: 'Layanan Aspirasi & Pengaduan SP4N-LAPOR',
    subtitle: 'Sampaikan Aspirasi dan Laporan Anda Secara Online',
    link: 'https://www.lapor.go.id',
    isExternal: true,
  },
  {
    image: '/images/slider/slider7.jpg',
    fallbackImage: '/images/slider/slider7.png',
    alt: 'Kampanye Pariwisata Anti Korupsi',
    title: 'Pariwisata Berintegritas & Anti Korupsi',
    subtitle: 'Menjaga Tata Kelola Pemerintahan yang Bersih dan Berwibawa',
    link: '/ppid/profil/maklumat-pelayanan',
  },
  {
    image: '/images/slider/slider8.jpg',
    fallbackImage: '/slider/Slider.jpg',
    alt: 'Aplikasi Cekidot Persuratan Dispar',
    title: 'Layanan Cekidot Dispar Sulteng',
    subtitle: 'Digitalisasi Persuratan dan Pelayanan Dinas',
    link: 'https://cekidot.dispar.my.id/kirim-surat',
    isExternal: true,
  },
];

const AUTOPLAY_INTERVAL = 5000;
const DUAL_SLIDE_DURATION = 11000;
const SUB_SCENE_INTERVAL = 5500;

// Konstanta sinkronisasi gelombang animasi sweep huruf agar ke-3 baris bergerak serempak & seimbang
const SWEEP_TRAVEL_TIME = 1.55;
const SWEEP_GLOW_DURATION = 1.05;
const SWEEP_REPEAT_DELAY = 2.75;

// Vektor SVG Ultra-HD (4K/8K) untuk tipografi khas "DINAS PARIWISATA"
// Mempertahankan gaya font yang sama persis tanpa pecah piksel/blur & mendukung sweep per-huruf tanpa kotak
const DINAS_GLYPHS = {
  D: {
    w: 28,
    d: 'M 0 2 H 13.2 C 21.8 2 28 7.6 28 16 C 28 24.4 21.8 30 13.2 30 H 0 Z M 8 6.4 V 25.6 H 12.6 C 17.4 25.6 20 21.8 20 16 C 20 10.2 17.4 6.4 12.6 6.4 Z',
  },
  I: {
    w: 8,
    d: 'M 0 2 H 8 V 30 H 0 Z',
  },
  N: {
    w: 26,
    d: 'M 0 2 H 7.4 L 21.2 19.8 V 2 H 26 V 30 H 18.8 L 4.8 11.8 V 30 H 0 Z',
  },
  A: {
    w: 28,
    // Gaya huruf A khas dengan lengkung kubah atas, palang kiri-tengah, dan kaki kanan melengkung anggun
    d: 'M 0 30 V 14.2 C 0 6.2 5.8 1 14 1 C 22.2 1 28 6.2 28 14.2 V 22.5 C 28 27.4 25.6 32.4 20.6 36 L 17 34.4 C 19.2 31.3 20 27.1 20 22.2 V 13.8 C 20 8.6 17.6 5.6 14 5.6 C 10.4 5.6 8 8.6 8 13.8 V 20 H 17.4 V 24.2 H 8 V 30 Z',
  },
  S: {
    w: 25,
    d: 'M 24.2 6.6 L 19.6 9.8 C 17.8 7.2 15.5 5.6 12.8 5.6 C 9.8 5.6 8 7.1 8 9.2 C 8 11.3 10.1 12.2 14.8 13.6 C 21.2 15.5 25 17.9 25 22.4 C 25 27.3 20.4 30.6 12.6 30.6 C 6.4 30.6 2.1 28.1 0.2 24.2 L 5.4 21 C 7.1 24 9.6 25.8 12.8 25.8 C 16.1 25.8 17.8 24.4 17.8 22.4 C 17.8 20.2 15.8 19.2 11 17.7 C 4.5 15.8 0.8 13.5 0.8 9.2 C 0.8 4.4 5.5 1 12.8 1 C 18.1 1 22.1 3.1 24.2 6.6 Z',
  },
  P: {
    w: 25.5,
    d: 'M 0 2 H 14.2 C 20.8 2 25.5 5.6 25.5 11.2 C 25.5 16.8 20.8 20.4 14.2 20.4 H 8 V 30 H 0 Z M 8 6.4 V 16 H 13.4 C 16.1 16 17.6 14.2 17.6 11.2 C 17.6 8.2 16.1 6.4 13.4 6.4 Z',
  },
  R: {
    w: 26,
    d: 'M 0 2 H 14.2 C 20.6 2 25 5.4 25 10.8 C 25 15.1 22.1 18.2 17.4 19.4 L 26 30 H 17.4 L 9.8 20 H 8.2 V 30 H 0 Z M 8.2 6.4 V 15.6 H 13.4 C 15.8 15.6 17.2 13.8 17.2 10.8 C 17.2 7.8 15.8 6.4 13.4 6.4 Z',
  },
  W: {
    w: 40,
    d: 'M 0 2 H 8.4 L 12.8 20.4 L 17.8 2 H 22.4 L 27.4 20.4 L 31.8 2 H 40 L 31.4 30 H 24.4 L 20.1 13.6 L 15.8 30 H 8.8 Z',
  },
  T: {
    w: 24,
    d: 'M 0 2 H 24 V 6.4 H 16 V 30 H 8 V 6.4 H 0 Z',
  },
};

const DINAS_LETTERS_LAYOUT = [
  { char: 'D', x: 0 },
  { char: 'I', x: 32 },
  { char: 'N', x: 46 },
  { char: 'A', x: 77 },
  { char: 'S', x: 109 },
  { char: 'P', x: 148 },
  { char: 'A', x: 177 },
  { char: 'R', x: 209 },
  { char: 'I', x: 238.5 },
  { char: 'W', x: 250 },
  { char: 'I', x: 293.5 },
  { char: 'S', x: 305 },
  { char: 'A', x: 333.5 },
  { char: 'T', x: 362.5 },
  { char: 'A', x: 387 },
];

const DINAS_TOTAL_WIDTH = 415;

// Stylized "DINAS PARIWISATA" 100% Vector SVG dengan animasi Letter-by-Letter Sweep (tanpa kotak)
const StylizedDinasPariwisata = ({ lineOffset = 0.06 }) => {
  return (
    <div className="relative inline-flex items-center select-none pointer-events-none">
      <svg
        viewBox="0 0 415 37"
        aria-label="DINAS PARIWISATA"
        className="h-[20px] sm:h-[27px] md:h-[34px] lg:h-[41px] xl:h-[48px] w-auto overflow-visible block"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.92)) drop-shadow(0 5px 14px rgba(0,0,0,0.75))',
          shapeRendering: 'geometricPrecision',
        }}
      >
        <defs>
          {/* Gradasi Kuning Keemasan Khas */}
          <linearGradient id="dinas-gold-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9D95E" />
            <stop offset="52%" stopColor="#F5BE2C" />
            <stop offset="100%" stopColor="#E29E12" />
          </linearGradient>
          {/* Gradasi Cahaya Sweep per-Huruf */}
          <linearGradient id="dinas-gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>

        {DINAS_LETTERS_LAYOUT.map((item, idx) => {
          const glyph = DINAS_GLYPHS[item.char];
          const progress = (item.x + glyph.w * 0.5) / DINAS_TOTAL_WIDTH;
          const letterDelay = lineOffset + progress * SWEEP_TRAVEL_TIME;

          return (
            <g key={idx} transform={`translate(${item.x}, 0)`}>
              <motion.g
                style={{
                  transformOrigin: `${glyph.w / 2}px 18px`,
                  willChange: 'transform, filter',
                }}
                animate={{
                  scale: [1, 1.045, 1],
                }}
                transition={{
                  duration: SWEEP_GLOW_DURATION,
                  repeat: Infinity,
                  repeatDelay: SWEEP_REPEAT_DELAY,
                  delay: letterDelay,
                  ease: 'easeInOut',
                }}
              >
                {/* Layer Dasar Kuning Keemasan */}
                <path
                  d={glyph.d}
                  fill="url(#dinas-gold-base)"
                  fillRule="evenodd"
                />
                {/* Layer Sweep Cahaya per-Huruf (tanpa kotak, murni mengikuti bentuk huruf) */}
                <motion.path
                  d={glyph.d}
                  fill="url(#dinas-gold-highlight)"
                  fillRule="evenodd"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(254, 240, 138, 0.95))',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.95, 0],
                  }}
                  transition={{
                    duration: SWEEP_GLOW_DURATION,
                    repeat: Infinity,
                    repeatDelay: SWEEP_REPEAT_DELAY,
                    delay: letterDelay,
                    ease: 'easeInOut',
                  }}
                />
              </motion.g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Per-letter sweep animation without any bounding boxes or div highlights
// Disinkronkan penuh secara proporsional dari kiri ke kanan agar seimbang di semua baris teks
const LetterSweep = ({ text, baseColor, highlightColor, glowColor, lineOffset = 0, className = '' }) => {
  const chars = text.split('');
  const maxIdx = Math.max(chars.length - 1, 1);

  return (
    <span
      className={`inline-block select-none whitespace-nowrap antialiased ${className}`}
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'geometricPrecision',
      }}
    >
      {chars.map((char, i) => {
        const progress = i / maxIdx;
        return (
          <motion.span
            key={i}
            className="inline-block"
            style={{
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              willChange: 'transform, color, text-shadow',
            }}
            animate={{
              color: [baseColor, highlightColor, baseColor],
              textShadow: [
                '0 2px 4px rgba(0,0,0,0.92), 0 4px 12px rgba(0,0,0,0.82)',
                `0 0 18px ${glowColor}, 0 0 6px ${highlightColor}, 0 2px 6px rgba(0,0,0,0.95)`,
                '0 2px 4px rgba(0,0,0,0.92), 0 4px 12px rgba(0,0,0,0.82)',
              ],
              scale: [1, 1.045, 1],
            }}
            transition={{
              duration: SWEEP_GLOW_DURATION,
              repeat: Infinity,
              repeatDelay: SWEEP_REPEAT_DELAY,
              delay: lineOffset + progress * SWEEP_TRAVEL_TIME,
              ease: 'easeInOut',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </span>
  );
};

const Hero = () => {
  const [slides, setSlides] = useState(SLIDES);
  const [current, setCurrent] = useState(0);
  const [subImageIdx, setSubImageIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    let mounted = true;
    api.get('/slider')
      .then(({ data }) => {
        if (!mounted || !Array.isArray(data)) return;
        const active = data.filter((item) => item.gambar).map((item) => ({
          image: getImageSrc(item.gambar),
          fallbackImage: '/slider/Slider.jpg',
          alt: item.judul || 'Banner pariwisata Sulawesi Tengah',
          title: item.judul || 'Banner pariwisata Sulawesi Tengah',
        }));
        if (active.length) {
          setCurrent(0);
          setSlides([SLIDES[0], ...active]);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Continuous video-like cycling between Adegan 1 (Megalit) and Adegan 2 (Lore Lindu) on Slide 0
  useEffect(() => {
    if (!slides[current]?.isDual) {
      setSubImageIdx(0);
      return;
    }

    const subTimer = setInterval(() => {
      setSubImageIdx((prev) => (prev === 0 ? 1 : 0));
    }, SUB_SCENE_INTERVAL);

    return () => clearInterval(subTimer);
  }, [current, slides]);

  // Carousel Autoplay management for advancing slides
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const duration = slides[current]?.isDual ? DUAL_SLIDE_DURATION : AUTOPLAY_INTERVAL;

    const slideTimer = setTimeout(() => {
      next();
    }, duration);

    return () => clearTimeout(slideTimer);
  }, [current, isPaused, next, slides]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  const slide = slides[current] ?? slides[0];
  const activeDuration = slide.isDual ? DUAL_SLIDE_DURATION : AUTOPLAY_INTERVAL;

  return (
    <section
      aria-label="Hero Banner"
      className="relative w-full aspect-[12/5] min-h-[240px] sm:min-h-[290px] md:min-h-[360px] max-h-[800px] bg-slate-950 overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide 0: Unified Dual-Destination Video-like Experience */}
      {slide.isDual ? (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          {/* Scene 1 (TAMPIL PERTAMA): Patung Megalit Poso, Bukit Selena Palu, & Danau Paisupok Banggai */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
            initial={false}
            animate={{
              opacity: subImageIdx === 0 ? 1 : 0,
              scale: subImageIdx === 0 ? 1.05 : 1.0,
            }}
            transition={{
              opacity: { duration: 1.4, ease: 'easeInOut' },
              scale: { duration: 6, ease: 'easeOut' },
            }}
          >
            <img
              src="/images/slider/hero-banner-destinasi-2.jpg?v=4kultra"
              alt="Destinasi Wisata Sulawesi Tengah - Patung Megalit Poso, Bukit Selena Palu, Danau Paisupok Banggai"
              className="w-full h-full object-cover object-center"
              style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }}
              loading="eager"
            />
          </motion.div>

          {/* Scene 2 (TAMPIL KEDUA): Taman Nasional Lore Lindu, Air Terjun Saluopa Poso, & Kepulauan Tojo Una-Una */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
            initial={false}
            animate={{
              opacity: subImageIdx === 1 ? 1 : 0,
              scale: subImageIdx === 1 ? 1.0 : 1.05,
            }}
            transition={{
              opacity: { duration: 1.4, ease: 'easeInOut' },
              scale: { duration: 6, ease: 'easeOut' },
            }}
          >
            <img
              src="/images/slider/hero-banner-destinasi-1.jpg?v=4kultra"
              alt="Destinasi Wisata Sulawesi Tengah - Taman Nasional Lore Lindu, Air Terjun Saluopa, Kepulauan Tojo Una-Una"
              className="w-full h-full object-cover object-center"
              style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }}
              loading="eager"
            />
          </motion.div>

          {/* Animated Welcome Text Overlay - Sejajar Presisi, Proporsional, Ultra-HD & Pure Letter-by-Letter Sweep */}
          <div className="absolute left-5 sm:left-10 md:left-14 lg:left-20 xl:left-24 top-1/2 -translate-y-1/2 z-20 max-w-[92%] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl text-left pointer-events-none flex flex-col items-start gap-1.5 sm:gap-2 md:gap-2.5">
            
            {/* Line 1: Selamat Datang di Website Resmi (Emas/Kuning Italic Serif) */}
            <div className="whitespace-nowrap flex items-center">
              <LetterSweep
                text="Selamat Datang di Website Resmi"
                baseColor="#F6C843"
                highlightColor="#FFFBEB"
                glowColor="rgba(254, 240, 138, 0.95)"
                lineOffset={0}
                className="italic font-serif font-semibold tracking-[0.04em] sm:tracking-[0.05em] text-[11px] sm:text-base md:text-xl lg:text-[23px] xl:text-[27px] leading-none"
              />
            </div>

            {/* Line 2: DINAS PARIWISATA (Vektor Ultra-HD 4K + Gaya Font Khas + Sweep per-Huruf Tanpa Kotak) */}
            <div className="whitespace-nowrap flex items-center">
              <StylizedDinasPariwisata lineOffset={0.05} />
            </div>

            {/* Line 3: PROVINSI SULAWESI TENGAH (Sejajar Presisi dengan DINAS PARIWISATA) */}
            <div className="whitespace-nowrap flex items-center">
              <LetterSweep
                text="PROVINSI SULAWESI TENGAH"
                baseColor="#FFFFFF"
                highlightColor="#FFFBEB"
                glowColor="rgba(255, 255, 255, 0.95)"
                lineOffset={0.1}
                className="font-extrabold uppercase tracking-[0.17em] sm:tracking-[0.21em] md:tracking-[0.23em] text-[10px] sm:text-[14px] md:text-[17.5px] lg:text-[20.5px] xl:text-[24px] leading-none"
              />
            </div>

          </div>
        </div>
      ) : (
        /* Slides 1..8: Standard Slides */
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {slide.link && slide.link !== '#' ? (
              <a
                href={slide.link}
                target={slide.isExternal ? '_blank' : '_self'}
                rel={slide.isExternal ? 'noopener noreferrer' : undefined}
                className="block w-full h-full cursor-pointer"
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
              </a>
            ) : (
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
            )}
          </motion.div>
        </AnimatePresence>
      )}

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
        {slides.map((s, idx) => (
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
          transition={{ duration: activeDuration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-amber-400 z-20"
        />
      )}
    </section>
  );
};

export default Hero;
