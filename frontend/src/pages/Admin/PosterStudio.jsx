import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import QRCode from 'qrcode';
import {
  Check,
  Compass,
  Copy,
  Download,
  Images,
  MapPin,
  Newspaper,
  QrCode,
  RotateCcw,
  Search,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { getImageSrc } from '../../utils/imageHelper';
import { KABUPATEN_OPTIONS, stripHtml } from './adminConstants';
import { AdminLayout, AdminPageShell, useAdminToast } from './components/AdminUI';
import { SCALE, SPRING } from './adminMotion';

const FORMAT_OPTIONS = [
  { id: 'feed', label: 'IG Feed (3:4)', w: 1080, h: 1440, hint: '1080 × 1440 px' },
  { id: 'square', label: 'Square (1:1)', w: 1080, h: 1080, hint: '1080 × 1080 px' },
  { id: 'story', label: 'Story / WA (9:16)', w: 1080, h: 1920, hint: '1080 × 1920 px' },
  { id: 'banner', label: 'Banner (16:9)', w: 1280, h: 720, hint: '1280 × 720 px' },
];

const TEMPLATE_OPTIONS = [
  { id: 'editorial', label: 'Pesona Editorial', desc: 'Foto penuh & gradasi tegas' },
  { id: 'resmi', label: 'Resmi Instansi', desc: 'Header pita dinas & bingkai rapi' },
  { id: 'spotlight', label: 'Spotlight Kaca', desc: 'Kartu kaca gelap modern' },
  { id: 'qr_card', label: 'Kartu QR Cetak', desc: 'Fokus QR besar siap pameran' },
  { id: 'majalah', label: 'Majalah Pesona', desc: 'Cover majalah & tipografi besar' },
  { id: 'split', label: 'Split Modern', desc: 'Foto & blok warna berdampingan' },
  { id: 'festival_glow', label: 'Festival & Event', desc: 'Glow acara & bingkai sorotan' },
  { id: 'kartu_pos', label: 'Kartu Pos Wisata', desc: 'Bingkai galeri hangat elegan' },
];

const SOURCE_TABS = [
  { id: 'ide', label: 'Dari Ide', icon: Wand2 },
  { id: 'berita', label: 'Berita', icon: Newspaper },
  { id: 'dtw', label: 'DTW', icon: Compass },
  { id: 'desa', label: 'Desa', icon: MapPin },
  { id: 'slider', label: 'Slider', icon: Images },
  { id: 'custom', label: 'Kustom', icon: Sparkles },
];

const SAMPLE_IDEAS = [
  {
    label: 'Wisata Togean',
    text: 'Promosi liburan akhir pekan ke Kepulauan Togean, ajak wisatawan snorkeling dan nikmati keindahan bawah laut Tojo Una-Una',
  },
  {
    label: 'Festival Danau Poso',
    text: 'Undangan Festival Danau Poso 15 Desember di Tentena, ada pertunjukan budaya megalit, kuliner khas, dan lomba perahu',
  },
  {
    label: 'Pengumuman Resmi',
    text: 'Pengumuman resmi pembukaan pendaftaran Desa Wisata Unggulan Provinsi Sulawesi Tengah tahun 2026 melalui portal dinas',
  },
  {
    label: 'Kartu QR Pameran',
    text: 'Buat kartu scan QR wisata Danau Lindu untuk booth pameran pariwisata agar pengunjung bisa langsung lihat info lengkap',
  },
];

const IDEA_STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'atau', 'dengan', 'ini', 'itu',
  'buat', 'bikin', 'tolong', 'buatkan', 'poster', 'kartu', 'promo', 'promosi', 'ajak',
  'wisatawan', 'ada', 'bisa', 'agar', 'supaya', 'langsung', 'lihat', 'info', 'tentang',
]);

const REGION_ALIASES = [
  ['tentena', 'Kabupaten Poso'],
  ['poso', 'Kabupaten Poso'],
  ['togean', 'Kabupaten Tojo Una-Una'],
  ['togian', 'Kabupaten Tojo Una-Una'],
  ['ampana', 'Kabupaten Tojo Una-Una'],
  ['luwuk', 'Kabupaten Banggai'],
  ['banggai kepulauan', 'Kabupaten Banggai Kepulauan'],
  ['banggai laut', 'Kabupaten Banggai Laut'],
  ['banggai', 'Kabupaten Banggai'],
  ['morowali utara', 'Kabupaten Morowali Utara'],
  ['morowali', 'Kabupaten Morowali'],
  ['parigi', 'Kabupaten Parigi Moutong'],
  ['lindu', 'Kabupaten Sigi'],
  ['sigi', 'Kabupaten Sigi'],
  ['donggala', 'Kabupaten Donggala'],
  ['tolitoli', 'Kabupaten Tolitoli'],
  ['buol', 'Kabupaten Buol'],
  ['palu', 'Kota Palu'],
];

const toTitleCase = (str = '') =>
  str
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, idx) => {
      if (/^(RI|QR|DTW|IG|WA|Sulteng|PPID|MICE)$/i.test(w)) return w.toUpperCase();
      if (idx > 0 && /^(di|ke|dari|dan|yang|untuk|atau)$/i.test(w)) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');

const composePosterFromIdea = (rawIdea, sources, origin) => {
  const raw = (rawIdea || '').trim();
  const lower = raw.toLowerCase();

  // 1. Deteksi intensi & pilih template + palet + badge otomatis
  let templateId = 'editorial';
  let paletteId = 'active';
  let badge = 'PESONA SULAWESI TENGAH';
  let cta = 'Jelajahi pesona wisata di portal resmi';

  if (/\b(qr|scan|brosur|tiket|booth|pameran|barcode)\b/i.test(lower)) {
    templateId = 'qr_card';
    badge = 'PUSAT INFORMASI QR';
    cta = 'Scan QR untuk rute & informasi lengkap';
  } else if (/\b(festival|event|acara|konser|budaya|megalit|kuliner|ramadhan|lebaran|natal|imlek|hut|kemerdekaan|malam)\b/i.test(lower)) {
    templateId = 'spotlight';
    badge = 'AGENDA & EVENT SULTENG';
    cta = 'Jangan lewatkan agenda pariwisata Sulteng';
    if (/ramadhan|lebaran|idul fitri/i.test(lower)) paletteId = 'emerald';
    else if (/hut|kemerdekaan|17 agustus/i.test(lower)) paletteId = 'crimson';
  } else if (/\b(pengumuman|edaran|pendaftaran|daftar|tutup|penutupan|himbauan|jadwal|seleksi|lomba|resmi|surat)\b/i.test(lower)) {
    templateId = 'resmi';
    paletteId = 'sulteng';
    badge = 'PENGUMUMAN RESMI';
    cta = 'Simak informasi lengkap di portal resmi dinas';
  } else if (/\b(pantai|laut|bahari|pulau|snorkel|selam|togean|togian)\b/i.test(lower)) {
    paletteId = 'togean';
    badge = 'WISATA BAHARI SULTENG';
  }

  // 2. Cari kecocokan dengan konten database website (DTW, Desa, Berita, Slider)
  const keywords = lower
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !IDEA_STOPWORDS.has(w));

  const candidates = [
    ...(sources.dtw || []).map((item) => ({ tab: 'dtw', item })),
    ...(sources.desa || []).map((item) => ({ tab: 'desa', item })),
    ...(sources.berita || []).map((item) => ({ tab: 'berita', item })),
    ...(sources.slider || []).map((item) => ({ tab: 'slider', item })),
  ];

  let bestMatch = null;
  let bestScore = 0;
  candidates.forEach((cand) => {
    const title = `${cand.item.judul || cand.item.nama || ''}`.toLowerCase();
    const hay = `${title} ${cand.item.kabupaten || ''} ${cand.item.kategori || ''} ${stripHtml(cand.item.deskripsi || cand.item.konten || '')}`.toLowerCase();
    let score = 0;
    keywords.forEach((kw) => {
      if (title.includes(kw)) score += 3;
      else if (hay.includes(kw)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cand;
    }
  });

  // 3. Deteksi Kabupaten / Kota Sulteng
  let detectedRegion = '';
  for (const [alias, full] of REGION_ALIASES) {
    if (lower.includes(alias)) {
      detectedRegion = full;
      break;
    }
  }
  if (!detectedRegion && bestMatch?.item?.kabupaten) {
    detectedRegion = bestMatch.item.kabupaten;
  }
  if (!detectedRegion) {
    const kabMatch = KABUPATEN_OPTIONS.find((k) => lower.includes(k.replace(/^Kabupaten\s+|^Kota\s+/i, '').toLowerCase()));
    if (kabMatch) detectedRegion = kabMatch;
  }
  const location = detectedRegion || 'Provinsi Sulawesi Tengah';

  // 4. Pilih foto & URL QR paling pas (prioritaskan kecocokan kabupaten/judul kuat)
  let imageUrl = DEFAULT_FALLBACK_IMG;
  let qrUrl = `${origin}/`;
  let matchNote = '';

  const sameRegionMatch =
    bestMatch &&
    (!detectedRegion ||
      !bestMatch.item.kabupaten ||
      bestMatch.item.kabupaten.toLowerCase() === detectedRegion.toLowerCase());

  if (bestMatch && sameRegionMatch && bestScore >= 4) {
    const norm = normalizeItemForPoster(bestMatch.tab, bestMatch.item);
    imageUrl = norm.imageUrl;
    qrUrl = norm.qrUrl;
    matchNote = `Foto & link diambil dari ${norm.sourceType} "${bestMatch.item.judul || bestMatch.item.nama}"`;
  } else if (/togean|togian|pantai|laut|bahari|pulau|snorkel|selam/.test(lower)) {
    imageUrl = '/images/admin/kepulauan-togian.jpg';
    qrUrl = `${origin}/info-pariwisata/destinasi/daya-tarik-wisata`;
    matchNote = 'Menggunakan foto bahari Kepulauan Togean';
  } else if (/air terjun|saluopa|tentena|sungai|poso|festival/.test(lower)) {
    imageUrl = '/images/admin/air-terjun-saluopa.jpg';
    qrUrl = `${origin}/info-pariwisata/destinasi/daya-tarik-wisata`;
    matchNote = 'Menggunakan foto wisata alam Sulawesi Tengah';
  } else if (/pengumuman|edaran|dinas|pendaftaran|resmi|ppid|desa wisata/.test(lower)) {
    imageUrl = '/images/admin/kantor-dispar.jpg';
    qrUrl = /desa wisata/.test(lower)
      ? `${origin}/info-pariwisata/destinasi/desa-wisata`
      : `${origin}/berita`;
    matchNote = 'Menggunakan visual resmi Dinas Pariwisata Sulteng';
  }

  // 5. Susun Headline tegas & Ringkasan rapi sesuai ide pengguna
  const firstClause = raw.split(/[.,;\n]/)[0].trim();
  const strippedLead = firstClause
    .replace(/^(tolong\s+)?(buatkan|buat|bikin)\s+(poster|flyer|kartu\s+scan\s+qr|kartu\s+qr|kartu)\s+/i, '')
    .replace(/^(promosi|ajak|undangan)\s+/i, '')
    .trim();

  const words = (strippedLead || firstClause || 'Pesona Sulawesi Tengah').split(/\s+/);
  const headline = toTitleCase(words.slice(0, 7).join(' '));

  const normalizedSentence = raw.charAt(0).toUpperCase() + raw.slice(1).replace(/[.]+$/, '');
  const tailHint =
    templateId === 'resmi'
      ? 'Informasi dan ketentuan lengkap dapat diakses melalui portal resmi Dinas Pariwisata Sulawesi Tengah.'
      : 'Rencanakan perjalanan terbaik Anda bersama Pesona Sulawesi Tengah.';
  const summary =
    normalizedSentence.length > 145
      ? `${normalizedSentence.slice(0, 142).trimEnd()}...`
      : `${normalizedSentence}. ${tailHint}`;

  return {
    templateId,
    paletteId,
    matchNote: matchNote || `Template ${TEMPLATE_OPTIONS.find((t) => t.id === templateId)?.label} disiapkan`,
    posterFields: {
      headline,
      badge,
      location,
      summary,
      imageUrl,
      qrUrl,
      qrLabel: templateId === 'qr_card' ? 'Scan Info & Rute' : 'Scan Info Lengkap',
      cta,
      showQr: true,
      showSummary: templateId !== 'qr_card',
    },
  };
};

const PRESET_PALETTES = [
  { id: 'active', label: 'Tema Aktif' },
  {
    id: 'sulteng',
    label: 'Sulteng Klasik',
    primary: '#1F5BA6',
    secondary: '#383087',
    accent: '#5C2180',
    highlight: '#F59E0B',
  },
  {
    id: 'emerald',
    label: 'Zamrud Wisata',
    primary: '#059669',
    secondary: '#047857',
    accent: '#064E3B',
    highlight: '#FBBF24',
  },
  {
    id: 'crimson',
    label: 'Merah Putih RI',
    primary: '#B91C1C',
    secondary: '#DC2626',
    accent: '#7F1D1D',
    highlight: '#F59E0B',
  },
  {
    id: 'togean',
    label: 'Tosca Togean',
    primary: '#0369A1',
    secondary: '#0F766E',
    accent: '#1E3A8A',
    highlight: '#FBBF24',
  },
];

const DEFAULT_FALLBACK_IMG = '/images/admin/danau-lindu.jpg';

const roundRectPath = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

const drawImageCover = (ctx, img, x, y, w, h, radius = 0) => {
  ctx.save();
  if (radius > 0) {
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  if (!img || !img.naturalWidth || !img.naturalHeight) {
    ctx.fillStyle = '#0f2744';
    ctx.fillRect(x, y, w, h);
    ctx.restore();
    return;
  }
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
};

const wrapTextLines = (ctx, text, maxWidth, maxLines) => {
  const clean = (text || '').trim();
  if (!clean) return [];
  const words = clean.split(/\s+/);
  const lines = [];
  let current = '';

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
        if (lines.length === maxLines) {
          const last = lines[maxLines - 1];
          lines[maxLines - 1] = truncateToWidth(ctx, `${last}...`, maxWidth);
          return lines;
        }
        current = word;
      } else {
        lines.push(truncateToWidth(ctx, word, maxWidth));
        if (lines.length === maxLines) return lines;
        current = '';
      }
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
};

const truncateToWidth = (ctx, str, maxWidth) => {
  if (ctx.measureText(str).width <= maxWidth) return str;
  let cut = str;
  while (cut.length > 4 && ctx.measureText(`${cut.slice(0, -1)}…`).width > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return `${cut.trimEnd()}…`;
};

const drawQrModuleBox = (ctx, qrUrl, x, y, size, darkColor = '#0B192C', label = '') => {
  ctx.save();
  roundRectPath(ctx, x, y, size, size + (label ? 28 : 0), 22);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(11, 25, 44, 0.24)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fill();
  ctx.restore();

  const target = (qrUrl || '').trim() || window.location.origin;
  let qr;
  try {
    qr = QRCode.create(target, { errorCorrectionLevel: 'M' });
  } catch {
    qr = QRCode.create(window.location.origin, { errorCorrectionLevel: 'M' });
  }

  const count = qr.modules.size;
  const pad = Math.round(size * 0.1);
  const inner = size - pad * 2;
  const cell = inner / count;

  ctx.save();
  ctx.fillStyle = darkColor;
  for (let r = 0; r < count; r += 1) {
    for (let c = 0; c < count; c += 1) {
      if (qr.modules.get(r, c)) {
        ctx.fillRect(
          x + pad + c * cell,
          y + pad + r * cell,
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }
  ctx.restore();

  if (label) {
    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.font = '700 13px Poppins, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(truncateToWidth(ctx, label, size - 16), x + size / 2, y + size + 10);
    ctx.restore();
  }
};

const drawPill = (ctx, text, x, y, bgColor, textColor, fontSize = 20, padX = 22, height = 44) => {
  ctx.save();
  ctx.font = `700 ${fontSize}px Poppins, Inter, sans-serif`;
  const textW = ctx.measureText(text).width;
  const pillW = Math.min(textW + padX * 2, 760);
  roundRectPath(ctx, x, y, pillW, height, height / 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(truncateToWidth(ctx, text, pillW - padX * 2), x + padX, y + height / 2 + 1);
  ctx.restore();
  return pillW;
};

const drawHeaderBrand = (ctx, logoImg, x, y, lightText = true, maxH = 54) => {
  ctx.save();
  let offsetX = x;
  if (logoImg && logoImg.naturalWidth > 0) {
    const ratio = logoImg.naturalWidth / logoImg.naturalHeight;
    const h = maxH;
    const w = h * ratio;
    ctx.drawImage(logoImg, offsetX, y, w, h);
    offsetX += w + 18;
  }
  ctx.fillStyle = lightText ? 'rgba(255,255,255,0.95)' : '#0B192C';
  ctx.font = '800 22px Poppins, Inter, sans-serif';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText('DINAS PARIWISATA', offsetX, y + 4);
  ctx.fillStyle = lightText ? 'rgba(255,255,255,0.75)' : '#475569';
  ctx.font = '600 15px Inter, sans-serif';
  ctx.fillText('PROVINSI SULAWESI TENGAH', offsetX, y + 32);
  ctx.restore();
};

const loadImageSafe = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    const isExternal = /^https?:\/\//i.test(url) && !url.startsWith(window.location.origin);
    if (isExternal || url.includes(':5050') || url.includes('/uploads/')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

const normalizeItemForPoster = (tab, item) => {
  const origin = window.location.origin;
  if (!item) return null;
  if (tab === 'berita') {
    const summaryRaw = stripHtml(item.konten || '');
    return {
      sourceType: 'Berita',
      headline: item.judul || 'Informasi Pariwisata Sulawesi Tengah',
      badge: item.kategori || 'WARTA PARIWISATA',
      location: item.tanggal
        ? new Date(item.tanggal).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Dinas Pariwisata Sulteng',
      summary:
        summaryRaw.length > 165 ? `${summaryRaw.slice(0, 162).trimEnd()}...` : summaryRaw,
      imageUrl: getImageSrc(item.gambar, '/images/admin/kantor-dispar.jpg'),
      qrUrl: item.slug ? `${origin}/berita/${item.slug}` : `${origin}/berita`,
      cta: 'Baca selengkapnya di portal resmi',
    };
  }
  if (tab === 'dtw') {
    const summaryRaw = stripHtml(item.deskripsi || '');
    return {
      sourceType: 'Daya Tarik Wisata',
      headline: item.judul || 'Destinasi Wisata Sulawesi Tengah',
      badge: 'DAYA TARIK WISATA',
      location: item.kabupaten || 'Sulawesi Tengah',
      summary:
        summaryRaw.length > 165 ? `${summaryRaw.slice(0, 162).trimEnd()}...` : summaryRaw,
      imageUrl: getImageSrc(item.gambar, '/images/admin/danau-lindu.jpg'),
      qrUrl: `${origin}/info-pariwisata/destinasi/daya-tarik-wisata`,
      cta: 'Jelajahi pesona wisata Sulteng',
    };
  }
  if (tab === 'desa') {
    const summaryRaw = stripHtml(item.deskripsi || '');
    return {
      sourceType: 'Desa Wisata',
      headline: item.nama || 'Desa Wisata Binaan Sulteng',
      badge: 'DESA WISATA UNGGULAN',
      location: item.kabupaten || 'Sulawesi Tengah',
      summary:
        summaryRaw.length > 165 ? `${summaryRaw.slice(0, 162).trimEnd()}...` : summaryRaw,
      imageUrl: getImageSrc(item.gambar, '/images/admin/air-terjun-saluopa.jpg'),
      qrUrl: `${origin}/info-pariwisata/destinasi/desa-wisata`,
      cta: 'Kunjungi desa wisata Sulawesi Tengah',
    };
  }
  return {
    sourceType: 'Slider Hero',
    headline: item.judul || 'Pesona Pariwisata Sulawesi Tengah',
    badge: 'PESONA SULAWESI TENGAH',
    location: 'Sulawesi Tengah · Negeri Seribu Megalit',
    summary: 'Informasi resmi destinasi unggulan, budaya, dan agenda pariwisata Sulawesi Tengah.',
    imageUrl: getImageSrc(item.gambar, '/images/admin/kepulauan-togian.jpg'),
    qrUrl: `${origin}/`,
    cta: 'Kunjungi portal resmi Dispar Sulteng',
  };
};

const drawEditorialPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const pad = w >= 1200 ? 64 : 68;
  const isStory = h > w;
  const isBanner = w > h;

  // Full backdrop photo + tinted vignette
  drawImageCover(ctx, photo, 0, 0, w, h, 0);

  // Subtle top vignette for header readability
  const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.28);
  topGrad.addColorStop(0, 'rgba(6, 14, 28, 0.78)');
  topGrad.addColorStop(1, 'rgba(6, 14, 28, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, h * 0.28);

  // Deep colorized bottom scrim
  const startY = isBanner ? h * 0.14 : isStory ? h * 0.36 : h * 0.28;
  const botGrad = ctx.createLinearGradient(0, startY, 0, h);
  botGrad.addColorStop(0, 'rgba(11, 25, 44, 0.04)');
  botGrad.addColorStop(0.42, `${palette.primary}D9`);
  botGrad.addColorStop(0.8, `${palette.secondary}F5`);
  botGrad.addColorStop(1, '#081426');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, startY, w, h - startY);

  // Header brand + badge
  drawHeaderBrand(ctx, logoWhite, pad, pad - 6, true, isBanner ? 48 : 54);
  if (state.badge) {
    ctx.save();
    ctx.font = '700 18px Poppins, Inter, sans-serif';
    const estW = Math.min(ctx.measureText(state.badge.toUpperCase()).width + 44, 460);
    drawPill(
      ctx,
      state.badge.toUpperCase(),
      w - pad - estW,
      pad,
      palette.highlight,
      '#0B192C',
      18,
      22,
      42
    );
    ctx.restore();
  }

  // Footer band calculation
  const qrSize = isBanner ? 132 : isStory ? 168 : 148;
  const footerHeight = state.showQr ? qrSize + 36 : 74;
  const footerTop = h - pad - footerHeight;

  // QR card on right
  if (state.showQr) {
    drawQrModuleBox(
      ctx,
      state.qrUrl,
      w - pad - qrSize,
      footerTop,
      qrSize,
      '#0B192C',
      state.qrLabel || 'Scan Info'
    );
  }

  // Content width avoids QR on right
  const textMaxW = state.showQr ? w - pad * 2 - qrSize - 40 : w - pad * 2;

  // Location / Meta line above CTA
  const metaY = h - pad - 28;
  ctx.save();
  ctx.fillStyle = palette.highlight;
  ctx.font = '700 21px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, pad, metaY - 34);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '500 19px Inter, sans-serif';
  ctx.fillText(truncateToWidth(ctx, state.cta || window.location.host, textMaxW), pad, metaY);
  ctx.restore();

  // Summary block above meta
  let contentBottom = metaY - 82;
  if (state.showSummary && state.summary) {
    ctx.save();
    ctx.font = `400 ${isBanner ? 22 : 25}px Inter, sans-serif`;
    const sumLines = wrapTextLines(ctx, state.summary, textMaxW, isStory ? 4 : isBanner ? 2 : 3);
    const lineH = isBanner ? 32 : 36;
    const blockH = sumLines.length * lineH;
    contentBottom -= blockH + 14;
    ctx.fillStyle = 'rgba(241, 245, 249, 0.90)';
    ctx.textBaseline = 'top';
    sumLines.forEach((line, idx) => {
      ctx.fillText(line, pad, contentBottom + idx * lineH);
    });
    contentBottom -= 18;
    ctx.restore();
  }

  // Headline + vertical highlight bar
  ctx.save();
  const titleSize = isBanner ? 44 : isStory ? 58 : 52;
  const titleLineH = isBanner ? 54 : isStory ? 70 : 64;
  ctx.font = `800 ${titleSize}px Poppins, Inter, sans-serif`;
  const titleW = isBanner ? w - pad * 2 - (state.showQr ? qrSize + 44 : 0) : w - pad * 2 - 26;
  const titleLines = wrapTextLines(ctx, state.headline, titleW, isStory ? 4 : 3);
  const titleBlockH = titleLines.length * titleLineH;
  const titleTop = Math.max(h * 0.34, contentBottom - titleBlockH);

  // Accent bar
  roundRectPath(ctx, pad, titleTop + 6, 10, Math.max(48, titleBlockH - 12), 5);
  ctx.fillStyle = palette.highlight;
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(6, 14, 28, 0.45)';
  ctx.shadowBlur = 16;
  titleLines.forEach((line, idx) => {
    ctx.fillText(line, pad + 28, titleTop + idx * titleLineH);
  });
  ctx.restore();
};

const drawResmiPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const pad = w >= 1200 ? 54 : 60;
  const isBanner = w > h;
  const isStory = h > w;

  // Light clean official background
  ctx.fillStyle = '#F4F7FB';
  ctx.fillRect(0, 0, w, h);

  // Top official theme ribbon
  const ribbonH = isBanner ? 112 : 146;
  const grad = ctx.createLinearGradient(0, 0, w, ribbonH);
  grad.addColorStop(0, palette.primary);
  grad.addColorStop(0.55, palette.secondary);
  grad.addColorStop(1, palette.accent);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, ribbonH);

  // Gold accent hairline
  ctx.fillStyle = palette.highlight;
  ctx.fillRect(0, ribbonH - 6, w, 6);

  drawHeaderBrand(ctx, logoWhite, pad, (ribbonH - 56) / 2, true, isBanner ? 48 : 56);

  if (state.badge) {
    ctx.save();
    ctx.font = '700 17px Poppins, Inter, sans-serif';
    const pillW = Math.min(ctx.measureText(state.badge.toUpperCase()).width + 42, 420);
    drawPill(
      ctx,
      state.badge.toUpperCase(),
      w - pad - pillW,
      (ribbonH - 42) / 2,
      'rgba(255,255,255,0.2)',
      '#FFFFFF',
      17,
      20,
      40
    );
    ctx.restore();
  }

  if (isBanner) {
    // Two-column layout for 16:9 banner
    const bodyTop = ribbonH + 34;
    const bodyH = h - bodyTop - pad;
    const photoW = Math.round(w * 0.44);
    ctx.save();
    ctx.shadowColor = 'rgba(11, 25, 44, 0.16)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    roundRectPath(ctx, pad, bodyTop, photoW, bodyH, 24);
    ctx.fillStyle = '#E2E8F0';
    ctx.fill();
    ctx.restore();
    drawImageCover(ctx, photo, pad, bodyTop, photoW, bodyH, 24);

    const colX = pad + photoW + 42;
    const colW = w - colX - pad;
    const qrSize = 128;

    ctx.save();
    ctx.fillStyle = palette.primary;
    ctx.font = '700 20px Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, colX, bodyTop + 4);

    ctx.fillStyle = '#0B192C';
    ctx.font = '800 38px Poppins, Inter, sans-serif';
    const lines = wrapTextLines(ctx, state.headline, colW, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, colX, bodyTop + 42 + idx * 48);
    });

    if (state.showSummary && state.summary) {
      ctx.fillStyle = '#475569';
      ctx.font = '400 21px Inter, sans-serif';
      const sumMaxW = state.showQr ? colW - qrSize - 24 : colW;
      const sumLines = wrapTextLines(ctx, state.summary, sumMaxW, 3);
      const sumY = bodyTop + 48 + lines.length * 48 + 14;
      sumLines.forEach((line, idx) => {
        ctx.fillText(line, colX, sumY + idx * 30);
      });
    }
    ctx.restore();

    if (state.showQr) {
      drawQrModuleBox(
        ctx,
        state.qrUrl,
        w - pad - qrSize,
        h - pad - qrSize - 24,
        qrSize,
        palette.primary,
        state.qrLabel || 'Scan Info'
      );
    }
    return;
  }

  // Portrait / Square layout
  const isTall = h / w >= 1.6;
  const isPortrait34 = h > w && !isTall;
  const photoTop = ribbonH + 38;
  const photoH = isTall ? 760 : isPortrait34 ? 560 : 450;
  ctx.save();
  ctx.shadowColor = 'rgba(11, 25, 44, 0.16)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;
  roundRectPath(ctx, pad, photoTop, w - pad * 2, photoH, 28);
  ctx.fillStyle = '#E2E8F0';
  ctx.fill();
  ctx.restore();
  drawImageCover(ctx, photo, pad, photoTop, w - pad * 2, photoH, 28);

  // Location tag
  const infoTop = photoTop + photoH + 34;
  ctx.save();
  ctx.fillStyle = palette.primary;
  ctx.font = '700 22px Inter, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, pad, infoTop);

  // Headline
  const qrSize = isStory ? 172 : 144;
  const bottomFooterY = h - pad - (state.showQr ? qrSize + 28 : 54);
  ctx.fillStyle = '#0B192C';
  ctx.font = `800 ${isStory ? 50 : 42}px Poppins, Inter, sans-serif`;
  const titleLines = wrapTextLines(ctx, state.headline, w - pad * 2, isStory ? 4 : 3);
  const titleLineH = isStory ? 62 : 52;
  titleLines.forEach((line, idx) => {
    ctx.fillText(line, pad, infoTop + 38 + idx * titleLineH);
  });

  if (state.showSummary && state.summary) {
    const sumY = infoTop + 44 + titleLines.length * titleLineH + 14;
    const sumMaxW = state.showQr ? w - pad * 2 - qrSize - 36 : w - pad * 2;
    const availLines = Math.max(2, Math.floor((bottomFooterY - sumY + 34) / 34));
    ctx.fillStyle = '#475569';
    ctx.font = `400 ${isStory ? 25 : 22}px Inter, sans-serif`;
    const sumLines = wrapTextLines(ctx, state.summary, sumMaxW, Math.min(availLines, isStory ? 6 : 3));
    sumLines.forEach((line, idx) => {
      ctx.fillText(line, pad, sumY + idx * 34);
    });
  }

  // Divider + CTA bottom left
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(truncateToWidth(ctx, state.cta || 'Portal Resmi Dispar Sulteng', w - pad * 2 - (state.showQr ? qrSize + 32 : 0)), pad, h - pad - 10);
  ctx.restore();

  if (state.showQr) {
    drawQrModuleBox(
      ctx,
      state.qrUrl,
      w - pad - qrSize,
      h - pad - qrSize - 24,
      qrSize,
      palette.primary,
      state.qrLabel || 'Scan Info'
    );
  }
};

const drawSpotlightPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const pad = w >= 1200 ? 54 : 60;
  const isBanner = w > h;
  const isStory = h > w;

  // Deep atmospheric background
  ctx.save();
  ctx.fillStyle = '#071324';
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.28;
  drawImageCover(ctx, photo, -30, -30, w + 60, h + 60, 0);
  ctx.restore();

  const glow = ctx.createRadialGradient(w * 0.2, h * 0.15, 40, w * 0.2, h * 0.15, w * 0.9);
  glow.addColorStop(0, `${palette.primary}88`);
  glow.addColorStop(0.55, `${palette.accent}55`);
  glow.addColorStop(1, 'rgba(6, 14, 28, 0.92)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Outer glass card frame
  const cardX = pad;
  const cardY = pad;
  const cardW = w - pad * 2;
  const cardH = h - pad * 2;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 36);
  ctx.fillStyle = 'rgba(11, 25, 44, 0.68)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.stroke();
  ctx.restore();

  const innerPad = 42;
  const ix = cardX + innerPad;
  const iy = cardY + innerPad;
  const iw = cardW - innerPad * 2;

  drawHeaderBrand(ctx, logoWhite, ix, iy, true, 48);

  if (isBanner) {
    const imgX = ix + iw * 0.54;
    const imgW = iw * 0.46;
    const imgY = iy;
    const imgH = cardH - innerPad * 2;
    drawImageCover(ctx, photo, imgX, imgY, imgW, imgH, 24);

    const textW = iw * 0.5;
    if (state.badge) {
      drawPill(ctx, state.badge.toUpperCase(), ix, iy + 86, palette.highlight, '#0B192C', 17, 18, 38);
    }

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 38px Poppins, Inter, sans-serif';
    ctx.textBaseline = 'top';
    const lines = wrapTextLines(ctx, state.headline, textW, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, ix, iy + 146 + idx * 48);
    });

    if (state.showSummary && state.summary) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.86)';
      ctx.font = '400 20px Inter, sans-serif';
      const sumMaxW = state.showQr ? textW - 144 : textW;
      const sumLines = wrapTextLines(ctx, state.summary, sumMaxW, 3);
      sumLines.forEach((line, idx) => {
        ctx.fillText(line, ix, iy + 306 + idx * 30);
      });
    }
    ctx.restore();

    if (state.showQr) {
      drawQrModuleBox(
        ctx,
        state.qrUrl,
        ix + textW - 122,
        cardY + cardH - innerPad - 144,
        122,
        '#0B192C',
        state.qrLabel || 'Scan Info'
      );
    }
    return;
  }

  // Portrait / Square glass photo window
  const isTall = h / w >= 1.6;
  const isPortrait34 = h > w && !isTall;
  const imgY = iy + 78;
  const imgH = isTall ? 740 : isPortrait34 ? 530 : 410;
  drawImageCover(ctx, photo, ix, imgY, iw, imgH, 26);

  if (state.badge) {
    drawPill(
      ctx,
      state.badge.toUpperCase(),
      ix + 20,
      imgY + imgH - 60,
      palette.highlight,
      '#0B192C',
      18,
      20,
      40
    );
  }

  const qrSize = isStory ? 166 : 138;
  const textY = imgY + imgH + 34;
  const textMaxW = state.showQr ? iw - qrSize - 32 : iw;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${isStory ? 48 : 40}px Poppins, Inter, sans-serif`;
  ctx.textBaseline = 'top';
  const lines = wrapTextLines(ctx, state.headline, iw, isStory ? 4 : 3);
  lines.forEach((line, idx) => {
    ctx.fillText(line, ix, textY + idx * (isStory ? 60 : 50));
  });

  if (state.showSummary && state.summary) {
    const sumY = textY + lines.length * (isStory ? 60 : 50) + 16;
    ctx.fillStyle = 'rgba(226, 232, 240, 0.86)';
    ctx.font = `400 ${isStory ? 24 : 21}px Inter, sans-serif`;
    const sumLines = wrapTextLines(ctx, state.summary, textMaxW, isStory ? 5 : 3);
    sumLines.forEach((line, idx) => {
      ctx.fillText(line, ix, sumY + idx * 32);
    });
  }

  ctx.fillStyle = palette.highlight;
  ctx.font = '700 20px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(
    truncateToWidth(ctx, `●  ${state.location || 'Sulawesi Tengah'}`, textMaxW),
    ix,
    cardY + cardH - innerPad - 8
  );
  ctx.restore();

  if (state.showQr) {
    drawQrModuleBox(
      ctx,
      state.qrUrl,
      ix + iw - qrSize,
      cardY + cardH - innerPad - qrSize - 24,
      qrSize,
      '#0B192C',
      state.qrLabel || 'Scan Info'
    );
  }
};

const drawQrCardPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const pad = 64;
  const isBanner = w > h;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, palette.primary);
  grad.addColorStop(0.55, palette.secondary);
  grad.addColorStop(1, palette.accent);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle decorative glow circle
  const rad = ctx.createRadialGradient(w * 0.85, h * 0.15, 20, w * 0.85, h * 0.15, w * 0.6);
  rad.addColorStop(0, `${palette.highlight}44`);
  rad.addColorStop(1, 'transparent');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, w, h);

  drawHeaderBrand(ctx, logoWhite, pad, pad - 6, true, 52);

  // Main white ticket card
  const ticketY = pad + 82;
  const ticketH = h - ticketY - pad;
  const ticketW = w - pad * 2;

  ctx.save();
  roundRectPath(ctx, pad, ticketY, ticketW, ticketH, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(6, 14, 28, 0.30)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.fill();
  ctx.restore();

  if (isBanner) {
    const qrSize = Math.min(340, ticketH - 110);
    const qrX = pad + 44;
    const qrY = ticketY + (ticketH - qrSize - 28) / 2;
    drawQrModuleBox(ctx, state.qrUrl, qrX, qrY, qrSize, palette.primary, state.qrLabel || 'Scan Info Lengkap');

    const infoX = qrX + qrSize + 44;
    const infoW = pad + ticketW - infoX - 44;
    drawPill(
      ctx,
      (state.badge || 'INFORMASI RESMI').toUpperCase(),
      infoX,
      ticketY + 46,
      `${palette.primary}1A`,
      palette.primary,
      18,
      20,
      40
    );

    ctx.save();
    ctx.fillStyle = '#0B192C';
    ctx.font = '800 40px Poppins, Inter, sans-serif';
    ctx.textBaseline = 'top';
    const lines = wrapTextLines(ctx, state.headline, infoW, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, infoX, ticketY + 106 + idx * 50);
    });

    ctx.fillStyle = '#64748B';
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, infoX, ticketY + ticketH - 102);

    ctx.fillStyle = palette.primary;
    ctx.font = '600 18px Inter, sans-serif';
    ctx.fillText(truncateToWidth(ctx, state.qrUrl || window.location.origin, infoW), infoX, ticketY + ticketH - 64);
    ctx.restore();
    return;
  }

  // Portrait / Square ticket
  const isTall = h / w >= 1.6;
  const isPortrait34 = h > w && !isTall;
  const thumbH = isTall ? 340 : isPortrait34 ? 270 : 210;
  drawImageCover(ctx, photo, pad + 24, ticketY + 24, ticketW - 48, thumbH, 24);

  const qrSize = isTall ? 430 : isPortrait34 ? 380 : 320;
  const qrX = (w - qrSize) / 2;
  const qrY = ticketY + thumbH + 56;
  drawQrModuleBox(
    ctx,
    state.qrUrl,
    qrX,
    qrY,
    qrSize,
    palette.primary,
    state.qrLabel || 'Scan untuk Info Lengkap'
  );

  const textStart = qrY + qrSize + 58;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = palette.primary;
  ctx.font = '700 20px Poppins, Inter, sans-serif';
  ctx.fillText((state.badge || 'WISATA SULTENG').toUpperCase(), w / 2, textStart);

  ctx.fillStyle = '#0B192C';
  ctx.font = `800 ${h > w ? 42 : 34}px Poppins, Inter, sans-serif`;
  const lines = wrapTextLines(ctx, state.headline, ticketW - 88, h > w ? 3 : 2);
  lines.forEach((line, idx) => {
    ctx.fillText(line, w / 2, textStart + 36 + idx * (h > w ? 52 : 42));
  });

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(
    truncateToWidth(ctx, `${state.location || 'Sulawesi Tengah'} · ${state.cta}`, ticketW - 72),
    w / 2,
    ticketY + ticketH - 28
  );
  ctx.restore();
};

const drawMajalahPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const pad = w >= 1200 ? 58 : 64;
  const isBanner = w > h;
  const isTall = h / w >= 1.6;

  drawImageCover(ctx, photo, 0, 0, w, h, 0);

  // Top dark editorial masthead scrim
  const topGrad = ctx.createLinearGradient(0, 0, 0, isBanner ? h * 0.38 : h * 0.3);
  topGrad.addColorStop(0, 'rgba(6, 14, 28, 0.86)');
  topGrad.addColorStop(1, 'rgba(6, 14, 28, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, isBanner ? h * 0.38 : h * 0.3);

  // Bottom dramatic scrim
  const botStart = isBanner ? h * 0.34 : h * 0.44;
  const botGrad = ctx.createLinearGradient(0, botStart, 0, h);
  botGrad.addColorStop(0, 'rgba(6, 14, 28, 0)');
  botGrad.addColorStop(0.5, 'rgba(6, 14, 28, 0.72)');
  botGrad.addColorStop(1, '#050D1A');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, botStart, w, h - botStart);

  // Masthead title across top
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = `800 ${isBanner ? 52 : 66}px Poppins, Inter, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  ctx.fillText('PESONA SULTENG', w / 2, pad - 12);
  ctx.fillStyle = palette.highlight;
  ctx.fillRect(pad, pad + (isBanner ? 54 : 68), w - pad * 2, 3);
  ctx.restore();

  const subRowY = pad + (isBanner ? 70 : 86);
  drawHeaderBrand(ctx, logoWhite, pad, subRowY, true, 42);
  if (state.badge) {
    ctx.save();
    ctx.font = '700 16px Poppins, Inter, sans-serif';
    const estW = Math.min(ctx.measureText(state.badge.toUpperCase()).width + 38, 420);
    drawPill(
      ctx,
      state.badge.toUpperCase(),
      w - pad - estW,
      subRowY + 4,
      palette.highlight,
      '#0B192C',
      16,
      19,
      36
    );
    ctx.restore();
  }

  const qrSize = isBanner ? 126 : isTall ? 162 : 144;
  const textMaxW = state.showQr ? w - pad * 2 - qrSize - 36 : w - pad * 2;
  if (state.showQr) {
    drawQrModuleBox(
      ctx,
      state.qrUrl,
      w - pad - qrSize,
      h - pad - qrSize - 26,
      qrSize,
      '#0B192C',
      state.qrLabel || 'Scan Info'
    );
  }

  // Location pill + Headline + Summary anchored near bottom
  const locY = h - pad - 42;
  drawPill(
    ctx,
    `●  ${state.location || 'Sulawesi Tengah'}`,
    pad,
    locY,
    'rgba(255,255,255,0.16)',
    '#FFFFFF',
    18,
    18,
    38
  );

  let bottomY = locY - 22;
  if (state.showSummary && state.summary) {
    ctx.save();
    ctx.font = `400 ${isBanner ? 20 : 23}px Inter, sans-serif`;
    const sumLines = wrapTextLines(ctx, state.summary, textMaxW, isBanner ? 2 : 3);
    const lineH = isBanner ? 29 : 33;
    bottomY -= sumLines.length * lineH;
    ctx.fillStyle = 'rgba(241, 245, 249, 0.88)';
    ctx.textBaseline = 'top';
    sumLines.forEach((line, idx) => {
      ctx.fillText(line, pad, bottomY + idx * lineH);
    });
    bottomY -= 16;
    ctx.restore();
  }

  ctx.save();
  const hSize = isBanner ? 44 : isTall ? 64 : 56;
  const hLine = isBanner ? 54 : isTall ? 74 : 66;
  ctx.font = `800 ${hSize}px Poppins, Inter, sans-serif`;
  const hLines = wrapTextLines(ctx, state.headline, isBanner ? textMaxW : w - pad * 2, 3);
  const hTop = bottomY - hLines.length * hLine;
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(5, 13, 26, 0.65)';
  ctx.shadowBlur = 18;
  hLines.forEach((line, idx) => {
    ctx.fillText(line, pad, hTop + idx * hLine);
  });
  ctx.restore();
};

const drawSplitPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const isBanner = w > h;
  const isTall = h / w >= 1.6;
  const pad = isBanner ? 48 : 58;

  if (isBanner) {
    const splitX = Math.round(w * 0.48);
    drawImageCover(ctx, photo, 0, 0, splitX, h, 0);

    // Subtle dark gradient top-left for logo on photo
    const gTop = ctx.createLinearGradient(0, 0, 0, 140);
    gTop.addColorStop(0, 'rgba(6, 14, 28, 0.72)');
    gTop.addColorStop(1, 'transparent');
    ctx.fillStyle = gTop;
    ctx.fillRect(0, 0, splitX, 140);
    drawHeaderBrand(ctx, logoWhite, 36, 34, true, 44);

    // Color theme half on right
    const bgGrad = ctx.createLinearGradient(splitX, 0, w, h);
    bgGrad.addColorStop(0, palette.primary);
    bgGrad.addColorStop(0.55, palette.secondary);
    bgGrad.addColorStop(1, palette.accent);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(splitX, 0, w - splitX, h);

    // Highlight accent seam
    ctx.fillStyle = palette.highlight;
    ctx.fillRect(splitX - 5, 0, 10, h);

    const cx = splitX + 46;
    const cw = w - cx - pad;
    if (state.badge) {
      drawPill(ctx, state.badge.toUpperCase(), cx, pad, palette.highlight, '#0B192C', 17, 18, 38);
    }

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 38px Poppins, Inter, sans-serif';
    ctx.textBaseline = 'top';
    const lines = wrapTextLines(ctx, state.headline, cw, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, cx, pad + 62 + idx * 48);
    });

    if (state.showSummary && state.summary) {
      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      ctx.font = '400 20px Inter, sans-serif';
      const sMaxW = state.showQr ? cw - 146 : cw;
      const sLines = wrapTextLines(ctx, state.summary, sMaxW, 4);
      sLines.forEach((line, idx) => {
        ctx.fillText(line, cx, pad + 74 + lines.length * 48 + idx * 29);
      });
    }

    ctx.fillStyle = palette.highlight;
    ctx.font = '700 19px Inter, sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, cx, h - pad);
    ctx.restore();

    if (state.showQr) {
      drawQrModuleBox(ctx, state.qrUrl, w - pad - 126, h - pad - 146, 126, '#0B192C', state.qrLabel || 'Scan Info');
    }
    return;
  }

  // Vertical / Square Split
  const splitY = Math.round(h * (isTall ? 0.5 : 0.48));
  drawImageCover(ctx, photo, 0, 0, w, splitY, 0);

  const gTop = ctx.createLinearGradient(0, 0, 0, 150);
  gTop.addColorStop(0, 'rgba(6, 14, 28, 0.75)');
  gTop.addColorStop(1, 'transparent');
  ctx.fillStyle = gTop;
  ctx.fillRect(0, 0, w, 150);
  drawHeaderBrand(ctx, logoWhite, pad, 42, true, 48);

  const bgGrad = ctx.createLinearGradient(0, splitY, w, h);
  bgGrad.addColorStop(0, palette.primary);
  bgGrad.addColorStop(0.55, palette.secondary);
  bgGrad.addColorStop(1, palette.accent);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, splitY, w, h - splitY);

  // Seam stripe + floating badge overlapping seam
  ctx.fillStyle = palette.highlight;
  ctx.fillRect(0, splitY - 5, w, 10);
  if (state.badge) {
    drawPill(ctx, state.badge.toUpperCase(), pad, splitY - 22, palette.highlight, '#0B192C', 18, 22, 42);
  }

  const qrSize = isTall ? 168 : 144;
  const contentTop = splitY + 46;
  const textMaxW = state.showQr ? w - pad * 2 - qrSize - 34 : w - pad * 2;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${isTall ? 52 : 42}px Poppins, Inter, sans-serif`;
  ctx.textBaseline = 'top';
  const lines = wrapTextLines(ctx, state.headline, w - pad * 2, isTall ? 4 : 3);
  const lineH = isTall ? 64 : 52;
  lines.forEach((line, idx) => {
    ctx.fillText(line, pad, contentTop + idx * lineH);
  });

  if (state.showSummary && state.summary) {
    const sTop = contentTop + lines.length * lineH + 16;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = `400 ${isTall ? 24 : 21}px Inter, sans-serif`;
    const availLines = Math.max(2, Math.floor((h - pad - 48 - sTop) / 32));
    const sLines = wrapTextLines(ctx, state.summary, textMaxW, Math.min(availLines, isTall ? 5 : 3));
    sLines.forEach((line, idx) => {
      ctx.fillText(line, pad, sTop + idx * 32);
    });
  }

  ctx.fillStyle = palette.highlight;
  ctx.font = '700 20px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(truncateToWidth(ctx, `●  ${state.location || 'Sulawesi Tengah'}`, textMaxW), pad, h - pad - 8);
  ctx.restore();

  if (state.showQr) {
    drawQrModuleBox(ctx, state.qrUrl, w - pad - qrSize, h - pad - qrSize - 24, qrSize, '#0B192C', state.qrLabel || 'Scan Info');
  }
};

const drawFestivalGlowPoster = (ctx, { w, h, state, palette, photo, logoWhite }) => {
  const pad = w >= 1200 ? 54 : 60;
  const isBanner = w > h;
  const isTall = h / w >= 1.6;
  const isPortrait34 = h > w && !isTall;

  ctx.fillStyle = '#070E1E';
  ctx.fillRect(0, 0, w, h);

  // Decorative neon blooms
  const bloom1 = ctx.createRadialGradient(w * 0.15, h * 0.2, 20, w * 0.15, h * 0.2, w * 0.72);
  bloom1.addColorStop(0, `${palette.primary}AA`);
  bloom1.addColorStop(1, 'transparent');
  ctx.fillStyle = bloom1;
  ctx.fillRect(0, 0, w, h);

  const bloom2 = ctx.createRadialGradient(w * 0.85, h * 0.82, 20, w * 0.85, h * 0.82, w * 0.75);
  bloom2.addColorStop(0, `${palette.accent}AA`);
  bloom2.addColorStop(1, 'transparent');
  ctx.fillStyle = bloom2;
  ctx.fillRect(0, 0, w, h);

  // Subtle decorative rings
  ctx.save();
  ctx.strokeStyle = `${palette.highlight}26`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w * 0.9, h * 0.14, 180, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w * 0.1, h * 0.86, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  drawHeaderBrand(ctx, logoWhite, pad, pad - 6, true, 48);

  if (isBanner) {
    const imgW = Math.round(w * 0.42);
    const imgH = h - pad * 2 - 74;
    const imgY = pad + 74;
    ctx.save();
    roundRectPath(ctx, pad, imgY, imgW, imgH, 24);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = palette.highlight;
    ctx.stroke();
    ctx.restore();
    drawImageCover(ctx, photo, pad + 4, imgY + 4, imgW - 8, imgH - 8, 20);

    const tx = pad + imgW + 40;
    const tw = w - tx - pad;
    if (state.badge) {
      drawPill(ctx, state.badge.toUpperCase(), tx, imgY, palette.highlight, '#0B192C', 17, 18, 38);
    }

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 38px Poppins, Inter, sans-serif';
    ctx.textBaseline = 'top';
    const lines = wrapTextLines(ctx, state.headline, tw, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, tx, imgY + 56 + idx * 48);
    });
    if (state.showSummary && state.summary) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.86)';
      ctx.font = '400 20px Inter, sans-serif';
      const sMaxW = state.showQr ? tw - 140 : tw;
      const sLines = wrapTextLines(ctx, state.summary, sMaxW, 3);
      sLines.forEach((line, idx) => {
        ctx.fillText(line, tx, imgY + 66 + lines.length * 48 + idx * 29);
      });
    }
    ctx.fillStyle = palette.highlight;
    ctx.font = '700 19px Inter, sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, tx, h - pad);
    ctx.restore();

    if (state.showQr) {
      drawQrModuleBox(ctx, state.qrUrl, w - pad - 120, h - pad - 142, 120, '#0B192C', state.qrLabel || 'Scan Info');
    }
    return;
  }

  // Centered pill badge + highlighted hero photo
  if (state.badge) {
    ctx.save();
    ctx.font = '700 18px Poppins, Inter, sans-serif';
    const pillW = Math.min(ctx.measureText(state.badge.toUpperCase()).width + 44, 460);
    drawPill(ctx, state.badge.toUpperCase(), w - pad - pillW, pad, palette.highlight, '#0B192C', 18, 22, 40);
    ctx.restore();
  }

  const imgY = pad + 84;
  const imgH = isTall ? 700 : isPortrait34 ? 520 : 390;
  ctx.save();
  ctx.shadowColor = `${palette.highlight}44`;
  ctx.shadowBlur = 32;
  roundRectPath(ctx, pad, imgY, w - pad * 2, imgH, 28);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = palette.highlight;
  ctx.stroke();
  ctx.restore();
  drawImageCover(ctx, photo, pad + 4, imgY + 4, w - pad * 2 - 8, imgH - 8, 24);

  const qrSize = isTall ? 166 : 142;
  const textY = imgY + imgH + 34;
  const textMaxW = state.showQr ? w - pad * 2 - qrSize - 32 : w - pad * 2;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${isTall ? 50 : 42}px Poppins, Inter, sans-serif`;
  ctx.textBaseline = 'top';
  const lines = wrapTextLines(ctx, state.headline, w - pad * 2, isTall ? 4 : 3);
  const lineH = isTall ? 62 : 52;
  lines.forEach((line, idx) => {
    ctx.fillText(line, pad, textY + idx * lineH);
  });

  if (state.showSummary && state.summary) {
    const sTop = textY + lines.length * lineH + 14;
    ctx.fillStyle = 'rgba(226, 232, 240, 0.88)';
    ctx.font = `400 ${isTall ? 24 : 21}px Inter, sans-serif`;
    const sLines = wrapTextLines(ctx, state.summary, textMaxW, isTall ? 5 : 3);
    sLines.forEach((line, idx) => {
      ctx.fillText(line, pad, sTop + idx * 32);
    });
  }

  ctx.fillStyle = palette.highlight;
  ctx.font = '700 20px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(truncateToWidth(ctx, `●  ${state.location || 'Sulawesi Tengah'}`, textMaxW), pad, h - pad - 8);
  ctx.restore();

  if (state.showQr) {
    drawQrModuleBox(ctx, state.qrUrl, w - pad - qrSize, h - pad - qrSize - 24, qrSize, '#0B192C', state.qrLabel || 'Scan Info');
  }
};

const drawKartuPosPoster = (ctx, { w, h, state, palette, photo, logoDark }) => {
  const pad = w >= 1200 ? 52 : 58;
  const isBanner = w > h;
  const isTall = h / w >= 1.6;
  const isPortrait34 = h > w && !isTall;

  // Warm gallery paper card backdrop
  ctx.fillStyle = '#FBF8F1';
  ctx.fillRect(0, 0, w, h);

  // Top & bottom color stripe accents
  const stripe = ctx.createLinearGradient(0, 0, w, 0);
  stripe.addColorStop(0, palette.primary);
  stripe.addColorStop(0.6, palette.secondary);
  stripe.addColorStop(1, palette.highlight);
  ctx.fillStyle = stripe;
  ctx.fillRect(0, 0, w, 14);
  ctx.fillRect(0, h - 10, w, 10);

  drawHeaderBrand(ctx, logoDark, pad, pad - 4, false, 48);
  if (state.badge) {
    ctx.save();
    ctx.font = '700 17px Poppins, Inter, sans-serif';
    const estW = Math.min(ctx.measureText(state.badge.toUpperCase()).width + 40, 420);
    drawPill(ctx, state.badge.toUpperCase(), w - pad - estW, pad, `${palette.primary}18`, palette.primary, 17, 20, 38);
    ctx.restore();
  }

  if (isBanner) {
    const frameW = Math.round(w * 0.46);
    const frameH = h - pad * 2 - 74;
    const frameY = pad + 72;
    ctx.save();
    ctx.shadowColor = 'rgba(11, 25, 44, 0.14)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    roundRectPath(ctx, pad, frameY, frameW, frameH, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
    drawImageCover(ctx, photo, pad + 14, frameY + 14, frameW - 28, frameH - 68, 12);

    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.font = '600 17px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, pad + 18, frameY + frameH - 26);
    ctx.restore();

    const tx = pad + frameW + 40;
    const tw = w - tx - pad;
    ctx.save();
    ctx.fillStyle = '#0B192C';
    ctx.font = '800 38px Poppins, Inter, sans-serif';
    ctx.textBaseline = 'top';
    const lines = wrapTextLines(ctx, state.headline, tw, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, tx, frameY + 8 + idx * 48);
    });
    if (state.showSummary && state.summary) {
      ctx.fillStyle = '#475569';
      ctx.font = '400 20px Inter, sans-serif';
      const sMaxW = state.showQr ? tw - 142 : tw;
      const sLines = wrapTextLines(ctx, state.summary, sMaxW, 4);
      sLines.forEach((line, idx) => {
        ctx.fillText(line, tx, frameY + 22 + lines.length * 48 + idx * 30);
      });
    }
    ctx.restore();

    if (state.showQr) {
      drawQrModuleBox(ctx, state.qrUrl, w - pad - 122, h - pad - 144, 122, palette.primary, state.qrLabel || 'Scan Info');
    }
    return;
  }

  // Portrait / Square polaroid matte frame
  const frameY = pad + 78;
  const frameW = w - pad * 2;
  const photoH = isTall ? 740 : isPortrait34 ? 540 : 410;
  const frameH = photoH + 74;

  ctx.save();
  ctx.shadowColor = 'rgba(11, 25, 44, 0.14)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 14;
  roundRectPath(ctx, pad, frameY, frameW, frameH, 24);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  drawImageCover(ctx, photo, pad + 18, frameY + 18, frameW - 36, photoH, 16);

  ctx.save();
  ctx.fillStyle = palette.primary;
  ctx.font = '700 20px Inter, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(`●  ${state.location || 'Sulawesi Tengah'}`, pad + 22, frameY + photoH + 46);
  ctx.restore();

  const qrSize = isTall ? 166 : 142;
  const textY = frameY + frameH + 34;
  const textMaxW = state.showQr ? w - pad * 2 - qrSize - 32 : w - pad * 2;

  ctx.save();
  ctx.fillStyle = '#0B192C';
  ctx.font = `800 ${isTall ? 48 : 40}px Poppins, Inter, sans-serif`;
  ctx.textBaseline = 'top';
  const lines = wrapTextLines(ctx, state.headline, textMaxW, isTall ? 4 : 3);
  const lineH = isTall ? 58 : 49;
  lines.forEach((line, idx) => {
    ctx.fillText(line, pad, textY + idx * lineH);
  });

  if (state.showSummary && state.summary) {
    const sTop = textY + lines.length * lineH + 14;
    ctx.fillStyle = '#475569';
    ctx.font = `400 ${isTall ? 23 : 20}px Inter, sans-serif`;
    const sLines = wrapTextLines(ctx, state.summary, textMaxW, isTall ? 5 : 3);
    sLines.forEach((line, idx) => {
      ctx.fillText(line, pad, sTop + idx * 30);
    });
  }

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px Inter, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(truncateToWidth(ctx, state.cta || 'Dinas Pariwisata Sulteng', textMaxW), pad, h - pad - 12);
  ctx.restore();

  if (state.showQr) {
    drawQrModuleBox(ctx, state.qrUrl, w - pad - qrSize, h - pad - qrSize - 26, qrSize, palette.primary, state.qrLabel || 'Scan Info');
  }
};

const TEMPLATE_RENDERERS = {
  editorial: drawEditorialPoster,
  resmi: drawResmiPoster,
  spotlight: drawSpotlightPoster,
  qr_card: drawQrCardPoster,
  majalah: drawMajalahPoster,
  split: drawSplitPoster,
  festival_glow: drawFestivalGlowPoster,
  kartu_pos: drawKartuPosPoster,
};

const AdminPosterStudio = () => {
  const { theme } = useTheme();
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();
  const canvasRef = useRef(null);

  const [sourceTab, setSourceTab] = useState('berita');
  const [sources, setSources] = useState({ berita: [], dtw: [], desa: [], slider: [] });
  const [loadingSources, setLoadingSources] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState('');

  const [formatId, setFormatId] = useState('feed');
  const [templateId, setTemplateId] = useState('editorial');
  const [paletteId, setPaletteId] = useState('active');

  const [posterState, setPosterState] = useState({
    headline: 'Pesona Wisata Sulawesi Tengah',
    badge: 'WARTA PARIWISATA',
    location: 'Dinas Pariwisata Provinsi Sulawesi Tengah',
    summary:
      'Jelajahi kekayaan alam bahari Kepulauan Togean, warisan megalit Lore Lindu, dan ragam budaya Nusantara.',
    imageUrl: DEFAULT_FALLBACK_IMG,
    qrUrl: `${window.location.origin}/`,
    qrLabel: 'Scan Info Lengkap',
    cta: 'Selengkapnya di Portal Resmi Dispar Sulteng',
    showQr: true,
    showSummary: true,
  });

  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [ideaText, setIdeaText] = useState('');
  const [ideaResultNote, setIdeaResultNote] = useState('');

  const handleGenerateFromIdea = (overrideText) => {
    const text = (typeof overrideText === 'string' ? overrideText : ideaText).trim();
    if (!text) {
      showToast('Tulis ide atau catatan singkat poster terlebih dahulu', 'error');
      return;
    }
    if (typeof overrideText === 'string') {
      setIdeaText(overrideText);
    }
    const composed = composePosterFromIdea(text, sources, window.location.origin);
    setCustomPhotoUrl(null);
    setSelectedKey('');
    setTemplateId(composed.templateId);
    setPaletteId(composed.paletteId);
    setPosterState((prev) => ({ ...prev, ...composed.posterFields }));
    setIdeaResultNote(composed.matchNote);
    showToast('Poster otomatis diracik dari ide Anda!');
  };

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoadingSources(true);
      try {
        const [bRes, dtwRes, desaRes, slRes] = await Promise.all([
          api.get('/berita?limit=40').catch(() => ({ data: { data: [] } })),
          api.get('/info-pariwisata/dtw').catch(() => ({ data: [] })),
          api.get('/info-pariwisata/desa-wisata').catch(() => ({ data: [] })),
          api.get('/slider/all').catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;
        const nextSources = {
          berita: bRes.data?.data || [],
          dtw: Array.isArray(dtwRes.data) ? dtwRes.data : [],
          desa: Array.isArray(desaRes.data) ? desaRes.data : [],
          slider: Array.isArray(slRes.data) ? slRes.data : [],
        };
        setSources(nextSources);

        // Prefill with first available item
        const firstTab = nextSources.berita.length
          ? 'berita'
          : nextSources.dtw.length
            ? 'dtw'
            : nextSources.desa.length
              ? 'desa'
              : 'slider';
        const firstItem = nextSources[firstTab][0];
        if (firstItem) {
          setSourceTab(firstTab);
          setSelectedKey(`${firstTab}-${firstItem.id}`);
          const normalized = normalizeItemForPoster(firstTab, firstItem);
          if (normalized) {
            setPosterState((prev) => ({ ...prev, ...normalized }));
          }
        }
      } finally {
        if (mounted) setLoadingSources(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  const currentItems = useMemo(() => {
    if (sourceTab === 'custom') return [];
    const list = sources[sourceTab] || [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter((it) => {
      const text = `${it.judul || it.nama || ''} ${it.kabupaten || ''} ${it.kategori || ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [sources, sourceTab, searchTerm]);

  const handlePickItem = (tab, item) => {
    setSelectedKey(`${tab}-${item.id}`);
    setCustomPhotoUrl(null);
    const normalized = normalizeItemForPoster(tab, item);
    if (normalized) {
      setPosterState((prev) => ({ ...prev, ...normalized }));
    }
  };

  const activePalette = useMemo(() => {
    if (paletteId === 'active') {
      return {
        primary: theme?.primary_color || '#1F5BA6',
        secondary: theme?.secondary_color || '#383087',
        accent: theme?.accent_color || '#5C2180',
        highlight: theme?.highlight_color || '#F59E0B',
      };
    }
    const found = PRESET_PALETTES.find((p) => p.id === paletteId);
    return found || PRESET_PALETTES[1];
  }, [paletteId, theme]);

  const activeFormat = useMemo(
    () => FORMAT_OPTIONS.find((f) => f.id === formatId) || FORMAT_OPTIONS[0],
    [formatId]
  );

  const effectiveImageUrl = customPhotoUrl || posterState.imageUrl || DEFAULT_FALLBACK_IMG;

  const drawPoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = activeFormat;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [loadedPhoto, logoWhite, logoDark] = await Promise.all([
      loadImageSafe(effectiveImageUrl),
      loadImageSafe(encodeURI('/dinas pariwisata-COLOR WHITE.png')),
      loadImageSafe('/dinas-pariwisata-logo-clean.png'),
    ]);
    const photo = loadedPhoto || (await loadImageSafe(DEFAULT_FALLBACK_IMG));

    const payload = {
      w,
      h,
      state: posterState,
      palette: activePalette,
      photo,
      logoWhite,
      logoDark: logoDark || logoWhite,
    };

    ctx.clearRect(0, 0, w, h);
    const renderTemplate = TEMPLATE_RENDERERS[templateId] || drawEditorialPoster;
    renderTemplate(ctx, payload);
  }, [activeFormat, posterState, activePalette, effectiveImageUrl, templateId]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) drawPoster();
    }, 30);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [drawPoster]);

  const generatedCaption = useMemo(() => {
    const lines = [
      `[${posterState.badge || 'INFO WISATA'}] ${posterState.headline}`,
      '',
    ];
    if (posterState.location) {
      lines.push(`Lokasi/Info: ${posterState.location}`);
    }
    if (posterState.summary) {
      lines.push('');
      lines.push(posterState.summary);
    }
    lines.push('');
    lines.push(`Info selengkapnya: ${posterState.qrUrl || window.location.origin}`);
    lines.push('');
    lines.push('#DinasPariwisataSulteng #PesonaSulteng #SulawesiTengah #WonderfulIndonesia');
    return lines.join('\n');
  }, [posterState]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('Gagal mengekspor gambar poster', 'error');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const slugName = (posterState.headline || 'poster-dispar')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .slice(0, 42);
        a.href = url;
        a.download = `poster-${slugName || 'sulteng'}-${formatId}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('Poster PNG HD berhasil diunduh!');
      }, 'image/png');
    } catch {
      showToast('Foto tidak mengizinkan ekspor langsung. Coba ganti/unggah foto lokal.', 'error');
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generatedCaption);
      setCopiedCaption(true);
      showToast('Caption IG / WhatsApp berhasil disalin!');
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      showToast('Gagal menyalin ke clipboard', 'error');
    }
  };

  const handleUploadLocalPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (customPhotoUrl) URL.revokeObjectURL(customPhotoUrl);
    setCustomPhotoUrl(URL.createObjectURL(f));
    showToast('Foto kustom dipasang ke kanvas');
  };

  return (
    <AdminLayout>
      <AdminPageShell>
        <div className="admin-panel glass" style={{ marginBottom: 18 }}>
          <div className="admin-panel-head" style={{ marginBottom: 0 }}>
            <div>
              <h1 className="admin-panel-title">Studio Poster &amp; QR Wisata</h1>
              <p className="admin-panel-sub">
                Buat poster promosi Instagram, WhatsApp Story, atau Kartu QR cetak langsung dari data website.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <motion.button
                type="button"
                className="admin-btn admin-btn-ghost"
                whileTap={reduce ? undefined : { scale: SCALE.press }}
                transition={SPRING.press}
                onClick={handleCopyCaption}
              >
                {copiedCaption ? <Check className="ic-sm" /> : <Copy className="ic-sm" />}
                <span>{copiedCaption ? 'Tersalin' : 'Salin Caption'}</span>
              </motion.button>
              <motion.button
                type="button"
                className="admin-btn admin-btn-amber"
                whileTap={reduce ? undefined : { scale: SCALE.press }}
                transition={SPRING.press}
                onClick={handleDownloadPng}
              >
                <Download className="ic-sm" />
                <span>Download PNG HD</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="admin-poster-studio">
          {/* Kolom Kiri: Sumber Konten, Template, Teks */}
          <div className="admin-panel glass admin-poster-controls">
            <div className="admin-poster-block">
              <div className="admin-poster-step-head">
                <span className="admin-poster-step-num">1</span>
                <div>
                  <h2 className="admin-section-title" style={{ margin: 0 }}>
                    Ambil Konten Otomatis
                  </h2>
                  <p className="admin-section-sub" style={{ margin: '2px 0 0' }}>
                    Pilih berita, destinasi, atau slider — foto & teks terisi otomatis.
                  </p>
                </div>
              </div>

              <div className="admin-tabs glass admin-poster-tabs" role="tablist">
                {SOURCE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={sourceTab === tab.id}
                      onClick={() => {
                        setSourceTab(tab.id);
                        setSearchTerm('');
                      }}
                      className={`admin-tab ${sourceTab === tab.id ? 'active' : ''}`}
                    >
                      <Icon className="ic-sm" style={{ marginRight: 5, verticalAlign: '-2px' }} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {sourceTab === 'ide' ? (
                <div className="admin-poster-idea-box">
                  <textarea
                    className="admin-d-textarea"
                    rows={3}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleGenerateFromIdea();
                      }
                    }}
                    placeholder="Ketik ide poster bebas (cth: Undangan Festival Danau Poso 15 Desember di Tentena, ada kuliner & lomba perahu...)"
                  />

                  <div className="admin-poster-idea-examples">
                    <span className="admin-poster-idea-hint">Contoh cepat:</span>
                    {SAMPLE_IDEAS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        className="admin-poster-idea-chip"
                        onClick={() => handleGenerateFromIdea(sample.text)}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>

                  <div className="admin-poster-idea-actions">
                    <motion.button
                      type="button"
                      className="admin-btn admin-btn-amber"
                      whileTap={reduce ? undefined : { scale: SCALE.press }}
                      transition={SPRING.press}
                      onClick={() => handleGenerateFromIdea()}
                    >
                      <Wand2 className="ic-sm" />
                      <span>Buatkan Poster Otomatis</span>
                    </motion.button>
                    {ideaResultNote && (
                      <span className="admin-poster-idea-note">{ideaResultNote}</span>
                    )}
                  </div>
                </div>
              ) : sourceTab !== 'custom' && (
                <>
                  <div className="admin-search-box" style={{ marginTop: 10 }}>
                    <Search className="ic" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Cari ${SOURCE_TABS.find((t) => t.id === sourceTab)?.label}...`}
                    />
                  </div>
                  <div className="admin-poster-pick-list">
                    {loadingSources ? (
                      <div className="admin-poster-pick-empty">Memuat data konten...</div>
                    ) : currentItems.length === 0 ? (
                      <div className="admin-poster-pick-empty">Tidak ada item yang cocok.</div>
                    ) : (
                      currentItems.slice(0, 24).map((item) => {
                        const title = item.judul || item.nama || 'Tanpa judul';
                        const sub = item.kabupaten || item.kategori || 'Slider Utama';
                        const thumb = getImageSrc(item.gambar, DEFAULT_FALLBACK_IMG);
                        const isPicked = selectedKey === `${sourceTab}-${item.id}`;
                        return (
                          <button
                            key={`${sourceTab}-${item.id}`}
                            type="button"
                            className={`admin-poster-pick-item ${isPicked ? 'active' : ''}`}
                            onClick={() => handlePickItem(sourceTab, item)}
                          >
                            <img src={thumb} alt={title} className="admin-poster-pick-thumb" />
                            <div className="admin-poster-pick-meta">
                              <div className="admin-poster-pick-title">{title}</div>
                              <div className="admin-poster-pick-sub">{sub}</div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="admin-poster-block">
              <div className="admin-poster-step-head">
                <span className="admin-poster-step-num">2</span>
                <div>
                  <h2 className="admin-section-title" style={{ margin: 0 }}>
                    Format, Desain & Warna
                  </h2>
                </div>
              </div>

              <div className="admin-poster-sublabel">Ukuran Kanvas</div>
              <div className="admin-poster-pills">
                {FORMAT_OPTIONS.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormatId(fmt.id)}
                    className={`admin-poster-pill ${formatId === fmt.id ? 'active' : ''}`}
                  >
                    <span>{fmt.label}</span>
                  </button>
                ))}
              </div>

              <div className="admin-poster-sublabel" style={{ marginTop: 14 }}>
                Gaya Template
              </div>
              <div className="admin-poster-templates">
                {TEMPLATE_OPTIONS.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={`admin-poster-tpl-card ${templateId === tpl.id ? 'active' : ''}`}
                  >
                    <div className="admin-poster-tpl-name">{tpl.label}</div>
                    <div className="admin-poster-tpl-desc">{tpl.desc}</div>
                  </button>
                ))}
              </div>

              <div className="admin-poster-sublabel" style={{ marginTop: 14 }}>
                Palet Warna
              </div>
              <div className="admin-poster-pills">
                {PRESET_PALETTES.map((pal) => {
                  const pColor = pal.id === 'active' ? theme?.primary_color || '#1F5BA6' : pal.primary;
                  const hColor = pal.id === 'active' ? theme?.highlight_color || '#F59E0B' : pal.highlight;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setPaletteId(pal.id)}
                      className={`admin-poster-pill ${paletteId === pal.id ? 'active' : ''}`}
                    >
                      <span
                        className="admin-poster-dot"
                        style={{ background: `linear-gradient(135deg, ${pColor}, ${hColor})` }}
                      />
                      <span>{pal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="admin-poster-block" style={{ marginBottom: 0 }}>
              <div className="admin-poster-step-head">
                <span className="admin-poster-step-num">3</span>
                <div>
                  <h2 className="admin-section-title" style={{ margin: 0 }}>
                    Sesuaikan Teks, Foto & QR Code
                  </h2>
                </div>
              </div>

              <div className="admin-d-field">
                <label className="admin-d-label">Judul Utama Poster</label>
                <input
                  type="text"
                  className="admin-d-input"
                  value={posterState.headline}
                  onChange={(e) => setPosterState({ ...posterState, headline: e.target.value })}
                />
              </div>

              <div className="admin-poster-row-2">
                <div className="admin-d-field">
                  <label className="admin-d-label">Lencana / Kategori</label>
                  <input
                    type="text"
                    className="admin-d-input"
                    value={posterState.badge}
                    onChange={(e) => setPosterState({ ...posterState, badge: e.target.value })}
                  />
                </div>
                <div className="admin-d-field">
                  <label className="admin-d-label">Lokasi / Sub-Info</label>
                  <input
                    type="text"
                    className="admin-d-input"
                    value={posterState.location}
                    onChange={(e) => setPosterState({ ...posterState, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-d-field">
                <label className="admin-d-label">Ringkasan Singkat</label>
                <textarea
                  className="admin-d-textarea"
                  rows={2}
                  value={posterState.summary}
                  onChange={(e) => setPosterState({ ...posterState, summary: e.target.value })}
                />
              </div>

              <div className="admin-poster-row-2">
                <div className="admin-d-field">
                  <label className="admin-d-label">URL Tujuan QR Code</label>
                  <input
                    type="text"
                    className="admin-d-input"
                    value={posterState.qrUrl}
                    onChange={(e) => setPosterState({ ...posterState, qrUrl: e.target.value })}
                  />
                </div>
                <div className="admin-d-field">
                  <label className="admin-d-label">Teks Bawah QR</label>
                  <input
                    type="text"
                    className="admin-d-input"
                    value={posterState.qrLabel}
                    onChange={(e) => setPosterState({ ...posterState, qrLabel: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-poster-toggles">
                <label className="admin-poster-check">
                  <input
                    type="checkbox"
                    checked={posterState.showQr}
                    onChange={(e) => setPosterState({ ...posterState, showQr: e.target.checked })}
                  />
                  <QrCode className="ic-sm" />
                  <span>Tampilkan QR Code</span>
                </label>
                <label className="admin-poster-check">
                  <input
                    type="checkbox"
                    checked={posterState.showSummary}
                    onChange={(e) =>
                      setPosterState({ ...posterState, showSummary: e.target.checked })
                    }
                  />
                  <span>Tampilkan Ringkasan</span>
                </label>

                <label className="admin-btn admin-btn-ghost admin-btn-sm admin-poster-upload-btn">
                  <Upload className="ic-sm" />
                  <span>Ganti Foto</span>
                  <input type="file" accept="image/*" hidden onChange={handleUploadLocalPhoto} />
                </label>

                {customPhotoUrl && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => {
                      URL.revokeObjectURL(customPhotoUrl);
                      setCustomPhotoUrl(null);
                    }}
                  >
                    <RotateCcw className="ic-sm" />
                    <span>Foto Asli</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Live Preview & Caption */}
          <div className="admin-poster-preview-col">
            <div className="admin-panel glass admin-poster-stage-card">
              <div className="admin-poster-stage-head">
                <div>
                  <div className="admin-poster-stage-title">Live Preview Poster</div>
                  <div className="admin-poster-stage-sub">
                    {activeFormat.label} · {activeFormat.hint}
                  </div>
                </div>
                <span
                  className="admin-badge blue"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <Sparkles className="ic-sm" /> Siap Unduh
                </span>
              </div>

              <div className={`admin-poster-stage format-${formatId}`}>
                <canvas
                  ref={canvasRef}
                  className="admin-poster-canvas"
                  aria-label="Pratinjau poster Dinas Pariwisata"
                />
              </div>

              <div className="admin-poster-caption-box">
                <div className="admin-poster-caption-head">
                  <span>Caption Siap Tempel (IG / WhatsApp)</span>
                  <button
                    type="button"
                    className="admin-poster-copy-mini"
                    onClick={handleCopyCaption}
                  >
                    {copiedCaption ? <Check className="ic-sm" /> : <Copy className="ic-sm" />}
                    <span>{copiedCaption ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <pre className="admin-poster-caption-text">{generatedCaption}</pre>
              </div>
            </div>
          </div>
        </div>
      </AdminPageShell>
    </AdminLayout>
  );
};

export default AdminPosterStudio;
