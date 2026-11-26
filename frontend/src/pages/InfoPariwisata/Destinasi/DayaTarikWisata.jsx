import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Eye, Compass, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import PageHeader from '../../../components/PageHeader';
import { useLanguage } from '../../../context/LanguageContext';
import { KABUPATEN_MAP, slugify } from '../../../utils/translations';
import { cleanMojibake } from '../../../utils/sanitize';

const getDescriptionPreview = (html) => {
  if (!html) return '';

  const document = new DOMParser().parseFromString(cleanMojibake(html), 'text/html');
  document.querySelectorAll('script, style, img, iframe, video, audio, svg').forEach((element) => element.remove());
  return document.body.textContent.replace(/\s+/g, ' ').trim();
};

const DestinationCard = ({ item, index, isEn }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const image = typeof item.gambar === 'string' ? item.gambar.trim() : '';
  const imageSrc = image
    ? (image.startsWith('http') || image.startsWith('/') ? image : `/uploads/${image}`)
    : '';
  const description = getDescriptionPreview(item.deskripsi);
  const kabObj = KABUPATEN_MAP.find((k) => k.id === item.kabupaten);
  const kabDisplay = isEn && kabObj ? kabObj.en : item.kabupaten;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-[430px]"
    >
      <Link
        to={`/info-pariwisata/destinasi/detail/${item.id}`}
        className="card group flex h-full flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/80 overflow-hidden cursor-pointer bg-white block text-inherit no-underline"
      >
        <div className="relative h-48 shrink-0 overflow-hidden bg-slate-100">
          {imageSrc && !imageFailed ? (
            <img
              src={imageSrc}
              alt={item.judul || 'Daya tarik wisata'}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <MapPin size={32} aria-hidden="true" />
              <span className="text-sm">{isEn ? 'Photo not available' : 'Foto belum tersedia'}</span>
            </div>
          )}
          <div className="absolute top-4 left-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow">
            {kabDisplay}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-navy-900 group-hover:text-primary-600 transition-colors">
            {item.judul}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {description || (isEn ? 'Description not available.' : 'Deskripsi belum tersedia.')}
          </p>
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 text-gray-400">
              <Eye size={14} /> {item.dilihat ?? 0} {isEn ? 'views' : 'dilihat'}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
              {isEn ? 'Details' : 'Lihat Detail'} <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const DayaTarikWisata = () => {
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
    api.get(`/info-pariwisata/dtw?kabupaten=${encodeURIComponent(selected)}`)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selected]);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const pagedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const selectedObj = KABUPATEN_MAP.find((k) => k.id === selected);
  const selectedDisplay = isEn && selectedObj ? selectedObj.en : selected;

  return (
    <>
      <Helmet><title>{isEn ? 'Tourist Attractions - Tourism Info' : 'Daya Tarik Wisata - Info Pariwisata'}</title></Helmet>
      <PageHeader
        badge="Destinasi & Wisata Unggulan"
        badgeIcon={Compass}
        title="Daya Tarik Wisata"
        subtitle="Jelajahi keindahan alam, budaya, dan pesona wisata bahari di 13 kabupaten & kota Sulawesi Tengah"
        breadcrumbs={[
          { label: 'Info Pariwisata', path: '/info-pariwisata/destinasi/daya-tarik-wisata' },
          { label: 'Destinasi' },
          { label: 'Daya Tarik Wisata' }
        ]}
      />
      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Filter Kabupaten */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelected('Semua')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === 'Semua' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-navy-700 border border-gray-200 hover:border-primary-400'}`}
            >
              {isEn ? 'All Regencies' : 'Semua Wilayah'}
            </button>
            {KABUPATEN_MAP.map((kab) => (
              <button
                key={kab.id}
                onClick={() => setSelected(kab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === kab.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-navy-700 border border-gray-200 hover:border-primary-400'}`}
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
            <div className="text-center py-20 text-gray-400">
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <p>
                {isEn
                  ? `No destination data available for ${selectedDisplay}`
                  : `Belum ada data destinasi untuk ${selectedDisplay}`}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagedData.map((item, idx) => (
                  <DestinationCard key={item.id} item={item} index={idx} isEn={isEn} />
                ))}
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

export default DayaTarikWisata;
