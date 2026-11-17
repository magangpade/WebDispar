import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Newspaper, Building, FileText, Compass, Calendar,
  ChevronDown, ChevronRight, Search, ShieldCheck, Clock,
  ExternalLink, Sparkles, MessageSquare, X
} from 'lucide-react';

const KABUPATEN_LIST = [
  'Kota Palu', 'Kabupaten Donggala', 'Kabupaten Sigi', 'Kabupaten Parigi Moutong',
  'Kabupaten Poso', 'Kabupaten Morowali', 'Kabupaten Morowali Utara', 'Kabupaten Tojo Una-Una',
  'Kabupaten Banggai', 'Kabupaten Banggai Kepulauan', 'Kabupaten Banggai Laut',
  'Kabupaten Tolitoli', 'Kabupaten Buol',
];

const slugify = (str) =>
  str.toLowerCase().replace(/kabupaten |kota /g, '').replace(/\s+/g, '-');

// MENUS PERSIS SESUAI NAVBAR SEBELUMNYA
export const MENUS_CONFIG = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Berita', path: '/berita', icon: Newspaper },
  {
    label: 'Profil',
    icon: Building,
    children: [
      { label: 'Sejarah', path: '/profil/sejarah' },
      { label: 'Visi dan Misi', path: '/profil/visi-misi' },
      { label: 'Profil Pimpinan', path: '/profil/profil-pimpinan' },
      { label: 'Tupoksi', path: '/profil/tupoksi' },
      { label: 'Majalah', path: '/profil/majalah' },
      { label: 'Logo', path: '/profil/logo' },
      { label: 'Hubungi Kami', path: '/profil/hubungi-kami' },
    ],
  },
  {
    label: 'Informasi Publik',
    icon: FileText,
    children: [
      {
        label: 'PPID',
        children: [
          {
            label: 'Profil',
            children: [
              { label: 'Struktur Organisasi PPID', path: '/ppid/struktur-organisasi' },
              { label: 'Visi dan Misi', path: '/ppid/visi-misi' },
              { label: 'Maklumat Pelayanan Informasi Publik', path: '/ppid/maklumat-pelayanan' },
              { label: 'Tugas PPID dan PPID Pelaksana', path: '/ppid/tugas-ppid' },
            ],
          },
          { label: 'Dokumen Publik', path: '/ppid/profil/dokumen-publik' },
          { label: 'Laporan Tahunan PPID', path: '/ppid/profil/laporan-tahunan' },
          {
            label: 'Layanan Publik',
            children: [
              { label: 'Form Permohonan Informasi', path: '/ppid/layanan-publik/form-permohonan' },
              { label: 'Form Pengajuan Keberatan', path: '/ppid/layanan-publik/form-keberatan' },
              { label: 'Prosedur Pengaduan', path: '/ppid/layanan-publik/prosedur-pengaduan' },
              { label: 'Survey Penilaian Layanan Informasi Publik', path: '/ppid/layanan-publik/survey-kepuasan' },
              { label: 'Regulasi Layanan Publik', path: '/ppid/layanan-publik/regulasi' },
            ],
          },
          { label: 'Surat Keputusan', path: '/ppid/profil/surat-keputusan' },
          { label: 'Standar Pelayanan Publik', path: '/ppid/profil/standar-pelayanan' },
        ],
      },
      { label: 'Informasi Setiap Saat', path: '/ppid/informasi-setiap-saat' },
      { label: 'Informasi Serta Merta', path: '/ppid/informasi-serta-merta' },
      { label: 'Informasi Dikecualikan', path: '/ppid/informasi-dikecualikan' },
      { label: 'Layanan Aduan Masyarakat', path: 'https://www.lapor.go.id', external: true },
      { label: 'Regulasi', path: '/ppid/regulasi' },
    ],
  },
  {
    label: 'Info Pariwisata',
    icon: Compass,
    children: [
      {
        label: 'Destinasi Pariwisata',
        children: [
          {
            label: 'Daya Tarik Wisata',
            children: KABUPATEN_LIST.map((kab) => ({
              label: kab,
              path: `/info-pariwisata/destinasi/daya-tarik-wisata/${slugify(kab)}`,
            })),
          },
          {
            label: 'Desa Wisata',
            children: KABUPATEN_LIST.map((kab) => ({
              label: kab,
              path: `/info-pariwisata/destinasi/desa-wisata/${slugify(kab)}`,
            })),
          },
        ],
      },
      {
        label: 'Pemasaran Pariwisata',
        children: [
          { label: 'Paket Wisata', path: '/info-pariwisata/pemasaran/paket-wisata' },
          { label: 'Kalender Event', path: '/info-pariwisata/pemasaran/kalender-event' },
          { label: 'Data Hunian Hotel', path: '/info-pariwisata/pemasaran/data-hunian' },
          { label: 'Statistik Kunjungan', path: '/info-pariwisata/pemasaran/statistik-kunjungan' },
        ],
      },
      { label: 'Ekonomi Kreatif', path: '/info-pariwisata/ekonomi-kreatif' },
      { label: 'Sumber Daya Pariwisata', path: '/info-pariwisata/sumber-daya' },
    ],
  },
  { label: 'Rencana Terbit', path: '/rencana-terbit', icon: Calendar },
  { label: 'Lapor', path: 'https://www.lapor.go.id', external: true, icon: MessageSquare },
];

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, language, setLanguage }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Update WITA clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Makassar',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('id-ID', options).format(now);
      setCurrentTime(`${formatted} WITA`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-expand active category
  useEffect(() => {
    MENUS_CONFIG.forEach((m) => {
      if (m.children) {
        const hasActive = (items) =>
          items?.some((item) => item.path === location.pathname || (item.children && hasActive(item.children)));
        if (hasActive(m.children)) {
          setOpenSubmenus((prev) => ({ ...prev, [m.label]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLinkClick = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const renderChildren = (items, depth = 1) => {
    return (
      <div className={`flex flex-col gap-1 pl-3.5 mt-1 border-l border-white/10 ${depth > 1 ? 'ml-1.5' : ''}`}>
        {items.map((sub, idx) => {
          const hasKids = sub.children && sub.children.length > 0;
          const isExpanded = !!openSubmenus[`${depth}-${sub.label}`];
          const isCurrentActive = sub.path === location.pathname;

          if (hasKids) {
            return (
              <div key={idx} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(`${depth}-${sub.label}`)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-md text-[11px] text-blue-100/90 hover:text-white hover:bg-white/10 transition-colors text-left font-medium"
                >
                  <span className="truncate pr-1">{sub.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-blue-200/70 shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && renderChildren(sub.children, depth + 1)}
              </div>
            );
          }

          if (sub.external) {
            return (
              <a
                key={idx}
                href={sub.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-1.5 px-2 rounded-md text-[11px] text-blue-200/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="truncate">{sub.label}</span>
                <ExternalLink className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
              </a>
            );
          }

          return (
            <Link
              key={idx}
              to={sub.path}
              onClick={handleLinkClick}
              className={`py-1.5 px-2 rounded-md text-[11px] transition-colors truncate ${
                isCurrentActive
                  ? 'bg-amber-400/20 text-amber-300 font-bold border-l-2 border-amber-400'
                  : 'text-blue-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {sub.label}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50
        w-80 max-w-[85vw] h-screen
        flex flex-col justify-between
        bg-gradient-to-b from-[#0B192C] via-[#162740] to-[#0B192C]
        text-white border-r border-white/10
        shadow-2xl transition-transform duration-300 ease-in-out
        lg:hidden
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}
      `}
    >
      {/* Top Section Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-4">
        {/* Logo Branding & Mobile Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 group">
            <img
              src="/dinas pariwisata-COLOR WHITE.png"
              alt="Logo Dinas Pariwisata Sulteng"
              className="w-10 h-auto object-contain drop-shadow"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#FBBF24] tracking-wider uppercase leading-tight font-sans">
                PEMERINTAH PROVINSI SULTENG
              </span>
              <span className="text-sm font-extrabold text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors">
                DINAS PARIWISATA
              </span>
              <span className="text-[10px] text-blue-200/90 font-medium leading-tight">
                Negeri Seribu Megalit
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Tutup Menu"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Info & Language */}
        <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-black/20 border border-white/5 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium tracking-tight whitespace-nowrap">{currentTime || 'WITA'}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-[11px] text-slate-300 pl-1 border-l border-white/10">
            <button
              onClick={() => setLanguage && setLanguage('ID')}
              className={`px-1 rounded hover:text-white transition-colors ${language === 'ID' || !language ? 'text-amber-400' : 'text-slate-400'}`}
            >
              ID
            </button>
            <span className="text-slate-500">/</span>
            <button
              onClick={() => setLanguage && setLanguage('EN')}
              className={`px-1 rounded hover:text-white transition-colors ${language === 'EN' ? 'text-amber-400' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-blue-300 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                window.location.href = `/berita?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            placeholder="Cari wisata, berita..."
            className="w-full bg-[#163259]/80 border border-[#2A4D7D] focus:border-amber-400 text-white placeholder-blue-200/60 text-xs rounded-xl pl-9 pr-3 py-2 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Navigation Menu (Sama Persis Menu Navbar Sebelumnya) */}
        <div className="flex flex-col gap-2">
          <div className="px-1 text-[10px] font-bold tracking-wider text-blue-300/80 uppercase">
            MENU NAVIGASI
          </div>
          <nav className="flex flex-col gap-1">
            {MENUS_CONFIG.map((menu, idx) => {
              const Icon = menu.icon || Home;
              const hasKids = menu.children && menu.children.length > 0;
              const isExpanded = !!openSubmenus[menu.label];
              const isCurrentActive = menu.path === location.pathname;

              if (hasKids) {
                return (
                  <div key={idx} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(menu.label)}
                      className={`
                        w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold
                        transition-all duration-200 text-left
                        ${isExpanded ? 'bg-white/10 text-white shadow-sm' : 'text-slate-200 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-blue-300 shrink-0" />
                        <span>{menu.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-blue-300 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && renderChildren(menu.children, 1)}
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
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-blue-300 shrink-0" />
                      <span>{menu.label}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </a>
                );
              }

              return (
                <Link
                  key={idx}
                  to={menu.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold
                    transition-all duration-200
                    ${
                      isCurrentActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrentActive ? 'text-slate-950' : 'text-blue-300'}`} />
                  <span>{menu.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            to="/info-pariwisata/destinasi/daya-tarik-wisata"
            onClick={handleLinkClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span># Destinasi Sulteng</span>
          </Link>
        </div>
      </div>

      {/* Bottom Footer Verification */}
      <div className="p-4 bg-black/25 border-t border-white/10 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-[11px]">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Portal Resmi Terverifikasi</span>
        </div>
        <p className="text-[10px] text-blue-200/80 leading-snug">
          Pemerintah Provinsi Sulawesi Tengah
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
