import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Newspaper, MapPin, FileText, LogOut, LayoutDashboard, Images, Globe, 
  Compass, ShieldCheck, Palette, Building2, ChevronDown, ChevronRight,
  History, Target, Users, BookOpen, Image as ImageIcon, Calendar,
  TrendingUp, BarChart3, HelpCircle
} from 'lucide-react';
import api from '../../services/api';

export const ADMIN_NAV_TREE = [
  { 
    label: 'Dashboard', 
    path: '/portal-internal-dispar/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Profil', 
    icon: Building2,
    children: [
      { label: 'Sejarah Dinas', path: '/portal-internal-dispar/profil?sub=sejarah', icon: History },
      { label: 'Visi dan Misi', path: '/portal-internal-dispar/profil?sub=visi_misi', icon: Target },
      { label: 'Profil Pimpinan & Pejabat', path: '/portal-internal-dispar/profil?sub=profil_pimpinan', icon: Users },
      { label: 'Tugas Pokok & Fungsi (Tupoksi)', path: '/portal-internal-dispar/profil?sub=tupoksi', icon: FileText },
      { label: 'Majalah & Publikasi', path: '/portal-internal-dispar/profil?sub=majalah', icon: BookOpen },
      { label: 'Logo Resmi & Branding', path: '/portal-internal-dispar/profil?sub=logo', icon: ImageIcon },
    ]
  },
  { 
    label: 'Informasi Publik (PPID)', 
    icon: FileText,
    children: [
      { label: 'Daftar Dokumen PPID', path: '/portal-internal-dispar/ppid?tab=items', icon: FileText },
      { label: 'Regulasi Layanan Publik', path: '/portal-internal-dispar/ppid?tab=regulasi', icon: ShieldCheck },
      { label: 'Surat Keputusan (SK)', path: '/portal-internal-dispar/ppid?tab=sk', icon: FileText },
    ]
  },
  { 
    label: 'Info Pariwisata', 
    icon: Compass,
    children: [
      {
        label: 'Destinasi Wisata',
        icon: MapPin,
        children: [
          { label: 'Daya Tarik Wisata (DTW)', path: '/portal-internal-dispar/dtw', icon: MapPin },
          { label: 'Desa Wisata', path: '/portal-internal-dispar/desa-wisata', icon: Compass },
        ]
      },
      {
        label: 'Promosi & Pemasaran',
        icon: TrendingUp,
        children: [
          { label: 'Slider Hero Utama', path: '/portal-internal-dispar/slider', icon: Images },
          { label: 'Berita & Artikel', path: '/portal-internal-dispar/berita', icon: Newspaper },
        ]
      }
    ]
  },
  { 
    label: 'Warna Tema', 
    path: '/portal-internal-dispar/tema', 
    icon: Palette 
  },
];

// Helper recursive flatten untuk item-item leaves (untuk mobile atau pencarian)
export const getFlattenedMenu = (items) => {
  let res = [];
  items.forEach(it => {
    if (it.path) {
      res.push(it);
    }
    if (it.children) {
      res = res.concat(getFlattenedMenu(it.children));
    }
  });
  return res;
};

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [nestedOpen, setNestedOpen] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/portal-internal-dispar/login';
    }
  }, []);

  // Tutup dropdown jika rute berubah atau klik di luar area navbar
  useEffect(() => {
    setOpenDropdown(null);
    setNestedOpen(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setNestedOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/portal-internal-dispar/login';
  };

  const isItemActive = (item) => {
    if (item.path) {
      return (location.pathname + location.search) === item.path || location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(c => isItemActive(c));
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Top Sub-Bar (Topbar Mini) */}
      <div className="w-full bg-[#162744] text-white/80 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Portal Terautentikasi
          </div>
          <span className="hidden sm:inline text-white/60">•</span>
          <span className="hidden sm:inline text-white/70">
            Pemerintah Provinsi Sulawesi Tengah • <span className="text-amber-400 font-semibold">Bumi Seribu Megalit</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" /> Buka Web Publik
          </Link>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#1F5BA6] to-[#5C2180] flex items-center justify-center text-[10px] font-bold text-white">
              A
            </div>
            <span className="font-semibold text-xs hidden md:inline">Administrator</span>
          </div>
        </div>
      </div>

      {/* 2. Main Top Navbar (Multi-Level Dropdown) */}
      <header
        className="sticky top-0 z-40 w-full text-white shadow-md border-b border-white/10 transition-colors duration-300"
        style={{ background: 'var(--theme-gradient, linear-gradient(to right, #1F5BA6, #383087, #5C2180))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand & Logo */}
          <Link to="/portal-internal-dispar/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="h-11 px-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-sm">
              <img
                src="/dinas pariwisata-COLOR WHITE.png"
                alt="Logo Dinas Pariwisata"
                className="h-9 w-auto object-contain drop-shadow"
                onError={(e) => { e.currentTarget.src = '/images/dinas_pariwisata-COLOR_BLACK.png'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg md:text-xl tracking-tight leading-tight text-white">
                  Admin Panel
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase">
                  CMS
                </span>
              </div>
              <p className="text-amber-400 text-[10px] md:text-xs font-bold tracking-wider uppercase leading-tight">
                DINAS PARIWISATA SULTENG
              </p>
            </div>
          </Link>

          {/* Desktop Nav in Glassy Pill with Multi-Level Dropdowns */}
          <nav 
            ref={navRef}
            className="hidden lg:inline-flex items-center gap-1 p-1.5 rounded-full border border-white/20 bg-white/15 backdrop-blur-md shadow-inner relative"
          >
            {ADMIN_NAV_TREE.map((item, idx) => {
              const hasSub = Array.isArray(item.children) && item.children.length > 0;
              const active = isItemActive(item);
              const isOpen = openDropdown === idx;
              const Icon = item.icon;

              if (!hasSub) {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <div key={idx} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(isOpen ? null : idx);
                      setNestedOpen(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                      active || isOpen
                        ? 'bg-white/30 text-white shadow-sm ring-1 ring-white/40'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Level 1 Dropdown Panel */}
                  {isOpen && (
                    <div 
                      className="absolute left-0 mt-2.5 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}
                    >
                      <div className="px-3 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {item.label}
                        </span>
                        <span className="text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded">
                          Modul
                        </span>
                      </div>

                      {item.children.map((sub, sidx) => {
                        const hasNested = Array.isArray(sub.children) && sub.children.length > 0;
                        const isSubActive = isItemActive(sub);
                        const SubIcon = sub.icon || ChevronRight;
                        const isSubOpen = nestedOpen === sidx;

                        if (hasNested) {
                          return (
                            <div 
                              key={sidx} 
                              className="relative"
                              onMouseEnter={() => setNestedOpen(sidx)}
                            >
                              <button
                                type="button"
                                onClick={() => setNestedOpen(isSubOpen ? null : sidx)}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold rounded-xl transition-all mx-1.5 cursor-pointer ${
                                  isSubActive || isSubOpen
                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                    : 'text-slate-700 hover:bg-slate-100/80'
                                }`}
                                style={{ width: 'calc(100% - 12px)' }}
                              >
                                <div className="flex items-center gap-2">
                                  <SubIcon className="w-4 h-4 text-blue-600" />
                                  <span>{sub.label}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              </button>

                              {/* Level 2 Nested Dropdown (Flyout) */}
                              {isSubOpen && (
                                <div 
                                  className="absolute left-full top-0 ml-1.5 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                                  style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}
                                >
                                  <div className="px-3 py-1.5 mb-1 border-b border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                      {sub.label}
                                    </span>
                                  </div>
                                  {sub.children.map((child, cidx) => {
                                    const isChildActive = (location.pathname + location.search) === child.path;
                                    const ChildIcon = child.icon || ChevronRight;
                                    return (
                                      <Link
                                        key={cidx}
                                        to={child.path}
                                        onClick={() => {
                                          setOpenDropdown(null);
                                          setNestedOpen(null);
                                        }}
                                        className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all mx-1.5 ${
                                          isChildActive
                                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                                            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                        style={{ width: 'calc(100% - 12px)' }}
                                      >
                                        <ChildIcon className={`w-3.5 h-3.5 ${isChildActive ? 'text-white' : 'text-blue-500'}`} />
                                        <span>{child.label}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={sidx}
                            to={sub.path}
                            onClick={() => {
                              setOpenDropdown(null);
                              setNestedOpen(null);
                            }}
                            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all mx-1.5 ${
                              isSubActive
                                ? 'bg-blue-600 text-white font-bold shadow-sm'
                                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                            style={{ width: 'calc(100% - 12px)' }}
                          >
                            <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-white' : 'text-blue-600'}`} />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-200 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Horizontal Scroll (Multi-item pills) */}
        <div className="lg:hidden border-t border-white/10 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {getFlattenedMenu(ADMIN_NAV_TREE).map((item, idx) => {
            const active = (location.pathname + location.search) === item.path || location.pathname === item.path;
            const Icon = item.icon || ChevronRight;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-white/80 hover:bg-white/15'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({ berita: 0, dtw: 0, desa: 0, slider: 0, profil: 0, ppid: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/berita?limit=1').catch(() => ({ data: { total: 0 } })),
      api.get('/info-pariwisata/dtw').catch(() => ({ data: [] })),
      api.get('/info-pariwisata/desa-wisata').catch(() => ({ data: [] })),
      api.get('/slider/all').catch(() => ({ data: [] })),
      api.get('/profil/all').catch(() => ({ data: [] })),
      api.get('/ppid/kategori').catch(() => ({ data: [] })),
    ]).then(([b, d, dw, sl, pf, pk]) => {
      setStats({
        berita: b.data?.total || 0,
        dtw: d.data?.length || 0,
        desa: dw.data?.length || 0,
        slider: sl.data?.length || 0,
        profil: pf.data?.length || 0,
        ppid: pk.data?.length || 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Berita', value: stats.berita, icon: Newspaper, color: 'bg-gradient-to-br from-[#1F5BA6] to-[#0369a1]', path: '/portal-internal-dispar/berita' },
    { label: 'Slider Hero Aktif', value: stats.slider, icon: Images, color: 'bg-gradient-to-br from-[#eab308] to-[#ca8a04]', path: '/portal-internal-dispar/slider' },
    { label: 'Daya Tarik Wisata', value: stats.dtw, icon: MapPin, color: 'bg-gradient-to-br from-[#059669] to-[#047857]', path: '/portal-internal-dispar/dtw' },
    { label: 'Desa Wisata', value: stats.desa, icon: Compass, color: 'bg-gradient-to-br from-[#5C2180] to-[#7c3aed]', path: '/portal-internal-dispar/desa-wisata' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Banner Selamat Datang Bergaya Hero Halaman Utama */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-white shadow-lg border border-white/10 transition-colors duration-300"
          style={{ background: 'var(--theme-gradient, linear-gradient(to right, #1F5BA6, #383087, #5C2180))' }}
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold text-amber-300 border border-white/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Pusat Kontrol Manajemen Data Terpadu
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Selamat Datang di Panel Admin Dispar</h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Kelola informasi profil dinas, transparansi PPID, destinasi wisata Sulawesi Tengah, promosi berita, dan kustomisasi visual web secara langsung melalui navigasi bertingkat di atas.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
            <img src="/dinas pariwisata-COLOR WHITE.png" alt="Emblem" className="w-80 h-auto object-contain" />
          </div>
        </div>

        {/* Grid Kartu Statistik */}
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            Ringkasan Konten Portal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, idx) => (
              <Link
                key={idx}
                to={card.path}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{card.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Akses Cepat Modul Berdasarkan Hirarki */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
          <h2 className="font-black text-slate-900 text-base mb-4">Navigasi Cepat Seluruh Modul Admin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADMIN_NAV_TREE.filter(m => m.children).map((group, gidx) => (
              <div key={gidx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-2 text-sm font-black text-slate-800 mb-3 pb-2 border-b border-slate-200">
                  <group.icon className="w-4 h-4 text-blue-600" />
                  <span>{group.label}</span>
                </div>
                <div className="space-y-1.5">
                  {getFlattenedMenu(group.children).map((sub, sidx) => (
                    <Link
                      key={sidx}
                      to={sub.path}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 transition-colors"
                    >
                      <span>{sub.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
