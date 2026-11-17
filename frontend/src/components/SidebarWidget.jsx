import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import api from '../services/api';

const SidebarWidget = () => {
  const [beritaPopuler, setBeritaPopuler] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/berita?limit=5').then((res) => setBeritaPopuler(res.data.data || [])).catch(() => {});
    api.get('/info-pariwisata/kalender-event').then((res) => setEvents((res.data || []).slice(0, 3))).catch(() => {});
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <aside className="space-y-6">
      {/* Berita Populer */}
      <div className="card p-5">
        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Newspaper size={18} className="text-primary-600" />
          Berita Populer
        </h3>
        <div className="space-y-3">
          {beritaPopuler.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada berita</p>
          ) : (
            beritaPopuler.map((b) => (
              <Link
                key={b.id}
                to={`/berita/${b.slug}`}
                className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <img
                  src={b.gambar ? (b.gambar.startsWith('http') || b.gambar.startsWith('/') ? b.gambar : `/uploads/${b.gambar}`) : '/slider/Slider.jpg'}
                  alt={b.judul}
                  onError={(e) => { e.currentTarget.src = '/slider/Slider.jpg'; }}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {b.judul}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(b.tanggal)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Agenda Event */}
      <div className="card p-5">
        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Calendar size={18} className="text-gold-500" />
          Agenda Event
        </h3>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada event</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0">
                  <span className="text-xs font-bold">{new Date(ev.tanggal).getDate()}</span>
                  <span className="text-[9px] uppercase">{new Date(ev.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 line-clamp-2">{ev.judul}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{ev.lokasi}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <Link
          to="/info-pariwisata/pemasaran/kalender-event"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:gap-2 transition-all"
        >
          Lihat Semua Event <ExternalLink size={12} />
        </Link>
      </div>

      {/* Quick Links */}
      <div className="card p-5 bg-gradient-to-br from-primary-600 to-navy-800 text-white">
        <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-white/20 pb-3">
          <TrendingUp size={18} className="text-gold-400" />
          Akses Cepat
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Daftar Informasi Publik', path: '/ppid/daftar-informasi-publik' },
            { label: 'Form Permohonan Informasi', path: '/ppid/layanan-publik/form-permohonan' },
            { label: 'Survey Kepuasan Masyarakat', path: '/ppid/layanan-publik/survey-kepuasan' },
            { label: 'Rencana Terbit', path: '/rencana-terbit' },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="block text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              → {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarWidget;