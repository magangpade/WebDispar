import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaRegClock,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaRegPaperPlane,
} from 'react-icons/fa6';
import { motion } from 'framer-motion';

const HubungiKami = () => {
  const [form, setForm] = useState({ nama: '', email: '', subjek: '', pesan: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ nama: '', email: '', subjek: '', pesan: '' });
  };

  const kontak = [
    {
      icon: FaLocationDot,
      title: 'Alamat Kantor',
      value:
        'Jalan Dewi Sartika Nomor 45 Palu, Kode Pos 94121\nPalu Selatan, Sulawesi Tengah, Indonesia',
      color: 'from-red-500 to-red-700',
    },
    {
      icon: FaPhone,
      title: 'Telepon',
      value: '(0451) 483942',
      href: 'tel:0451483942',
      color: 'from-green-500 to-green-700',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'dispar@sultengprov.go.id',
      href: 'mailto:dispar@sultengprov.go.id',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: FaRegClock,
      title: 'Jam Kerja',
      value: 'Senin - Jumat: 08.00 - 16.00 WITA\nSabtu - Minggu: Tutup',
      color: 'from-purple-500 to-purple-700',
    },
  ];

  const social = [
    {
      icon: FaYoutube,
      label: 'Dinas Pariwisata Sulteng',
      href: 'https://youtube.com',
      color: 'hover:bg-red-600',
    },
    {
      icon: FaInstagram,
      label: 'dinaspariwisatasulteng',
      href: 'https://instagram.com',
      color: 'hover:bg-pink-600',
    },
    {
      icon: FaTiktok,
      label: 'dispar.sulteng',
      href: 'https://tiktok.com',
      color: 'hover:bg-black',
    },
    {
      icon: FaFacebook,
      label: 'Dinas Pariwisata Sulawesi Tengah',
      href: 'https://facebook.com',
      color: 'hover:bg-blue-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Hubungi Kami - Dinas Pariwisata Sulteng</title>
      </Helmet>

      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Hubungi Kami</h1>
          <p className="text-white/70 mt-2">Kami siap membantu Anda</p>
        </div>
      </div>

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
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors whitespace-pre-line"
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
                <h2 className="font-bold text-navy-900">Lokasi Kantor Dinas Pariwisata</h2>
                <p className="mt-1 text-sm text-gray-600">Jalan Dewi Sartika Nomor 45, Palu, Sulawesi Tengah</p>
                <a
                  href="https://maps.app.goo.gl/KET7RCLtQzEHyH7E7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800"
                >
                  <FaLocationDot aria-hidden="true" />
                  Buka lokasi di Google Maps
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
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Kirim Pesan</h2>
              <p className="text-gray-500 text-sm mb-6">
                Isi formulir di bawah ini, kami akan segera merespon
              </p>

              {sent && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  ✓ Pesan Anda berhasil terkirim. Terima kasih!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder="Masukkan nama Anda"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                  <input
                    type="text"
                    required
                    value={form.subjek}
                    onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder="Subjek pesan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                  <textarea
                    required
                    rows={4}
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  <FaRegPaperPlane size={18} /> Kirim Pesan
                </button>
              </form>
            </motion.div>
          </div>

          {/* Social Media */}
          <div className="mt-12 card p-8 text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Ikuti Kami</h2>
            <p className="text-gray-500 text-sm mb-6">
              Dapatkan informasi terbaru melalui media sosial resmi kami
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {social.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
