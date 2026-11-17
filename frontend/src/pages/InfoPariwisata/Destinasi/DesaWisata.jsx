import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Eye, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const KABUPATEN = [
  'Kota Palu', 'Kabupaten Donggala', 'Kabupaten Sigi', 'Kabupaten Parigi Moutong',
  'Kabupaten Poso', 'Kabupaten Morowali', 'Kabupaten Morowali Utara', 'Kabupaten Tojo Una-Una',
  'Kabupaten Banggai', 'Kabupaten Banggai Kepulauan', 'Kabupaten Banggai Laut',
  'Kabupaten Tolitoli', 'Kabupaten Buol',
];

const DesaWisata = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState('Kota Palu');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/info-pariwisata/desa-wisata?kabupaten=${selected}`)
      .then((res) => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <>
      <Helmet><title>Desa Wisata - Info Pariwisata Sulawesi Tengah</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Desa Wisata</h1>
          <p className="text-white/70 mt-2">Jelajahi potensi kearifan lokal dan pesona desa wisata Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {KABUPATEN.map((kab) => (
              <button
                key={kab}
                onClick={() => setSelected(kab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selected === kab ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-navy-700 border border-gray-200 hover:border-primary-400'
                }`}
              >
                {kab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-72 rounded-xl" />)}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-gray-400 card">
              <Home size={48} className="mx-auto mb-4 opacity-30" />
              <p>Belum ada data desa wisata untuk {selected}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card group"
                >
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={item.gambar ? (item.gambar.startsWith('http') || item.gambar.startsWith('/') ? item.gambar : `/uploads/${item.gambar}`) : '/slider/Slider.jpg'}
                      alt={item.nama}
                      onError={(e) => {
                        e.currentTarget.src = '/slider/Slider.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                      {item.kabupaten}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-navy-900 text-lg mb-2 line-clamp-2">{item.nama}</h3>
                    <div
                      className="text-sm text-gray-600 line-clamp-3 mb-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.deskripsi }}
                    />
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Eye size={14} /> {item.dilihat || 0} dilihat
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DesaWisata;