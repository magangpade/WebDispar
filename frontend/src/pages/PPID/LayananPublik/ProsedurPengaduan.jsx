import { Helmet } from 'react-helmet-async';
import { CheckCircle, ShieldAlert, Phone, Mail, MessageCircle, Share2, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/PageHeader';

const FaWhatsapp = ({ size = 20 }) => <MessageCircle size={size} />;
const FaInstagram = ({ size = 20 }) => <Share2 size={size} />;
const FaFacebook = ({ size = 20 }) => <Globe size={size} />;
const FaSquareTwitter = ({ size = 20 }) => <MessageSquare size={size} />;
const FaPhone = ({ size = 20 }) => <Phone size={size} />;
const FaEnvelope = ({ size = 20 }) => <Mail size={size} />;

const ProsedurPengaduan = () => {
  const steps = [
    {
      title: 'KANAL LAPORAN',
      desc: 'Sampaikan pengaduan Anda melalui kanal yang tersedia (telepon, email, media sosial, website)',
      color: 'from-red-500 to-red-700',
    },
    {
      title: 'PENDATAAN',
      desc: 'Pengaduan Anda akan dicatat dan diverifikasi oleh petugas',
      color: 'from-blue-500 to-blue-700',
    },
    {
      title: 'DISPOSISI',
      desc: 'Pengaduan diteruskan ke bidang terkait untuk ditindaklanjuti',
      color: 'from-purple-500 to-purple-700',
    },
    {
      title: 'TINDAK LANJUT',
      desc: 'Pengaduan ditindaklanjuti dan Anda akan mendapat respon',
      color: 'from-green-500 to-green-700',
    },
  ];

  const kanal = [
    {
      icon: FaWhatsapp,
      label: '@LAPOR1708',
      desc: 'WhatsApp / SMS',
      href: 'https://wa.me/6281117081708',
      color: 'bg-green-500',
    },
    {
      icon: FaInstagram,
      label: '@LAPOR1708',
      desc: 'Instagram',
      href: 'https://instagram.com/lapor1708',
      color: 'bg-pink-500',
    },
    {
      icon: FaFacebook,
      label: '@LAPOR1708',
      desc: 'Facebook',
      href: 'https://facebook.com/lapor1708',
      color: 'bg-blue-600',
    },
    {
      icon: FaSquareTwitter,
      label: '@LAPOR1708',
      desc: 'Twitter',
      href: 'https://twitter.com/lapor1708',
      color: 'bg-sky-500',
    },
    {
      icon: FaPhone,
      label: 'Hotline',
      desc: 'Telepon / Call Center',
      href: 'tel:1500',
      color: 'bg-red-500',
    },
    {
      icon: FaEnvelope,
      label: 'lapor.go.id',
      desc: 'Website Resmi',
      href: 'https://www.lapor.go.id',
      color: 'bg-navy-800',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Prosedur Pengaduan - PPID Dinas Pariwisata Sulteng</title>
      </Helmet>

      <PageHeader
        badge="Layanan Aspirasi & Pengaduan"
        badgeIcon={ShieldAlert}
        title="Prosedur Pengaduan"
        subtitle="Tata Cara Pengaduan Penyelenggaraan Wewenang atau Pelanggaran yang Dilakukan oleh Pejabat Badan Publik"
        breadcrumbs={[
          { label: 'PPID', path: '/ppid/profil' },
          { label: 'Layanan Publik' },
          { label: 'Prosedur Pengaduan' }
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {/* Steps */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">Alur Pengaduan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="card p-6 h-full">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-lg`}
                    >
                      {idx === steps.length - 1 ? (
                        <CheckCircle size={26} />
                      ) : (
                        <span className="text-2xl font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-navy-900 mb-2 text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-navy-300" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Kanal */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">Kanal Pengaduan</h2>
            <p className="text-center text-gray-500 mb-8">
              Laporan pengaduan melalui kanal Medsos (Instagram, Facebook, Twitter), Lapor Tuaka
              Website (lapor.go.id), Lapor Android, dan Hotline
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kanal.map((k, idx) => (
                <a
                  key={idx}
                  href={k.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${k.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                  >
                    <k.icon size={24} />
                  </div>
                  <p className="text-xs font-semibold text-navy-900 mt-1">{k.label}</p>
                  <p className="text-[10px] text-gray-400 text-center">{k.desc}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-5 bg-gold-50 border-l-4 border-gold-400 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Catatan:</strong> Setiap pengaduan akan ditindaklanjuti sesuai dengan ketentuan
              yang berlaku. Identitas pelapor akan dirahasiakan. Untuk pengaduan yang memerlukan tindak
              lanjut cepat, silakan menghubungi hotline <strong>1500</strong> atau melalui WhatsApp{' '}
              <strong>0811 1708 1708</strong>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProsedurPengaduan;