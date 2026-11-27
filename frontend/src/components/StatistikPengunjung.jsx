import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

const DEFAULT_STATS = {
  today: 0,
  yesterday: 0,
  thisWeek: 0,
  lastWeek: 0,
  thisMonth: 0,
  lastMonth: 0,
  allDays: 0,
  ip: '127.0.0.1'
};

const StatistikPengunjung = ({ language = 'ID' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const modalRef = useRef(null);

  const isEN = language === 'EN';

  // Fetch statistik pengunjung dari backend
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/statistik/pengunjung');
      if (res.data) {
        setStats({
          today: Number(res.data.today || 0),
          yesterday: Number(res.data.yesterday || 0),
          thisWeek: Number(res.data.thisWeek || 0),
          lastWeek: Number(res.data.lastWeek || 0),
          thisMonth: Number(res.data.thisMonth || 0),
          lastMonth: Number(res.data.lastMonth || 0),
          allDays: Number(res.data.allDays || 0),
          ip: res.data.ip || '127.0.0.1'
        });
      }
    } catch {
      // Jika backend offline, tetap 0
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Update live clock
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Format tanggal & jam sesuai gambar (contoh: 2026-11-23 20:25)
  const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  // Tutup jika klik backdrop
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Format digit odometer: 7 digit (misal 0000000)
  const odometerDigits = String(stats.allDays).padStart(7, '0').split('');

  const items = [
    {
      label: isEN ? 'Today' : 'Hari Ini',
      value: stats.today,
      icon: User,
      color: 'text-sky-400'
    },
    {
      label: isEN ? 'Yesterday' : 'Kemarin',
      value: stats.yesterday,
      icon: User,
      color: 'text-emerald-400'
    },
    {
      label: isEN ? 'This Week' : 'Minggu Ini',
      value: stats.thisWeek,
      icon: User,
      color: 'text-amber-400'
    },
    {
      label: isEN ? 'Last Week' : 'Minggu Lalu',
      value: stats.lastWeek,
      icon: User,
      color: 'text-orange-400'
    },
    {
      label: isEN ? 'This Month' : 'Bulan Ini',
      value: stats.thisMonth,
      icon: User,
      color: 'text-rose-400'
    },
    {
      label: isEN ? 'Last Month' : 'Bulan Lalu',
      value: stats.lastMonth,
      icon: User,
      color: 'text-pink-400'
    },
    {
      label: isEN ? 'All days' : 'Semua Hari',
      value: stats.allDays,
      icon: BarChart3,
      color: 'text-blue-400'
    },
  ];

  return (
    <>
      {/* Modal Popup Sesuai Gambar yang Diminta */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[390px] sm:max-w-[420px] bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl text-white"
            >
              {/* Header Modal Bar */}
              <div className="relative flex items-center justify-between pb-3">
                <div className="flex-1 flex items-center justify-center gap-2 pl-6">
                  <span className="text-lg">📊</span>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {isEN ? 'Visitor Statistics' : 'Statistik Pengunjung'}
                  </h3>
                </div>

                {/* Close Button Lingkaran Abu-abu seperti pada gambar */}
                <button
                  onClick={() => setIsOpen(false)}
                  title={isEN ? 'Close' : 'Tutup'}
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subheading teks putih */}
              <div className="text-left text-xs sm:text-sm font-semibold text-white/90 mb-2.5">
                {isEN ? 'Statistik Pengunjung' : 'Statistik Pengunjung'}
              </div>

              {/* Kotak Hitam / Box Counter Dalam */}
              <div className="bg-[#181B22] border border-gray-700/80 rounded-2xl p-4 sm:p-5 shadow-inner">
                {/* Odometer Horizontal Bar di Atas */}
                <div className="flex items-center justify-center gap-0.5 pb-4">
                  <div className="inline-flex items-center bg-black border border-gray-700 rounded-sm px-1.5 py-0.5 shadow-sm">
                    {odometerDigits.map((digit, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center justify-center w-5 sm:w-6 h-6 sm:h-7 bg-[#101216] text-white font-mono text-xs sm:text-sm font-bold border-r border-gray-800 last:border-r-0"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Baris Statistik dengan Icon dan Nilai */}
                <div className="space-y-1.5 font-mono text-xs sm:text-sm">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 border-b border-gray-800/40 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className="text-gray-300 font-sans text-xs">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-mono text-white text-xs sm:text-sm font-bold">
                        {item.value.toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Garis Pemisah Tipis */}
                <div className="border-t border-gray-800/80 my-3.5" />

                {/* Info Footer Box */}
                <div className="text-center space-y-1 text-[11px] text-gray-400 font-mono">
                  <div>
                    {isEN ? 'Your IP: ' : 'IP Anda: '}
                    <span className="text-gray-200 font-semibold">{stats.ip}</span>
                  </div>
                  <div className="text-gray-400">
                    {formatDateTime(currentTime)}
                  </div>
                  <div className="text-gray-300 font-sans text-[11px] pt-0.5 font-medium flex items-center justify-center gap-1.5">
                    <span>{isEN ? 'Visitors Counter' : 'Penghitung Pengunjung'}</span>
                    <button
                      onClick={fetchStats}
                      disabled={isLoading}
                      title={isEN ? 'Refresh' : 'Muat Ulang'}
                      className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Icon di Pojok Kiri Bawah (Persis Posisi Gambar) */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <motion.button
          onClick={() => {
            setIsOpen((prev) => {
              if (!prev) fetchStats();
              return !prev;
            });
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          data-tour="stats-widget"
          aria-label={isEN ? 'Visitor Statistics' : 'Statistik Pengunjung'}
          className="w-12 h-12 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/25 text-white shadow-2xl shadow-black/50 flex items-center justify-center hover:border-amber-400 transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Icon Chart sesuai gambar */}
          <span className="text-xl group-hover:scale-110 transition-transform">
            📊
          </span>

          {/* Indicator Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
        </motion.button>
      </div>
    </>
  );
};

export default StatistikPengunjung;
