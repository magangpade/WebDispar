export const KABUPATEN_OPTIONS = [
  'Kota Palu',
  'Kabupaten Donggala',
  'Kabupaten Sigi',
  'Kabupaten Parigi Moutong',
  'Kabupaten Poso',
  'Kabupaten Tojo Una-Una',
  'Kabupaten Banggai',
  'Kabupaten Banggai Kepulauan',
  'Kabupaten Banggai Laut',
  'Kabupaten Morowali',
  'Kabupaten Morowali Utara',
  'Kabupaten Tolitoli',
  'Kabupaten Buol',
];

export const KATEGORI_BERITA_OPTIONS = [
  'WARTA PARIWISATA',
  'BERITA UTAMA',
  'KEGIATAN DINAS',
  'EVENT & PROMOSI',
  'PENGUMUMAN',
];

export const getBeritaBadgeTone = (kategori = '') => {
  const k = kategori.toLowerCase();
  if (k.includes('event') || k.includes('promosi')) return 'amber';
  if (k.includes('desa')) return 'emerald';
  if (k.includes('kegiatan') || k.includes('utama')) return 'purple';
  if (k.includes('pengumuman')) return 'rose';
  return 'blue';
};

export const formatDateId = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const stripHtml = (raw = '') =>
  String(raw)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/┬á|\u00a0/g, ' ')
    .replace(/┬▒/g, '±')
    .replace(/â€“|â€”/g, '-')
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
