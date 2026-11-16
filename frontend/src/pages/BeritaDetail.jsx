import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Eye, ArrowLeft, Share2 } from 'lucide-react';
import api from '../services/api';

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

      <div className="bg-gradient-to-r from-[#0b192c] to-[#1e3a5f] py-16 lg:py-20">
        <div className="container-custom">
          <Link to="/berita" className="inline-flex items-center gap-2 text-white/70 hover:text-gold-400 mb-4 transition-colors">
            <ArrowLeft size={18} /> Kembali ke Berita
          </Link>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white mb-4 max-w-4xl">{berita.judul}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1"><Calendar size={16} /> {formatDate(berita.tanggal)}</span>
            <span className="flex items-center gap-1"><User size={16} /> {berita.penulis}</span>
            <span className="flex items-center gap-1"><Eye size={16} /> {berita.dilihat} dilihat</span>
          </div>
        </div>
      </div>

      <article className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          {berita.gambar && (
            <img
              src={berita.gambar.startsWith('http') ? berita.gambar : `/uploads/${berita.gambar}`}
              alt={berita.judul}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full max-h-[500px] object-cover rounded-xl mb-8 shadow-lg"
            />
          )}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: berita.konten }}
          />
          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Share2 size={16} /> Bagikan:</span>
            <a href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline text-sm">Twitter</a>
            <a href={`https://wa.me/?text=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">WhatsApp</a>
          </div>
        </div>
      </article>
    </>
  );
};

export default BeritaDetail;