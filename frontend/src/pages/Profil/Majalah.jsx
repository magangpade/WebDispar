import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const OFFICIAL_MAJALAH = [
  {
    judul: 'Majalah Pesona Sulawesi Tengah Edisi I - 2019',
    cover: 'https://pariwisata.sultengprov.go.id/images/MAJALAH_PESONA_Edisi_I_001.jpg',
    file_pdf: 'https://drive.google.com/file/d/1BH5D9htVorzZskUNze_oOToALnh60Q--/view?usp=sharing',
    baca_link: 'https://drive.google.com/file/d/1BH5D9htVorzZskUNze_oOToALnh60Q--/preview'
  },
  {
    judul: 'Majalah Pesona Sulawesi Tengah Edisi II - 2021',
    cover: 'https://pariwisata.sultengprov.go.id/images/MAJALAH_PESONA_Edisi_II_2021_001.jpg',
    file_pdf: 'https://drive.google.com/file/d/1MrIDSlwSyPWU3gR-h3VM2HhJk4EBrj8L/view?usp=sharing',
    baca_link: 'https://drive.google.com/file/d/1MrIDSlwSyPWU3gR-h3VM2HhJk4EBrj8L/preview'
  },
  {
    judul: 'Booklet Pesona Kuliner Sulawesi Tengah',
    cover: 'https://pariwisata.sultengprov.go.id/images/seribumegalit/Booklet_Pesona_Kuliner_-_page_1_001.jpg',
    file_pdf: 'https://drive.google.com/file/d/1hgWI1J6RfyS0PljRM6pNQ1D4NO7QDZSN/view?usp=sharing',
    baca_link: 'https://anyflip.com/hwsca/xoqq/'
  },
  {
    judul: 'Booklet Negeri Seribu Megalit',
    cover: 'https://pariwisata.sultengprov.go.id/images/seribumegalit/Booklet_megalit_2023_fix_001.jpg',
    file_pdf: 'https://drive.google.com/file/d/1Qxi2nxgq18p52nIS3cqcRbHqDAwbK7V1/view?pli=1',
    baca_link: 'https://drive.google.com/file/d/1Qxi2nxgq18p52nIS3cqcRbHqDAwbK7V1/preview'
  },
];

const Majalah = () => {
  const [majalah, setMajalah] = useState(OFFICIAL_MAJALAH);

  useEffect(() => {
    api.get('/profil/majalah')
      .then((res) => {
        if (res.data?.length && res.data[0].file_pdf) {
          setMajalah(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>Majalah & Publikasi - Dinas Pariwisata Sulteng</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Majalah & Publikasi</h1>
          <p className="text-white/70 mt-2">Koleksi majalah resmi dan booklet promosi pariwisata Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {majalah.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card group overflow-hidden flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {m.cover ? (
                    <img
                      src={m.cover}
                      alt={m.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <BookOpen size={48} className="text-slate-400" />
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-1">Edisi Resmi</p>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{m.judul}</h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={m.baca_link || m.file_pdf || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2.5 px-3 rounded-lg transition-colors"
                    >
                      <Eye size={14} /> Baca
                    </a>
                    <a
                      href={m.file_pdf || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors"
                      title="Unduh PDF"
                    >
                      <Download size={14} /> Unduh
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Majalah;
