import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import PageHeader from '../../../components/PageHeader';
import { useLanguage } from '../../../context/LanguageContext';
import { KABUPATEN_MAP, slugify } from '../../../utils/translations';

const DesaWisata = () => {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const { kabupaten: paramKabupaten } = useParams();

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState('Kota Palu');
  const [loading, setLoading] = useState(false);

  // Sync selected with route parameter if available
  useEffect(() => {
    if (paramKabupaten) {
      const match = KABUPATEN_MAP.find(
        (k) => k.slug === paramKabupaten.toLowerCase() || slugify(k.id) === paramKabupaten.toLowerCase()
      );
      if (match) {
        setSelected(match.id);
      }
    }
  }, [paramKabupaten]);

  useEffect(() => {
    setLoading(true);
    api.get(`/info-pariwisata/desa-wisata?kabupaten=${encodeURIComponent(selected)}`)
      .then((res) => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const selectedObj = KABUPATEN_MAP.find((k) => k.id === selected);
  const selectedDisplay = isEn && selectedObj ? selectedObj.en : selected;

  return (
    <>
      <Helmet><title>{isEn ? 'Tourism Villages - Central Sulawesi Tourism Info' : 'Desa Wisata - Info Pariwisata Sulawesi Tengah'}</title></Helmet>

      <PageHeader
        badge="Pariwisata Berbasis Masyarakat"
        badgeIcon={Home}
        title="Desa Wisata"
        subtitle="Jelajahi potensi kearifan lokal, budaya otentik, dan pesona desa wisata Sulawesi Tengah"
        breadcrumbs={[
          { label: 'Info Pariwisata', path: '/info-pariwisata/destinasi/daya-tarik-wisata' },
          { label: 'Destinasi' },
          { label: 'Desa Wisata' }
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Filter */}
          <div data-tour="desa-filter" className="flex flex-wrap gap-2 mb-10">
            {KABUPATEN_MAP.map((kab) => (
              <button
                key={kab.id}
                onClick={() => setSelected(kab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selected === kab.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-navy-700 border border-gray-200 hover:border-primary-400'
                }`}
              >
                {isEn ? kab.en : kab.id}
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
              <p>
                {isEn
                  ? `No tourism village data available for ${selectedDisplay}`
                  : `Belum ada data desa wisata untuk ${selectedDisplay}`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, idx) => {
                const kabObj = KABUPATEN_MAP.find((k) => k.id === item.kabupaten);
                const kabDisplay = isEn && kabObj ? kabObj.en : item.kabupaten;

                return (
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
                        {kabDisplay}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-navy-900 text-lg mb-2 line-clamp-2">{item.nama}</h3>
                      <div
                        className="text-sm text-gray-600 line-clamp-3 mb-4 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.deskripsi }}
                      />
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={14} /> {item.dilihat || 0} {isEn ? 'views' : 'dilihat'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DesaWisata;
