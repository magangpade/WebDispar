const BLOCKED_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'applet',
  'form', 'input', 'button', 'textarea', 'select', 'meta', 'link', 'base', 'svg', 'math',
]);

const URL_ATTRS = new Set(['href', 'src', 'xlink:href', 'action', 'formaction', 'poster']);
const SAFE_URL_PROTOCOLS = /^(https?:|mailto:|tel:|\/|#)/i;

/**
 * Membersihkan karakter mojibake / encoding rusak (sering terlihat seperti karakter China/Korea).
 * Karakter ini muncul akibat double-encoding UTF-8 → Latin-1 pada data lama.
 * Pola utama: 뿯½ (U+BFEF U+00BD) dan ┬ (U+252C)
 */
export const cleanMojibake = (text) => {
  if (!text || typeof text !== 'string') return text;

  let cleaned = text;

  // 0. Kata dengan aksen yang rusak lebih dulu (harus sebelum aturan generik)
  //    Contoh: Caf├뿯½ → Café
  cleaned = cleaned.replace(/\b(C|c)af[├┬][\uBFEF\uBFEE\uFFFD\u00BD\s]*/g, (m) =>
    m.startsWith('C') ? 'Café ' : 'café '
  );

  // 1. Box drawing + mojibake pada elemen kosong → jadikan spasi
  cleaned = cleaned.replace(/[┬├│][\uBFEF\uBFEE\uFFFD]\u00BD/g, ' ');

  // 2. Kata bahasa Inggris berapostrof: Let's, haven't, it's, dsb.
  //    Contoh: Let뿯½뿯½뿯½s → Let's
  cleaned = cleaned.replace(/([a-zA-Z])((?:[\uBFEF\uBFEE\uFFFD]\u00BD)+)([a-zA-Z])/g, (_, a, _mid, b) => `${a}'${b}`);

  // 3. Kata/frasa diapit mojibake ganda (tanda kutip buka-tutup)
  //    Contoh: 뿯½뿯½뿯½Nosarara Nosabatutu뿯½뿯½뿯½ → "Nosarara Nosabatutu"
  cleaned = cleaned.replace(/((?:[\uBFEF\uBFEE\uFFFD]\u00BD){2,4})([^<\n\r\uBFEF\uBFEE\uFFFD\u00BD]{1,80}?)((?:[\uBFEF\uBFEE\uFFFD]\u00BD){2,4})/g, (_, _o, word, _c) => ` \u201C${word.trim()}\u201D `);

  // 4. Mojibake sebagai em-dash / tanda pisah
  //    Contoh: Kelurahan Besusu 뿯½뿯½뿯½ Kota → Kelurahan Besusu \u2014 Kota
  cleaned = cleaned.replace(/((?:[\uBFEF\uBFEE\uFFFD]\u00BD){2,4})/g, ' \u2014 ');

  // 5. Mojibake tunggal → tanda petik biasa
  cleaned = cleaned.replace(/[\uBFEF\uBFEE\uFFFD]\u00BD/g, '\u2018');

  // 6. Sisa karakter artefak
  cleaned = cleaned.replace(/[\uBFEF\uBFEE\uFFFD]/g, '');
  cleaned = cleaned.replace(/[┬├│]/g, ' ');
  cleaned = cleaned.replace(/&nbsp;/g, ' ');

  // 7. Rapikan spasi ganda
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');

  // 8. Normalisasi sufiks possessif "-nya" yang terpisah
  //    Contoh: "Air nya bikin" → "Airnya bikin", "Indah nya Pantai" → "Indahnya Pantai"
  cleaned = cleaned.replace(/\b([A-Za-z]{2,}) nya\b/g, '$1nya');

  return cleaned;
};

/**
 * Membersihkan dan merapikan HTML dari konten destinasi wisata:
 * - Hapus tag-tag berbahaya (XSS)
 * - Tambahkan text-align: justify pada semua <p> dan <li>
 * - Konversi <h3> berisi span-span terpisah (pola CMS lama) → <h3> bersih
 * - Hapus tag kosong hasil artefak mojibake
 * - Tambahkan kelas Tailwind-compat pada gambar
 */
export const sanitizeAndFormatHtml = (dirty) => {
  if (!dirty) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return String(dirty).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  // Step 1: Bersihkan mojibake di level teks mentah sebelum di-parse DOM
  const preClean = cleanMojibake(String(dirty));

  const doc = new DOMParser().parseFromString(preClean, 'text/html');

  // Step 2: Konversi heading berisi banyak span (pola CMS lama: item_title_part_*)
  // <h3><span><span class="item_title_part_...">Kata1</span>┬ <span>Kata2</span></span></h3>
  // → <h3>Kata1 Kata2</h3>
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const spans = heading.querySelectorAll('[class*="item_title_part"]');
    if (spans.length > 0) {
      const words = Array.from(spans).map((s) => s.textContent.trim()).filter(Boolean);
      if (words.length > 0) {
        heading.innerHTML = words.join(' ');
      }
    }
  });

  // Step 3: Hapus tag kosong atau hanya berisi spasi / em-dash artefak
  doc.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, span').forEach((el) => {
    const text = el.textContent.trim();
    // Kosong atau hanya berisi karakter artefak
    if (text === '' || /^[\s\u2014\u2013\-]+$/.test(text)) {
      // Pastikan tidak ada konten gambar di dalamnya
      if (!el.querySelector('img')) {
        el.remove();
      }
    }
  });

  // Step 4: Semua <p> dan <li> → tambahkan text-align: justify
  doc.querySelectorAll('p').forEach((p) => {
    const existing = p.getAttribute('style') || '';
    if (!existing.includes('text-align')) {
      p.setAttribute('style', (existing + '; text-align: justify; text-justify: inter-word;').replace(/^;\s*/, ''));
    }
  });

  doc.querySelectorAll('li').forEach((li) => {
    const existing = li.getAttribute('style') || '';
    if (!existing.includes('text-align')) {
      li.setAttribute('style', (existing + '; text-align: justify; text-justify: inter-word;').replace(/^;\s*/, ''));
    }
  });

  // Step 4b: Blok kredit penulis / sumber / foto → beri gaya khusus yang jelas
  const CREDIT_STYLE = [
    'margin: 1.25rem 0',
    'padding: 0.75rem 1rem',
    'border-left: 4px solid #f59e0b',
    'background: #fffbeb',
    'border-radius: 0 0.75rem 0.75rem 0',
    'font-size: 0.875rem',
    'line-height: 1.6',
    'color: #57534e',
    'font-style: italic',
    'text-align: left',
  ].join('; ');

  doc.querySelectorAll('p').forEach((p) => {
    if (p.querySelector('img')) return;
    const raw = p.textContent.replace(/\s+/g, ' ').trim();
    if (!raw || raw.length > 260) return;

    const onlyEmphasis =
      p.children.length === 1 &&
      /^(strong|em|b|i)$/i.test(p.children[0].tagName) &&
      p.children[0].children.length <= 1;

    const looksLikeByline =
      onlyEmphasis &&
      raw.length < 160 &&
      (/[\u2014\-–]\s*\S/.test(raw) ||
        /(travel|blogger|guide|fotografer|fotografer|dokumentasi|humas|redaksi|kontributor|penulis|reporter|wartawan)/i.test(raw));

    const isCredit =
      /^(foto|sumber|penulis|dokumentasi|source\s*pict|narasi|editor|kontributor)\s*[:\-]/i.test(raw) ||
      looksLikeByline;

    if (!isCredit) return;

    const credit = doc.createElement('div');
    credit.setAttribute('class', 'credit-note');
    credit.setAttribute('style', CREDIT_STYLE);
    credit.innerHTML = p.innerHTML;
    p.replaceWith(credit);
  });

  // Step 5: Semua heading → hilangkan inline warna/style aneh, buat bersih
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    // Hanya pertahankan text-align center jika ada
    const style = h.getAttribute('style') || '';
    if (style.includes('text-align: center')) {
      h.setAttribute('style', 'text-align: center;');
    } else {
      h.removeAttribute('style');
    }
    // Hapus warna inline pada span di dalam heading
    h.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));
    h.querySelectorAll('[class]').forEach((el) => el.removeAttribute('class'));
  });

  // Step 6: Gambar → tambahkan style responsif dan rounded + fallback jika gagal dimuat
  const IMG_FALLBACK_SRC = '/slider/Slider.jpg';
  doc.querySelectorAll('img').forEach((img) => {
    // Hapus tag <img> tanpa src valid (artefak / kosong)
    const src = (img.getAttribute('src') || '').trim();
    if (!src) {
      img.remove();
      return;
    }
    img.setAttribute('src', src);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '0.75rem';
    img.style.margin = '1.5rem auto';
    img.style.display = 'block';
    img.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
    // Hapus atribut width/height absolut yang bisa merusak layout
    img.removeAttribute('width');
    img.removeAttribute('height');
    img.setAttribute('alt', img.getAttribute('alt') || '');
    // Fallback lokal bila gambar dari domain eksternal gagal dimuat (404 / DNS error)
    // Domain yang diizinkan: CDN gambar pihak ketiga yang masih aktif.
    const ALLOWED_REMOTE = /^(https:\/\/(images\.unsplash\.com|i\.ytimg\.com|youtube\.com|www\.youtube\.com|youtu\.be|media\.akamaihd\.net|googlevideo\.com)|https:\/\/i\.ytimg)/i;
    const isDeadRemote = /^https?:\/\//i.test(src) && !ALLOWED_REMOTE.test(src);
    const isDataUri = /^data:/i.test(src);
    if (isDeadRemote || isDataUri) {
      img.setAttribute('src', IMG_FALLBACK_SRC);
    }
  });

  // Step 7: Link → pastikan aman dan terbuka di tab baru
  doc.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (href && !SAFE_URL_PROTOCOLS.test(href)) {
      a.removeAttribute('href');
    }
    if (a.getAttribute('target') === '_blank') {
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Step 8: Hapus tag berbahaya (XSS)
  const walk = (node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (BLOCKED_TAGS.has(tag)) {
          child.remove();
          continue;
        }
        for (const attr of Array.from(child.attributes)) {
          const name = attr.name.toLowerCase();
          const val = (attr.value || '').trim();
          if (name.startsWith('on') || name === 'srcdoc') {
            child.removeAttribute(attr.name);
            continue;
          }
          if (URL_ATTRS.has(name) && val && !SAFE_URL_PROTOCOLS.test(val)) {
            child.removeAttribute(attr.name);
          }
        }
        walk(child);
      } else if (child.nodeType === Node.TEXT_NODE) {
        // Bersihkan sisa mojibake di text node
        if (child.textContent && /[\uBFEF\uBFEE\uFFFD┬├│]/.test(child.textContent)) {
          child.textContent = cleanMojibake(child.textContent);
        }
      }
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
};

/**
 * Zero-dependency browser DOM HTML sanitizer (original, untuk halaman lain).
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return String(dirty).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  const doc = new DOMParser().parseFromString(String(dirty), 'text/html');

  const walk = (node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (BLOCKED_TAGS.has(tag)) {
          child.remove();
          continue;
        }
        for (const attr of Array.from(child.attributes)) {
          const name = attr.name.toLowerCase();
          const val = (attr.value || '').trim();
          if (name.startsWith('on') || name === 'srcdoc') {
            child.removeAttribute(attr.name);
            continue;
          }
          if (URL_ATTRS.has(name) && val && !SAFE_URL_PROTOCOLS.test(val)) {
            child.removeAttribute(attr.name);
          }
        }
        if (tag === 'a' && child.getAttribute('target') === '_blank') {
          child.setAttribute('rel', 'noopener noreferrer');
        }
        walk(child);
      }
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
};
