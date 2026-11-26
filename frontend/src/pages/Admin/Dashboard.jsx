import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  Calendar,
  ChevronRight,
  Compass,
  FileText,
  Home,
  Images,
  MapPin,
  Newspaper,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import { getImageSrc } from '../../utils/imageHelper';
import { AdminLayout, AdminPageShell } from './components/AdminUI';
import { SPRING, getStaggerContainer, getStaggerItem } from './adminMotion';

export { AdminLayout };

const formatShort = (n) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2).replace('.', ',')} jt`;
  }
  if (num >= 1_000) {
    return `${Math.round(num / 1_000)} rb`;
  }
  return String(num);
};

const formatDateId = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const SHOWCASE_SPOTS = [
  {
    name: 'Danau Lindu',
    loc: 'Taman Nasional Lore Lindu',
    img: '/images/admin/danau-lindu.jpg',
    to: '/portal-internal-dispar/dtw',
  },
  {
    name: 'Air Terjun Saluopa',
    loc: 'Tentena, Kab. Poso',
    img: '/images/admin/air-terjun-saluopa.jpg',
    to: '/portal-internal-dispar/dtw',
  },
  {
    name: 'Kepulauan Togian',
    loc: 'Kab. Tojo Una-Una',
    img: '/images/admin/kepulauan-togian.jpg',
    to: '/portal-internal-dispar/dtw',
  },
];

const QUICK_LINKS = [
  {
    label: 'Kelola Slider',
    to: '/portal-internal-dispar/slider',
    icon: Images,
    bg: 'color-mix(in srgb, var(--amber) 16%, transparent)',
    color: 'var(--amber-dark)',
  },
  {
    label: 'Kelola Berita',
    to: '/portal-internal-dispar/berita',
    icon: Newspaper,
    bg: 'color-mix(in srgb, var(--blue) 13%, transparent)',
    color: 'var(--blue)',
  },
  {
    label: 'Kelola Daya Tarik Wisata',
    to: '/portal-internal-dispar/dtw',
    icon: MapPin,
    bg: 'rgba(5, 150, 105, 0.13)',
    color: 'var(--emerald)',
  },
  {
    label: 'Kelola Desa Wisata',
    to: '/portal-internal-dispar/desa-wisata',
    icon: Home,
    bg: 'color-mix(in srgb, var(--purple) 13%, transparent)',
    color: 'var(--purple)',
  },
  {
    label: 'Kelola PPID',
    to: '/portal-internal-dispar/ppid',
    icon: FileText,
    bg: 'rgba(225, 29, 72, 0.10)',
    color: '#e11d48',
  },
  {
    label: 'Kelola Profil Dinas',
    to: '/portal-internal-dispar/profil',
    icon: Building2,
    bg: 'color-mix(in srgb, var(--blue) 12%, transparent)',
    color: 'var(--blue)',
  },
  {
    label: 'Studio Poster & QR',
    to: '/portal-internal-dispar/poster',
    icon: Sparkles,
    bg: 'color-mix(in srgb, var(--amber) 16%, transparent)',
    color: 'var(--amber-dark)',
  },
];

const Dashboard = () => {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    berita: 0,
    sliderTotal: 0,
    sliderAktif: 0,
    dtw: 0,
    desa: 0,
  });
  const [latestBerita, setLatestBerita] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setLoading(true);
      try {
        const [bRes, slRes, dtwRes, desaRes, thRes] = await Promise.all([
          api.get('/berita?limit=5').catch(() => ({ data: { data: [], total: 0 } })),
          api.get('/slider/all').catch(() => ({ data: [] })),
          api.get('/info-pariwisata/dtw').catch(() => ({ data: [] })),
          api.get('/info-pariwisata/desa-wisata').catch(() => ({ data: [] })),
          api.get('/info-pariwisata/statistik-kunjungan/tahun').catch(() => ({ data: [] })),
        ]);

        const years = Array.isArray(thRes.data) && thRes.data.length > 0
          ? thRes.data.map((r) => String(r.tahun || r)).sort()
          : ['2022', '2023', '2024', '2025'];

        const yearSummaries = await Promise.all(
          years.map((y) =>
            api.get(`/statistik/wisatawan?tahun=${y}`).then((r) => r.data).catch(() => null)
          )
        );

        if (!active) return;

        const sliders = Array.isArray(slRes.data) ? slRes.data : [];
        setCounts({
          berita: bRes.data?.total || 0,
          sliderTotal: sliders.length,
          sliderAktif: sliders.filter((s) => s.aktif === 1).length,
          dtw: Array.isArray(dtwRes.data) ? dtwRes.data.length : 0,
          desa: Array.isArray(desaRes.data) ? desaRes.data.length : 0,
        });
        setLatestBerita(Array.isArray(bRes.data?.data) ? bRes.data.data.slice(0, 5) : []);
        setYearlyStats(yearSummaries.filter(Boolean));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const maxVisit = useMemo(() => {
    const vals = yearlyStats.flatMap((y) => [Number(y.domestic) || 0, Number(y.international) || 0]);
    return Math.max(1, ...vals);
  }, [yearlyStats]);

  const latestStat = yearlyStats[yearlyStats.length - 1];

  const statCells = [
    {
      label: 'Total Berita',
      value: counts.berita,
      sub: 'berita diterbitkan',
      icon: Newspaper,
      tone: 'blue',
      to: '/portal-internal-dispar/berita',
    },
    {
      label: 'Slider Aktif',
      value: counts.sliderAktif,
      sub: `dari ${counts.sliderTotal} slider`,
      icon: Images,
      tone: 'amber',
      to: '/portal-internal-dispar/slider',
    },
    {
      label: 'Daya Tarik Wisata',
      value: counts.dtw,
      sub: 'destinasi tercatat',
      icon: MapPin,
      tone: 'emerald',
      to: '/portal-internal-dispar/dtw',
    },
    {
      label: 'Desa Wisata',
      value: counts.desa,
      sub: 'desa binaan',
      icon: Compass,
      tone: 'purple',
      to: '/portal-internal-dispar/desa-wisata',
    },
  ];

  const staggerParent = getStaggerContainer(reduce);
  const staggerItem = getStaggerItem(reduce);

  return (
    <AdminLayout>
      <AdminPageShell>
        <div className="admin-panel glass dashboard-panel">
          <div className="admin-panel-head">
            <div>
              <h1 className="admin-panel-title">Dashboard</h1>
              <p className="admin-panel-sub">
                Ringkasan isi website Dinas Pariwisata Provinsi Sulawesi Tengah
              </p>
            </div>
          </div>
          <div className="admin-dash-divider" />

          {/* 4 Sel Statistik */}
          <motion.div
            className="admin-stats"
            variants={staggerParent}
            initial="hidden"
            animate="show"
          >
            {statCells.map((cell) => {
              const Icon = cell.icon;
              return (
                <motion.div key={cell.label} variants={staggerItem}>
                  <Link to={cell.to} className="admin-stat">
                    <span className={`admin-stat-ic ${cell.tone}`}>
                      <Icon className="ic" />
                    </span>
                    <span className="admin-stat-num">
                      {loading ? '—' : cell.value.toLocaleString('id-ID')}
                    </span>
                    <span className="admin-stat-label">{cell.label}</span>
                    <span className="admin-stat-sub">{cell.sub}</span>
                    <ChevronRight className="ic-sm chev" strokeWidth={2.4} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Destinasi Unggulan */}
          <h2 className="admin-section-title">Destinasi Unggulan</h2>
          <p className="admin-section-sub">
            Cuplikan destinasi dan kantor Dinas Pariwisata Provinsi Sulawesi Tengah
          </p>
          <div className="admin-showcase">
            <div className="admin-showcase-photos">
              {SHOWCASE_SPOTS.map((spot) => (
                <Link key={spot.name} to={spot.to} className="admin-showcase-photo">
                  <img src={spot.img} alt={spot.name} />
                  <span>
                    <span className="admin-photo-name">{spot.name}</span>
                    <span className="admin-photo-loc">{spot.loc}</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/portal-internal-dispar/profil" className="admin-showcase-office">
              <img src="/images/admin/kantor-dispar.jpg" alt="Kantor Dinas Pariwisata Sulawesi Tengah" />
              <span>
                <span className="admin-photo-name">Kantor Dispar</span>
                <span className="admin-photo-loc">Dinas Pariwisata Provinsi Sulawesi Tengah</span>
              </span>
            </Link>
          </div>

          {/* Grafik Kunjungan Wisatawan */}
          <div className="admin-chart-head" style={{ marginTop: 30 }}>
            <div>
              <h2 className="admin-section-title" style={{ margin: 0 }}>
                Kunjungan Wisatawan
              </h2>
              <p className="admin-section-sub" style={{ margin: '4px 0 0' }}>
                Per tahun — domestik dan mancanegara
              </p>
            </div>
            <div className="admin-chart-total">
              <span className="big">
                {latestStat ? Number(latestStat.total).toLocaleString('id-ID') : '—'}
              </span>
              {latestStat && Number(latestStat.growth) !== 0 && (
                <span className="admin-badge-up">
                  <TrendingUp className="ic-sm" />
                  {Number(latestStat.growth) > 0 ? '+' : ''}
                  {String(latestStat.growth).replace('.', ',')}%
                </span>
              )}
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>
                Total kunjungan tahun {latestStat?.tahun || 'terbaru'}
              </div>
            </div>
          </div>

          <div className="admin-legend" style={{ marginTop: 12 }}>
            <span>
              <span className="admin-dot" style={{ background: 'var(--blue)' }} />
              Domestik
            </span>
            <span>
              <span className="admin-dot" style={{ background: 'var(--amber)' }} />
              Mancanegara
            </span>
          </div>

          <div className="admin-chart" aria-label="Grafik Kunjungan Wisatawan">
            {yearlyStats.map((row, idx) => {
              const domPct = Math.max(4, Math.round((Number(row.domestic) / maxVisit) * 100));
              const manPct = Math.max(3, Math.round((Number(row.international) / maxVisit) * 100));
              return (
                <div key={row.tahun} className="admin-year-group">
                  <div className="admin-bars">
                    <div className="admin-bar-col">
                      <span className="admin-bar-val">{formatShort(row.domestic)}</span>
                      <div className="admin-bar-track" style={{ height: `${domPct}%` }}>
                        <motion.div
                          className="admin-bar dom"
                          initial={reduce ? { y: 0 } : { y: '100%' }}
                          animate={{ y: '0%' }}
                          transition={{ ...SPRING.number, delay: reduce ? 0 : 0.08 + idx * 0.08 }}
                        />
                      </div>
                    </div>
                    <div className="admin-bar-col">
                      <span className="admin-bar-val">{formatShort(row.international)}</span>
                      <div className="admin-bar-track" style={{ height: `${manPct}%`, minHeight: 7 }}>
                        <motion.div
                          className="admin-bar man"
                          initial={reduce ? { y: 0 } : { y: '100%' }}
                          animate={{ y: '0%' }}
                          transition={{ ...SPRING.number, delay: reduce ? 0 : 0.14 + idx * 0.08 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-year-label">{row.tahun}</div>
                </div>
              );
            })}
          </div>
          <p className="admin-chart-note">
            Berdasarkan data rekapitulasi resmi statistik kunjungan wisatawan Dinas Pariwisata Provinsi Sulawesi Tengah.
          </p>

          {/* Dua Kolom: Berita Terbaru & Akses Cepat */}
          <div className="admin-two-col">
            <div>
              <h2 className="admin-section-title">Berita Terbaru</h2>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="admin-skeleton" style={{ height: 68 }} />
                  ))}
                </div>
              ) : latestBerita.length === 0 ? (
                <div className="admin-empty-note">Belum ada berita diterbitkan.</div>
              ) : (
                <div>
                  {latestBerita.map((b) => (
                    <Link key={b.id} to="/portal-internal-dispar/berita" className="admin-news-item">
                      <span className="admin-thumb">
                        {b.gambar ? (
                          <img
                            src={getImageSrc(b.gambar, '/images/admin/danau-lindu.jpg')}
                            alt={b.judul}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Newspaper className="ic" />
                        )}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span className="admin-news-title">{b.judul}</span>
                        <span className="admin-news-date">
                          <Calendar className="ic-sm" />
                          {formatDateId(b.tanggal)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="admin-section-title">Akses Cepat</h2>
              <div>
                {QUICK_LINKS.map((q) => {
                  const Icon = q.icon;
                  return (
                    <Link key={q.to} to={q.to} className="admin-quick-item">
                      <span className="admin-quick-ic" style={{ background: q.bg, color: q.color }}>
                        <Icon className="ic" />
                      </span>
                      <span>{q.label}</span>
                      <ChevronRight className="ic-sm chev" strokeWidth={2.4} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AdminPageShell>
    </AdminLayout>
  );
};

export default Dashboard;
