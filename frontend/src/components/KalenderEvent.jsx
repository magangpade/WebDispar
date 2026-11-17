import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const KalenderEvent = ({ limit = 6, showTitle = true }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/info-pariwisata/kalender-event')
      .then((res) => setEvents((res.data || []).slice(0, limit)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <div className="mb-6">
          <h2 className="section-title">Kalender Event</h2>
          <p className="section-subtitle">Agenda pariwisata Sulawesi Tengah</p>
        </div>
      )}
      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-400 card">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p>Belum ada event terjadwal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev, idx) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card p-5 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {ev.gambar && (
                  <div className="relative w-full h-44 mb-4 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={ev.gambar.startsWith('http') ? ev.gambar : `/uploads/${ev.gambar}`}
                      alt={ev.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-600 to-navy-800 rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                    <Calendar size={14} />
                    <span className="text-lg font-bold mt-0.5">{new Date(ev.tanggal).getDate()}</span>
                    <span className="text-[10px] uppercase font-semibold">
                      {new Date(ev.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">{ev.judul}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <Clock size={12} className="text-amber-500" /> {formatDate(ev.tanggal)}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} className="text-red-500" /> {ev.lokasi}
                    </p>
                  </div>
                </div>
                {ev.deskripsi && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">{ev.deskripsi}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KalenderEvent;