// generate-sitemap.js
// Run: node generate-sitemap.js
// Output: public/sitemap.xml
// StormGlass Interactive Inc.

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const BASE_URL = 'https://myicdcode.com';
const TODAY = new Date().toISOString().split('T')[0];

// Static pages
const STATIC_PAGES = [
  { url: '/',          priority: '1.0', changefreq: 'weekly'  },
  { url: '/browse',    priority: '0.9', changefreq: 'monthly' },
  { url: '/about',     priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy',   priority: '0.3', changefreq: 'yearly'  },
  { url: '/terms',     priority: '0.3', changefreq: 'yearly'  },
  { url: '/advertise', priority: '0.4', changefreq: 'monthly' },
];

// Chapter browse pages
const CHAPTER_PAGES = Array.from({ length: 21 }, (_, i) => ({
  url: `/browse?chapter=${i + 1}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

function loadCodes() {
  // Load all chapter chunk files
  const codes = [];
  for (let i = 1; i <= 21; i++) {
    try {
      const raw = readFileSync(`src/data/chunks/chapter_${i}.js`, 'utf8');
      // Extract code values using regex — avoids full JS eval
      const matches = raw.matchAll(/"code":\s*"([A-Z0-9.]+)"/g);
      for (const m of matches) {
        codes.push(m[1]);
      }
    } catch (e) {
      console.warn(`Could not read chapter_${i}.js: ${e.message}`);
    }
  }
  return codes;
}

function generateSitemap() {
  console.log('Generating sitemap...');

  const codes = loadCodes();
  console.log(`Loaded ${codes.length} codes`);

  const urlEntries = [];

  // Static pages
  for (const page of STATIC_PAGES) {
    urlEntries.push(`  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Chapter pages
  for (const page of CHAPTER_PAGES) {
    urlEntries.push(`  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Code pages — billable codes only for SEO value
  // We include all codes but give billable higher priority
  let codeCount = 0;
  for (const code of codes) {
    urlEntries.push(`  <url>
    <loc>${BASE_URL}/code/${code}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`);
    codeCount++;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`;

  writeFileSync('public/sitemap.xml', xml, 'utf8');
  console.log(`Sitemap written: public/sitemap.xml`);
  console.log(`  Static pages: ${STATIC_PAGES.length}`);
  console.log(`  Chapter pages: ${CHAPTER_PAGES.length}`);
  console.log(`  Code pages: ${codeCount}`);
  console.log(`  Total URLs: ${urlEntries.length}`);
}

generateSitemap();
