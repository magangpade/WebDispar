import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Download, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

// Data default (fallback) sesuai data yang Anda berikan
const DEFAULT_PEJABAT = [
  { nama: 'Dra. Diah Agustiningsih, M.Pd', nip: '196808251994122006', jabatan: 'Kepala Dinas', urutan: 1 },
  { nama: 'Nency Ainun, S.Stp., M.Si', nip: '198105012000122001', jabatan: 'Sekretaris Dinas', urutan: 2 },
  { nama: 'Rani Adelia, SE, MM', nip: '198505022011012006', jabatan: 'Kepala Sub. Bagian Keuangan dan Aset', urutan: 3 },
  { nama: 'Achmad Khomaini, S.Kom', nip: '198106172005011016', jabatan: 'Kepala Sub. Bagian Kepegawaian dan Umum', urutan: 4 },
  { nama: 'Hasna, S.Sos., M.Ap', nip: '197111212000122001', jabatan: 'Kepala Bidang Pengembangan Destinasi Pariwisata', urutan: 5 },
  { nama: 'Joyce Sagita Novyanti, SE., MM', nip: '197811222009042001', jabatan: 'Kepala Bidang Pengembangan Pemasaran Pariwisata', urutan: 6 },
  { nama: 'Ilham Arifin, SH', nip: '198701212006041008', jabatan: 'Kepala Bidang Pengembangan Ekonomi Kreatif, Pemanfaatan & Perlindungan HKI', urutan: 7 },
  { nama: 'Widyawati, SS., M.Sc', nip: '197108222005022002', jabatan: 'Kepala Bidang Sumber Daya Pariwisata dan Ekonomi Kreatif', urutan: 8 },
  { nama: 'Mohammad Arif, S.Sos., M.Ap', nip: '198105122006041018', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 9 },
  { nama: 'Wahyu Sukmawan, ST', nip: '197611022008011011', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 10 },
  { nama: 'Yunita, S.Sos', nip: '197306102001122003', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 11 },
  { nama: 'Vera Christine Lasewa, S.PAR', nip: '198808022015032002', jabatan: 'Adyatama Kepariwisataan dan Ekonomi Kreatif', urutan: 12 },
  { nama: 'Satrisni Bisno, SE', nip: '197710251999032005', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 13 },
  { nama: 'Max William Baginda, S.Sos., M.Si', nip: '197305142000031003', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 14 },
  { nama: 'Gafriani Lasawedi, SS., M.Si', nip: '197209181998032008', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 15 },
  { nama: 'Husen, S.Kom', nip: '197908112010011007', jabatan: 'Adyatama Kepariwisataan Ekonomi Kreatif Ahli Muda', urutan: 16 },
];

const ProfilPimpinan = () => {
  const [pejabat, setPejabat] = useState(DEFAULT_PEJABAT);

  useEffect(() => {
    api.get('/profil/pejabat/all')
      .then((res) => { if (res.data?.length) setPejabat(res.data); })
      .catch(() => {});
  }, []);

  const getInitials = (nama) =>
    nama.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');

  return (
    <>
      <Helmet><title>Profil Pimpinan - Dinas Pariwisata Sulteng</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Profil Pimpinan</h1>
          <p className="text-white/70 mt-2">Struktur Organisasi Dinas Pariwisata Provinsi Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Struktur Organisasi */}
          <div className="mb-10 flex flex-wrap gap-3">
            <a
              href="/images/2026/Struktur_Organisasi_dan_Tugas_Fungsi_Dinas_Pariwisata.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-2"
            >
              <Network size={18} /> Lihat Struktur Organisasi
            </a>
            <a
              href="/images/Kepegawaian/DUK_UPDATE_JANUARI_2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Download size={18} /> Unduh DUK (Update 2025)
            </a>
          </div>

          {/* Grid Pejabat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pejabat.map((p, idx) => (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="card p-5 text-center group hover:shadow-xl transition-all"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {p.foto && (
                    <img
                      src={p.foto.startsWith('http') ? p.foto : `/uploads/${p.foto}`}
                      alt={p.nama}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement.querySelector('.initials-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover rounded-full border-4 border-gold-400 group-hover:scale-105 transition-transform shadow-md"
                    />
                  )}
                  <div
                    className="initials-fallback w-full h-full rounded-full bg-gradient-to-br from-primary-600 to-navy-800 border-4 border-gold-400 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-105 transition-transform shadow-md"
                    style={{ display: p.foto ? 'none' : 'flex' }}
                  >
                    {getInitials(p.nama)}
                  </div>
                </div>
                <h3 className="font-bold text-navy-900 text-sm mb-1">{p.nama}</h3>
                <p className="text-xs text-gray-500 mb-2">NIP. {p.nip}</p>
                <p className="text-xs font-semibold text-primary-600 bg-primary-50 rounded-full px-3 py-1 inline-block">
                  {p.jabatan}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-10 p-4 bg-blue-50 border-l-4 border-primary-600 rounded-lg text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <Users size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <span>
                Data pejabat di atas berdasarkan struktur organisasi terkini Dinas Pariwisata Provinsi Sulawesi Tengah.
                Untuk informasi lebih lanjut, silakan hubungi <a href="mailto:dispar@sultengprov.go.id" className="text-primary-600 underline">dispar@sultengprov.go.id</a>.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilPimpinan;