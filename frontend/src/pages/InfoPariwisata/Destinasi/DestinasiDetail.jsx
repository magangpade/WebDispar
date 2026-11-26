import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Check,
  Compass,
  Navigation,
  Sparkles
} from 'lucide-react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import { sanitizeAndFormatHtml } from '../../../utils/sanitize';
import { KABUPATEN_MAP } from '../../../utils/translations';

const DestinasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/info-pariwisata/dtw/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.judul || 'Destinasi Pariwisata Sulawesi Tengah',
          url: window.location.href,
        });
      } catch {
        // Abaikan cancel
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-24">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-96 bg-gray-200 rounded-2xl w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-custom py-24 text-center">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <Compass className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-navy-900 mb-2">
            {isEn ? 'Destination Not Found' : 'Destinasi Tidak Ditemukan'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isEn
              ? 'The destination you are looking for is not available or has been moved.'
              : 'Informasi destinasi wisata yang Anda cari tidak ditemukan atau telah dipindahkan.'}
          </p>
          <button
            onClick={() => navigate('/info-pariwisata/destinasi/daya-tarik-wisata')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 transition"
          >
            <ArrowLeft size={16} />
            {isEn ? 'Back to Attractions' : 'Kembali ke Daya Tarik Wisata'}
          </button>
        </div>
      </div>
    );
  }

  const image = typeof data.gambar === 'string' ? data.gambar.trim() : '';
  const imageSrc = image
    ? (image.startsWith('http') || image.startsWith('/') ? image : `/uploads/${image}`)
    : '';

  const kabObj = KABUPATEN_MAP.find((k) => k.id.toLowerCase() === (data.kabupaten || '').toLowerCase());
  const kabDisplay = isEn && kabObj ? kabObj.en : data.kabupaten;

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      <Helmet>
        <title>{data.judul} - {isEn ? 'Tourism Sulteng' : 'Dinas Pariwisata Sulteng'}</title>
        <meta name="description" content={`Pesona wisata ${data.judul} di ${data.kabupaten}, Sulawesi Tengah.`} />
      </Helmet>

      {/* Hero Header */}
      <section
        className="relative py-14 lg:py-20 text-white overflow-hidden"
        style={{ background: 'var(--theme-gradient, linear-gradient(to right, #1F5BA6, #383087, #5C2180))' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-5xl px-4 md:px-8 relative z-10">
          <Link
            to="/info-pariwisata/destinasi/daya-tarik-wisata"
            className="inline-flex items-center gap-2 text-white/80 hover:text-amber-300 mb-6 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            {isEn ? 'Back to Attractions List' : 'Kembali ke Daftar Daya Tarik Wisata'}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow">
              <MapPin size={13} /> {kabDisplay}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white border border-white/20">
              <Sparkles size={13} className="text-amber-300" /> {isEn ? 'Tourist Attraction' : 'Daya Tarik Wisata'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
            {data.judul}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-white/85">
            {data.created_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={15} className="text-amber-300" /> {formatDate(data.created_at)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Eye size={15} className="text-amber-300" /> {data.dilihat ?? 0} {isEn ? 'views' : 'kali dilihat'}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition text-white text-xs font-semibold cursor-pointer ml-auto"
            >
              {copied ? <Check size={14} className="text-emerald-300" /> : <Share2 size={14} />}
              {copied ? (isEn ? 'Link Copied!' : 'Tautan Tersalin!') : (isEn ? 'Share' : 'Bagikan')}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 md:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
            {/* Foto Utama */}
            {imageSrc && !imageFailed && (
              <div className="relative mb-10 overflow-hidden rounded-2xl max-h-[520px] bg-slate-100 shadow-md">
                <img
                  src={imageSrc}
                  alt={data.judul}
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-cover max-h-[520px]"
                />
              </div>
            )}

            {/* Quick Info Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 mb-8 rounded-2xl bg-amber-50/70 border border-amber-200/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    {isEn ? 'Location / Regency' : 'Lokasi / Kabupaten'}
                  </div>
                  <div className="text-sm font-bold text-navy-900">{kabDisplay}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-700 shrink-0">
                  <Navigation size={20} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    {isEn ? 'Province' : 'Provinsi'}
                  </div>
                  <div className="text-sm font-bold text-navy-900">Sulawesi Tengah</div>
                </div>
              </div>
            </div>

            {/* Deskripsi Konten */}
            <div className="mt-2">
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-navy-900 mb-6">
                <Sparkles size={20} className="text-amber-500 shrink-0" />
                {isEn ? 'Destination Overview' : 'Ulasan & Gambaran Destinasi'}
              </h2>
              {data.deskripsi ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeAndFormatHtml(data.deskripsi) }}
                  className={[
                    // Tipografi konten artikel
                    'prose prose-slate prose-lg max-w-none',
                    // Teks rata kanan kiri
                    '[&_p]:text-justify [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4',
                    '[&_li]:text-justify [&_li]:text-gray-700 [&_li]:leading-relaxed',
                    // Heading bersih dan tebal
                    '[&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-navy-900 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-gray-200 [&_h1]:pb-2',
                    '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-800 [&_h2]:mt-7 [&_h2]:mb-3',
                    '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy-800 [&_h3]:mt-6 [&_h3]:mb-2',
                    '[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-navy-700 [&_h4]:mt-5 [&_h4]:mb-2',
                    // Gambar responsif rapi
                    '[&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:mx-auto [&_img]:block [&_img]:max-w-full',
                    // Link rapi
                    '[&_a]:text-primary-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-800',
                    // Blockquote
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:bg-amber-50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-gray-600',
                    // List rapi
                    '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1',
                    '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1',
                    // Strong dan em
                    '[&_strong]:font-bold [&_strong]:text-navy-900',
                    '[&_em]:italic [&_em]:text-gray-600',
                    // HR pemisah
                    '[&_hr]:my-6 [&_hr]:border-gray-200',
                  ].join(' ')}
                />
              ) : (
                <p className="italic text-gray-400 text-center py-10">
                  {isEn ? 'No description available for this destination.' : 'Deskripsi belum tersedia untuk destinasi ini.'}
                </p>
              )}
            </div>

            {/* Footer Aksi */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => navigate('/info-pariwisata/destinasi/daya-tarik-wisata')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                <ArrowLeft size={16} />
                {isEn ? 'Browse Other Attractions' : 'Lihat Daya Tarik Lainnya'}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 shadow-md hover:shadow transition cursor-pointer"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? (isEn ? 'Copied to Clipboard' : 'Tersalin ke Clipboard') : (isEn ? 'Share Destination' : 'Bagikan Destinasi')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DestinasiDetail;
