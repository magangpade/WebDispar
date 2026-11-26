import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  Compass,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  MapPin,
  Newspaper,
  Palette,
  RotateCcw,
  Save,
  User,
} from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { SeasonalIcon } from '../../components/SeasonalIcon';
import { AdminLayout, AdminPageShell, useAdminToast } from './components/AdminUI';
import { SCALE, SPRING } from './adminMotion';

const PRESET_TEMAS = [
  {
    nama: 'Sulteng Biru Ungu (Default)',
    desc: 'Gradasi biru–ungu khas Dinas Pariwisata.',
    primary: '#1F5BA6',
    secondary: '#383087',
    accent: '#5C2180',
    highlight: '#F59E0B',
    badge_icon: 'none',
    seasonal_badge: '',
  },
  {
    nama: 'Ramadhan & Idul Fitri',
    desc: 'Hijau zamrud dan emas yang hangat.',
    primary: '#059669',
    secondary: '#047857',
    accent: '#064E3B',
    highlight: '#FBBF24',
    badge_icon: 'ketupat',
    seasonal_badge: 'Ramadhan & Idul Fitri',
  },
  {
    nama: 'HUT Kemerdekaan RI',
    desc: 'Merah putih semangat kemerdekaan.',
    primary: '#B91C1C',
    secondary: '#DC2626',
    accent: '#991B1B',
    highlight: '#F59E0B',
    badge_icon: 'kemerdekaan',
    seasonal_badge: 'Dirgahayu Republik Indonesia',
  },
  {
    nama: 'Natal & Tahun Baru',
    desc: 'Merah, hijau, dan emas perayaan.',
    primary: '#14532D',
    secondary: '#991B1B',
    accent: '#1E3A8A',
    highlight: '#FACC15',
    badge_icon: 'natal',
    seasonal_badge: 'Merry Christmas & Happy New Year',
  },
  {
    nama: 'Tahun Baru Imlek',
    desc: 'Merah dan emas penuh keberuntungan.',
    primary: '#991B1B',
    secondary: '#B91C1C',
    accent: '#7F1D1D',
    highlight: '#FDE047',
    badge_icon: 'imlek',
    seasonal_badge: 'Gong Xi Fa Cai',
  },
  {
    nama: 'Festival Budaya Bumi Megalit',
    desc: 'Ungu dan biru megalit Sulawesi Tengah.',
    primary: '#7C3AED',
    secondary: '#383087',
    accent: '#1F5BA6',
    highlight: '#F59E0B',
    badge_icon: 'megalit',
    seasonal_badge: 'Bumi Seribu Megalit Sulteng',
  },
  {
    nama: 'Royal Deep Ocean',
    desc: 'Biru samudra dalam dan tenang.',
    primary: '#0369A1',
    secondary: '#1E40AF',
    accent: '#312E81',
    highlight: '#38BDF8',
    badge_icon: 'none',
    seasonal_badge: '',
  },
  {
    nama: 'Emerald Bahari Togean',
    desc: 'Tosca laut dan biru Kepulauan Togean.',
    primary: '#047857',
    secondary: '#0F766E',
    accent: '#1E3A8A',
    highlight: '#FBBF24',
    badge_icon: 'none',
    seasonal_badge: '',
  },
];

const AdminTemaContent = () => {
  const { theme, updateThemeState } = useTheme();
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();

  const [form, setForm] = useState({
    nama_tema: theme.nama_tema || 'Sulteng Biru Ungu (Default)',
    primary_color: theme.primary_color || '#1F5BA6',
    secondary_color: theme.secondary_color || '#383087',
    accent_color: theme.accent_color || '#5C2180',
    highlight_color: theme.highlight_color || '#F59E0B',
    badge_icon: theme.badge_icon || 'none',
    seasonal_badge: theme.seasonal_badge || '',
  });
  const [saving, setSaving] = useState(false);
  const [previewTarget, setPreviewTarget] = useState('user');

  useEffect(() => {
    if (theme) {
      setForm({
        nama_tema: theme.nama_tema || 'Sulteng Biru Ungu (Default)',
        primary_color: theme.primary_color || '#1F5BA6',
        secondary_color: theme.secondary_color || '#383087',
        accent_color: theme.accent_color || '#5C2180',
        highlight_color: theme.highlight_color || '#F59E0B',
        badge_icon: theme.badge_icon || 'none',
        seasonal_badge: theme.seasonal_badge || '',
      });
    }
  }, [theme]);

  const applyPreset = (preset) => {
    const updated = {
      nama_tema: preset.nama,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      highlight_color: preset.highlight,
      badge_icon: preset.badge_icon || 'none',
      seasonal_badge: preset.seasonal_badge || '',
    };
    setForm(updated);
    updateThemeState(updated);
    showToast(`Pratinjau tema "${preset.nama}" diterapkan — klik Simpan Tema untuk menyimpan`);
  };

  const handleColorChange = (key, val) => {
    const updated = { ...form, [key]: val, nama_tema: 'Tema Kustom' };
    setForm(updated);
    updateThemeState(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/tema', form);
      updateThemeState(res.data.data);
      showToast('Tema website berhasil disimpan ke database');
    } catch {
      showToast('Gagal menyimpan tema', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const res = await api.post('/tema/reset');
      setForm(res.data.data);
      updateThemeState(res.data.data);
      showToast('Tema dikembalikan ke Default Dispar');
    } catch {
      showToast('Gagal mereset tema', 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewVars = {
    '--blue': form.primary_color,
    '--purple': form.accent_color,
    '--amber': form.highlight_color,
    '--grad': `linear-gradient(135deg, ${form.primary_color}, ${form.secondary_color} 55%, ${form.accent_color})`,
  };

  return (
    <AdminPageShell>
      <div className="admin-panel glass">
        <div className="admin-panel-head">
          <div>
            <h1 className="admin-panel-title">Warna Tema</h1>
            <p className="admin-panel-sub">
              Atur tampilan panel admin &amp; portal — pilih preset musiman atau racik warna sendiri.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <motion.button
              type="button"
              disabled={saving}
              onClick={handleReset}
              className="admin-btn admin-btn-ghost"
              whileTap={reduce ? undefined : { scale: SCALE.press }}
              transition={SPRING.press}
            >
              <RotateCcw className="ic-sm" />
              <span>Reset Tema</span>
            </motion.button>
            <motion.button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="admin-btn admin-btn-amber"
              whileTap={reduce ? undefined : { scale: SCALE.press }}
              transition={SPRING.press}
            >
              <Save className="ic-sm" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Tema'}</span>
            </motion.button>
          </div>
        </div>

        <h2 className="admin-section-title" style={{ marginTop: 18 }}>
          Preset Tema
        </h2>
        <div className="admin-tema-grid">
          {PRESET_TEMAS.map((preset) => {
            const active =
              form.primary_color.toLowerCase() === preset.primary.toLowerCase() &&
              form.accent_color.toLowerCase() === preset.accent.toLowerCase();
            return (
              <motion.button
                key={preset.nama}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`admin-tema-card ${active ? 'active' : ''}`}
                whileTap={reduce ? undefined : { scale: SCALE.choice }}
                transition={SPRING.press}
              >
                <div
                  className="admin-tema-preview"
                  style={{
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary} 55%, ${preset.accent})`,
                  }}
                >
                  {preset.badge_icon && preset.badge_icon !== 'none' ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 7px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.22)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      <SeasonalIcon type={preset.badge_icon} className="w-3 h-3" />
                      <span>{preset.seasonal_badge}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: preset.highlight,
                      border: '1.5px solid rgba(255,255,255,0.7)',
                    }}
                  />
                </div>
                <div className="admin-tema-name">{preset.nama}</div>
                <div className="admin-tema-desc">{preset.desc}</div>
              </motion.button>
            );
          })}
        </div>

        <h2 className="admin-section-title" style={{ marginTop: 22 }}>
          Warna Kustom
        </h2>
        <div className="admin-tema-custom">
          <label className="admin-tema-field">
            Warna Utama
            <span className="admin-tema-swatch">
              <input
                type="color"
                value={form.primary_color}
                onChange={(e) => handleColorChange('primary_color', e.target.value)}
              />
              <span>{form.primary_color.toUpperCase()}</span>
            </span>
          </label>
          <label className="admin-tema-field">
            Warna Tengah
            <span className="admin-tema-swatch">
              <input
                type="color"
                value={form.secondary_color}
                onChange={(e) => handleColorChange('secondary_color', e.target.value)}
              />
              <span>{form.secondary_color.toUpperCase()}</span>
            </span>
          </label>
          <label className="admin-tema-field">
            Warna Kedua
            <span className="admin-tema-swatch">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => handleColorChange('accent_color', e.target.value)}
              />
              <span>{form.accent_color.toUpperCase()}</span>
            </span>
          </label>
          <label className="admin-tema-field">
            Warna Aksen
            <span className="admin-tema-swatch">
              <input
                type="color"
                value={form.highlight_color}
                onChange={(e) => handleColorChange('highlight_color', e.target.value)}
              />
              <span>{form.highlight_color.toUpperCase()}</span>
            </span>
          </label>
        </div>

        <div className="admin-tema-custom" style={{ marginTop: 14 }}>
          <label className="admin-tema-field" style={{ minWidth: 240 }}>
            Ikon Tematik Hari Besar
            <select
              className="admin-select-inline"
              value={form.badge_icon}
              onChange={(e) => {
                const val = e.target.value;
                const map = {
                  ketupat: 'Ramadhan & Idul Fitri',
                  kemerdekaan: 'Dirgahayu RI',
                  natal: 'Natal & Tahun Baru',
                  imlek: 'Gong Xi Fa Cai',
                  megalit: 'Bumi Seribu Megalit',
                  none: '',
                };
                const updated = {
                  ...form,
                  badge_icon: val,
                  seasonal_badge: val !== 'none' ? form.seasonal_badge || map[val] : '',
                };
                setForm(updated);
                updateThemeState(updated);
              }}
            >
              <option value="none">Tanpa Ikon Khusus (Standar)</option>
              <option value="ketupat">Belah Ketupat (Ramadhan & Idul Fitri)</option>
              <option value="kemerdekaan">Bendera Merah Putih (HUT RI)</option>
              <option value="natal">Pohon Cemara (Natal & Tahun Baru)</option>
              <option value="imlek">Lampion (Tahun Baru Imlek)</option>
              <option value="megalit">Patung Megalit (Sulawesi Tengah)</option>
            </select>
          </label>
          <label className="admin-tema-field" style={{ minWidth: 240, flex: 1, maxWidth: 340 }}>
            Label Hari Besar
            <input
              type="text"
              className="admin-select-inline"
              disabled={form.badge_icon === 'none'}
              placeholder="Contoh: Marhaban Ya Ramadhan"
              value={form.seasonal_badge}
              onChange={(e) => {
                const updated = { ...form, seasonal_badge: e.target.value };
                setForm(updated);
                updateThemeState(updated);
              }}
            />
          </label>
        </div>

        <p className="admin-count-note" style={{ marginTop: 14 }}>
          Warna aksen langsung mengubah ikon statistik, grafik, badge, fokus input, serta portal publik setelah disimpan.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
          <div>
            <h2 className="admin-section-title" style={{ margin: 0 }}>
              {previewTarget === 'user' ? 'Preview Halaman User (Publik)' : 'Preview Panel Admin'}
            </h2>
            <p className="admin-section-sub" style={{ margin: '4px 0 0' }}>
              Pratinjau langsung tampilan website — warnanya berubah mengikuti preset atau warna kustom di atas.
              <span className="pv-swatch" style={previewVars} title="Gradasi tema aktif" />
            </p>
          </div>
          <div className="admin-tabs glass" style={{ margin: 0 }} role="tablist" aria-label="Mode pratinjau tema">
            <button
              type="button"
              role="tab"
              aria-selected={previewTarget === 'user'}
              onClick={() => setPreviewTarget('user')}
              className={`admin-tab ${previewTarget === 'user' ? 'active' : ''}`}
            >
              Halaman User (Publik)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={previewTarget === 'admin'}
              onClick={() => setPreviewTarget('admin')}
              className={`admin-tab ${previewTarget === 'admin' ? 'active' : ''}`}
            >
              Panel Admin
            </button>
          </div>
        </div>

        <div className="pv-wrap" style={previewVars} aria-hidden="true">
          {previewTarget === 'user' ? (
            <div className="pv-pub-shell">
              {/* Topbar Publik */}
              <div
                className="pv-pub-topbar"
                style={{
                  background: `linear-gradient(to right, ${form.primary_color}, ${form.secondary_color}, ${form.accent_color})`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {form.badge_icon && form.badge_icon !== 'none' ? (
                    <span className="pv-pub-badge">
                      <SeasonalIcon type={form.badge_icon} className="w-3 h-3" />
                      <span>{form.seasonal_badge || 'Edisi Khusus'}</span>
                    </span>
                  ) : (
                    <span className="pv-pub-badge" style={{ background: 'rgba(16,185,129,0.2)', borderColor: 'rgba(16,185,129,0.4)', color: '#6ee7b7' }}>
                      ● Portal Resmi
                    </span>
                  )}
                  <span style={{ opacity: 0.85 }}>Pemerintah Provinsi Sulawesi Tengah</span>
                </div>
                <span style={{ opacity: 0.85 }}>dispar@sultengprov.go.id</span>
              </div>

              {/* Navbar Publik */}
              <div
                className="pv-pub-navbar"
                style={{
                  background: `linear-gradient(to right, ${form.primary_color}, ${form.secondary_color}, ${form.accent_color})`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src="/dinas-pariwisata-logo-clean.png?v=clean"
                    alt="Logo"
                    style={{ height: 28, width: 'auto', objectFit: 'contain' }}
                  />
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 11, lineHeight: 1.15 }}>
                      Dinas Pariwisata
                    </div>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: form.highlight_color }}>
                      PROVINSI SULAWESI TENGAH
                    </div>
                  </div>
                </div>
                <div className="pv-pub-navpills">
                  <span style={{ background: form.highlight_color, color: '#0b192c', fontWeight: 800 }}>Home</span>
                  <span>Profil</span>
                  <span>Informasi Publik</span>
                  <span>Info Pariwisata</span>
                  <span>Rencana Terbit</span>
                  <span>Lapor</span>
                </div>
              </div>

              {/* Hero Banner Publik */}
              <div
                className="pv-pub-hero"
                style={{ backgroundImage: 'url(/images/slider/hero-banner-destinasi-1.jpg)' }}
              >
                <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.16)',
                      border: '1px solid rgba(255,255,255,0.28)',
                      fontSize: 8,
                      fontWeight: 700,
                      color: form.highlight_color,
                      marginBottom: 6,
                    }}
                  >
                    WONDERFUL INDONESIA • SULAWESI TENGAH
                  </span>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>
                    Eksplorasi Keindahan Sulawesi Tengah
                  </div>
                  <div style={{ fontSize: 9.5, opacity: 0.9, marginTop: 4 }}>
                    Pesona Megalit, Bukit Selena, Danau Paisupok, Lore Lindu, dan Kepulauan Togean.
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 10,
                      padding: '6px 13px',
                      borderRadius: 9,
                      background: form.highlight_color,
                      color: '#0b192c',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 800,
                      fontSize: 9.5,
                    }}
                  >
                    Jelajahi Destinasi
                  </span>
                </div>
              </div>

              {/* Seksi Konten Publik */}
              <div className="pv-pub-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 11.5, color: 'var(--ink)' }}>
                      Destinasi &amp; Berita Terkini
                    </div>
                    <div style={{ fontSize: 8.5, color: 'var(--ink-soft)' }}>
                      Aksen tombol, kategori, dan tautan mengikuti warna tema aktif
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: 999,
                      background: form.primary_color,
                      color: '#fff',
                      fontSize: 8.5,
                      fontWeight: 700,
                    }}
                  >
                    Lihat Semua
                  </span>
                </div>
                <div className="pv-pub-cards">
                  {[
                    { title: 'Danau Lindu', tag: 'Alam', img: '/images/admin/danau-lindu.jpg' },
                    { title: 'Air Terjun Saluopa', tag: 'Poso', img: '/images/admin/air-terjun-saluopa.jpg' },
                    { title: 'Kepulauan Togian', tag: 'Bahari', img: '/images/admin/kepulauan-togian.jpg' },
                  ].map((c) => (
                    <div key={c.title} className="pv-pub-card">
                      <div className="pv-pub-card-img" style={{ backgroundImage: `url(${c.img})` }}>
                        <span
                          style={{
                            position: 'absolute',
                            top: 5,
                            left: 5,
                            padding: '1px 6px',
                            borderRadius: 999,
                            background: form.primary_color,
                            color: '#fff',
                            fontSize: 7.5,
                            fontWeight: 700,
                          }}
                        >
                          {c.tag}
                        </span>
                      </div>
                      <div style={{ padding: '7px 8px' }}>
                        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 9.5, color: 'var(--ink)' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: 8, fontWeight: 700, color: form.accent_color, marginTop: 2 }}>
                          Selengkapnya →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Publik */}
              <div
                className="pv-pub-footer"
                style={{
                  background: `linear-gradient(to bottom, ${form.accent_color}, ${form.secondary_color}, ${form.primary_color})`,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: form.highlight_color, marginBottom: 4 }}>Quick Links</div>
                  <div>Home • Profil • PPID • Info Pariwisata</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: form.highlight_color, marginBottom: 4 }}>Kontak Resmi</div>
                  <div>Jl. Moh. Yamin No. 12, Palu</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: form.highlight_color, marginBottom: 4 }}>Dinas Pariwisata</div>
                  <div>Provinsi Sulawesi Tengah</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="pv-topbar">
                <div className="pv-chip">
                  <div className="pv-chip-logo">
                    <MapPin style={{ width: 11, height: 11 }} />
                  </div>
                  <div>
                    <div className="pv-chip-title">Admin Panel</div>
                    <div className="pv-chip-sub">DINAS PARIWISATA SULTENG</div>
                  </div>
                </div>
                <div className="pv-pill">
                  <span className="pv-mini-item"><LayoutDashboard style={{ width: 9, height: 9 }} />Dashboard</span>
                  <span className="pv-mini-item"><Images style={{ width: 9, height: 9 }} />Slider Hero</span>
                  <span className="pv-mini-item"><Newspaper style={{ width: 9, height: 9 }} />Berita</span>
                  <span className="pv-mini-item"><Compass style={{ width: 9, height: 9 }} />DTW</span>
                  <span className="pv-mini-item"><MapPin style={{ width: 9, height: 9 }} />Desa</span>
                  <span className="pv-mini-item"><FileText style={{ width: 9, height: 9 }} />PPID</span>
                  <span className="pv-mini-item"><Building2 style={{ width: 9, height: 9 }} />Profil</span>
                  <span className="pv-mini-item active"><Palette style={{ width: 9, height: 9 }} />Warna Tema</span>
                  <span className="pv-mini-item logout"><LogOut style={{ width: 9, height: 9 }} />Logout</span>
                </div>
                <div className="pv-chip">
                  <div className="pv-avatar">
                    <User style={{ width: 11, height: 11 }} />
                  </div>
                  <span className="pv-user-name">admin</span>
                </div>
              </div>

              <div className="pv-panel">
                <h4 className="pv-panel-title">Dashboard</h4>
                <p className="pv-panel-sub">Ringkasan isi website Dinas Pariwisata Provinsi Sulawesi Tengah</p>
                <div className="pv-divider" />
                <div className="pv-stats">
                  <div className="pv-stat">
                    <span className="pv-stat-ic blue"><Newspaper style={{ width: 12, height: 12 }} /></span>
                    <span className="pv-stat-num">234</span>
                    <span className="pv-stat-label">Total Berita</span>
                    <span className="pv-stat-sub">berita diterbitkan</span>
                  </div>
                  <div className="pv-stat">
                    <span className="pv-stat-ic amber"><Images style={{ width: 12, height: 12 }} /></span>
                    <span className="pv-stat-num">8</span>
                    <span className="pv-stat-label">Slider Aktif</span>
                    <span className="pv-stat-sub">dari 8 slider</span>
                  </div>
                  <div className="pv-stat">
                    <span className="pv-stat-ic emerald"><MapPin style={{ width: 12, height: 12 }} /></span>
                    <span className="pv-stat-num">44</span>
                    <span className="pv-stat-label">Daya Tarik Wisata</span>
                    <span className="pv-stat-sub">destinasi tercatat</span>
                  </div>
                  <div className="pv-stat">
                    <span className="pv-stat-ic purple"><Compass style={{ width: 12, height: 12 }} /></span>
                    <span className="pv-stat-num">10</span>
                    <span className="pv-stat-label">Desa Wisata</span>
                    <span className="pv-stat-sub">desa binaan</span>
                  </div>
                </div>

                <h5 className="pv-sec-title">Destinasi Unggulan</h5>
                <p className="pv-sec-sub">Cuplikan destinasi dan kantor Dinas Pariwisata Provinsi Sulawesi Tengah</p>
                <div className="pv-show">
                  <div className="pv-photos">
                    <div className="pv-photo" style={{ backgroundImage: 'url(/images/admin/danau-lindu.jpg)' }}>
                      <span>
                        <span className="pv-photo-name">Danau Lindu</span>
                        <span className="pv-photo-loc">Taman Nasional Lore Lindu</span>
                      </span>
                    </div>
                    <div className="pv-photo" style={{ backgroundImage: 'url(/images/admin/air-terjun-saluopa.jpg)' }}>
                      <span>
                        <span className="pv-photo-name">Air Terjun Saluopa</span>
                        <span className="pv-photo-loc">Tentena, Kab. Poso</span>
                      </span>
                    </div>
                    <div className="pv-photo" style={{ backgroundImage: 'url(/images/admin/kepulauan-togian.jpg)' }}>
                      <span>
                        <span className="pv-photo-name">Kepulauan Togian</span>
                        <span className="pv-photo-loc">Kab. Tojo Una-Una</span>
                      </span>
                    </div>
                  </div>
                  <div className="pv-office">
                    <span>
                      <span className="pv-photo-name">Kantor Dispar</span>
                      <span className="pv-photo-loc">Dinas Pariwisata Provinsi Sulawesi Tengah</span>
                    </span>
                  </div>
                </div>

                <div className="pv-chart-head" style={{ marginTop: 14 }}>
                  <div>
                    <h5 className="pv-sec-title" style={{ margin: 0 }}>Kunjungan Wisatawan</h5>
                    <p className="pv-sec-sub" style={{ margin: '2px 0 0' }}>Per tahun — domestik dan mancanegara</p>
                  </div>
                  <div className="pv-chart-total">
                    <span className="big">11.697.098</span>
                    <span className="pv-badge-up">+26,58%</span>
                    <div style={{ fontSize: 8, color: 'var(--ink-soft)', marginTop: 2 }}>Total kunjungan tahun 2025</div>
                  </div>
                </div>
                <div className="pv-legend">
                  <span><span className="pv-dot dom" />Domestik</span>
                  <span><span className="pv-dot man" />Mancanegara</span>
                </div>
                <div className="pv-chart">
                  {[
                    { yr: '2022', dom: 14, man: 3 },
                    { yr: '2023', dom: 45, man: 4 },
                    { yr: '2024', dom: 79, man: 6 },
                    { yr: '2025', dom: 96, man: 8 },
                  ].map((b) => (
                    <div key={b.yr} className="pv-year">
                      <div className="pv-bars">
                        <div className="pv-bar-col"><div className="pv-bar dom" style={{ height: `${b.dom}%` }} /></div>
                        <div className="pv-bar-col"><div className="pv-bar man" style={{ height: `${b.man}%`, minHeight: 3 }} /></div>
                      </div>
                      <div className="pv-year-label">{b.yr}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
};

const AdminTema = () => (
  <AdminLayout>
    <AdminTemaContent />
  </AdminLayout>
);

export default AdminTema;
