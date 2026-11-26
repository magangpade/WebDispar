import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Smartphone } from 'lucide-react';

const SURVEY_URL = 'https://skm.go.id/share/instansi/bcab53cf-9864-4f53-b15b-3ff140a15e57/1';

export const SurveiKepuasan = ({ language = 'ID' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const isEn = language === 'EN';

  // Otomatis tampilkan popup setelah 2.5 detik jika baru pertama kali membuka website dalam sesi ini
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('skm_survey_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Tutup dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('skm_survey_seen', 'true');
    setIsOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleDismiss();
    }
  };

  const handleOpenSurvey = () => {
    sessionStorage.setItem('skm_survey_seen', 'true');
    window.open(SURVEY_URL, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <>
      {/* Modal Popup Survei Kepuasan Masyarakat (Sesuai Desain Resmi Portal Dispar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 select-none"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[620px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 overflow-hidden"
            >
              {/* Tombol Tutup X di Pojok Kanan Atas */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label={isEn ? 'Close' : 'Tutup'}
                title={isEn ? 'Close' : 'Tutup'}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-7">
                {/* Kolom Kiri: QR Code Card */}
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center justify-center shrink-0 shadow-sm w-full md:w-48">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-inner">
                    <img
                      src="/images/qr-skm-dispar.png"
                      alt="QR Code Survei Kepuasan Masyarakat Dispar Sulteng"
                      className="w-36 h-36 sm:w-38 sm:h-38 object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-2.5 text-slate-500 text-[11px] font-medium text-center">
                    <Smartphone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>
                      {isEn ? 'Scan QR Code via Mobile' : 'Scan QR Code ini untuk mengisi via HP'}
                    </span>
                  </div>
                </div>

                {/* Kolom Kanan: Pesan Salam Pesona Indonesia & Tombol Aksi */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                    <span>{isEn ? 'Greetings from Pesona Indonesia' : 'Salam Pesona Indonesia'}</span>
                    <span className="text-red-500 animate-pulse text-xl">❤️</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
                    {isEn
                      ? 'Help us improve service quality by completing the Community Satisfaction Survey of the Central Sulawesi Provincial Tourism Office.'
                      : 'Bantu kami meningkatkan kualitas pelayanan dengan mengisi Survei Kepuasan Masyarakat Dinas Pariwisata Provinsi Sulawesi Tengah.'}
                  </p>

                  {/* Tombol Utama: KLIK DI SINI UNTUK MENGISI */}
                  <button
                    type="button"
                    onClick={handleOpenSurvey}
                    className="w-full mt-5 py-3 px-5 rounded-xl bg-[#2A374A] hover:bg-[#1E293B] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{isEn ? 'CLICK HERE TO FILL OUT' : 'KLIK DI SINI UNTUK MENGISI'}</span>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  {/* Tombol Sekunder: Nanti Saja / Lewati */}
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="w-full mt-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-600 hover:text-slate-900 border border-slate-200/80 font-semibold text-xs sm:text-sm transition-colors text-center cursor-pointer shadow-sm"
                  >
                    {isEn ? 'Maybe Later / Skip' : 'Nanti Saja / Lewati'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Icon Wonderful Indonesia di Pojok Kanan Bawah (Sejajar Kiri-Kanan) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isEn ? 'Public Satisfaction Survey' : 'Survei Kepuasan Masyarakat (SKM)'}
          title={isEn ? 'Public Satisfaction Survey (SKM)' : 'Survei Kepuasan Masyarakat (SKM)'}
          className="w-12 h-12 rounded-full bg-white border border-slate-200/90 text-slate-800 shadow-2xl shadow-black/20 flex items-center justify-center hover:border-amber-400 hover:shadow-amber-500/20 transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* Subtle Glow Hover */}
          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Logo Wonderful Indonesia */}
          <img
            src="/images/media_1587964394_logo_wonderful_indonesia.png"
            alt="Wonderful Indonesia"
            className="w-9 h-auto object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
          />

          {/* Notification Dot Merah Berdenyut */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white"></span>
          </span>
        </motion.button>
      </div>
    </>
  );
};

export default SurveiKepuasan;
