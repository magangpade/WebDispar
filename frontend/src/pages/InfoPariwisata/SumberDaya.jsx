import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Award, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const DEFAULT_ITEMS = [
  {
    judul: 'Laporan Tenaga Kerja Pariwisata & Ekonomi Kreatif',
    deskripsi: 'Data tenaga kerja di sektor pariwisata dan ekonomi kreatif Sulawesi Tengah',
    icon: Users,
    color: 'from-blue-500 to-blue-700',
    file: '/dokumen/laporan-tenaga-kerja.pdf',
  },
  {
    judul: 'Data Pelatihan dan Sertifikasi Kompetensi Pariwisata & Ekonomi Kreatif',
    deskripsi: 'Data pelatihan dan sertifikasi kompetensi SDM pariwisata & ekraf',
    icon: Award,
    color: 'from-gold-500 to-orange-700',
    file: '/dokumen/data-pelatihan-sertifikasi.pdf',
  },
];

const SumberDaya = () => {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/info-pariwisata/sumber-daya')
      .then((res) => {
        if (res.data?.length) {
          setItems(
            res.data.map((item, idx) => ({
              judul: item.judul,
              deskripsi: item.deskripsi || '',
              icon: idx === 0 ? Users : Award,
              color: idx === 0 ? 'from-blue-500 to-blue-700' : 'from-gold-500 to-orange-700',
              file: item.file ? (item.file.startsWith('http') ? item.file : `/uploads/${item.file}`) : null,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Sumber Daya Pariwisata & Ekonomi Kreatif - Dinas Pariwisata Sulteng</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Sumber Daya Pariwisata & Ekonomi Kreatif</h1>
          <p className="text-white/70 mt-2">Data dan informasi SDM sektor pariwisata dan ekonomi kreatif</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                    <item.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy-900 mb-1">{item.judul}</h3>
                    <p className="text-sm text-gray-500">{item.deskripsi}</p>
                  </div>
                  <a
                    href={item.file || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 btn-primary text-sm inline-flex items-center gap-2"
                  >
                    <Download size={16} /> Unduh / Lihat
                  </a>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="mt-10 card p-6 bg-blue-50 border-l-4 border-primary-600">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Tentang Data Ini:</p>
                <p>
                  Data sumber daya pariwisata dan ekonomi kreatif mencakup informasi tenaga kerja, pelatihan,
                  sertifikasi kompetensi, serta data pendukung lainnya yang berkaitan dengan pengembangan SDM
                  di sektor pariwisata dan ekonomi kreatif Provinsi Sulawesi Tengah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SumberDaya;