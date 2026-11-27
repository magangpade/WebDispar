import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';

const DaftarInformasiPublik = () => {
  const [kategori, setKategori] = useState([]);
  const [items, setItems] = useState({});
  const [openKategori, setOpenKategori] = useState(null);

  useEffect(() => {
    api.get('/ppid/kategori').then((res) => setKategori(res.data)).catch(() => {});
  }, []);

  const toggleKategori = async (kat) => {
    if (openKategori === kat.id) {
      setOpenKategori(null);
      return;
    }
    setOpenKategori(kat.id);
    if (!items[kat.id]) {
      const res = await api.get(`/ppid/items/${kat.id}`);
      setItems((prev) => ({ ...prev, [kat.id]: res.data }));
    }
  };

  const getDocHref = (item) => {
    const target = item.link || item.file;
    if (!target) return '#';
    if (target.startsWith('http://') || target.startsWith('https://')) return target;
    if (target.startsWith('/')) return target;
    return `/uploads/${target}`;
  };

  return (
    <>
      <Helmet><title>Daftar Informasi Publik - PPID</title></Helmet>
      <PageHeader
        badge="PPID Pelaksana Dinas Pariwisata Sulteng"
        title="Daftar Informasi Publik"
        subtitle="Daftar rincian kategori dan dokumen keterbukaan informasi publik Dinas Pariwisata Provinsi Sulawesi Tengah"
        breadcrumbs={[
          { label: 'PPID', path: '/ppid/profil' },
          { label: 'Daftar Informasi Publik' }
        ]}
      />
      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          <div data-tour="ppid-categories" className="space-y-3">
            {kategori.map((kat) => (
              <div key={kat.id} className="card overflow-hidden">
                <button
                  onClick={() => toggleKategori(kat)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-navy-900 flex items-center gap-3">
                    <FileText size={20} className="text-primary-600" />
                    {kat.nama}
                  </span>
                  {openKategori === kat.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                <AnimatePresence>
                  {openKategori === kat.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="p-5 space-y-2 bg-gray-50">
                        {(items[kat.id] || []).map((item) => (
                          <a
                            key={item.id}
                            href={getDocHref(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={!getDocHref(item).startsWith('http')}
                            className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-primary-50 transition-colors group"
                          >
                            <span className="text-sm text-navy-800 group-hover:text-primary-700">{item.judul}</span>
                            {(item.file || item.link) && <Download size={16} className="text-primary-600 group-hover:scale-110 transition-transform" />}
                          </a>
                        ))}
                        {(!items[kat.id] || items[kat.id].length === 0) && (
                          <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DaftarInformasiPublik;