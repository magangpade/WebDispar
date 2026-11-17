import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, Download, FileText, BedDouble, Building2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const HUNIAN_KABUPATEN = [
  { no: 1, kabupaten: 'Kota Palu', bintang: 18, nonBintang: 112, kamar: 3420, restoran: 276, tpk: '54,82%' },
  { no: 2, kabupaten: 'Kabupaten Morowali', bintang: 4, nonBintang: 95, kamar: 1860, restoran: 62, tpk: '58,90%' },
  { no: 3, kabupaten: 'Kabupaten Banggai', bintang: 6, nonBintang: 82, kamar: 1640, restoran: 27, tpk: '53,45%' },
  { no: 4, kabupaten: 'Kabupaten Tojo Una-Una', bintang: 3, nonBintang: 76, kamar: 1290, restoran: 39, tpk: '51,20%' },
  { no: 5, kabupaten: 'Kabupaten Poso', bintang: 3, nonBintang: 68, kamar: 1185, restoran: 107, tpk: '46,15%' },
  { no: 6, kabupaten: 'Kabupaten Parigi Moutong', bintang: 2, nonBintang: 64, kamar: 1040, restoran: 270, tpk: '43,75%' },
  { no: 7, kabupaten: 'Kabupaten Morowali Utara', bintang: 2, nonBintang: 54, kamar: 920, restoran: 150, tpk: '49,60%' },
  { no: 8, kabupaten: 'Kabupaten Tolitoli', bintang: 2, nonBintang: 52, kamar: 890, restoran: 133, tpk: '44,80%' },
  { no: 9, kabupaten: 'Kabupaten Donggala', bintang: 2, nonBintang: 49, kamar: 810, restoran: 164, tpk: '42,30%' },
  { no: 10, kabupaten: 'Kabupaten Buol', bintang: 1, nonBintang: 36, kamar: 540, restoran: 104, tpk: '40,50%' },
  { no: 11, kabupaten: 'Kabupaten Sigi', bintang: 1, nonBintang: 28, kamar: 415, restoran: 47, tpk: '38,40%' },
  { no: 12, kabupaten: 'Kabupaten Banggai Laut', bintang: 1, nonBintang: 29, kamar: 410, restoran: 43, tpk: '41,25%' },
  { no: 13, kabupaten: 'Kabupaten Banggai Kepulauan', bintang: 0, nonBintang: 31, kamar: 390, restoran: 81, tpk: '39,10%' },
];

const DataHunian = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/info-pariwisata/data-hunian')
      .then((res) => setData(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Data Hunian Hotel - Info Pariwisata Sulawesi Tengah</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Data Hunian Hotel</h1>
          <p className="text-white/70 mt-2">Informasi tingkat penghunian kamar (TPK) dan direktori akomodasi wisata di Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Ringkasan Statistik Akomodasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                <Hotel size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hotel Berbintang</p>
                <p className="text-2xl font-bold text-navy-900">45 Unit</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hotel Non-Bintang & Homestay</p>
                <p className="text-2xl font-bold text-navy-900">776 Unit</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <BedDouble size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Kapasitas Kamar</p>
                <p className="text-2xl font-bold text-navy-900">14.810 Kamar</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-primary-600 to-navy-800 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-white/75">Rata-Rata TPK Provinsi</p>
                <p className="text-2xl font-bold">46,48%</p>
              </div>
            </div>
          </div>

          {/* Tabel Rekapitulasi Per Kabupaten/Kota */}
          <div className="card overflow-hidden mb-10">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy-900">
                Rekapitulasi Akomodasi Hotel & Tingkat Penghunian Kamar (TPK) Menurut Kabupaten/Kota
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Data sektoral akomodasi perhotelan dan sarana rumah makan/restoran di 13 Kabupaten/Kota Provinsi Sulawesi Tengah
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-navy-800 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4">Kabupaten / Kota</th>
                    <th className="py-3.5 px-4 text-center">Hotel Bintang</th>
                    <th className="py-3.5 px-4 text-center">Hotel Non-Bintang</th>
                    <th className="py-3.5 px-4 text-center">Jumlah Kamar</th>
                    <th className="py-3.5 px-4 text-center">Rumah Makan / Restoran</th>
                    <th className="py-3.5 px-4 text-center">Rata-Rata TPK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {HUNIAN_KABUPATEN.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center text-gray-500">{row.no}</td>
                      <td className="py-3 px-4 font-medium text-navy-900">{row.kabupaten}</td>
                      <td className="py-3 px-4 text-center">{row.bintang.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-center">{row.nonBintang.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-center font-medium">{row.kamar.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-center">{row.restoran.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700">
                          {row.tpk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold text-navy-900 border-t-2 border-gray-200">
                  <tr>
                    <td colSpan={2} className="py-3.5 px-4">Total / Rata-Rata Provinsi Sulawesi Tengah</td>
                    <td className="py-3.5 px-4 text-center">45</td>
                    <td className="py-3.5 px-4 text-center">776</td>
                    <td className="py-3.5 px-4 text-center">14.810</td>
                    <td className="py-3.5 px-4 text-center">1.503</td>
                    <td className="py-3.5 px-4 text-center text-primary-700">46,48%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Dokumen Unduhan Resmi */}
          <h2 className="text-xl font-bold text-navy-900 mb-4">Dokumen & Laporan Data Hunian Hotel (PDF)</h2>
          {loading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-gray-400 card">
              <Hotel size={48} className="mx-auto mb-4 opacity-30" />
              <p>Belum ada data hunian tersedia</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-6 flex flex-col sm:flex-row sm:items-center gap-5"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
                    <Hotel size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-navy-900 mb-1">{item.judul}</h3>
                    <p className="text-xs text-gray-500">{item.deskripsi}</p>
                  </div>
                  {item.file && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={item.file.startsWith('http') || item.file.startsWith('/') ? item.file : `/uploads/${item.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
                      >
                        <FileText size={15} /> Lihat
                      </a>
                      <a
                        href={item.file.startsWith('http') || item.file.startsWith('/') ? item.file : `/uploads/${item.file}`}
                        download
                        className="inline-flex items-center gap-1.5 border border-primary-600 text-primary-600 hover:bg-primary-50 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
                      >
                        <Download size={15} /> Unduh
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Info tambahan */}
          <div className="mt-10 card p-6 bg-blue-50 border-l-4 border-primary-600">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Catatan:</p>
                <p>Data hunian hotel dan statistik akomodasi bersumber dari dokumen resmi Dinas Pariwisata Provinsi Sulawesi Tengah yang telah disimpan secara lokal di server ini.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DataHunian;
