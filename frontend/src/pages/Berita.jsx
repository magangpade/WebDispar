import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import BeritaCard from '../components/BeritaCard';
import PageHeader from '../components/PageHeader';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Berita = () => {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(initialQ);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQ);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearch(q);
    setDebouncedSearch(q);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) setPage(1);
        return search;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '9' });
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    api.get(`/berita?${params.toString()}`)
      .then((res) => {
        setBerita(res.data.data || []);
        setTotalPages(Math.max(1, res.data.totalPages || 1));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  return (
    <>
      <Helmet>
        <title>{isEn ? 'News - Central Sulawesi Tourism Department' : 'Berita - Dinas Pariwisata Sulteng'}</title>
      </Helmet>

      <PageHeader
        badge="Warta Pariwisata Sulawesi Tengah"
        badgeIcon={Newspaper}
        title="Berita Terkini"
        subtitle="Informasi dan rilis resmi seputar pembangunan pariwisata, destinasi, dan ekonomi kreatif Sulawesi Tengah."
        breadcrumbs={[{ label: 'Berita' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isEn ? 'Search news...' : 'Cari berita...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => <div key={i} className="skeleton h-80 rounded-xl" />)}
            </div>
          ) : berita.length === 0 ? (
            <div className="text-center py-16 text-gray-500 card">
              <Newspaper size={44} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">
                {isEn ? 'No news matched your search.' : 'Tidak ada berita yang sesuai dengan pencarian.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {berita.map((b, idx) => (
                <BeritaCard key={b.id} berita={b} index={idx} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${page === i + 1 ? 'bg-amber-500 text-slate-950' : 'border border-gray-200 hover:bg-amber-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Berita;