import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, ShieldCheck, PhoneCall, Info } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const InformasiSertaMerta = () => {
  return (
    <>
      <Helmet>
        <title>Informasi Serta Merta - PPID Dinas Pariwisata Provinsi Sulawesi Tengah</title>
        <meta
          name="description"
          content="Informasi Publik Serta Merta Dinas Pariwisata Provinsi Sulawesi Tengah sesuai UU No. 14 Tahun 2008 Pasal 10."
        />
      </Helmet>

      <PageHeader
        badge="PPID Pelaksana Dispar Sulteng"
        badgeIcon={AlertTriangle}
        title="Informasi Serta Merta"
        subtitle="Informasi yang berkaitan dengan hajat hidup orang banyak dan ketertiban umum serta wajib diumumkan tanpa penundaan sesuai Pasal 10 UU KIP No. 14 Tahun 2008."
        breadcrumbs={[
          { label: 'PPID', path: '/ppid/profil' },
          { label: 'Informasi Publik', path: '/ppid/daftar-informasi-publik' },
          { label: 'Informasi Serta Merta' }
        ]}
      />

      <div className="bg-gray-50/60 py-12 lg:py-16">
        <div className="container-custom max-w-4xl space-y-8">

          {/* Kotak Status Informasi (Persis Data Asli Web Dispar: No Data) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
            <div className="max-w-md mx-auto">
              <img
                src="/images/undraw_No_data_re_kwbl.png"
                alt="Tidak Ada Data Informasi Serta Merta"
                className="w-64 h-auto mx-auto mb-6 object-contain"
              />
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3 border border-emerald-200/50">
                Kondisi Aman & Terkendali
              </span>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">
                Tidak Ada Informasi Serta Merta
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Saat ini tidak terdapat situasi darurat bencana, ancaman bahaya keselamatan jiwa, atau gangguan ketertiban umum di seluruh kawasan destinasi wisata Provinsi Sulawesi Tengah. Seluruh aktivitas kepariwisataan berjalan normal, aman, dan kondusif.
              </p>
            </div>
          </div>

          {/* Penjelasan Edukatif Kategori Informasi Serta Merta */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-primary-600" size={22} />
              <h3 className="text-lg font-bold text-navy-900">
                Apa Itu Informasi Serta Merta?
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Sesuai dengan <strong>Undang-Undang Nomor 14 Tahun 2008 Pasal 10</strong> dan Peraturan Komisi Informasi (Perki) Nomor 1 Tahun 2021, Badan Publik berkewajiban mengumumkan secara serta merta informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum, meliputi:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h4 className="font-semibold text-navy-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Keadaan Darurat Bencana Alam
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Peringatan dini tsunami, gempa bumi, tanah longsor, cuaca ekstrem gelombang tinggi di perairan wisata bahari, atau bencana yang berdampak langsung pada wisatawan dan kawasan wisata.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h4 className="font-semibold text-navy-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Kedaruratan Kesehatan & Lingkungan
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Informasi wabah penyakit menular, pencemaran lingkungan akut di sekitar daya tarik wisata, atau insiden biologis/kimia yang berpotensi membahayakan keselamatan umum.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>Jika terjadi situasi darurat, PPID Dinas Pariwisata akan segera mempublikasikan arahan resmi di halaman ini.</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/ppid/layanan-publik/prosedur-pengaduan"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1F5BA6] text-xs font-bold transition-all border border-blue-200/60 shrink-0"
                >
                  <PhoneCall size={14} />
                  <span>Prosedur Pengaduan</span>
                </Link>
                <Link
                  to="/profil/hubungi-kami"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shrink-0"
                >
                  <PhoneCall size={14} />
                  <span>Hubungi Kami</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default InformasiSertaMerta;
