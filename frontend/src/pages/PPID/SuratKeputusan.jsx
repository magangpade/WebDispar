import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download } from 'lucide-react';
import api from '../../services/api';

const KATEGORI = [
  'SK Daftar Informasi Publik',
  'SK Penetapan Informasi Dikecualikan',
  'SK PPID',
  'SK Petugas Layanan Informasi Publik',
  'SK Petugas Kehumasan',
  'SK Petugas Aduan Masyarakat',
];

const TAHUN = ['2021', '2022', '2023', '2024', '2025', '2026'];

const SuratKeputusan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ppid/sk')
      .then((res) => setData(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group by judul
  const grouped = KATEGORI.map((kat) => ({
    kategori: kat,
    items: TAHUN.map((thn) => {
      const found = data.find((d) => d.judul?.includes(kat) && d.tahun === thn);
      return { tahun: thn, file: found?.file };
    }),
  }));

  return (
    <>
      <Helmet><title>Surat Keputusan - PPID Dinas Pariwisata Sulteng</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Surat Keputusan</h1>
          <p className="text-white/70 mt-2">Informasi Publik Dinas Pariwisata Provinsi Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          <div className="card overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">JENIS SK</th>
                  {TAHUN.map((thn) => (
                    <th key={thn} className="px-4 py-4 text-center text-sm font-semibold">{thn}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-navy-900">{row.kategori}</td>
                    {row.items.map((item, iIdx) => (
                      <td key={iIdx} className="px-4 py-4 text-center">
                        {item.file ? (
                          <a
                            href={item.file.startsWith('http') ? item.file : `/uploads/${item.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline"
                          >
                            <FileText size={12} /> Lihat
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuratKeputusan;