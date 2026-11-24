import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa6';
import { useLanguage } from '../context/LanguageContext';
import { UI_STRINGS } from '../utils/translations';

const Footer = () => {
  const { language } = useLanguage();
  const strings = UI_STRINGS[language] || UI_STRINGS.ID;
  const isEn = language === 'EN';

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
            <a href="#" className="hover:text-white transition-colors">{isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEn ? 'Terms & Conditions' : 'Syarat & Ketentuan'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEn ? 'Sitemap' : 'Peta Situs'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
