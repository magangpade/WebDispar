import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, ChevronRight, Search,
  Sparkles, ExternalLink, Compass, FileText, Building, Home, Newspaper
} from 'lucide-react';

const KABUPATEN_LIST = [
  'Kota Palu', 'Kabupaten Donggala', 'Kabupaten Sigi', 'Kabupaten Parigi Moutong',
  'Kabupaten Poso', 'Kabupaten Morowali', 'Kabupaten Morowali Utara', 'Kabupaten Tojo Una-Una',
  'Kabupaten Banggai', 'Kabupaten Banggai Kepulauan', 'Kabupaten Banggai Laut',
  'Kabupaten Tolitoli', 'Kabupaten Buol',
];

const slugify = (str) =>
  str.toLowerCase().replace(/kabupaten |kota /g, '').replace(/\s+/g, '-');

export const NAV_MENUS = [
  { label: 'Home', path: '/' },
  { label: 'Berita', path: '/berita' },
  {
    label: 'Profil',
    children: [
      { label: 'Sejarah Singkat', path: '/profil/sejarah' },
      { label: 'Visi dan Misi', path: '/profil/visi-misi' },
      { label: 'Profil Pimpinan', path: '/profil/profil-pimpinan' },
      { label: 'Tugas Pokok & Fungsi', path: '/profil/tupoksi' },
      { label: 'Majalah & Publikasi', path: '/profil/majalah' },
      { label: 'Logo & Identitas Visual', path: '/profil/logo' },
      { label: 'Hubungi Kami', path: '/profil/hubungi-kami' },
    ],
  },
  {
    label: 'Informasi Publik',
    children: [
      {
        label: 'PPID Dinas Pariwisata',
        children: [
          {
            label: 'Profil PPID',
            children: [
              { label: 'Struktur Organisasi PPID', path: '/ppid/profil/struktur-organisasi' },
              { label: 'Visi dan Misi PPID', path: '/ppid/profil/visi-misi' },
              { label: 'Maklumat Pelayanan', path: '/ppid/profil/maklumat-pelayanan' },
              { label: 'Tugas PPID & Pelaksana', path: '/ppid/profil/tugas-ppid' },
            ],
          },
          { label: 'Daftar Informasi Publik (DIP)', path: '/ppid/daftar-informasi-publik' },
          { label: 'Laporan Tahunan PPID', path: '/ppid/laporan-tahunan' },
          {
            label: 'Layanan Publik PPID',
            children: [
              { label: 'Form Permohonan Informasi', path: '/ppid/layanan-publik/form-permohonan' },
              { label: 'Form Pengajuan Keberatan', path: '/ppid/layanan-publik/form-keberatan' },
              { label: 'Prosedur Pengaduan', path: '/ppid/layanan-publik/prosedur-pengaduan' },
              { label: 'Survey Kepuasan Layanan', path: '/ppid/layanan-publik/survey-kepuasan' },
              { label: 'Regulasi Layanan Publik', path: '/ppid/layanan-publik/regulasi' },
            ],
          },
          { label: 'Surat Keputusan (SK 2021-2026)', path: '/ppid/surat-keputusan' },
          { label: 'Standar Pelayanan Publik (SOP)', path: '/ppid/standar-pelayanan' },
        ],
      },
      { label: 'Informasi Setiap Saat', path: '/ppid/daftar-informasi-publik' },
      { label: 'Informasi Serta Merta', path: '/ppid/daftar-informasi-publik' },
      { label: 'Informasi Dikecualikan', path: '/ppid/daftar-informasi-publik' },
      { label: 'Regulasi Pariwisata & Hukum', path: '/ppid/regulasi' },
      { label: 'Layanan Aduan SP4N-LAPOR', path: 'https://www.lapor.go.id/instansi/pemerintah-provinsi-sulawesi-tengah', external: true },
    ],
  },
  {
    label: 'Info Pariwisata',
    children: [
      {
        label: 'Destinasi Pariwisata',
        children: [
          { label: 'Daya Tarik Wisata (DTW)', path: '/info-pariwisata/destinasi/daya-tarik-wisata' },
          { label: 'Desa Wisata Sulteng', path: '/info-pariwisata/destinasi/desa-wisata' },
        ],
      },
      {
        label: 'Pemasaran Pariwisata',
        children: [
          { label: 'Paket Wisata Unggulan', path: '/info-pariwisata/pemasaran/paket-wisata' },
          { label: 'Kalender Event', path: '/info-pariwisata/pemasaran/kalender-event' },
          { label: 'Data Hunian Hotel', path: '/info-pariwisata/pemasaran/data-hunian' },
          { label: 'Statistik Kunjungan', path: '/info-pariwisata/pemasaran/statistik-kunjungan' },
        ],
      },
      { label: 'Ekonomi Kreatif', path: '/info-pariwisata/ekonomi-kreatif' },
      { label: 'Sumber Daya & Direktori', path: '/info-pariwisata/sumber-daya' },
    ],
  },
  { label: 'Rencana Terbit', path: '/rencana-terbit' },
  { label: 'SP4N-LAPOR', path: 'https://www.lapor.go.id/instansi/pemerintah-provinsi-sulawesi-tengah', external: true },
];

// Sub-dropdown flyout component with glassmorphism
const SubDropdown = ({ items, onClose, subLeft = false }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const posClass = subLeft
    ? 'top-0 right-full mr-1.5'
    : 'top-0 left-full ml-1.5';

  return (
    <div
      className={`absolute ${posClass} bg-[#0B192C]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-2 min-w-[240px] z-50 animate-fadeIn`}
    >
      {items.map((item, idx) => {
        const hasSub = Array.isArray(item.children) && item.children.length > 0;
        const isOpen = openIdx === idx;

        if (hasSub) {
          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setOpenIdx(idx)}
              onMouseLeave={() => setOpenIdx(null)}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isOpen
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight size={13} className="text-amber-400 opacity-70 shrink-0" />
              </button>
              {isOpen && (
                <SubDropdown items={item.children} onClose={onClose} subLeft={subLeft} />
              )}
            </div>
          );
        }

        if (item.external) {
          return (
            <a
              key={idx}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-white/10 transition-all"
            >
              <span>{item.label}</span>
              <ExternalLink size={12} className="text-amber-400 shrink-0" />
            </a>
          );
        }

        return (
          <Link
            key={idx}
            to={item.path}
            onClick={onClose}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-white/10 transition-all"
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

// Main Dropdown Panel with Glassmorphism
const DropdownPanel = ({ items, onClose, alignRight = false }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const alignClass = alignRight ? 'right-0' : 'left-0';

  return (
    <div
      className={`absolute top-full mt-2 ${alignClass} bg-[#0B192C]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-2 min-w-[240px] z-50 animate-fadeIn`}
    >
      {items.map((item, idx) => {
        const hasSub = Array.isArray(item.children) && item.children.length > 0;
        const isOpen = openIdx === idx;

        if (hasSub) {
          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setOpenIdx(idx)}
              onMouseLeave={() => setOpenIdx(null)}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isOpen
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight size={13} className="text-amber-400 opacity-70 shrink-0" />
              </button>
              {isOpen && (
                <SubDropdown items={item.children} onClose={onClose} subLeft={alignRight} />
              )}
            </div>
          );
        }

        if (item.external) {
          return (
            <a
              key={idx}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-white/10 transition-all"
            >
              <span>{item.label}</span>
              <ExternalLink size={12} className="text-amber-400 shrink-0" />
            </a>
          );
        }

        return (
          <Link
            key={idx}
            to={item.path}
            onClick={onClose}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-white/10 transition-all"
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export const Navbar = ({ onToggleMobile, language = 'ID', setLanguage }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDropdown = () => setActiveMenu(null);

  const isActive = (menu) => {
    if (menu.path) return location.pathname === menu.path;
    if (menu.children) {
      return menu.children.some(child => {
        if (child.path === location.pathname) return true;
        if (child.children) {
          return child.children.some(grandChild => grandChild.path === location.pathname);
        }
        return false;
      });
    }
    return false;
  };

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B192C]/90 backdrop-blur-xl border-b border-white/15 shadow-xl shadow-black/20 py-2.5'
            : 'bg-gradient-to-r from-[#0B192C]/85 via-[#162740]/80 to-[#0B192C]/85 backdrop-blur-md border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4 w-full">
          {/* Brand Logo & Title */}
          <Link
            to="/"
            onClick={closeDropdown}
            className="flex items-center gap-3 shrink-0 group focus:outline-none"
          >
            <img
              src="/dinas pariwisata-COLOR WHITE.png"
              alt="Logo Dinas Pariwisata Sulteng"
              className="h-10 md:h-11 w-auto object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base md:text-lg tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                Dinas Pariwisata
              </span>
              <span className="font-bold text-amber-400 text-[10px] md:text-[11px] tracking-wider uppercase leading-none">
                PROVINSI SULAWESI TENGAH
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Bar in Glassy Container */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
            {NAV_MENUS.map((menu, idx) => {
              const active = isActive(menu);
              const isOpened = activeMenu === idx;

              if (menu.children) {
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(idx)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMenu(isOpened ? null : idx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                        isOpened || active
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{menu.label}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 opacity-80 ${
                          isOpened ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpened && (
                      <DropdownPanel
                        items={menu.children}
                        onClose={closeDropdown}
                        alignRight={idx > 2}
                      />
                    )}
                  </div>
                );
              }

              if (menu.external) {
                return (
                  <a
                    key={idx}
                    href={menu.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-1"
                  >
                    <span>{menu.label}</span>
                    <ExternalLink size={11} className="text-amber-400 opacity-80" />
                  </a>
                );
              }

              return (
                <Link
                  key={idx}
                  to={menu.path}
                  onClick={closeDropdown}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {menu.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2.5">
            {/* Search Icon Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Pencarian"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/25 flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-sm"
              title="Cari Berita & Destinasi"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher Pill */}
            <div className="hidden sm:inline-flex items-center gap-0.5 rounded-full p-0.5 bg-white/5 border border-white/10 backdrop-blur-sm text-xs">
              {['ID', 'EN'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage && setLanguage(lang)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    language === lang
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* CTA Button: Destinasi Sulteng (Desktop) */}
            <Link
              to="/info-pariwisata/destinasi/daya-tarik-wisata"
              className="hidden xl:inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span># Destinasi</span>
            </Link>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              onClick={onToggleMobile}
              aria-label="Buka Menu Navigasi"
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Glassy Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="bg-[#0B192C]/95 border border-white/20 text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Pencarian Portal Pariwisata</h3>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ketik destinasi, berita, atau dokumen publik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                autoFocus
              />
            </div>

            {/* Quick Links Suggestions */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pencarian Populer:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Wisata Megalit Lore Lindu', path: '/info-pariwisata/destinasi/daya-tarik-wisata' },
                  { label: 'Kepulauan Togean', path: '/info-pariwisata/pemasaran/paket-wisata' },
                  { label: 'PPID & Dokumen SAKIP', path: '/ppid/daftar-informasi-publik' },
                  { label: 'Berita Pariwisata', path: '/berita' },
                  { label: 'Kalender Event Sulteng', path: '/info-pariwisata/pemasaran/kalender-event' },
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.path}
                    onClick={() => setIsSearchOpen(false)}
                    className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/10 transition-colors text-slate-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
