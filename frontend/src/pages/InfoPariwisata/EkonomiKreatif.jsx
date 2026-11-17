import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Palette, Download, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const SUBSEKTOR = [
  'Kuliner', 'Kriya', 'Musik', 'Fesyen', 'Film', 'Animasi & Video',
  'Aplikasi & Game', 'Desain Produk', 'Desain Interior', 'Desain Komunikasi Visual',
  'Arsitektur', 'Seni Pertunjukan', 'Seni Rupa', 'Penerbitan',
  'Periklanan', 'Televisi & Radio', 'Fotografi',
];

const EkonomiKreatif = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/info-pariwisata/ekonomi-kreatif')
      .then((res) => setData(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const colors = ['from-blue-500 to-blue-700', 'from-purple-500 to-purple-700', 'from-gold-500 to-orange-700', 'from-green-500 to-teal-700', 'from-pink-500 to-rose-700'];

  return (
    <>
      <Helmet><title>Ekonomi Kreatif - Info Pariwisata Sulawesi Tengah</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Ekonomi Kreatif</h1>
          <p className="text-white/70 mt-2">Data pelaku ekonomi kreatif Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* 17 Subsektor */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-8 mb-10">
            <h2 className="text-2xl font-bold text-navy-900 mb-2">17 Subsektor Ekonomi Kreatif</h2>
            <p className="text-gray-500 text-sm mb-6">Sektor-sektor kreatif yang dikembangkan di Sulawesi Tengah</p>
            <div className="flex flex-wrap gap-2">
              {SUBSEKTOR.map((s, idx) => (
                <span key={idx} className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200 hover:bg-primary-100 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Data dari API */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-navy-900 mb-2 flex items-center gap-2">
              <Sparkles size={24} className="text-gold-500" />
              Data Pelaku Ekonomi Kreatif
            </h2>
            <p className="text-gray-500 text-sm">Data yang tersedia untuk diunduh</p>
          </div>

          {loading ? (
            <div className="skeleton h-40 w-full rounded-xl" />
          ) : data.length === 0 ? (
            <div className="card p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-orange-700 flex items-center justify-center text-white flex-shrink-0">
                <Palette size={26} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900 mb-1">Data Pelaku Ekonomi Kreatif Sulawesi Tengah</h3>
                <p className="text-xs text-gray-500">Data lengkap pelaku ekonomi kreatif per subsektor</p>
              </div>
              <a href="/dokumen/ekraf-sulteng.pdf" download className="flex-shrink-0 btn-primary text-sm">
                <Download size={16} /> Unduh
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-5 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white flex-shrink-0`}>
                    <Palette size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy-900 text-sm mb-1 line-clamp-2">{item.judul}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.deskripsi}</p>
                  </div>
                  {item.file && (
                    <a
                      href={item.file.startsWith('http') ? item.file : `/uploads/${item.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                      title="Unduh / Buka Direktori"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EkonomiKreatif;