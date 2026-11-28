import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  Check,
  ChevronDown,
  Compass,
  FileText,
  Globe,
  Images,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  Palette,
  Sparkles,
  Upload,
  User,
  X,
} from 'lucide-react';
import '../admin.css';
import {
  BLUR,
  SCALE,
  SPRING,
  SPRING_SHEET,
  TRANSITION,
  getPageVariants,
} from '../adminMotion';

const useIsMobile = (breakpoint = 720) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return isMobile;
};

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', shortLabel: 'Dashboard', path: '/portal-internal-dispar/dashboard', icon: LayoutDashboard },
  { label: 'Slider Hero', shortLabel: 'Slider', path: '/portal-internal-dispar/slider', icon: Images },
  { label: 'Berita & Artikel', shortLabel: 'Berita', path: '/portal-internal-dispar/berita', icon: Newspaper },
  { label: 'Daya Tarik Wisata', shortLabel: 'DTW', path: '/portal-internal-dispar/dtw', icon: Compass },
  { label: 'Desa Wisata', shortLabel: 'Desa', path: '/portal-internal-dispar/desa-wisata', icon: MapPin },
  { label: 'Dokumen PPID', shortLabel: 'PPID', path: '/portal-internal-dispar/ppid', icon: FileText },
  { label: 'Profil Dinas', shortLabel: 'Profil', path: '/portal-internal-dispar/profil', icon: Building2 },
  { label: 'Studio Poster & QR', shortLabel: 'Poster', path: '/portal-internal-dispar/poster', icon: Sparkles },
  { label: 'Warna Tema', shortLabel: 'Tema', path: '/portal-internal-dispar/tema', icon: Palette },
];

const ToastContext = createContext({ showToast: () => {} });

export const useAdminToast = () => useContext(ToastContext);

export const AdminPageShell = ({ children }) => {
  const reduce = useReducedMotion();
  const variants = getPageVariants(reduce);
  return (
    <motion.div variants={variants} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
};

export const AdminLayout = ({ children, drawerOpen = false }) => {
  const location = useLocation();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile(720);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', key: 0 });
  const closeTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const menuWrapRef = useRef(null);
  const fabWrapRef = useRef(null);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();
  const displayName = storedUser?.username || storedUser?.nama || 'admin';

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimerRef.current);
    setToast((prev) => ({ visible: true, message, type, key: prev.key + 1 }));
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/portal-internal-dispar/login';
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('admin-active');
    return () => {
      document.body.classList.remove('admin-active');
      document.body.classList.remove('drawer-open');
      document.body.classList.remove('drawer-animating');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('drawer-open', drawerOpen);
    document.body.classList.add('drawer-animating');
    const t = setTimeout(() => document.body.classList.remove('drawer-animating'), 420);
    return () => clearTimeout(t);
  }, [drawerOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    const onClickOutside = (e) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (fabWrapRef.current && !fabWrapRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const openMenu = () => {
    clearTimeout(closeTimerRef.current);
    setMenuOpen(true);
  };

  const scheduleCloseMenu = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setMenuOpen(false), 220);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/portal-internal-dispar/login';
  };

  const isNavActive = (path) => location.pathname === path;

  return (
    <MotionConfig reducedMotion="user">
      <ToastContext.Provider value={{ showToast }}>
        <div className="admin-scope">
          <div id="app" className="admin-app">
            {/* Topbar 3-chip */}
            <header className="admin-topbar">
              <Link to="/portal-internal-dispar/dashboard" className="admin-chip glass-dark admin-chip-brand">
                <div className="admin-chip-logo">
                  <MapPin className="ic" />
                </div>
                <div>
                  <div className="admin-chip-title">
                    Admin Panel <span className="admin-cms-badge">CMS</span>
                  </div>
                  <div className="admin-chip-sub">DINAS PARIWISATA SULTENG</div>
                </div>
              </Link>

              {/* Pil menu desktop */}
              <div
                ref={menuWrapRef}
                className={`admin-menu-wrap ${menuOpen ? 'open' : ''}`}
                onMouseEnter={openMenu}
                onMouseLeave={scheduleCloseMenu}
                onFocus={openMenu}
                onBlur={scheduleCloseMenu}
              >
                <div className="admin-menu-pill">
                  <button
                    type="button"
                    className="admin-menu-trigger"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    onClick={openMenu}
                  >
                    <Menu className="ic" strokeWidth={2.4} />
                    <span>Menu</span>
                    <ChevronDown className="ic-sm chev" strokeWidth={2.4} />
                  </button>

                  <nav className="admin-menu-items" aria-label="Menu admin">
                    {ADMIN_NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isNavActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          title={item.label}
                          className={`admin-menu-item ${active ? 'active' : ''}`}
                        >
                          <Icon className="ic-sm" />
                          <span>{item.shortLabel || item.label}</span>
                        </Link>
                      );
                    })}
                    <button
                      type="button"
                      onClick={handleLogout}
                      title="Logout"
                      className="admin-menu-item logout-item"
                    >
                      <LogOut className="ic-sm" />
                      <span>Keluar</span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Chip kanan */}
              <div className="admin-chip glass-dark admin-chip-user">
                <div className="admin-avatar">
                  <User className="ic" />
                </div>
                <span className="admin-user-name">{displayName}</span>
                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className="admin-icon-btn globe"
                  title="Buka Web Publik"
                  aria-label="Buka Web Publik"
                >
                  <Globe className="ic" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="admin-icon-btn"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <LogOut className="ic" />
                </button>
              </div>
            </header>

            <main className="admin-main">{children}</main>
          </div>

          {/* Mobile FAB + kotak popup di luar #app agar position:fixed selalu relatif terhadap viewport */}
          {!drawerOpen && (
            <div ref={fabWrapRef}>
              <motion.button
                type="button"
                className={`admin-fab-menu ${mobileOpen ? 'open' : ''}`}
                aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                aria-haspopup="true"
                aria-expanded={mobileOpen}
                whileTap={reduce ? undefined : { scale: SCALE.press }}
                transition={SPRING.press}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={TRANSITION.swap}
                      style={{ display: 'grid', placeItems: 'center' }}
                    >
                      <X className="ic" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.6 }}
                      transition={TRANSITION.swap}
                      style={{ display: 'grid', placeItems: 'center' }}
                    >
                      <Menu className="ic" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <AnimatePresence>
                {mobileOpen && (
                  <motion.div
                    className="admin-fab-pop"
                    role="menu"
                    aria-label="Menu admin mobile"
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: 12, scale: SCALE.popover, filter: BLUR.surface }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1, filter: BLUR.none }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: 8, scale: 0.92, filter: BLUR.icon }
                    }
                    transition={SPRING.pop}
                    style={{ transformOrigin: 'bottom right' }}
                  >
                    {ADMIN_NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isNavActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={`admin-m-item ${active ? 'active' : ''}`}
                        >
                          <Icon className="ic-sm" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="admin-m-item logout-item"
                    >
                      <LogOut className="ic-sm" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Floating Toast */}
          <AnimatePresence>
            {toast.visible && (
              <motion.div
                key={toast.key}
                role="status"
                aria-live="polite"
                className={`admin-toast ${toast.type === 'error' ? 'error' : ''}`}
                initial={
                  reduce
                    ? { opacity: 0, x: '-50%' }
                    : { opacity: 0, x: '-50%', y: 28, scale: SCALE.toast, filter: BLUR.surface }
                }
                animate={{ opacity: 1, x: '-50%', y: 0, scale: 1, filter: BLUR.none }}
                exit={
                  reduce
                    ? { opacity: 0, x: '-50%' }
                    : { opacity: 0, x: '-50%', y: 18, scale: SCALE.toast, transition: TRANSITION.dismiss }
                }
                transition={SPRING.toast}
              >
                {toast.type === 'error' ? <X className="ic-sm" /> : <Check className="ic-sm" />}
                <span>{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToastContext.Provider>
    </MotionConfig>
  );
};

export const AdminDrawer = ({
  open,
  onClose,
  title,
  onSubmit,
  submitting = false,
  submitLabel = 'Simpan',
  children,
}) => {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile(720);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const raf = requestAnimationFrame(() => {
      const firstInput = bodyRef.current?.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    });
    return () => {
      document.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
    };
  }, [open, onClose]);

  const initialPos = reduce ? { opacity: 0 } : isMobile ? { y: '100%' } : { x: '103%' };
  const activePos = reduce ? { opacity: 1 } : isMobile ? { y: 0 } : { x: 0 };
  const exitPos = reduce
    ? { opacity: 0 }
    : isMobile
      ? { y: '100%', transition: TRANSITION.dismiss }
      : { x: '103%', transition: TRANSITION.drawerOut };

  const drawerContent = (
    <div className="admin-scope">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="admin-drawer-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={TRANSITION.overlay}
              onClick={onClose}
            />
            <motion.aside
              className="admin-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={initialPos}
              animate={activePos}
              exit={exitPos}
              transition={isMobile ? SPRING_SHEET : TRANSITION.drawer}
              drag={isMobile && !reduce ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.04, bottom: 0.35 }}
              onDragEnd={(_, info) => {
                if (isMobile && (info.offset.y > 90 || info.velocity.y > 450)) {
                  onClose();
                }
              }}
            >
              {isMobile && <div className="admin-sheet-handle" aria-hidden="true" />}
              <div className="admin-drawer-head">
                <div>
                  <span className={`admin-drawer-badge ${/^edit/i.test(title) ? 'edit' : 'add'}`}>
                    {/^edit/i.test(title) ? 'Mode Edit' : 'Tambah Data Baru'}
                  </span>
                  <h3 className="admin-drawer-title">{title}</h3>
                </div>
                <motion.button
                  type="button"
                  className="admin-drawer-close"
                  aria-label="Tutup"
                  whileTap={reduce ? undefined : { scale: SCALE.press }}
                  onClick={onClose}
                >
                  <X className="ic" />
                </motion.button>
              </div>
              <form onSubmit={onSubmit} className="admin-drawer-form">
                <motion.div
                  className="admin-drawer-body"
                  ref={bodyRef}
                  initial={reduce ? undefined : { opacity: 0, y: 8 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.08 }}
                >
                  {children}
                </motion.div>
                <div className="admin-drawer-foot">
                  <motion.button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    whileTap={reduce ? undefined : { scale: SCALE.press }}
                    transition={SPRING.press}
                    onClick={onClose}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="admin-btn admin-btn-amber"
                    whileTap={reduce ? undefined : { scale: SCALE.press }}
                    transition={SPRING.press}
                  >
                    {submitting ? 'Menyimpan...' : submitLabel}
                  </motion.button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : null;
};

export const AdminDropzone = ({
  accept = 'image/*',
  previewUrl,
  fileName,
  hint = 'Klik untuk memilih berkas, atau seret ke sini',
  onFileSelect,
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const f = files?.[0];
    if (f) onFileSelect(f);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`admin-dropzone ${dragging ? 'dragging' : ''}`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {previewUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxHeight: 150, maxWidth: '100%', borderRadius: 10, objectFit: 'cover' }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
            {fileName || 'Klik atau seret untuk mengganti'}
          </span>
        </div>
      ) : fileName ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <FileText className="ic" style={{ color: 'var(--blue)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{fileName}</span>
          <span style={{ fontSize: 11.5 }}>Klik untuk mengganti berkas</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Upload className="ic" />
          <span>{hint}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export const AdminConfirmModal = ({
  open,
  title = 'Hapus Data',
  message,
  confirmLabel = 'Hapus',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  const modalContent = (
    <div className="admin-scope">
      <AnimatePresence>
        {open && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.overlay}
            onClick={onCancel}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-label={title}
              className="admin-modal-card"
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: SCALE.dialog, filter: BLUR.surface, transformPerspective: 500, rotateX: -12 }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, filter: BLUR.none, transformPerspective: 500, rotateX: 0 }
              }
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, filter: BLUR.icon, transition: TRANSITION.dismiss }
              }
              transition={SPRING.dialog}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{title}</h3>
              <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                {message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <motion.button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  whileTap={reduce ? undefined : { scale: SCALE.press }}
                  transition={SPRING.press}
                  onClick={onCancel}
                >
                  Batal
                </motion.button>
                <motion.button
                  type="button"
                  disabled={loading}
                  className="admin-btn admin-btn-danger"
                  whileTap={reduce ? undefined : { scale: SCALE.press }}
                  transition={SPRING.press}
                  onClick={onConfirm}
                >
                  {loading ? 'Menghapus...' : confirmLabel}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
