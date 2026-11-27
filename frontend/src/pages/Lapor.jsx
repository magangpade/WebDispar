import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, MessageSquare, Phone, Mail, MapPin, CheckCircle, Clock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';

const Lapor = () => {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const steps = isEn
    ? [
        { no: '1', title: 'Write Report', desc: 'Describe your complaint or aspiration clearly, kèmkan bukti jika ada.' },
        { no: '2', title: 'Verification', desc: 'The national LAPOR! team will verify and forward your report to Central Sulawesi Provincial Government.' },
        { no: '3', title: 'Follow-Up', desc: 'The relevant department will follow up and respond within 5 working days.' },
        { no: '4', title: 'Feedback', desc: 'You can review and provide feedback on the response given by the department.' },
        { no: '5', title: 'Resolution', desc: 'Your report is monitored continuously until completely resolved.' },
      ]
    : [
        { no: '1', title: 'Tulis Laporan', desc: 'Tuliskan keluhan atau aspirasi Anda dengan jelas dan sertakan bukti pendukung jika ada.' },
        { no: '2', title: 'Proses Verifikasi', desc: 'Tim administrator SP4N-LAPOR! akan memverifikasi dan meneruskan ke Pemprov Sulawesi Tengah.' },
        { no: '3', title: 'Tindak Lanjut', desc: 'Instansi terkait (Dinas Pariwisata) akan menindaklanjuti dan membalas dalam waktu maksimal 5 hari kerja.' },
        { no: '4', title: 'Beri Tanggapan', desc: 'Anda dapat menanggapi kembali balasan yang diberikan oleh instansi.' },
        { no: '5', title: 'Selesai', desc: 'Laporan Anda akan terus dipantau hingga dinyatakan tuntas dan terselesaikan.' },
      ];

  const channels = isEn
    ? [
        {
          icon: ExternalLink,
          title: 'Official SP4N-LAPOR! Portal',
          detail: 'www.lapor.go.id',
          desc: 'Primary national online reporting portal accessible 24/7.',
          actionText: 'Submit Report on LAPOR!',
          href: 'https://www.lapor.go.id',
          isExternal: true,
          badge: 'Recommended',
          badgeColor: 'bg-emerald-500 text-white',
        },
        {
          icon: MessageSquare,
          title: 'SMS Service 1708',
          detail: 'Send to 1708',
          desc: 'Format: SULTENG (space) YOUR_REPORT send to 1708 (standard Telkomsel/Indosat/XL rates).',
          actionText: 'SMS 1708',
          href: 'sms:1708',
          isExternal: false,
          badge: 'Quick SMS',
          badgeColor: 'bg-blue-500 text-white',
        },
        {
          icon: Mail,
          title: 'Official Department Email',
          detail: 'dispar@sultengprov.go.id',
          desc: 'Direct consultation, suggestions, and official correspondence.',
          actionText: 'Send Email',
          href: 'mailto:dispar@sultengprov.go.id',
          isExternal: false,
          badge: 'Email',
          badgeColor: 'bg-purple-500 text-white',
        },
        {
          icon: Phone,
          title: 'BERANI SAMPOROA Hotline',
          detail: '0811-6662-222',
          desc: 'Central Sulawesi Tourism quick response and emergency command center.',
          actionText: 'Contact WhatsApp',
          href: 'https://wa.me/628116662222',
          isExternal: true,
          badge: 'Hotline',
          badgeColor: 'bg-amber-500 text-slate-900',
        },
      ]
    : [
        {
          icon: ExternalLink,
          title: 'Portal Resmi SP4N-LAPOR!',
          detail: 'www.lapor.go.id',
          desc: 'Kanal pengaduan pelayanan publik nasional resmi yang aktif 24 jam.',
          actionText: 'Buat Laporan di LAPOR!',
          href: 'https://www.lapor.go.id',
          isExternal: true,
          badge: 'Rekomendasi',
          badgeColor: 'bg-emerald-500 text-white',
        },
        {
          icon: MessageSquare,
          title: 'Layanan SMS 1708',
          detail: 'Kirim ke 1708',
          desc: 'Ketik format: SULTENG (spasi) ISI LAPORAN kirim ke 1708 (tarif operator standar).',
          actionText: 'SMS ke 1708',
          href: 'sms:1708',
          isExternal: false,
          badge: 'SMS Cepat',
          badgeColor: 'bg-blue-500 text-white',
        },
        {
          icon: Mail,
          title: 'Email Pengaduan Dinas',
          detail: 'dispar@sultengprov.go.id',
          desc: 'Konsultasi tertulis, surat resmi, dan aspirasi masyarakat.',
          actionText: 'Kirim Email',
          href: 'mailto:dispar@sultengprov.go.id',
          isExternal: false,
          badge: 'Email',
          badgeColor: 'bg-purple-500 text-white',
        },
        {
          icon: Phone,
          title: 'Hotline BERANI SAMPOROA',
          detail: '0811-6662-222',
          desc: 'Command Center respon cepat tanggap pariwisata Sulawesi Tengah.',
          actionText: 'Hubungi WhatsApp',
          href: 'https://wa.me/628116662222',
          isExternal: true,
          badge: 'Hotline',
          badgeColor: 'bg-amber-500 text-slate-900',
        },
      ];

  return (
    <>
      <Helmet>
        <title>{isEn ? 'SP4N-LAPOR! Complaints - Central Sulawesi Tourism Department' : 'Layanan Pengaduan SP4N-LAPOR! - Dispar Sulteng'}</title>
      </Helmet>

      <PageHeader
        badge="Layanan Aspirasi & Pengaduan"
        badgeIcon={ShieldCheck}
        title="Layanan Pengaduan SP4N-LAPOR!"
        subtitle="Layanan Aspirasi dan Pengaduan Online Rakyat - Saluran Resmi Pengaduan Pelayanan Publik Terintegrasi Nasional"
        breadcrumbs={[{ label: 'Lapor' }]}
      />

      <section className="py-12 lg:py-16 bg-slate-50">
        <div className="container-custom max-w-6xl">
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold w-fit mb-4">
                  <ShieldCheck size={14} />
                  <span>{isEn ? 'National Complaint System (SP4N)' : 'Sistem Pengaduan Pelayanan Publik Nasional'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-4">
                  {isEn
                    ? 'Submit Your Aspirations & Complaints Officially'
                    : 'Sampaikan Aspirasi & Pengaduan Anda Secara Resmi'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {isEn
                    ? 'Department of Tourism Central Sulawesi Province is integrated with SP4N-LAPOR!, the national complaints system managed by the Ministry of PANRB, Presidential Staff Office, and Ombudsman RI. Every report is recorded, transparent, and followed up promptly.'
                    : 'Dinas Pariwisata Provinsi Sulawesi Tengah terhubung langsung dengan SP4N-LAPOR!, sistem pengelolaan pengaduan pelayanan publik nasional yang dikelola oleh Kementerian PANRB, Kantor Staf Presiden, dan Ombudsman RI. Setiap laporan Anda tercatat, transparan, dan ditindaklanjuti secara bertanggung jawab.'}
                </p>

                {/* Important Notice */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 mb-6 flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold">{isEn ? 'Tips for Submitting on LAPOR!:' : 'Petunjuk Pengisian di LAPOR!:'}</span>{' '}
                    {isEn
                      ? 'When filing a complaint on the LAPOR! portal, type and select the destination agency: "Pemerintah Provinsi Sulawesi Tengah" to ensure your report is directly handled by our team.'
                      : 'Saat mengisi formulir di situs LAPOR!, pada kolom Instansi Tujuan ketik dan pilih "Pemerintah Provinsi Sulawesi Tengah" agar laporan Anda langsung masuk ke tim verifikator kami.'}
                  </div>
                </div>

                <div data-tour="lapor-cta" className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://www.lapor.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{isEn ? 'Open SP4N-LAPOR! Portal' : 'Buka Situs SP4N-LAPOR!'}</span>
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href="sms:1708"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                  >
                    <MessageSquare size={16} />
                    <span>SMS 1708</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-slate-100 to-slate-200 p-6 sm:p-8 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-200">
                <img
                  src="/images/SP4N-LAPOR-768x500.jpg"
                  alt="SP4N LAPOR Resmi"
                  className="rounded-2xl shadow-md max-h-72 w-auto object-cover border border-white"
                  onError={(e) => {
                    e.currentTarget.src = '/slider/Slider.jpg';
                  }}
                />
              </div>
            </div>
          </div>

          {/* 5 Alur Pengaduan */}
          <div data-tour="lapor-steps" className="mb-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                {isEn ? 'REPORTING WORKFLOW' : 'ALUR PENGADUAN'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {isEn ? '5 Steps of Your Report Process' : '5 Tahap Penanganan Laporan Anda'}
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                {isEn
                  ? 'Transparent, timely, and trackable from submission to final resolution.'
                  : 'Proses penanganan pengaduan yang terukur, transparan, dan dapat dipantau langsung.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-red-600/30">
                    {step.no}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kanal Pengaduan Alternatif */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                {isEn ? 'ALTERNATIVE CHANNELS' : 'SALURAN RESMI'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {isEn ? 'All Available Public Complaints Channels' : 'Pilihan Kanal Layanan Pengaduan'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {channels.map((ch, idx) => {
                const IconComponent = ch.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                          <IconComponent size={20} />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${ch.badgeColor}`}>
                          {ch.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{ch.title}</h4>
                      <p className="text-sm font-semibold text-amber-600 mt-0.5">{ch.detail}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ch.desc}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <a
                        href={ch.href}
                        target={ch.isExternal ? '_blank' : '_self'}
                        rel={ch.isExternal ? 'noopener noreferrer' : ''}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-red-600 transition-colors"
                      >
                        <span>{ch.actionText}</span>
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Lapor;
