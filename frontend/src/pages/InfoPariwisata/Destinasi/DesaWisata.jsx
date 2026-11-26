import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import PageHeader from '../../../components/PageHeader';
import { useLanguage } from '../../../context/LanguageContext';
import { KABUPATEN_MAP, slugify } from '../../../utils/translations';
import { sanitizeHtml } from '../../../utils/sanitize';

const DesaWisata = () => {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const { kabupaten: paramKabupaten } = useParams();

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState('Kota Palu');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

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
    setPage(1);
    api.get(`/info-pariwisata/desa-wisata?kabupaten=${encodeURIComponent(selected)}`)
      .then((res) => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const pagedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
          <div className="flex flex-wrap gap-2 mb-10">
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagedData.map((item, idx) => {
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
                        loading="lazy"
                        decoding="async"
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
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.deskripsi) }}
                      />
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={14} /> {item.dilihat || 0} {isEn ? 'views' : 'dilihat'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-semibold text-gray-600 px-3">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DesaWisata;
