import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight, ChevronLeft, X, ExternalLink, Sparkles } from 'lucide-react';

const SHARED_STEPS = {
  mobileMenu: {
    id: 'mobile-menu',
    selector: '[data-tour="mobile-menu"]',
    radius: 14,
    padding: 6,
    title: {
      ID: 'Menu Navigasi & Bahasa',
      EN: 'Navigation & Language Menu',
    },
    description: {
      ID: 'Ketuk tombol menu ini untuk membuka daftar seluruh layanan portal: Berita, Info Pariwisata (DTW & Event), Layanan Publik (PPID), Pengaduan, serta ganti bahasa ID/EN.',
      EN: 'Tap this menu button to open all portal sections: News, Tourism Info (Attractions & Events), Public Services (PPID), Reports, and ID/EN language switcher.',
    },
  },
  search: {
    id: 'search',
    selector: '[data-tour="search-btn"]',
    radius: 999,
    padding: 6,
    title: {
      ID: 'Pencarian Cepat Portal',
      EN: 'Quick Portal Search',
    },
    description: {
      ID: 'Cari destinasi wisata, agenda event, berita resmi, atau dokumen informasi publik dengan cepat dari halaman mana pun.',
      EN: 'Quickly search for tourist attractions, event agendas, official news, or public documents from any page.',
    },
  },
  langToggle: {
    id: 'language',
    selector: '[data-tour="lang-toggle"]',
    radius: 999,
    padding: 5,
    title: {
      ID: 'Pilihan Bahasa (ID / EN)',
      EN: 'Language Switcher (ID / EN)',
    },
    description: {
      ID: 'Ubah bahasa tampilan portal antara Bahasa Indonesia dan English kapan saja sesuai kenyamanan Anda.',
      EN: 'Switch the portal interface language between Bahasa Indonesia and English anytime.',
    },
  },
  breadcrumb: {
    id: 'breadcrumb',
    selector: '[data-tour="page-breadcrumb"]',
    radius: 12,
    padding: 8,
    title: {
      ID: 'Jejak Navigasi Halaman',
      EN: 'Page Breadcrumb Navigation',
    },
    description: {
      ID: 'Lihat posisi halaman Anda saat ini dan klik tautan induknya (seperti Home atau kategori layanan) untuk berpindah halaman dengan cepat.',
      EN: 'See your current location in the portal and click parent links (such as Home or category pages) to navigate back quickly.',
    },
  },
  skm: {
    id: 'skm-survey',
    selector: 'button[aria-label*="Survei"], button[aria-label*="Survey"]',
    radius: 999,
    padding: 6,
    title: {
      ID: 'Survei Kepuasan Masyarakat',
      EN: 'Satisfaction Survey',
    },
    description: {
      ID: 'Bantu tingkatkan kualitas pelayanan pariwisata dan informasi publik dengan mengisi survei singkat 1 menit lewat tombol ini.',
      EN: 'Help improve our tourism and public information services by submitting a quick 1-minute survey via this button.',
    },
  },
  statsWidget: {
    id: 'stats-widget',
    selector: '[data-tour="stats-widget"]',
    radius: 999,
    padding: 6,
    title: {
      ID: 'Statistik Pengunjung Langsung',
      EN: 'Live Visitor Statistics',
    },
    description: {
      ID: 'Klik tombol ini untuk memantau statistik kunjungan portal secara langsung (hari ini, bulan ini, dan total pengunjung).',
      EN: 'Click this button to view real-time portal traffic statistics (today, this month, and total visitors).',
    },
  },
};

function getRouteGuideConfig(pathname) {
  // 1. Beranda
  if (pathname === '/') {
    return {
      launcherLabel: { ID: 'Panduan Beranda', EN: 'Home Guide' },
      contextTitle: { ID: 'Beranda Portal', EN: 'Portal Home' },
      steps: [
        {
          id: 'nav-menus',
          selector: '[data-tour="nav-menus"]',
          radius: 999,
          padding: 6,
          title: { ID: 'Menu Navigasi Utama', EN: 'Main Navigation Menu' },
          description: {
            ID: 'Akses seluruh layanan portal di sini: Berita terkini, Profil dinas, Informasi Publik (PPID), Info Pariwisata (DTW & Kalender Event), hingga kanal Pengaduan.',
            EN: 'Access every portal service here: latest News, Agency Profile, Public Information (PPID), Tourism Info (Attractions & Events), and Public Reports.',
          },
          action: {
            label: { ID: 'Lihat Daya Tarik Wisata', EN: 'Explore Attractions' },
            to: '/info-pariwisata/destinasi/daya-tarik-wisata',
          },
        },
        SHARED_STEPS.mobileMenu,
        SHARED_STEPS.search,
        {
          id: 'home-news',
          selector: '[data-tour="home-news"]',
          radius: 18,
          padding: 8,
          title: { ID: 'Warta & Berita Terbaru', EN: 'Latest Regional News' },
          description: {
            ID: 'Pantau kabar terbaru seputar agenda, kebijakan, dan kegiatan pariwisata Sulawesi Tengah langsung dari beranda.',
            EN: 'Stay up to date with the latest tourism news, events, and initiatives across Central Sulawesi.',
          },
          action: {
            label: { ID: 'Buka Semua Berita', EN: 'View All News' },
            to: '/berita',
          },
        },
        {
          id: 'home-agenda',
          selector: '[data-tour="home-agenda"]',
          radius: 20,
          padding: 8,
          title: { ID: 'Kalender Event & Indeks Kepuasan', EN: 'Event Calendar & Satisfaction Index' },
          description: {
            ID: 'Jelajahi jadwal festival daerah tahun berjalan di sisi kiri dan capaian Survei Kepuasan Masyarakat (IKM) di sisi kanan.',
            EN: 'Explore upcoming regional festivals on the left and public service satisfaction index (IKM) scores on the right.',
          },
          action: {
            label: { ID: 'Buka Kalender Event', EN: 'Open Event Calendar' },
            to: '/info-pariwisata/pemasaran/kalender-event',
          },
        },
        SHARED_STEPS.langToggle,
        SHARED_STEPS.skm,
        SHARED_STEPS.statsWidget,
      ],
    };
  }

  // 2. Halaman Daftar Berita
  if (pathname === '/berita') {
    return {
      launcherLabel: { ID: 'Panduan Berita', EN: 'News Guide' },
      contextTitle: { ID: 'Halaman Berita', EN: 'News Page' },
      steps: [
        {
          id: 'berita-search',
          selector: '[data-tour="berita-search"]',
          radius: 999,
          padding: 6,
          title: { ID: 'Cari Kata Kunci Berita', EN: 'Search News Keywords' },
          description: {
            ID: 'Ketik topik, nama acara, atau kabupaten pada kolom ini untuk langsung menyaring daftar berita yang tampil di halaman.',
            EN: 'Type any topic, event name, or region here to filter the news articles shown on this page.',
          },
        },
        {
          id: 'berita-list',
          selector: 'main section .grid',
          radius: 18,
          padding: 8,
          title: { ID: 'Daftar Kartu Berita', EN: 'News Article Cards' },
          description: {
            ID: 'Klik salah satu kartu berita untuk membaca rilis lengkap, detail kegiatan, dan dokumentasi fotonya.',
            EN: 'Click any news card to read the full press release, event details, and photo documentation.',
          },
        },
        {
          id: 'berita-pagination',
          selector: '[data-tour="berita-pagination"]',
          radius: 14,
          padding: 8,
          title: { ID: 'Navigasi Halaman Arsip', EN: 'Archive Pagination' },
          description: {
            ID: 'Gunakan nomor halaman atau tombol panah kiri/kanan ini untuk menelusuri berita-berita sebelumnya.',
            EN: 'Use these page numbers or arrows to browse older news releases.',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 3. Halaman Detail Berita
  if (pathname.startsWith('/berita/')) {
    return {
      launcherLabel: { ID: 'Panduan Artikel', EN: 'Article Guide' },
      contextTitle: { ID: 'Baca Berita', EN: 'Read Article' },
      steps: [
        SHARED_STEPS.breadcrumb,
        {
          id: 'article-body',
          selector: 'main article, main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Konten & Dokumentasi Berita', EN: 'Article Content & Media' },
          description: {
            ID: 'Anda sedang membaca detail rilis resmi Dinas Pariwisata Sulawesi Tengah beserta tanggal terbit dan dokumentasi terkait.',
            EN: 'You are reading the full official release along with publication date and supporting documentation.',
          },
          action: {
            label: { ID: 'Lihat Berita Lainnya', EN: 'Browse More News' },
            to: '/berita',
          },
        },
        SHARED_STEPS.search,
      ],
    };
  }

  // 4. Daya Tarik Wisata (DTW)
  if (pathname.startsWith('/info-pariwisata/destinasi/daya-tarik-wisata')) {
    return {
      launcherLabel: { ID: 'Panduan Wisata', EN: 'Attractions Guide' },
      contextTitle: { ID: 'Daya Tarik Wisata', EN: 'Tourist Attractions' },
      steps: [
        {
          id: 'dtw-filter',
          selector: '[data-tour="dtw-filter"]',
          radius: 16,
          padding: 8,
          title: { ID: 'Filter Wilayah Kabupaten / Kota', EN: 'Filter by Regency / City' },
          description: {
            ID: 'Pilih tombol kabupaten/kota (misalnya Palu, Donggala, Tojo Una-Una, Poso, Banggai) untuk menyaring destinasi wisata di daerah tujuan Anda.',
            EN: 'Click a regency or city button to filter tourist attractions by destination area across Central Sulawesi.',
          },
        },
        {
          id: 'dtw-grid',
          selector: 'main section .grid',
          radius: 18,
          padding: 8,
          title: { ID: 'Katalog Objek Wisata Daerah', EN: 'Regional Attraction Directory' },
          description: {
            ID: 'Setiap kartu memuat foto, nama destinasi, wilayah, dan deskripsi daya tarik wisata yang dapat Anda kunjungi.',
            EN: 'Each card displays photos, location, and highlights of official tourist attractions to visit.',
          },
          action: {
            label: { ID: 'Lihat Desa Wisata', EN: 'Explore Tourism Villages' },
            to: '/info-pariwisata/destinasi/desa-wisata',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 5. Desa Wisata
  if (pathname.startsWith('/info-pariwisata/destinasi/desa-wisata')) {
    return {
      launcherLabel: { ID: 'Panduan Desa', EN: 'Villages Guide' },
      contextTitle: { ID: 'Desa Wisata', EN: 'Tourism Villages' },
      steps: [
        {
          id: 'desa-filter',
          selector: '[data-tour="desa-filter"]',
          radius: 16,
          padding: 8,
          title: { ID: 'Pilih Kabupaten Desa Wisata', EN: 'Filter Villages by Regency' },
          description: {
            ID: 'Klik nama daerah untuk melihat daftar desa wisata binaan di kabupaten/kota yang ingin Anda jelajahi.',
            EN: 'Select a region button to list registered tourism villages within that regency or city.',
          },
        },
        {
          id: 'desa-grid',
          selector: 'main section .grid',
          radius: 18,
          padding: 8,
          title: { ID: 'Profil & Potensi Desa Wisata', EN: 'Tourism Village Profiles' },
          description: {
            ID: 'Pelajari keunikan tradisi, kearifan lokal, serta potensi wisata unggulan masing-masing desa wisata.',
            EN: 'Explore local culture, crafts, and community-based attractions offered by each tourism village.',
          },
          action: {
            label: { ID: 'Lihat Daya Tarik Wisata', EN: 'View Tourist Attractions' },
            to: '/info-pariwisata/destinasi/daya-tarik-wisata',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 6. Kalender Event
  if (pathname === '/info-pariwisata/pemasaran/kalender-event') {
    return {
      launcherLabel: { ID: 'Panduan Event', EN: 'Events Guide' },
      contextTitle: { ID: 'Kalender Event', EN: 'Event Calendar' },
      steps: [
        {
          id: 'event-list',
          selector: 'main section .grid, main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Jadwal Festival & Atraksi Daerah', EN: 'Regional Festival Schedule' },
          description: {
            ID: 'Temukan informasi tanggal pelaksanaan, lokasi acara, serta ringkasan festival seni budaya dan event pariwisata Sulawesi Tengah.',
            EN: 'Browse upcoming dates, venues, and descriptions for cultural festivals and tourism events across Central Sulawesi.',
          },
          action: {
            label: { ID: 'Lihat Paket Wisata', EN: 'Browse Tour Packages' },
            to: '/info-pariwisata/pemasaran/paket-wisata',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 7. Paket Wisata
  if (pathname === '/info-pariwisata/pemasaran/paket-wisata') {
    return {
      launcherLabel: { ID: 'Panduan Paket', EN: 'Packages Guide' },
      contextTitle: { ID: 'Paket Wisata', EN: 'Tour Packages' },
      steps: [
        {
          id: 'paket-list',
          selector: 'main section .grid, main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Katalog & Brosur Paket Wisata', EN: 'Tour Package Brochures' },
          description: {
            ID: 'Klik tombol "Lihat" pada kartu paket untuk membuka pratinjau brosur perjalanan, atau klik "Unduh" untuk menyimpan berkas PDF-nya.',
            EN: 'Click "View" on any package card to preview the itinerary brochure, or "Download" to save the PDF file.',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 8. Info Pariwisata lainnya (Statistik Kunjungan, Hunian, Ekraf, SDM)
  if (pathname.startsWith('/info-pariwisata/')) {
    return {
      launcherLabel: { ID: 'Panduan Wisata', EN: 'Tourism Guide' },
      contextTitle: { ID: 'Info Pariwisata', EN: 'Tourism Data' },
      steps: [
        {
          id: 'tourism-section',
          selector: 'main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Data & Informasi Sektor Pariwisata', EN: 'Tourism Sector Data & Insights' },
          description: {
            ID: 'Halaman ini menyajikan data resmi terkait perkembangan kunjungan wisatawan, akomodasi, ekonomi kreatif, atau sumber daya manusia pariwisata.',
            EN: 'This page presents official data covering visitor arrivals, hospitality occupancy, creative economy, or tourism human resources.',
          },
          action: {
            label: { ID: 'Jelajahi Destinasi (DTW)', EN: 'Explore Attractions' },
            to: '/info-pariwisata/destinasi/daya-tarik-wisata',
          },
        },
        SHARED_STEPS.breadcrumb,
        SHARED_STEPS.statsWidget,
      ],
    };
  }

  // 9. PPID - Daftar Informasi Publik
  if (pathname === '/ppid/daftar-informasi-publik') {
    return {
      launcherLabel: { ID: 'Panduan DIP', EN: 'PPID List Guide' },
      contextTitle: { ID: 'Daftar Informasi Publik', EN: 'Public Info List' },
      steps: [
        {
          id: 'ppid-categories',
          selector: '[data-tour="ppid-categories"]',
          radius: 18,
          padding: 8,
          title: { ID: 'Kategori Dokumen PPID', EN: 'Public Document Categories' },
          description: {
            ID: 'Klik salah satu baris kategori di atas untuk membuka daftar dokumen publik yang tersedia, lalu klik judul dokumen untuk melihat atau mengunduh PDF.',
            EN: 'Click any category accordion row above to reveal available public documents, then click any item to view or download its PDF.',
          },
          action: {
            label: { ID: 'Ajukan Permohonan Informasi', EN: 'Request Public Info' },
            to: '/ppid/layanan-publik/form-permohonan',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 10. PPID - Form Permohonan & Keberatan
  if (
    pathname === '/ppid/layanan-publik/form-permohonan' ||
    pathname === '/ppid/layanan-publik/form-keberatan'
  ) {
    return {
      launcherLabel: { ID: 'Panduan Formulir', EN: 'Form Guide' },
      contextTitle: { ID: 'Formulir PPID', EN: 'PPID Form' },
      steps: [
        {
          id: 'ppid-form',
          selector: 'main form, main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Pengisian Formulir Resmi PPID', EN: 'Online PPID Request Form' },
          description: {
            ID: 'Isi seluruh kolom identitas pemohon, email aktif, dan uraian informasi atau keberatan secara jelas, lalu tekan tombol kirim di bagian bawah formulir.',
            EN: 'Fill in your applicant identity, active email, and request/objection details clearly, then submit at the bottom of the form.',
          },
          action: {
            label: { ID: 'Cek Daftar Informasi Publik', EN: 'Browse Public Info List' },
            to: '/ppid/daftar-informasi-publik',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 11. Halaman PPID lainnya
  if (pathname.startsWith('/ppid')) {
    return {
      launcherLabel: { ID: 'Panduan PPID', EN: 'PPID Guide' },
      contextTitle: { ID: 'Layanan PPID', EN: 'PPID Services' },
      steps: [
        {
          id: 'ppid-content',
          selector: 'main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Informasi & Layanan Publik PPID', EN: 'PPID Transparency Services' },
          description: {
            ID: 'Halaman ini memuat informasi publik, standar pelayanan, atau regulasi keterbukaan informasi di Dinas Pariwisata Sulawesi Tengah.',
            EN: 'This page provides public transparency documents, service standards, or official PPID regulations.',
          },
          action: {
            label: { ID: 'Buka Daftar Informasi Publik', EN: 'Open Public Info List' },
            to: '/ppid/daftar-informasi-publik',
          },
        },
        SHARED_STEPS.breadcrumb,
        SHARED_STEPS.skm,
      ],
    };
  }

  // 12. Halaman Lapor!
  if (pathname === '/lapor') {
    return {
      launcherLabel: { ID: 'Panduan Lapor!', EN: 'Report Guide' },
      contextTitle: { ID: 'SP4N-LAPOR!', EN: 'Public Complaints' },
      steps: [
        {
          id: 'lapor-cta',
          selector: '[data-tour="lapor-cta"]',
          radius: 18,
          padding: 8,
          title: { ID: 'Kirim Pengaduan Resmi', EN: 'Submit Official Report' },
          description: {
            ID: 'Klik "Buka Situs SP4N-LAPOR!" untuk melapor melalui portal nasional, atau kirim SMS ke 1708. Saat mengisi form, pilih instansi "Pemerintah Provinsi Sulawesi Tengah".',
            EN: 'Click "Open SP4N-LAPOR! Portal" to submit via the national platform or send an SMS to 1708. Select "Pemerintah Provinsi Sulawesi Tengah" as the destination agency.',
          },
        },
        {
          id: 'lapor-steps',
          selector: '[data-tour="lapor-steps"]',
          radius: 18,
          padding: 8,
          title: { ID: '5 Tahap Penanganan Laporan', EN: '5-Step Report Workflow' },
          description: {
            ID: 'Lihat alur penanganan setiap laporan yang masuk: mulai dari pencatatan, verifikasi, koordinasi tindak lanjut, hingga selesai ditangani.',
            EN: 'Understand each stage from report submission and verification to follow-up coordination and resolution.',
          },
        },
        SHARED_STEPS.skm,
      ],
    };
  }

  // 13. Profil - Hubungi Kami
  if (pathname === '/profil/hubungi-kami') {
    return {
      launcherLabel: { ID: 'Panduan Kontak', EN: 'Contact Guide' },
      contextTitle: { ID: 'Hubungi Kami', EN: 'Contact Us' },
      steps: [
        {
          id: 'contact-form',
          selector: 'main form, main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Formulir Kirim Pesan', EN: 'Direct Contact Form' },
          description: {
            ID: 'Lengkapi nama, alamat email, subjek, dan pesan Anda pada formulir ini untuk menghubungi Dinas Pariwisata Sulawesi Tengah secara langsung.',
            EN: 'Complete your name, email, subject, and message in this form to contact our office directly.',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 14. Profil lainnya
  if (pathname.startsWith('/profil')) {
    return {
      launcherLabel: { ID: 'Panduan Profil', EN: 'Profile Guide' },
      contextTitle: { ID: 'Profil Dinas', EN: 'Agency Profile' },
      steps: [
        {
          id: 'profil-section',
          selector: 'main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Informasi Profil Instansi', EN: 'Agency Profile Details' },
          description: {
            ID: 'Pelajari informasi resmi seputar struktur, tugas pokok dan fungsi, sejarah, pimpinan, atau publikasi majalah Dinas Pariwisata Sulawesi Tengah.',
            EN: 'Read official information covering leadership, duties and functions, history, or agency publications.',
          },
          action: {
            label: { ID: 'Hubungi Dinas Pariwisata', EN: 'Contact Us' },
            to: '/profil/hubungi-kami',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // 15. Rencana Terbit
  if (pathname === '/rencana-terbit') {
    return {
      launcherLabel: { ID: 'Panduan Terbitan', EN: 'Publish Plan Guide' },
      contextTitle: { ID: 'Rencana Terbit', EN: 'Publication Schedule' },
      steps: [
        {
          id: 'rencana-section',
          selector: 'main section',
          radius: 18,
          padding: 8,
          title: { ID: 'Jadwal Rencana Terbit Informasi', EN: 'Scheduled Public Information' },
          description: {
            ID: 'Pantau daftar rencana publikasi informasi dan dokumen yang akan diterbitkan berkala oleh Dinas Pariwisata Provinsi Sulawesi Tengah.',
            EN: 'Track scheduled public reports and documents planned for release by the Department of Tourism.',
          },
          action: {
            label: { ID: 'Lihat Daftar Informasi Publik', EN: 'Open Public Info List' },
            to: '/ppid/daftar-informasi-publik',
          },
        },
        SHARED_STEPS.breadcrumb,
      ],
    };
  }

  // Fallback untuk rute publik lain
  return {
    launcherLabel: { ID: 'Panduan Halaman', EN: 'Page Guide' },
    contextTitle: { ID: 'Panduan Portal', EN: 'Portal Guide' },
    steps: [
      SHARED_STEPS.breadcrumb,
      {
        id: 'generic-content',
        selector: 'main section',
        radius: 18,
        padding: 8,
        title: { ID: 'Informasi Halaman Aktif', EN: 'Active Page Content' },
        description: {
          ID: 'Gunakan informasi utama pada bagian ini atau manfaatkan tombol pencarian cepat di bagian atas untuk menemukan layanan lain.',
          EN: 'Explore the content on this page or use quick search in the header to jump to other services.',
        },
      },
      SHARED_STEPS.search,
      SHARED_STEPS.mobileMenu,
    ],
  };
}

function findVisibleElement(selector) {
  const nodes = document.querySelectorAll(selector);
  for (const el of nodes) {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden'
    ) {
      return el;
    }
  }
  return null;
}

function isPinnedToViewport(el) {
  let curr = el;
  while (curr && curr !== document.body) {
    const pos = window.getComputedStyle(curr).position;
    if (pos === 'fixed' || pos === 'sticky') return true;
    curr = curr.parentElement;
  }
  return false;
}

const PortalGuidanceTour = ({ language = 'ID' }) => {
  const { pathname } = useLocation();
  const isEN = language === 'EN';
  const langKey = isEN ? 'EN' : 'ID';

  const routeConfig = useMemo(() => getRouteGuideConfig(pathname), [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeSteps, setActiveSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const [popoverSize, setPopoverSize] = useState({ width: 340, height: 240 });

  const popoverRef = useRef(null);

  // Tutup tur secara bersih ketika berpindah ke halaman lain agar konteks panduan langsung segar
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsOpen(false);
      setTargetRect(null);
      setStepIndex(0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastThreshold(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentStep = activeSteps[stepIndex] || null;

  const measureCurrentTarget = useCallback(() => {
    if (!isOpen || !currentStep) {
      setTargetRect(null);
      return;
    }
    const el = findVisibleElement(currentStep.selector);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    });
  }, [isOpen, currentStep]);

  const startTour = useCallback(() => {
    const visibleSteps = routeConfig.steps.filter((step) =>
      findVisibleElement(step.selector)
    );
    if (visibleSteps.length === 0) return;
    setActiveSteps(visibleSteps);
    setStepIndex(0);
    setIsOpen(true);
  }, [routeConfig]);

  const closeTour = useCallback(() => {
    setIsOpen(false);
    setTargetRect(null);
  }, []);

  const handleNext = useCallback(() => {
    if (stepIndex < activeSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      closeTour();
    }
  }, [stepIndex, activeSteps.length, closeTour]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  }, [stepIndex]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const el = findVisibleElement(currentStep.selector);
    if (el && !isPinnedToViewport(el)) {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.height > vh * 0.55) {
        if (r.top < 92 || r.top > 240) {
          window.scrollTo({
            top: Math.max(0, window.scrollY + r.top - 96),
            behavior: 'smooth',
          });
        }
      } else if (r.top < 92 || r.bottom > vh - 80) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    const raf = requestAnimationFrame(measureCurrentTarget);
    const t1 = setTimeout(measureCurrentTarget, 140);
    const t2 = setTimeout(measureCurrentTarget, 360);

    const handleResizeOrScroll = () => {
      const updated = routeConfig.steps.filter((step) =>
        findVisibleElement(step.selector)
      );
      if (updated.length > 0 && updated.length !== activeSteps.length) {
        setActiveSteps(updated);
        setStepIndex((idx) => Math.min(idx, updated.length - 1));
      }
      measureCurrentTarget();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', measureCurrentTarget, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', measureCurrentTarget);
    };
  }, [isOpen, currentStep, activeSteps.length, routeConfig, measureCurrentTarget]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeTour();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeTour, handleNext, handlePrev]);

  useLayoutEffect(() => {
    if (!isOpen || !popoverRef.current) return;
    const { offsetWidth, offsetHeight } = popoverRef.current;
    if (offsetWidth > 0 && offsetHeight > 0) {
      setPopoverSize((prev) =>
        prev.width === offsetWidth && prev.height === offsetHeight
          ? prev
          : { width: offsetWidth, height: offsetHeight }
      );
    }
  }, [isOpen, stepIndex, langKey, targetRect, pathname]);

  const pad = currentStep?.padding ?? 6;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Clip visual spotlight cleanly inside viewport if target element is taller than viewport
  const getSpotlightBox = () => {
    if (!targetRect) return null;
    const top = Math.max(4, targetRect.top - pad);
    const left = Math.max(4, targetRect.left - pad);
    const maxBottom = vh - 10;
    const rawBottom = targetRect.bottom + pad;
    const clippedBottom = Math.min(rawBottom, maxBottom);
    const width = Math.min(targetRect.width + pad * 2, vw - left - 4);
    const height = Math.max(36, clippedBottom - top);
    return { top, left, width, height, bottom: top + height };
  };

  const spotlightBox = getSpotlightBox();

  const computePopoverStyle = () => {
    const width = Math.min(352, vw - 24);
    const estHeight = popoverSize.height || 240;

    if (!spotlightBox || !currentStep) {
      return {
        width,
        left: Math.max(12, (vw - width) / 2),
        top: Math.max(16, (vh - estHeight) / 2),
      };
    }

    const gap = 14;
    const spaceBelow = vh - spotlightBox.bottom;
    const spaceAbove = spotlightBox.top;

    let top;
    if (spaceBelow >= estHeight + gap) {
      top = spotlightBox.bottom + gap;
    } else if (spaceAbove >= estHeight + gap) {
      top = spotlightBox.top - estHeight - gap;
    } else if (spaceBelow >= spaceAbove) {
      top = vh - estHeight - 14;
    } else {
      top = 14;
    }
    top = Math.max(14, Math.min(top, vh - estHeight - 14));

    const preferredLeft = spotlightBox.left + spotlightBox.width / 2 - width / 2;
    const left = Math.max(12, Math.min(preferredLeft, vw - width - 12));

    return { width, top, left };
  };

  const popoverStyle = computePopoverStyle();
  const isLastStep = stepIndex >= activeSteps.length - 1;

  return (
    <>
      {/* Floating Launcher Button (berubah otomatis sesuai halaman aktif + bergeser -64px di atas BackToTop saat discroll) */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 select-none"
        animate={{ y: scrolledPastThreshold ? -64 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <motion.button
          key={pathname}
          type="button"
          data-tour="tour-launcher"
          onClick={startTour}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          aria-label={routeConfig.launcherLabel[langKey]}
          className="h-11 sm:h-12 px-3.5 sm:px-4 rounded-full text-white shadow-xl shadow-black/25 border border-white/25 flex items-center gap-2 font-semibold text-xs sm:text-sm cursor-pointer backdrop-blur-md transition-shadow hover:shadow-2xl"
          style={{ background: 'var(--theme-gradient-diagonal)' }}
        >
          <Compass className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-300 shrink-0" />
          <span className="tracking-tight whitespace-nowrap">
            {routeConfig.launcherLabel[langKey]}
          </span>
        </motion.button>
      </motion.div>

      {/* Interactive Spotlight Overlay */}
      <AnimatePresence>
        {isOpen && currentStep && (
          <motion.div
            key="portal-spotlight-tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70]"
            role="dialog"
            aria-modal="true"
            aria-label={
              isEN
                ? `Guide: ${routeConfig.contextTitle.EN}`
                : `Panduan: ${routeConfig.contextTitle.ID}`
            }
          >
            {/* Click-guard layer */}
            <div className="fixed inset-0 bg-transparent" aria-hidden="true" />

            {/* Cutout Spotlight Box */}
            {spotlightBox ? (
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  top: spotlightBox.top,
                  left: spotlightBox.left,
                  width: spotlightBox.width,
                  height: spotlightBox.height,
                }}
                transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                className="fixed pointer-events-none border-2 border-amber-400"
                style={{
                  borderRadius: currentStep.radius ?? 14,
                  boxShadow:
                    '0 0 0 9999px rgba(6, 17, 33, 0.72), 0 0 0 5px rgba(251, 191, 36, 0.25)',
                }}
              />
            ) : (
              <div
                aria-hidden="true"
                className="fixed inset-0 pointer-events-none bg-[#061121]/75"
              />
            )}

            {/* Floating Guidance Popover Card */}
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                top: popoverStyle.top,
                left: popoverStyle.left,
              }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              style={{ width: popoverStyle.width }}
              className="fixed bg-white text-slate-800 rounded-2xl shadow-2xl shadow-black/35 border border-slate-200 overflow-hidden"
            >
              {/* Header Bar */}
              <div
                className="px-4 py-3 text-white flex items-center justify-between gap-2"
                style={{ background: 'var(--theme-gradient-diagonal)' }}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">
                    {routeConfig.contextTitle[langKey]} •{' '}
                    {isEN
                      ? `${stepIndex + 1}/${activeSteps.length}`
                      : `Langkah ${stepIndex + 1}/${activeSteps.length}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeTour}
                  aria-label={isEN ? 'Close guide' : 'Tutup panduan'}
                  className="p-1 rounded-full hover:bg-white/20 text-white/85 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                  {currentStep.title[langKey]}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {currentStep.description[langKey]}
                </p>

                {currentStep.action && (
                  <Link
                    to={currentStep.action.to}
                    onClick={closeTour}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <span>{currentStep.action.label[langKey]}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}

                {/* Progress Dots */}
                <div className="flex items-center gap-1.5 mt-4 mb-3">
                  {activeSteps.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStepIndex(idx)}
                      aria-label={
                        isEN ? `Go to step ${idx + 1}` : `Ke langkah ${idx + 1}`
                      }
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === stepIndex
                          ? 'w-5 bg-amber-500'
                          : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeTour}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isEN ? 'Skip' : 'Lewati'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {stepIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{isEN ? 'Back' : 'Sebelumnya'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                      style={{ background: 'var(--theme-gradient-diagonal)' }}
                    >
                      <span>
                        {isLastStep
                          ? isEN
                            ? 'Finish'
                            : 'Selesai'
                          : isEN
                          ? 'Next'
                          : 'Berikutnya'}
                      </span>
                      {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortalGuidanceTour;
