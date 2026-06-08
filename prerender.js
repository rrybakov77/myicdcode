#!/usr/bin/env node
/**
 * myICDCode.com — Static Prerender Script
 * ========================================
 * StormGlass Interactive Inc.
 *
 * Generates static HTML files for every route so Google can index
 * real content without executing JavaScript.
 *
 * How it works:
 *   1. Reads the Vite-built index.html as a template
 *   2. For each route, injects proper <title>, <meta>, and structured data
 *   3. Writes a real HTML file to dist/ at the correct path
 *
 * This is NOT full SSR — it's static HTML injection (metadata + content hints).
 * The React app hydrates on top when JS loads.
 *
 * Usage:
 *   node prerender.js
 *   (runs automatically via: npm run build)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const BASE_URL = 'https://myicdcode.com';

// ── Load the built index.html template ────────────────────────
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// ── Load sample codes for code page prerendering ───────────────
// We prerender the top ~200 codes with full content
// The rest get generic meta tags
const TOP_CODES = [
  // Circulatory (Chapter 9) — highest EOB volume
  { code: 'I10',    title: 'Essential (primary) hypertension',              desc: 'ICD-10 code I10 — Essential hypertension (high blood pressure). The most billed diagnosis code in the US. Commonly appears on insurance EOB statements.' },
  { code: 'I25.10', title: 'Atherosclerotic heart disease of native coronary artery', desc: 'ICD-10 code I25.10 — Coronary artery disease without angina pectoris. Buildup of plaque in the arteries that supply the heart.' },
  { code: 'I50.9',  title: 'Heart failure, unspecified',                    desc: 'ICD-10 code I50.9 — Heart failure, unspecified. The heart is not pumping blood as well as it should.' },
  { code: 'I48.91', title: 'Unspecified atrial fibrillation',               desc: 'ICD-10 code I48.91 — Atrial fibrillation, an irregular and often rapid heart rate.' },
  { code: 'I21.9',  title: 'Acute myocardial infarction, unspecified',      desc: 'ICD-10 code I21.9 — Heart attack (myocardial infarction). Blockage of blood flow to the heart muscle.' },
  { code: 'I63.9',  title: 'Cerebral infarction, unspecified',              desc: 'ICD-10 code I63.9 — Stroke caused by a blood clot blocking a brain artery.' },
  { code: 'I11.9',  title: 'Hypertensive heart disease without heart failure', desc: 'ICD-10 code I11.9 — High blood pressure causing heart problems, without heart failure.' },
  { code: 'I20.9',  title: 'Angina pectoris, unspecified',                  desc: 'ICD-10 code I20.9 — Chest pain caused by reduced blood flow to the heart.' },
  { code: 'I44.2',  title: 'Atrioventricular block, complete',              desc: 'ICD-10 code I44.2 — Complete heart block. Electrical signals cannot travel from the upper to lower chambers of the heart.' },
  { code: 'I49.9',  title: 'Cardiac arrhythmia, unspecified',               desc: 'ICD-10 code I49.9 — Irregular heartbeat of unspecified type.' },

  // Endocrine (Chapter 4)
  { code: 'E11.9',  title: 'Type 2 diabetes mellitus without complications', desc: 'ICD-10 code E11.9 — Type 2 diabetes without complications. The most common form of diabetes. One of the top 5 billed codes in Medicare.' },
  { code: 'E78.5',  title: 'Hyperlipidemia, unspecified',                   desc: 'ICD-10 code E78.5 — High cholesterol or triglycerides in the blood. Very commonly billed diagnosis.' },
  { code: 'E11.65', title: 'Type 2 diabetes mellitus with hyperglycemia',   desc: 'ICD-10 code E11.65 — Type 2 diabetes with high blood sugar (hyperglycemia).' },
  { code: 'E03.9',  title: 'Hypothyroidism, unspecified',                   desc: 'ICD-10 code E03.9 — Underactive thyroid gland. The thyroid does not make enough hormones.' },
  { code: 'E66.9',  title: 'Obesity, unspecified',                          desc: 'ICD-10 code E66.9 — Obesity, unspecified. BMI of 30 or higher.' },
  { code: 'E87.1',  title: 'Hypo-osmolality and hyponatremia',              desc: 'ICD-10 code E87.1 — Low sodium levels in the blood (hyponatremia).' },
  { code: 'E55.9',  title: 'Vitamin D deficiency, unspecified',             desc: 'ICD-10 code E55.9 — Vitamin D deficiency. Insufficient vitamin D levels in the body.' },
  { code: 'E11.40', title: 'Type 2 diabetes mellitus with diabetic neuropathy', desc: 'ICD-10 code E11.40 — Type 2 diabetes with nerve damage (diabetic neuropathy).' },

  // Respiratory (Chapter 10)
  { code: 'J06.9',  title: 'Acute upper respiratory infection, unspecified', desc: 'ICD-10 code J06.9 — Common cold or upper respiratory infection. The most frequent reason for a doctor visit globally.' },
  { code: 'J44.1',  title: 'Chronic obstructive pulmonary disease with acute exacerbation', desc: 'ICD-10 code J44.1 — COPD with acute exacerbation. Chronic lung disease worsening suddenly.' },
  { code: 'J45.901',title: 'Unspecified asthma with acute exacerbation',    desc: 'ICD-10 code J45.901 — Asthma flare-up of unspecified severity requiring urgent intervention.' },
  { code: 'J18.9',  title: 'Pneumonia, unspecified organism',               desc: 'ICD-10 code J18.9 — Pneumonia with unspecified causative organism. Lung infection causing inflammation.' },
  { code: 'J45.51', title: 'Severe persistent asthma with acute exacerbation', desc: 'ICD-10 code J45.51 — Severe persistent asthma actively worsening. May require emergency treatment or hospitalization.' },
  { code: 'J20.9',  title: 'Acute bronchitis, unspecified',                 desc: 'ICD-10 code J20.9 — Acute bronchitis. Inflammation of the bronchial tubes, usually from infection.' },
  { code: 'J96.00', title: 'Acute respiratory failure, unspecified',        desc: 'ICD-10 code J96.00 — Acute respiratory failure. The lungs cannot provide enough oxygen to the body.' },

  // Mental health (Chapter 5)
  { code: 'F32.1',  title: 'Major depressive disorder, single episode, moderate', desc: 'ICD-10 code F32.1 — Moderate depression, single episode. Clinical depression causing noticeable difficulty in daily functioning.' },
  { code: 'F41.1',  title: 'Generalized anxiety disorder',                  desc: 'ICD-10 code F41.1 — Generalized anxiety disorder (GAD). Excessive, uncontrollable worry about everyday things.' },
  { code: 'F33.0',  title: 'Major depressive disorder, recurrent, mild',    desc: 'ICD-10 code F33.0 — Recurrent mild depression. Multiple episodes of clinical depression.' },
  { code: 'F43.10', title: 'Post-traumatic stress disorder, unspecified',   desc: 'ICD-10 code F43.10 — PTSD. Anxiety disorder triggered by a traumatic event.' },
  { code: 'F32.9',  title: 'Major depressive disorder, single episode, unspecified', desc: 'ICD-10 code F32.9 — Depression, single episode, unspecified severity.' },
  { code: 'F41.9',  title: 'Anxiety disorder, unspecified',                 desc: 'ICD-10 code F41.9 — Anxiety disorder of unspecified type.' },
  { code: 'F10.10', title: 'Alcohol abuse, uncomplicated',                  desc: 'ICD-10 code F10.10 — Alcohol use disorder, mild (alcohol abuse).' },

  // Musculoskeletal (Chapter 13)
  { code: 'M54.50', title: 'Low back pain, unspecified',                    desc: 'ICD-10 code M54.50 — Low back pain of unspecified cause. One of the most common reasons for medical visits in the US.' },
  { code: 'M54.2',  title: 'Cervicalgia',                                   desc: 'ICD-10 code M54.2 — Neck pain (cervicalgia). Pain in the cervical spine region.' },
  { code: 'M17.11', title: 'Primary osteoarthritis, right knee',            desc: 'ICD-10 code M17.11 — Osteoarthritis of the right knee. Joint degeneration causing pain and stiffness.' },
  { code: 'M79.3',  title: 'Panniculitis, unspecified',                     desc: 'ICD-10 code M79.3 — Inflammation of the fat layer beneath the skin.' },
  { code: 'M25.511',title: 'Pain in right shoulder',                        desc: 'ICD-10 code M25.511 — Right shoulder pain of unspecified cause.' },

  // Symptoms (Chapter 18) — huge EOB volume
  { code: 'R10.9',  title: 'Unspecified abdominal pain',                    desc: 'ICD-10 code R10.9 — Abdominal pain, unspecified location or cause. Very common ER and urgent care diagnosis.' },
  { code: 'R51.9',  title: 'Headache, unspecified',                         desc: 'ICD-10 code R51.9 — Headache of unspecified type. Common reason for urgent care and office visits.' },
  { code: 'R07.9',  title: 'Chest pain, unspecified',                       desc: 'ICD-10 code R07.9 — Chest pain of unspecified type. Common ER presentation.' },
  { code: 'R06.00', title: 'Dyspnea, unspecified',                          desc: 'ICD-10 code R06.00 — Shortness of breath (dyspnea), unspecified cause.' },
  { code: 'R50.9',  title: 'Fever, unspecified',                            desc: 'ICD-10 code R50.9 — Fever of unknown origin. Elevated body temperature without identified cause.' },
  { code: 'R53.83', title: 'Other fatigue',                                 desc: 'ICD-10 code R53.83 — Fatigue, other. Tiredness or exhaustion beyond normal levels.' },
  { code: 'R05.9',  title: 'Cough, unspecified',                            desc: 'ICD-10 code R05.9 — Cough, unspecified type. One of the most common presenting symptoms.' },
  { code: 'R00.0',  title: 'Tachycardia, unspecified',                      desc: 'ICD-10 code R00.0 — Rapid heart rate (tachycardia) of unspecified type.' },

  // Preventive / Z codes
  { code: 'Z00.00', title: 'Encounter for general adult medical examination without abnormal findings', desc: 'ICD-10 code Z00.00 — Annual physical exam with no abnormal findings. Very commonly appears on EOBs for wellness visits.' },
  { code: 'Z23',    title: 'Encounter for immunization',                    desc: 'ICD-10 code Z23 — Vaccination visit. Used for flu shots, COVID vaccines, childhood immunizations.' },
  { code: 'Z12.31', title: 'Encounter for screening mammogram for malignant neoplasm of breast', desc: 'ICD-10 code Z12.31 — Screening mammogram. Appears on EOBs for routine breast cancer screening.' },
  { code: 'Z79.4',  title: 'Long-term (current) use of insulin',            desc: 'ICD-10 code Z79.4 — Patient is currently using insulin long-term.' },
  { code: 'Z87.891',title: 'Personal history of nicotine dependence',       desc: 'ICD-10 code Z87.891 — Former tobacco user. History of nicotine dependence.' },
  { code: 'Z38.00', title: 'Single liveborn infant, delivered vaginally',   desc: 'ICD-10 code Z38.00 — Newborn born via vaginal delivery. Used for newborn birth records.' },
  { code: 'Z34.00', title: 'Encounter for supervision of normal first pregnancy', desc: 'ICD-10 code Z34.00 — Normal first pregnancy supervision visit.' },

  // Digestive (Chapter 11)
  { code: 'K21.0',  title: 'Gastro-esophageal reflux disease with esophagitis', desc: 'ICD-10 code K21.0 — GERD with esophagitis. Acid reflux causing inflammation of the esophagus.' },
  { code: 'K57.30', title: 'Diverticulosis of large intestine without perforation', desc: 'ICD-10 code K57.30 — Diverticulosis of the colon without complications.' },
  { code: 'K92.1',  title: 'Melena',                                        desc: 'ICD-10 code K92.1 — Black, tarry stools indicating bleeding in the upper digestive tract.' },
  { code: 'K80.20', title: 'Calculus of gallbladder without cholecystitis', desc: 'ICD-10 code K80.20 — Gallstones without gallbladder inflammation.' },
  { code: 'K59.00', title: 'Constipation, unspecified',                     desc: 'ICD-10 code K59.00 — Constipation of unspecified type.' },

  // Genitourinary (Chapter 14)
  { code: 'N39.0',  title: 'Urinary tract infection, site not specified',   desc: 'ICD-10 code N39.0 — Urinary tract infection (UTI). Very common reason for antibiotic prescriptions.' },
  { code: 'N18.9',  title: 'Chronic kidney disease, unspecified',           desc: 'ICD-10 code N18.9 — Chronic kidney disease of unspecified stage.' },
  { code: 'N40.0',  title: 'Benign prostatic hyperplasia without lower urinary tract symptoms', desc: 'ICD-10 code N40.0 — Enlarged prostate (BPH) without urinary symptoms.' },

  // Infectious (Chapter 1)
  { code: 'A41.9',  title: 'Sepsis, unspecified organism',                  desc: 'ICD-10 code A41.9 — Sepsis (blood poisoning) from unspecified organism. Life-threatening infection response.' },
  { code: 'B34.9',  title: 'Viral infection, unspecified',                  desc: 'ICD-10 code B34.9 — Viral infection of unspecified type.' },
  { code: 'J02.9',  title: 'Acute pharyngitis, unspecified',                desc: 'ICD-10 code J02.9 — Sore throat (pharyngitis) of unspecified cause.' },

  // Neoplasms (Chapter 2) — high value searches
  { code: 'C34.90', title: 'Malignant neoplasm of unspecified part of unspecified bronchus or lung', desc: 'ICD-10 code C34.90 — Lung cancer, unspecified location.' },
  { code: 'C50.911',title: 'Malignant neoplasm of unspecified site of right female breast', desc: 'ICD-10 code C50.911 — Breast cancer, right breast, unspecified site.' },
  { code: 'C18.9',  title: 'Malignant neoplasm of colon, unspecified',      desc: 'ICD-10 code C18.9 — Colon cancer, unspecified location.' },
  { code: 'C61',    title: 'Malignant neoplasm of prostate',                desc: 'ICD-10 code C61 — Prostate cancer.' },
  { code: 'C20',    title: 'Malignant neoplasm of rectum',                  desc: 'ICD-10 code C20 — Rectal cancer.' },
  { code: 'C80.1',  title: 'Malignant (primary) neoplasm, unspecified',     desc: 'ICD-10 code C80.1 — Cancer of unspecified primary site.' },
];

// ── Static routes ─────────────────────────────────────────────
const STATIC_ROUTES = [
  {
    path: '/',
    title: 'myICDCode.com — ICD-10-CM Code Lookup, Plain English',
    desc: 'Free ICD-10-CM diagnosis code lookup. Search 98,000+ codes with plain English explanations. FY 2026 current — updated annually from CMS and CDC.',
    canonical: BASE_URL + '/',
  },
  {
    path: '/browse',
    title: 'Browse ICD-10-CM Codes by Chapter — myICDCode.com',
    desc: 'Browse all 98,186 ICD-10-CM diagnosis codes organized by chapter. 21 chapters covering every medical condition. FY 2026 current.',
    canonical: BASE_URL + '/browse',
  },
  {
    path: '/about',
    title: 'About myICDCode.com — ICD-10 Code Lookup',
    desc: 'About myICDCode.com — a free ICD-10-CM diagnosis code lookup built by StormGlass Interactive Inc. 98,000+ codes with plain English explanations.',
    canonical: BASE_URL + '/about',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — myICDCode.com',
    desc: 'Privacy Policy for myICDCode.com. How we collect, use, and protect your information.',
    canonical: BASE_URL + '/privacy',
  },
  {
    path: '/terms',
    title: 'Terms of Use — myICDCode.com',
    desc: 'Terms of Use for myICDCode.com. Medical disclaimer and usage guidelines.',
    canonical: BASE_URL + '/terms',
  },
  {
    path: '/advertise',
    title: 'Advertise on myICDCode.com — Reach Healthcare Professionals',
    desc: 'Advertise on myICDCode.com and reach medical billers, coders, providers, and patients actively researching diagnosis codes.',
    canonical: BASE_URL + '/advertise',
  },
  // Chapter browse pages
  ...Array.from({ length: 21 }, (_, i) => ({
    path: `/browse?chapter=${i + 1}`,
    title: `ICD-10-CM Chapter ${i + 1} Codes — myICDCode.com`,
    desc: `Browse ICD-10-CM Chapter ${i + 1} diagnosis codes. FY 2026 current. Plain English explanations for every code.`,
    canonical: `${BASE_URL}/browse?chapter=${i + 1}`,
  })),
];

// ── HTML injection ────────────────────────────────────────────
function buildHtml(template, { title, desc, canonical, schema }) {
  let html = template;

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/s,
    `<title>${escapeHtml(title)}</title>`
  );

  // Replace/inject meta description
  if (html.includes('name="description"')) {
    html = html.replace(
      /<meta name="description" content=".*?"/,
      `<meta name="description" content="${escapeHtml(desc)}"`
    );
  }

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content=".*?"/,
    `<meta property="og:title" content="${escapeHtml(title)}"`
  );

  // Replace OG description
  html = html.replace(
    /<meta property="og:description" content=".*?"/,
    `<meta property="og:description" content="${escapeHtml(desc)}"`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href=".*?"/,
    `<link rel="canonical" href="${canonical}"`
  );

  // Replace OG URL
  html = html.replace(
    /<meta property="og:url" content=".*?"/,
    `<meta property="og:url" content="${canonical}"`
  );

  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content=".*?"/,
    `<meta name="twitter:title" content="${escapeHtml(title)}"`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description" content=".*?"/,
    `<meta name="twitter:description" content="${escapeHtml(desc)}"`
  );

  // Inject page-specific JSON-LD schema before </head>
  if (schema) {
    html = html.replace(
      '</head>',
      `  <script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`
    );
  }

  // Inject noscript content for Google (visible without JS)
  const noscript = `
  <noscript>
    <div style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#0f172a">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(desc)}</p>
      <p>Please enable JavaScript to use myICDCode.com, or visit <a href="${BASE_URL}">myicdcode.com</a>.</p>
    </div>
  </noscript>`;

  html = html.replace('<div id="root"></div>', `<div id="root"></div>${noscript}`);

  return html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function writeHtmlFile(distPath, relativePath, html) {
  // Convert URL path to filesystem path
  // /code/I10 -> dist/code/I10/index.html
  // /browse?chapter=1 -> dist/browse/index.html (query params handled client-side)
  let fsPath = relativePath.split('?')[0]; // strip query params
  if (fsPath === '/') fsPath = '/index.html';
  else fsPath = fsPath + '/index.html';

  const fullPath = join(distPath, fsPath.replace(/\//g, '/'));
  const dir = dirname(fullPath);

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(fullPath, html, 'utf-8');
}

// ── Main ──────────────────────────────────────────────────────
function main() {
  console.log('\n🚀 Prerendering static HTML...\n');

  let count = 0;

  // 1. Static routes
  for (const route of STATIC_ROUTES) {
    const html = buildHtml(template, {
      title: route.title,
      desc: route.desc,
      canonical: route.canonical,
      schema: null,
    });
    writeHtmlFile(DIST, route.path, html);
    count++;
  }
  console.log(`  ✓ ${STATIC_ROUTES.length} static pages`);

  // 2. Top code pages
  for (const code of TOP_CODES) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalCode',
      'codeValue': code.code,
      'codingSystem': 'ICD-10-CM',
      'name': code.title,
      'description': code.desc,
      'url': `${BASE_URL}/code/${code.code}`,
      'inDefinedTermSet': {
        '@type': 'DefinedTermSet',
        'name': 'ICD-10-CM',
        'url': BASE_URL,
      },
    };

    const html = buildHtml(template, {
      title: `${code.code} — ${code.title} | myICDCode.com`,
      desc: code.desc,
      canonical: `${BASE_URL}/code/${code.code}`,
      schema,
    });
    writeHtmlFile(DIST, `/code/${code.code}`, html);
    count++;
  }
  console.log(`  ✓ ${TOP_CODES.length} top code pages with MedicalCode schema`);

  console.log(`\n✅ Prerender complete — ${count} HTML files written to dist/`);
  console.log('   Google can now index real content without executing JavaScript.\n');
}

main();
