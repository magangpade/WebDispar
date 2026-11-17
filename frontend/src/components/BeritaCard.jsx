import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BeritaCard = ({ berita, index = 0 }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const getImageSrc = (img) => {
    if (!img) return '/slider/Slider.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `/uploads/${img}`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <Link to={`/berita/${berita.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100">
          <img
            src={getImageSrc(berita.gambar)}
            alt={berita.judul}
            onError={(e) => {
              e.currentTarget.src = '/slider/Slider.jpg';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="pt-5">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Calendar size={12} /> {formatDate(berita.tanggal)}
          </p>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors mb-3">
            {berita.judul}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 border-b border-slate-900 pb-0.5 group-hover:gap-2.5 transition-all">
            Baca Selengkapnya
            <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default BeritaCard;