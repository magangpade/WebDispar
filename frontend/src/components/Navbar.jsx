import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SeasonalIcon } from './SeasonalIcon';
import SearchModal from './SearchModal';
import { useLanguage } from '../context/LanguageContext';
import { UI_STRINGS, getNavMenus } from '../utils/translations';

const DEFAULT_MENUS = getNavMenus('ID', false);

const LogoSymbol = ({ className = 'h-11 sm:h-12 md:h-14 w-auto object-contain' }) => (
  <img
    src="/dinas-pariwisata-logo-clean.png?v=clean"
    alt="Logo Dinas Pariwisata"
    className={`${className} shrink-0 drop-shadow-md select-none`}
  />
);

// Dropdown panel styles (Glassy White/Purple sesuai WebDispar Original)
const panelStyle = (extra = {}, small = false) => ({
  position: 'absolute',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
  zIndex: 9999,
  minWidth: small ? 180 : 220,
  padding: '6px',
  ...extra,
});

const itemBase = (active, small = false) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', padding: small ? '7px 13px' : '10px 16px',
  fontSize: small ? 12 : 13, cursor: 'pointer',
  color: active ? '#7c3aed' : '#334155',
  background: active ? '#f5f3ff' : 'transparent',
  border: 'none', textAlign: 'left',
  borderRadius: 8,
  fontWeight: active ? 700 : 500,
  transition: 'all 0.15s ease',
});

const SubPanel = ({ items, onClose, small = false }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const pos = { top: 0, left: '100%', marginLeft: 4 };

  // Jika item di subpanel ini tidak memiliki turunan ke samping (leaf submenu seperti Dokumen SAKIP, Data Kepegawaian),
  // aktifkan scrolling max-height agar tidak terpotong di layar bawah
  const hasNestedSub = items.some(
    (it) => Array.isArray(it.children) && it.children.length > 0 && !it.inlineChildren
  );

  const scrollStyle = hasNestedSub
    ? {}
    : {
        maxHeight: 'min(480px, calc(100vh - 120px))',
        overflowY: 'auto',
      };

  return (
    <div
      className={!hasNestedSub ? 'dropdown-scroll' : ''}
      style={panelStyle({ ...pos, ...scrollStyle }, small)}
    >
      {items.map((item, idx) => {
        const hasSub = Array.isArray(item.children) && item.children.length > 0;
        if (hasSub && item.inlineChildren) return (
          <div key={idx}>
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              style={itemBase(openIdx === idx, small)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
              onMouseLeave={(e) => { if (openIdx !== idx) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; } }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              <ChevronDown size={11} style={{ opacity: 0.5, flexShrink: 0, transition: 'transform 0.2s', transform: openIdx === idx ? 'rotate(180deg)' : 'none' }} />
            </button>
            {openIdx === idx && (
              <div style={{ borderTop: '1px solid #f1f5f9', maxHeight: 240, overflowY: 'auto' }}>
                {item.children.map((child, cidx) => (
                  <Link
                    key={cidx}
                    to={child.path}
                    onClick={onClose}
                    style={{ display: 'block', padding: '6px 13px 6px 22px', fontSize: 11, color: '#64748b', textDecoration: 'none', borderRadius: 6 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#7c3aed'; e.currentTarget.style.background = '#f5f3ff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
        if (hasSub) return (
          <div key={idx} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              style={itemBase(openIdx === idx, small)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
              onMouseLeave={(e) => { if (openIdx !== idx) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; } }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              <ChevronRight size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
            </button>
            {openIdx === idx && <SubPanel items={item.children} onClose={onClose} small />}
          </div>
        );
        if (item.external) return (
          <a
            key={idx}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            style={{ display: 'block', padding: small ? '7px 13px' : '10px 16px', fontSize: small ? 12 : 13, color: '#334155', textDecoration: 'none', borderRadius: 8, fontWeight: 500 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
          >
            {item.label}
          </a>
        );
        return (
          <Link
            key={idx}
            to={item.path}
            onClick={onClose}
            style={{ display: 'block', padding: small ? '7px 13px' : '10px 16px', fontSize: small ? 12 : 13, color: '#334155', textDecoration: 'none', borderRadius: 8, fontWeight: 500 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

const DropdownPanel = ({ items, onClose }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const pos = { top: '100%', left: 0, marginTop: 6 };

  return (
    <div style={panelStyle(pos, true)}>
      {items.map((item, idx) => {
        const hasSub = Array.isArray(item.children) && item.children.length > 0;
        if (hasSub) return (
          <div key={idx} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              style={itemBase(openIdx === idx, true)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
              onMouseLeave={(e) => { if (openIdx !== idx) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; } }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              <ChevronRight size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
            </button>
            {openIdx === idx && <SubPanel items={item.children} onClose={onClose} small />}
          </div>
        );
        if (item.external) return (
          <a
            key={idx}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            style={{ display: 'block', padding: '7px 13px', fontSize: 12, color: '#334155', textDecoration: 'none', borderRadius: 8, fontWeight: 500 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
          >
            {item.label}
          </a>
        );
        return (
          <Link
            key={idx}
            to={item.path}
            onClick={onClose}
            style={{ display: 'block', padding: '7px 13px', fontSize: 12, color: '#334155', textDecoration: 'none', borderRadius: 8, fontWeight: 500 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export const Navbar = ({ onToggleMobile, language: propLanguage, setLanguage: propSetLanguage }) => {
  const { theme } = useTheme();
  const { language: contextLang, setLanguage: contextSetLang } = useLanguage();
  const language = propLanguage || contextLang || 'ID';
  const setLanguage = propSetLanguage || contextSetLang;
  const isEn = language === 'EN';
  const strings = UI_STRINGS[language] || UI_STRINGS.ID;
  const menus = getNavMenus(language, false);

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  // Click outside listener persis WebDispar Original
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeAll = () => setActiveMenu(null);

  const handleLogoClick = (e) => {
    closeAll();
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMenuClick = (e, menu) => {
    closeAll();
    if (menu.path === '/' && location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (menu.path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isActive = (menu) => {
    if (menu.path) return location.pathname === menu.path;
    return false;
  };

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-40 w-full flex justify-center transition-all duration-300 backdrop-blur-md border-b border-white/20 shadow-md"
        style={{
          background: 'var(--theme-gradient, linear-gradient(to right, #1F5BA6, #383087, #5C2180))',
          opacity: 0.96
        }}
      >
        <div className="flex max-w-7xl h-20 items-center justify-between px-3 sm:px-4 md:px-6 w-full">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} data-tour="nav-logo" className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0 cursor-pointer">
            <div className="relative">
              <LogoSymbol />
              {theme.badge_icon && theme.badge_icon !== 'none' && (
                <div
                  className="absolute -top-1 -right-2 w-5 h-5 rounded-full bg-white/90 backdrop-blur border border-white/60 p-0.5 shadow-md flex items-center justify-center animate-bounce pointer-events-none"
                  title={theme.seasonal_badge}
                >
                  <SeasonalIcon type={theme.badge_icon} className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-black text-lg md:text-xl tracking-tight leading-tight text-white whitespace-nowrap">
                {strings.deptName || 'Dinas Pariwisata'}
              </span>
              <span className="font-bold text-amber-400 text-[9px] sm:text-[10px] md:text-[11px] tracking-wider uppercase whitespace-nowrap leading-tight">
                {strings.provinceName || 'PROVINSI SULAWESI TENGAH'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav in Glassy Pill (Warna Ungu & Kaca Sesuai WebDispar Original) */}
          <nav data-tour="nav-menus" className="hidden lg:inline-flex items-center gap-1 p-1 rounded-full border border-white/20 bg-white/15 backdrop-blur-sm shadow-inner transition-all duration-300">
            {menus.map((menu, idx) => {
              const active = isActive(menu);
              if (menu.children) {
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1 ${
                        activeMenu === idx
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <span>{menu.label}</span>
                      <ChevronDown
                        size={11}
                        style={{
                          transition: 'transform 0.2s',
                          transform: activeMenu === idx ? 'rotate(180deg)' : 'none',
                        }}
                      />
                    </button>
                    {activeMenu === idx && (
                      <DropdownPanel
                        items={menu.children}
                        onClose={closeAll}
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
                    onClick={closeAll}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      active ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {menu.label}
                  </a>
                );
              }
              return (
                <Link
                  key={idx}
                  to={menu.path}
                  onClick={(e) => handleMenuClick(e, menu)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-white hover:bg-white/20'
                  }`}
                >
                  {menu.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Hanya Search, ID/EN, dan Hamburger Mobile - TANPA Destinasi) */}
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              data-tour="search-btn"
              className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 text-white transition-colors"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
            <div data-tour="lang-toggle" className="hidden md:inline-flex items-center gap-1 rounded-full px-1 py-0.5 border border-white/20 bg-white/15 backdrop-blur-sm transition-all duration-300">
              {['ID', 'EN'].map((lang, i) => (
                <span key={lang} className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage && setLanguage(lang)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      language === lang
                        ? 'bg-amber-500 text-slate-900 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                  {i === 0 && <span className="text-white/40 text-[10px]">/</span>}
                </span>
              ))}
            </div>
            <button
              onClick={onToggleMobile}
              data-tour="mobile-menu"
              aria-label="Menu"
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
      />
    </>
  );
};

export default Navbar;
