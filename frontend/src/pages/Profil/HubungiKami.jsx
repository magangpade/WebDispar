import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0  -2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TiktokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const HubungiKami = () => {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const [form, setForm] = useState({ nama: '', email: '', subjek: '', pesan: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setErrorMsg('');
    setSent(false);
    try {
      await api.post('/profil/pesan', form);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setForm({ nama: '', email: '', subjek: '', pesan: '' });
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          (isEn
            ? 'Failed to send message. Please try again later.'
            : 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.')
      );
    } finally {
      setSending(false);
    }
  };

  const kontak = [
    {
      icon: MapPin,
      title: isEn ? 'Office Address' : 'Alamat Kantor',
      value:
        'Jalan Dewi Sartika Nomor 45 Palu, Kode Pos 94121\nPalu Selatan, Sulawesi Tengah, Indonesia',
      href: 'https://maps.app.goo.gl/KET7RCLtQzEHyH7E7',
      color: 'from-red-500 to-red-700',
    },
    {
      icon: Phone,
      title: isEn ? 'Telephone' : 'Telepon',
      value: '(0451) 483942',
      href: 'tel:0451483942',
      color: 'from-green-500 to-green-700',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'dispar@sultengprov.go.id',
      href: 'mailto:dispar@sultengprov.go.id',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: Clock,
      title: isEn ? 'Working Hours' : 'Jam Kerja',
      value: isEn
        ? 'Monday - Friday: 08.00 - 16.00 WITA\nSaturday - Sunday: Closed'
        : 'Senin - Jumat: 08.00 - 16.00 WITA\nSabtu - Minggu: Tutup',
      color: 'from-purple-500 to-purple-700',
    },
  ];

  const social = [
    {
      icon: YoutubeIcon,
      label: 'Dinas Pariwisata Sulteng',
      href: 'https://www.youtube.com/@dinaspariwisatasulteng',
      color: 'hover:bg-red-600',
    },
    {
      icon: InstagramIcon,
      label: 'dinaspariwisatasulteng',
      href: 'https://www.instagram.com/dinaspariwisatasulteng/',
      color: 'hover:bg-pink-600',
    },
    {
      icon: TiktokIcon,
      label: 'dispar.sulteng',
      href: 'https://www.tiktok.com/@dispar.sulteng',
      color: 'hover:bg-black',
    },
    {
      icon: FacebookIcon,
      label: 'Dinas Pariwisata Sulawesi Tengah',
      href: 'https://www.facebook.com/dinaspariwisatasulteng/',
      color: 'hover:bg-blue-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{isEn ? 'Contact Us - Central Sulawesi Tourism Office' : 'Hubungi Kami - Dinas Pariwisata Sulteng'}</title>
      </Helmet>

      <PageHeader
        badge={isEn ? 'Contact & Location Services' : 'Layanan Kontak & Lokasi'}
        title={isEn ? 'Contact Us' : 'Hubungi Kami'}
        subtitle={
          isEn
            ? 'We are ready to assist your tourism information, partnership, and consultation needs'
            : 'Kami siap melayani kebutuhan informasi, kemitraan, dan konsultasi kepariwisataan Anda'
        }
        breadcrumbs={[
          { label: isEn ? 'Profile' : 'Profil', path: '/profil' },
          { label: isEn ? 'Contact Us' : 'Hubungi Kami' }
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Info Kontak */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {kontak.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4`}
                >
                  <item.icon size={22} />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors whitespace-pre-line hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600 whitespace-pre-line">{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card flex w-full flex-col"
            >
              <div className="relative h-72 sm:h-80 lg:h-auto lg:flex-1">
                <iframe
                  title="Pratinjau lokasi Kantor Dinas Pariwisata"
                  src="https://www.google.com/maps?q=Dinas+Pariwisata+Provinsi+Sulawesi+Tengah%2C+Jalan+Dewi+Sartika+Nomor+45%2C+Palu&z=17&output=embed"
                  className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={-1}
                />
                <a
                  href="https://maps.app.goo.gl/KET7RCLtQzEHyH7E7"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka lokasi Kantor Dinas Pariwisata di Google Maps"
                  className="absolute inset-0"
                />
              </div>
              <div className="p-5">
                <h2 className="font-bold text-navy-900">{isEn ? 'Tourism Office Location' : 'Lokasi Kantor Dinas Pariwisata'}</h2>
                <p className="mt-1 text-sm text-gray-600">Jalan Dewi Sartika Nomor 45, Palu, Sulawesi Tengah</p>
                <a
                  href="https://maps.app.goo.gl/KET7RCLtQzEHyH7E7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800"
                >
                  <MapPin size={16} aria-hidden="true" />
                  {isEn ? 'Open location in Google Maps' : 'Buka lokasi di Google Maps'}
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold text-navy-900 mb-2">{isEn ? 'Send a Message' : 'Kirim Pesan'}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {isEn ? 'Fill out the form below, and we will get back to you shortly' : 'Isi formulir di bawah ini, kami akan segera merespon'}
              </p>

              {sent && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {isEn ? '✓ Your message has been sent successfully. Thank you!' : '✓ Pesan Anda berhasil terkirim. Terima kasih!'}
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEn ? 'Full Name' : 'Nama Lengkap'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder={isEn ? 'Enter your full name' : 'Masukkan nama Anda'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder="email@contoh.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEn ? 'Subject' : 'Subjek'}</label>
                  <input
                    type="text"
                    required
                    value={form.subjek}
                    onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder={isEn ? 'Message subject' : 'Subjek pesan'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEn ? 'Message' : 'Pesan'}</label>
                  <textarea
                    required
                    rows={4}
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
                    placeholder={isEn ? 'Write your message here...' : 'Tulis pesan Anda di sini...'}
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-60">
                  <Send size={18} /> {sending ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Send Message' : 'Kirim Pesan')}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Social Media */}
          <div className="mt-12 card p-8 text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-2">{isEn ? 'Follow Us' : 'Ikuti Kami'}</h2>
            <p className="text-gray-500 text-sm mb-6">
              {isEn
                ? 'Stay connected and get the latest updates through our official social media channels'
                : 'Dapatkan informasi terbaru melalui media sosial resmi kami'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {social.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Kunjungi ${s.label} resmi Dinas Pariwisata Sulawesi Tengah`}
                  aria-label={s.label}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-navy-900 text-white font-medium transition-colors ${s.color}`}
                >
                  <s.icon size={18} /> {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HubungiKami;
