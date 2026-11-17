import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const OFFICIAL_LOGOS = [
  {
    label: 'Logo Dinas Pariwisata Sulteng',
    desc: 'Logo resmi instansi Dinas Pariwisata Provinsi Sulawesi Tengah format resolusi tinggi',
    preview: 'https://pariwisata.sultengprov.go.id/images/dinas_pariwisata-COLOR_BLACK.png',
    link: 'https://drive.google.com/drive/folders/1MFchSdQjgHxKhrMTkgCRYQojPNkq-urZ?usp=sharing',
    format: 'PNG HD'
  },
  {
    label: 'Branding Sulteng Nambaso',
    desc: 'Logo tagline pariwisata daerah Sulteng Nambaso (Sulawesi Tengah Hebat/Luar Biasa)',
    preview: 'https://pariwisata.sultengprov.go.id/images/SultengNambaso.png',
    link: 'https://drive.google.com/file/d/1nrNj20HzegreqIou8Af2StNetltaWVMC/view?usp=drive_link',
    format: 'PNG Transparent'
  },
  {
    label: 'Wonderful Indonesia',
    desc: 'Logo resmi kampanye kepariwisataan nasional Kementerian Pariwisata dan Ekonomi Kreatif',
    preview: 'https://pariwisata.sultengprov.go.id/images/media_1587964394_logo_wonderful_indonesia.png',
    link: 'https://drive.google.com/drive/folders/1Q-2fbXuovCZI6sWwF-bzZ2w0GpQJZSAA?usp=sharing',
    format: 'PNG Color & White'
  },
  {
    label: 'Branding Sulawesi Tengah',
    desc: 'City branding Sulawesi Tengah Complete Destination untuk promosi pariwisata internasional',
    preview: 'https://pariwisata.sultengprov.go.id/images/Branding_Sulteng.png',
    link: 'https://drive.google.com/drive/folders/1ZyNtw7_tSY0LkDfh5xFQph6ElFvsXrS6?usp=sharing',
    format: 'PNG HD'
  },
  {
    label: 'Logo 100% Sulawesi Tengah',
    desc: 'Stempel kampanye orisinalitas produk, destinasi, dan kerajinan khas Sulawesi Tengah',
    preview: 'https://pariwisata.sultengprov.go.id/images/PPID/Logo_100__Sulawesi_Tengah_-_Outline.png',
    link: 'https://drive.google.com/drive/folders/1O43KtomclfKs2AuojJXYJuDVZBOdyUqw',
    format: 'PNG Outline'
  },
  {
    label: 'Bangga Berwisata di Indonesia (BBWI)',
    desc: 'Gerakan nasional mendorong pergerakan wisatawan nusantara ke destinasi domestik',
    preview: 'https://pariwisata.sultengprov.go.id/images/PPID/BBWI_logo_2.png',
    link: 'https://drive.google.com/drive/folders/1X18KP8vl9rVxGDExxvanSQCoMU6pt44H?usp=sharing',
    format: 'PNG HD'
  },
  {
    label: 'Desain Berdasarkan Lokus Destinasi',
    desc: 'Kumpulan logo dan template promosi berdasarkan lokus 13 kabupaten/kota se-Sulawesi Tengah',
    preview: 'https://pariwisata.sultengprov.go.id/images/PPID/DESAIN_BERDASARKAN_LOKUS.png',
    link: 'https://drive.google.com/file/d/17RxXc5b_i2qWsksOjwR-NgsLfTFD8fnz/view?usp=sharing',
    format: 'Package ZIP'
  }
];

const GUIDELINES = [
  {
    title: 'Buku Panduan Brand & Logo Sulawesi Tengah Complete Destination',
    desc: 'Pedoman standar penggunaan logo, warna korporat, tipografi, dan tata letak promosi Sulawesi Tengah.',
    link: 'https://drive.google.com/file/d/1MpHwGaCGTONHBNpRQ37BK61WNFj06RcT/view?usp=sharing'
  },
  {
    title: 'Brand Guidance Wonderful Indonesia (Kemenparekraf RI)',
    desc: 'Panduan identitas visual Wonderful Indonesia untuk kolaborasi event dan kemitraan resmi.',
    link: 'https://www.indonesia.travel/id/id/brand-guidance'
  }
];

const Logo = () => {
  const [activeTab, setActiveTab] = useState('logo');

  return (
    <>
      <Helmet><title>Logo & Identitas Visual - Dinas Pariwisata Sulteng</title></Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Logo & Identitas Visual</h1>
          <p className="text-white/70 mt-2">Unduh aset logo resmi dan pedoman identitas visual pariwisata Sulawesi Tengah</p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-5 py-3 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'logo'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-navy-900'
              }`}
            >
              <ImageIcon size={18} />
              Aset Logo Resmi
            </button>
            <button
              onClick={() => setActiveTab('panduan')}
              className={`px-5 py-3 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'panduan'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-navy-900'
              }`}
            >
              <FileText size={18} />
              Buku Pedoman (Brand Guidelines)
            </button>
          </div>

          {activeTab === 'logo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {OFFICIAL_LOGOS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="card overflow-hidden flex flex-col justify-between"
                >
                  <div className="bg-slate-50 aspect-video flex items-center justify-center p-6 border-b border-gray-100">
                    <img
                      src={item.preview}
                      alt={item.label}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-navy-900 text-base">{item.label}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                          {item.format}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{item.desc}</p>
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      <Download size={14} /> Unduh Aset Lengkap
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'panduan' && (
            <div className="space-y-4 max-w-4xl">
              {GUIDELINES.map((g, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 text-base mb-1">{g.title}</h3>
                      <p className="text-sm text-gray-500">{g.desc}</p>
                    </div>
                  </div>
                  <a
                    href={g.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors flex-shrink-0"
                  >
                    Buka Panduan <ExternalLink size={14} />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Logo;
