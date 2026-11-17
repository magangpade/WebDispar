import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Eye, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const PaketWisata = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/info-pariwisata/paket-wisata')
      .then((res) => setData(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Paket Wisata - Info Pariwisata Sulawesi Tengah</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Paket Wisata</h1>
          <p className="text-white/70 mt-2">Paket perjalanan wisata menarik di Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-80 rounded-xl" />)}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-gray-400 card">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p>Belum ada paket wisata tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, idx) => (
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
                      src={item.gambar ? (item.gambar.startsWith('http') ? item.gambar : `/uploads/${item.gambar}`) : '/slider/Slider.jpg'}
                      alt={item.judul}
                      onError={(e) => { e.currentTarget.src = '/slider/Slider.jpg'; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-navy-900 text-lg mb-2 line-clamp-2">{item.judul}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4">{item.deskripsi}</p>
                    <div className="flex gap-2">
                      {item.file_pdf && (
                        <>
                          <a
                            href={item.file_pdf.startsWith('http') ? item.file_pdf : `/uploads/${item.file_pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                          >
                            <Eye size={14} /> Lihat
                          </a>
                          <a
                            href={item.file_pdf.startsWith('http') ? item.file_pdf : `/uploads/${item.file_pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 border border-primary-600 text-primary-600 hover:bg-primary-50 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                          >
                            <Download size={14} /> Unduh
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PaketWisata;