import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';

const DEFAULT_LAPORAN = [
  { judul: 'Laporan Penyelenggaraan Pemerintahan Daerah (LPPD) Dinas Pariwisata Sulteng - Tahun 2024', tahun: '2024', file: '/laporan/laporan-ppid-2024.pdf' },
  { judul: 'Laporan Keuangan Dinas Pariwisata Prov. Sulteng (Audited) - Tahun 2023', tahun: '2023', file: '/laporan/laporan-ppid-2023.pdf' },
  { judul: 'Laporan Cascading & Kinerja Dinas Pariwisata Prov. Sulteng - Tahun 2022', tahun: '2022', file: '/laporan/laporan-ppid-2022.pdf' },
  { judul: 'Laporan Perjanjian Kinerja Dinas Pariwisata Prov. Sulteng - Tahun 2021', tahun: '2021', file: '/laporan/laporan-ppid-2021.pdf' },
  { judul: 'Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Dinas Pariwisata Prov. Sulteng - Tahun 2020', tahun: '2020', file: '/laporan/laporan-ppid-2020.pdf' },
];

const resolveFileUrl = (raw) => {
  if (!raw) return '#';
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) return raw;
  return `/uploads/${raw}`;
};

const LaporanTahunan = () => {
  const [laporan, setLaporan] = useState(DEFAULT_LAPORAN);

  useEffect(() => {
    api.get('/ppid/laporan-tahunan')
      .then((res) => { if (res.data?.length) setLaporan(res.data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>Laporan Tahunan PPID - Dinas Pariwisata Sulteng</title></Helmet>

      <PageHeader
        badge="Akuntabilitas & Kinerja KIP"
        badgeIcon={FileText}
        title="Laporan Tahunan PPID"
        subtitle="Dokumentasi Laporan Tahunan Pelaksanaan Keterbukaan Informasi Publik Dinas Pariwisata Provinsi Sulawesi Tengah"
        breadcrumbs={[
          { label: 'PPID', path: '/ppid/profil' },
          { label: 'Laporan Tahunan PPID' }
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          <div className="space-y-4">
            {laporan.map((item, idx) => {
              const fileUrl = resolveFileUrl(item.file || item.link);
              return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 flex items-center gap-5 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-600 to-navy-800 flex flex-col items-center justify-center text-white flex-shrink-0">
                  <Calendar size={16} />
                  <span className="text-xs font-bold mt-1">{item.tahun || '-'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy-900 mb-1">{item.judul}</h3>
                  <p className="text-xs text-gray-500">Dokumen Resmi PPID</p>
                </div>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={!fileUrl.startsWith('http') && fileUrl !== '#'}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Download size={16} /> Unduh
                </a>
              </motion.div>
              );
            })}

            {laporan.length === 0 && (
              <div className="text-center py-16 text-gray-400 card">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>Belum ada laporan tahunan tersedia</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LaporanTahunan;