const BLOCKED_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'applet',
  'form', 'input', 'button', 'textarea', 'select', 'meta', 'link', 'base', 'svg', 'math',
]);

const URL_ATTRS = new Set(['href', 'src', 'xlink:href', 'action', 'formaction', 'poster']);
const SAFE_URL_PROTOCOLS = /^(https?:|mailto:|tel:|\/|#)/i;

/**
 * Zero-dependency browser DOM HTML sanitizer to prevent XSS on database-rendered HTML.
 * Strips dangerous elements, inline event handlers (on*), and unsafe URL protocols.
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
