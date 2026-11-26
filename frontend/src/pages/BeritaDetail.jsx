import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Eye, ArrowLeft, Share2 } from 'lucide-react';
import api from '../services/api';
import { sanitizeHtml } from '../utils/sanitize';

const BeritaDetail = () => {
  const { slug } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/berita/${slug}`)
      .then((res) => setBerita(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container-custom py-20"><div className="skeleton h-96 w-full rounded-xl" /></div>;
  if (!berita) return <div className="container-custom py-20 text-center"><p>Berita tidak ditemukan</p></div>;

  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Helmet>
        <title>{berita.judul} - Dinas Pariwisata Sulteng</title>
      </Helmet>

      <div
        className="py-12 lg:py-16 text-white relative overflow-hidden transition-colors duration-300"
        style={{ background: 'var(--theme-gradient, linear-gradient(to right, #1F5BA6, #383087, #5C2180))' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <Link to="/berita" className="inline-flex items-center gap-2 text-white/80 hover:text-amber-300 mb-4 transition-colors font-medium text-sm">
            <ArrowLeft size={16} /> Kembali ke Berita
          </Link>
          {berita.kategori && (
            <div>
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider rounded-full bg-white/15 text-amber-300 border border-white/20 uppercase">
                {berita.kategori}
              </span>
            </div>
          )}
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white mb-4 max-w-4xl">{berita.judul}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-white/80 font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={15} className="text-amber-300" /> {formatDate(berita.tanggal)}</span>
            <span className="flex items-center gap-1.5"><User size={15} className="text-amber-300" /> {berita.penulis}</span>
            <span className="flex items-center gap-1.5"><Eye size={15} className="text-amber-300" /> {berita.dilihat} dilihat</span>
          </div>
        </div>
      </div>

      <article className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          {berita.gambar && (
            <img
              src={berita.gambar.startsWith('http') || berita.gambar.startsWith('/') ? berita.gambar : `/uploads/${berita.gambar}`}
              alt={berita.judul}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full max-h-[500px] object-cover rounded-xl mb-8 shadow-lg"
            />
          )}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(berita.konten) }}
          />
          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Share2 size={16} /> Bagikan:</span>
            <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline text-sm">Twitter</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">WhatsApp</a>
          </div>
        </div>
      </article>
    </>
  );
};

export default BeritaDetail;