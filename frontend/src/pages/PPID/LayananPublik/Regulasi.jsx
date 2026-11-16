import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const DEFAULT_REGULASI = [
  { judul: 'PERATURAN MENTERI PARIWISATA DAN EKONOMI KREATIF/ KEPALA BADAN PARIWISATA DAN EKONOMI KREATIF REPUBLIK INDONESIA NOMOR 14 TAHUN 2021', kategori: 'umum' },
  { judul: 'KEPUTUSAN MENTERI DALAM NEGERI NOMOR 050-3708 TAHUN 2020', kategori: 'umum' },
  { judul: 'PERATURAN MENTERI PENDAYAGUNAAN APARATUR NEGARA DAN REFORMASI BIROKRASI REPUBLIK INDONESIA NOMOR 11 TAHUN 2021', kategori: 'umum' },
  { judul: 'PERATURAN MENTERI PARIWISATA REPUBLIK INDONESIA NOMOR 21 TAHUN 2016', kategori: 'umum' },
  { judul: 'PERMENDAGRI NOMOR 90 TAHUN 2019', kategori: 'umum' },
  { judul: 'LIST RIPPARDA', kategori: 'umum' },
  { judul: 'PERDA NOMOR 5 TAHUN 2019', kategori: 'umum' },
  { judul: 'PERDA SIGI NOMOR 18 TAHUN 2014', kategori: 'umum' },
  { judul: 'PERDA TOJO UNA-UNA NOMOR 7 TAHUN 2013', kategori: 'umum' },
  { judul: 'PERDA MOROWALI UTARA NOMOR 6 TAHUN 2017', kategori: 'umum' },
];

const DEFAULT_PEDOMAN = [
  { judul: 'PENGELOLAAN ORGANISASI (PERGUB 36/2020)' },
  { judul: 'PENGELOLAAN ADMINISTRASI (PERGUB 24/2020)' },
  { judul: 'PENGELOLAAN KEPEGAWAIAN (PERGUB 9/2021)' },
  { judul: 'PENGELOLAAN KEUANGAN (PERGUB 7/2020)' },
];

const DEFAULT_LAYANAN = [
  { judul: 'PERATURAN GUBERNUR TENTANG SISTEM INFORMASI DAN DOKUMENTASI PEMDA' },
  { judul: 'KEPUTUSAN GUBERNUR TENTANG PPID' },
  { judul: 'KEPUTUSAN GUBERNUR TENTANG TIM PERTIMBANGAN PPID' },
  { judul: 'KEPUTUSAN PPID TENTANG DAFTAR INFORMASI PUBLIK' },
  { judul: 'KEPUTUSAN PPID TENTANG INFORMASI DIKECUALIKAN' },
  { judul: 'UU 14 TAHUN 2008 TENTANG KETERBUKAAN INFORMASI PUBLIK' },
  { judul: 'PP 61 TAHUN 2010 TENTANG PELAKSANAAN UU 14/2008' },
  { judul: 'PERKI 1 TAHUN 2021 TENTANG STANDAR LAYANAN INFORMASI PUBLIK' },
  { judul: 'PERKI 1 TAHUN 2018 TENTANG SLIP DESA' },
];

const Regulasi = () => {
  const [regulasi, setRegulasi] = useState(DEFAULT_REGULASI);
  const [pedoman, setPedoman] = useState(DEFAULT_PEDOMAN);
  const [layanan, setLayanan] = useState(DEFAULT_LAYANAN);

  useEffect(() => {
    api.get('/ppid/regulasi').then((res) => {
      if (res.data?.length) {
        const umum = res.data.filter((r) => r.kategori === 'umum');
        const ped = res.data.filter((r) => r.kategori === 'pedoman');
        const lay = res.data.filter((r) => r.kategori === 'layanan');
        if (umum.length) setRegulasi(umum);
        if (ped.length) setPedoman(ped);
        if (lay.length) setLayanan(lay);
      }
    }).catch(() => {});
  }, []);

  const Section = ({ title, items, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-8"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
          <Icon size={24} />
        </div>
        <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors group"
          >
            <FileText size={20} className="text-primary-600 flex-shrink-0" />
            <p className="flex-1 text-sm text-navy-800 group-hover:text-primary-700">{item.judul}</p>
            <a
              href={item.file ? (item.file.startsWith('http') ? item.file : `/uploads/${item.file}`) : 'https://peraturan.bpk.go.id/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800"
            >
              <Download size={14} /> Ambil File
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet><title>Regulasi - PPID Dinas Pariwisata Sulteng</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Regulasi Layanan Publik</h1>
          <p className="text-white/70 mt-2">Kumpulan peraturan dan dokumen terkait pelayanan informasi publik</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl space-y-8">
          <Section title="Regulasi" items={regulasi} icon={Shield} color="bg-primary-600" />
          <Section title="Pedoman Pengelolaan" items={pedoman} icon={FileText} color="bg-gold-500" />
          <Section title="Regulasi Layanan Publik" items={layanan} icon={FileText} color="bg-navy-900" />
        </div>
      </section>
    </>
  );
};

export default Regulasi;