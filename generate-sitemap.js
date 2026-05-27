// generate-sitemap.js — StormGlass Interactive Inc.
// Generates a sitemap index + multiple child sitemaps (max 50k URLs each)
// Run: node generate-sitemap.js
// Output: public/sitemap.xml (index), public/sitemap-static.xml, public/sitemap-codes-1.xml, etc.

import { readFileSync, writeFileSync } from 'fs';

const BASE  = 'https://myicdcode.com';
const TODAY = new Date().toISOString().split('T')[0];
const MAX_PER_SITEMAP = 45000; // Stay under 50k limit with buffer

// ── Static pages ──────────────────────────────────────────────
const STATIC_URLS = [
  { url: '/',          priority: '1.0', changefreq: 'weekly'  },
  { url: '/browse',    priority: '0.9', changefreq: 'monthly' },
  { url: '/about',     priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy',   priority: '0.3', changefreq: 'yearly'  },
  { url: '/terms',     priority: '0.3', changefreq: 'yearly'  },
  { url: '/advertise', priority: '0.4', changefreq: 'monthly' },
  ...Array.from({ length: 21 }, (_, i) => ({
    url: `/browse?chapter=${i + 1}`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
];

// ── Load all codes from chapter chunks ────────────────────────
function loadAllCodes() {
  const codes = [];
  for (let i = 1; i <= 21; i++) {
    try {
      const raw = readFileSync(`src/data/chunks/chapter_${i}.js`, 'utf8');
      const matches = [...raw.matchAll(/"code":\s*"([A-Z0-9.]+)"/g)];
      for (const m of matches) codes.push(m[1]);
    } catch {
      console.warn(`  chapter_${i}.js not found — skipping`);
    }
  }
  return [...new Set(codes)]; // deduplicate
}

// ── Write a single sitemap file ───────────────────────────────
function writeSitemap(filename, entries) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${BASE}${e.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  writeFileSync(`public/${filename}`, xml, 'utf8');
  console.log(`  ✓ ${filename} — ${entries.length.toLocaleString()} URLs`);
  return filename;
}

// ── Write sitemap index ───────────────────────────────────────
function writeSitemapIndex(sitemapFiles) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(f => `  <sitemap>
    <loc>${BASE}/${f}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
  writeFileSync('public/sitemap.xml', xml, 'utf8');
  console.log(`  ✓ sitemap.xml (index) — ${sitemapFiles.length} child sitemaps`);
}

// ── Main ──────────────────────────────────────────────────────
function main() {
  console.log('Generating sitemaps...');

  const sitemapFiles = [];

  // Sitemap 1: static + chapter pages
  const staticFile = writeSitemap('sitemap-static.xml', STATIC_URLS);
  sitemapFiles.push(staticFile);

  // Load all code pages
  const codes = loadAllCodes();
  console.log(`  Loaded ${codes.length.toLocaleString()} codes`);

  // Split codes into chunks of MAX_PER_SITEMAP
  const codeEntries = codes.map(code => ({
    url: `/code/${code}`,
    priority: '0.7',
    changefreq: 'yearly',
  }));

  let part = 1;
  for (let i = 0; i < codeEntries.length; i += MAX_PER_SITEMAP) {
    const chunk = codeEntries.slice(i, i + MAX_PER_SITEMAP);
    const filename = `sitemap-codes-${part}.xml`;
    writeSitemap(filename, chunk);
    sitemapFiles.push(filename);
    part++;
  }

  // Write the sitemap index
  writeSitemapIndex(sitemapFiles);

  const total = STATIC_URLS.length + codes.length;
  console.log('');
  console.log(`Done. ${total.toLocaleString()} total URLs across ${sitemapFiles.length} sitemaps`);
  console.log('');
  console.log('Submit to Google Search Console:');
  console.log('  https://myicdcode.com/sitemap.xml');
}

main();
