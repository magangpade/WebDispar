import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UI_STRINGS } from '../utils/translations';

const FaFacebookF = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);
const FaTwitter = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FaInstagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const FaYoutube = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const FaTiktok = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => {
  const { language } = useLanguage();
  const strings = UI_STRINGS[language] || UI_STRINGS.ID;
  const isEn = language === 'EN';
  const [activeInfo, setActiveInfo] = useState(null);

  return (
    <footer
      className="w-full text-slate-200 border-t border-white/10 pt-12 pb-8 px-4 lg:px-8 transition-colors duration-300"
      style={{ background: 'var(--theme-gradient-vertical, linear-gradient(to bottom, #5C2180, #143D8F))' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* 4 Kolom Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Kolom 1: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[#FBBF24] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
              {strings.quickLinks || 'Quick Links'}
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              {[
                { label: isEn ? 'Home' : 'Home', path: '/' },
                { label: isEn ? 'Profile' : 'Profil', path: '/profil/sejarah' },
                { label: isEn ? 'Public Information' : 'Informasi Publik', path: '/ppid/daftar-informasi-publik' },
                { label: isEn ? 'Tourism Info' : 'Info Pariwisata', path: '/info-pariwisata/destinasi/daya-tarik-wisata' },
                { label: isEn ? 'Publication Plan' : 'Rencana Terbit', path: '/rencana-terbit' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-amber-400 text-xs">›</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Kolom 2: Kontak */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[#FBBF24] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
              {strings.contact || 'Kontak'}
            </h3>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <Link to="/profil/hubungi-kami" className="hover:text-amber-300 transition-colors">
                {strings.officeAddress || 'Alamat Kantor'}
              </Link>
              <Link to="/profil/hubungi-kami" className="hover:text-amber-300 transition-colors">
                {strings.complaintEmail || 'Email Pengaduan'}
              </Link>
              <Link to="/profil/hubungi-kami" className="hover:text-amber-300 transition-colors">
                {strings.tenganiService || 'Layanan Pengaduan Tengani'}
              </Link>
              <Link to="/ppid/profil" className="hover:text-amber-300 transition-colors">
                {strings.ppidTourism || 'PPID Dinas Pariwisata'}
              </Link>
            </div>
          </div>

          {/* Kolom 3: Alamat & Kontak Resmi */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[#FBBF24] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
              {strings.officialContact || 'Alamat & Kontak Resmi'}
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <a
                href="https://maps.app.goo.gl/KET7RCLtQzEHyH7E7"
                target="_blank"
                rel="noopener noreferrer"
                title={isEn ? 'Open tourism office location on Google Maps' : 'Buka lokasi Kantor Dinas Pariwisata di Google Maps'}
                className="flex items-start gap-2.5 group hover:text-amber-300 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed group-hover:underline">
                  {strings.fullAddress || 'Jalan Dewi Sartika Nomor 45 Palu, Kode Pos 94121, Palu Selatan, Sulawesi Tengah'}
                </span>
              </a>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FBBF24] shrink-0" />
                <a href="mailto:dispar@sultengprov.go.id" className="hover:text-amber-300 transition-colors">
                  dispar@sultengprov.go.id
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FBBF24] shrink-0" />
                <a href="tel:0451483942" className="hover:text-amber-300 transition-colors">
                  (0451) 483942
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 4: Media Sosial Resmi */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[#FBBF24] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
              {strings.officialSocial || 'Media Sosial Resmi'}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {strings.socialDesc || 'Ikuti akun resmi Dinas Pariwisata Provinsi Sulawesi Tengah untuk informasi festival dan pariwisata terkini.'}
            </p>
            <div className="flex gap-2.5 pt-1">
              {[
                { Icon: FaFacebookF, href: 'https://www.facebook.com/dinaspariwisatasulteng/', label: 'Facebook' },
                { Icon: FaInstagram, href: 'https://www.instagram.com/dinaspariwisatasulteng/', label: 'Instagram' },
                { Icon: FaTiktok, href: 'https://www.tiktok.com/@dispar.sulteng', label: 'TikTok' },
                { Icon: FaYoutube, href: 'https://www.youtube.com/@dinaspariwisatasulteng', label: 'YouTube' },
              ].map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Baris Hak Cipta & Link Bawah */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300/80">
          <p>{strings.copyright || '© 2026 Dinas Pariwisata Provinsi Sulawesi Tengah. All Rights Reserved.'}</p>
          <div className="flex gap-5">
            <button type="button" onClick={() => setActiveInfo('privacy')} className="hover:text-white transition-colors cursor-pointer">
              {isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}
            </button>
            <button type="button" onClick={() => setActiveInfo('terms')} className="hover:text-white transition-colors cursor-pointer">
              {isEn ? 'Terms & Conditions' : 'Syarat & Ketentuan'}
            </button>
            <button type="button" onClick={() => setActiveInfo('sitemap')} className="hover:text-white transition-colors cursor-pointer">
              {isEn ? 'Sitemap' : 'Peta Situs'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Kebijakan Privasi / Syarat & Ketentuan / Peta Situs */}
      {activeInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveInfo(null)}
        >
          <div
            className="bg-white text-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-slate-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveInfo(null)}
              aria-label={isEn ? 'Close' : 'Tutup'}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {activeInfo === 'privacy' && (
              <div className="space-y-3 text-sm text-slate-600">
                <h3 className="text-lg font-bold text-slate-900 pr-8">
                  {isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}
                </h3>
                <p>
                  {isEn
                    ? 'The Official Portal of the Department of Tourism of Central Sulawesi Province respects visitor privacy. Personal data submitted through contact, information request, or objection forms is used solely for official public service processing.'
                    : 'Portal Resmi Dinas Pariwisata Provinsi Sulawesi Tengah menghormati privasi pengunjung. Data pribadi yang dikirimkan melalui formulir kontak, permohonan informasi, atau pengajuan keberatan hanya digunakan untuk keperluan layanan publik resmi.'}
                </p>
                <p>
                  {isEn
                    ? 'Visitor statistics are recorded anonymously for service evaluation and portal performance improvement.'
                    : 'Statistik kunjungan dicatat secara anonim untuk keperluan evaluasi layanan dan peningkatan kinerja portal.'}
                </p>
              </div>
            )}

            {activeInfo === 'terms' && (
              <div className="space-y-3 text-sm text-slate-600">
                <h3 className="text-lg font-bold text-slate-900 pr-8">
                  {isEn ? 'Terms & Conditions' : 'Syarat & Ketentuan'}
                </h3>
                <p>
                  {isEn
                    ? 'All public information, documents, and tourism data published on this portal are managed by the Department of Tourism of Central Sulawesi Province in accordance with Law No. 14 of 2008 on Public Information Disclosure.'
                    : 'Seluruh informasi publik, dokumen, dan data pariwisata pada portal ini dikelola oleh Dinas Pariwisata Provinsi Sulawesi Tengah sesuai Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.'}
                </p>
                <p>
                  {isEn
                    ? 'Users may download and cite public documents by citing the Department of Tourism of Central Sulawesi Province as the official source.'
                    : 'Pengguna diperkenankan mengunduh dan mengutip dokumen publik dengan mencantumkan Dinas Pariwisata Provinsi Sulawesi Tengah sebagai sumber resmi.'}
                </p>
              </div>
            )}

            {activeInfo === 'sitemap' && (
              <div className="space-y-3 text-sm text-slate-600">
                <h3 className="text-lg font-bold text-slate-900 pr-8">
                  {isEn ? 'Sitemap' : 'Peta Situs'}
                </h3>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { label: isEn ? 'Home' : 'Beranda', path: '/' },
                    { label: isEn ? 'News' : 'Berita', path: '/berita' },
                    { label: isEn ? 'History' : 'Sejarah', path: '/profil/sejarah' },
                    { label: isEn ? 'Leadership Profile' : 'Profil Pimpinan', path: '/profil/profil-pimpinan' },
                    { label: isEn ? 'PPID Profile' : 'Profil PPID', path: '/ppid/profil' },
                    { label: isEn ? 'Public Information' : 'Daftar Informasi Publik', path: '/ppid/daftar-informasi-publik' },
                    { label: isEn ? 'Tourist Attractions' : 'Daya Tarik Wisata', path: '/info-pariwisata/destinasi/daya-tarik-wisata' },
                    { label: isEn ? 'Tourism Villages' : 'Desa Wisata', path: '/info-pariwisata/destinasi/desa-wisata' },
                    { label: isEn ? 'Event Calendar' : 'Kalender Event', path: '/info-pariwisata/pemasaran/kalender-event' },
                    { label: isEn ? 'Publication Plan' : 'Rencana Terbit', path: '/rencana-terbit' },
                    { label: isEn ? 'Contact Us' : 'Hubungi Kami', path: '/profil/hubungi-kami' },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setActiveInfo(null)}
                      className="text-xs font-medium text-[#1F5BA6] hover:underline py-1"
                    >
                      › {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
