import { useEffect } from 'react';

const BASE_URL = 'https://myicdcode.com';

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  noindex = false,
  schema = null,
}) {
  const fullTitle = title
    ? `${title} | myICDCode.com`
    : 'myICDCode.com — ICD-10-CM Code Lookup, Plain English';

  const fullDesc = description ||
    'Free ICD-10-CM diagnosis code lookup. Search 98,000+ codes with plain English explanations. FY 2026 current.';

  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : null;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.match(/\[(.+?)="(.+?)"\]/);
        if (parts) {
          el.setAttribute(parts[1], parts[2]);
          document.head.appendChild(el);
        }
      }
      if (el) el.setAttribute(attr, value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('meta[name="description"]', 'content', fullDesc);
    setMeta('meta[name="robots"]', 'content',
      noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large');
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', fullDesc);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:url"]', 'content', fullCanonical || BASE_URL);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', fullDesc);

    if (fullCanonical) setLink('canonical', fullCanonical);

    // Inject page-specific JSON-LD
    if (schema) {
      const existing = document.getElementById('page-schema');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-schema';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup page-specific schema on unmount
      if (schema) {
        const el = document.getElementById('page-schema');
        if (el) el.remove();
      }
    };
  }, [fullTitle, fullDesc, fullCanonical, noindex, type, schema]);

  return null;
}
