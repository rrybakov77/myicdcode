#!/usr/bin/env node
/**
 * myICDCode.com — Static Prerender v3
 * =====================================
 * StormGlass Interactive Inc.
 *
 * Generates static HTML for all key routes.
 * Guarantees GA4 + AdSense tags are present in every page.
 * Injects visible body content so Google can index real text.
 *
 * Usage: node prerender.js  (runs automatically after vite build)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST     = join(__dirname, 'dist');
const BASE_URL = 'https://myicdcode.com';

// ── Tracking tags — always injected into every page ───────────
const TRACKING_TAGS = `
  <!-- Google Analytics GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H19C2ZC6XC"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-H19C2ZC6XC');
  </script>
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7937609722850741" crossorigin="anonymous"></script>`;

// ── Load built template ───────────────────────────────────────
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// ── Top code data ─────────────────────────────────────────────
const TOP_CODES = [
  { code:'I10',     short:'Essential (primary) hypertension',                                    chapter:9,  chTitle:'Circulatory system diseases',                    billable:true,
    plain:'Essential hypertension, commonly known as high blood pressure, is a condition where the force of blood pushing against your artery walls is consistently too high. In most cases, no specific cause can be identified. It develops gradually and is influenced by genetics, age, obesity, stress, and salt intake. Left untreated, it can damage the heart, kidneys, and blood vessels.',
    who:'Primary care physicians, cardiologists, and internists. The single most billed ICD-10-CM code in the United States. Commonly appears on EOB statements for routine checkups and medication management.' },
  { code:'E11.9',   short:'Type 2 diabetes mellitus without complications',                      chapter:4,  chTitle:'Endocrine, nutritional and metabolic diseases',   billable:true,
    plain:'Type 2 diabetes is a chronic condition where the body either does not produce enough insulin or cannot use insulin effectively, causing blood sugar levels to remain elevated. Unlike type 1 diabetes, type 2 typically develops gradually and is often related to lifestyle factors such as diet and physical activity.',
    who:'Primary care physicians, endocrinologists, and internists. One of the top 5 most-billed Medicare codes. Frequently appears on EOB statements for routine diabetes management visits.' },
  { code:'J06.9',   short:'Acute upper respiratory infection, unspecified',                      chapter:10, chTitle:'Respiratory system diseases',                     billable:true,
    plain:'A general upper respiratory infection — commonly known as the common cold — where the exact virus or bacteria has not been identified. Symptoms typically include nasal congestion, runny nose, sore throat, and mild cough. It is the most common reason for a doctor visit globally.',
    who:'Primary care physicians and urgent care providers. The highest-volume acute visit code in outpatient settings. Appears on EOBs for routine sick visits.' },
  { code:'M54.50',  short:'Low back pain, unspecified',                                          chapter:13, chTitle:'Musculoskeletal and connective tissue diseases',   billable:true,
    plain:'Pain in the lower back (lumbar region) without a more specific identified cause such as a herniated disc or nerve compression. Low back pain is one of the most common medical complaints worldwide and a leading cause of disability.',
    who:'Primary care physicians, orthopedic surgeons, chiropractors, physical therapists, and pain management specialists.' },
  { code:'F32.1',   short:'Major depressive disorder, single episode, moderate',                 chapter:5,  chTitle:'Mental and behavioral disorders',                 billable:true,
    plain:'A single episode of clinical depression of moderate severity, where the patient experiences more than the minimum diagnostic symptoms and these cause noticeable difficulty in daily functioning.',
    who:'Psychiatrists, psychologists, primary care physicians, and licensed therapists. Used for billing therapy sessions, psychiatric evaluations, and antidepressant medication management.' },
  { code:'Z23',     short:'Encounter for immunization',                                          chapter:21, chTitle:'Factors influencing health status',               billable:true,
    plain:'This code is used when a patient visits specifically to receive a vaccine or immunization, including flu shots, COVID-19 vaccines, childhood immunizations, and travel vaccines.',
    who:'Primary care physicians, pediatricians, pharmacies, and public health clinics. One of the most common codes in pediatric billing.' },
  { code:'I25.10',  short:'Atherosclerotic heart disease of native coronary artery without angina pectoris', chapter:9, chTitle:'Circulatory system diseases',          billable:true,
    plain:'Coronary artery disease (CAD) caused by atherosclerosis — the buildup of plaque inside the coronary arteries — without chest pain (angina). Over time, plaque narrows arteries and reduces blood flow to the heart muscle.',
    who:'Cardiologists, internists, and primary care physicians. Very commonly billed for cardiology follow-up visits and cardiac testing encounters.' },
  { code:'I50.9',   short:'Heart failure, unspecified',                                          chapter:9,  chTitle:'Circulatory system diseases',                    billable:true,
    plain:'Heart failure occurs when the heart muscle cannot pump blood efficiently enough to meet the body\'s needs. Symptoms include shortness of breath, fatigue, and fluid retention.',
    who:'Cardiologists, hospitalists, and primary care physicians. One of the leading causes of hospitalization in adults over 65.' },
  { code:'E78.5',   short:'Hyperlipidemia, unspecified',                                         chapter:4,  chTitle:'Endocrine, nutritional and metabolic diseases',   billable:true,
    plain:'High levels of lipids (fats) in the blood, including cholesterol and triglycerides. High cholesterol increases the risk of heart disease and stroke. It usually has no symptoms and is detected through blood tests.',
    who:'Primary care physicians and internists. Extremely commonly billed — appears on EOBs for annual physicals and lipid panel result discussions.' },
  { code:'J44.1',   short:'Chronic obstructive pulmonary disease with acute exacerbation',       chapter:10, chTitle:'Respiratory system diseases',                     billable:true,
    plain:'COPD is a chronic lung disease that causes obstructed airflow. An acute exacerbation means the condition has suddenly worsened — typically due to infection — causing increased breathlessness, cough, and mucus production.',
    who:'Pulmonologists, emergency physicians, and primary care providers. One of the most common reasons for hospitalizations in adults over 60.' },
  { code:'F41.1',   short:'Generalized anxiety disorder',                                        chapter:5,  chTitle:'Mental and behavioral disorders',                 billable:true,
    plain:'Generalized anxiety disorder (GAD) is characterized by persistent, excessive worry about a number of different things. Symptoms include restlessness, fatigue, difficulty concentrating, muscle tension, and sleep problems.',
    who:'Psychiatrists, psychologists, primary care physicians, and licensed counselors.' },
  { code:'N39.0',   short:'Urinary tract infection, site not specified',                         chapter:14, chTitle:'Genitourinary system diseases',                   billable:true,
    plain:'A urinary tract infection (UTI) is a bacterial infection in any part of the urinary system. Symptoms typically include a burning sensation when urinating, frequent urge to urinate, and cloudy or strong-smelling urine.',
    who:'Primary care physicians, urgent care providers, and gynecologists. The most common outpatient infectious diagnosis in women.' },
  { code:'K21.0',   short:'Gastro-esophageal reflux disease with esophagitis',                  chapter:11, chTitle:'Digestive system diseases',                       billable:true,
    plain:'GERD with esophagitis means stomach acid is regularly flowing back up into the esophagus, causing inflammation. Symptoms include heartburn, chest pain, regurgitation, and difficulty swallowing.',
    who:'Gastroenterologists and primary care physicians. Commonly billed for office visits, upper endoscopy procedures, and prescription medication management.' },
  { code:'R10.9',   short:'Unspecified abdominal pain',                                          chapter:18, chTitle:'Symptoms and abnormal clinical findings',         billable:true,
    plain:'Abdominal pain of unspecified location or cause. This code is used when the patient presents with stomach pain but the specific cause has not yet been determined.',
    who:'Emergency physicians, urgent care providers, and gastroenterologists. Very commonly appears on EOBs for ER visits.' },
  { code:'Z00.00',  short:'Encounter for general adult medical examination without abnormal findings', chapter:21, chTitle:'Factors influencing health status',         billable:true,
    plain:'An annual physical examination or wellness visit for an adult that found no abnormal results. This code documents the routine preventive visit itself, not any specific diagnosis.',
    who:'Primary care physicians and internists. Extremely commonly appears on EOBs for yearly physicals.' },
  { code:'I21.9',   short:'Acute myocardial infarction, unspecified',                            chapter:9,  chTitle:'Circulatory system diseases',                    billable:true,
    plain:'A heart attack occurs when blood flow to a part of the heart muscle is blocked, typically by a blood clot. Without oxygen, the heart muscle begins to die.',
    who:'Emergency physicians, cardiologists, and hospitalists. Billed for ER visits, hospital admissions, and cardiac catheterization procedures.' },
  { code:'E03.9',   short:'Hypothyroidism, unspecified',                                         chapter:4,  chTitle:'Endocrine, nutritional and metabolic diseases',   billable:true,
    plain:'Hypothyroidism is a condition where the thyroid gland does not produce enough thyroid hormone. Symptoms include fatigue, weight gain, cold intolerance, and depression.',
    who:'Primary care physicians and endocrinologists. Commonly billed for office visits and thyroid function test result discussions.' },
  { code:'M17.11',  short:'Primary osteoarthritis, right knee',                                  chapter:13, chTitle:'Musculoskeletal and connective tissue diseases',   billable:true,
    plain:'Osteoarthritis of the right knee is the gradual breakdown of cartilage in the knee joint, causing pain, stiffness, and reduced range of motion.',
    who:'Orthopedic surgeons, rheumatologists, and primary care physicians. Commonly billed for office visits, X-rays, joint injections, and knee replacement surgery.' },
  { code:'J45.51',  short:'Severe persistent asthma with acute exacerbation',                    chapter:10, chTitle:'Respiratory system diseases',                     billable:true,
    plain:'Severe persistent asthma means the patient has daily symptoms and significantly limited physical activity. An acute exacerbation means the asthma is actively worsening and requires urgent medical intervention.',
    who:'Pulmonologists, emergency physicians, and primary care providers. Billed for ER visits, hospitalizations, and urgent asthma management encounters.' },
  { code:'F43.10',  short:'Post-traumatic stress disorder, unspecified',                         chapter:5,  chTitle:'Mental and behavioral disorders',                 billable:true,
    plain:'PTSD is a mental health condition triggered by experiencing or witnessing a traumatic event. Symptoms include flashbacks, nightmares, severe anxiety, and uncontrollable thoughts about the event.',
    who:'Psychiatrists, psychologists, therapists, and primary care physicians. Commonly billed for psychotherapy sessions and psychiatric evaluations.' },
  { code:'Z12.31',  short:'Encounter for screening mammogram for malignant neoplasm of breast',  chapter:21, chTitle:'Factors influencing health status',               billable:true,
    plain:'A routine screening mammogram performed to look for early signs of breast cancer in a patient with no symptoms.',
    who:'Radiologists, gynecologists, and primary care physicians. Extremely common on EOBs — almost every woman over 40 will see this code annually.' },
  { code:'A41.9',   short:'Sepsis, unspecified organism',                                        chapter:1,  chTitle:'Infectious and parasitic diseases',               billable:true,
    plain:'Sepsis is a life-threatening medical emergency that occurs when the body\'s response to an infection becomes dysregulated and starts damaging its own tissues and organs.',
    who:'Emergency physicians, hospitalists, and intensivists (ICU physicians). Associated with very high hospital billing due to severity.' },
  { code:'E66.9',   short:'Obesity, unspecified',                                                chapter:4,  chTitle:'Endocrine, nutritional and metabolic diseases',   billable:true,
    plain:'Obesity is defined as having a body mass index (BMI) of 30 or higher. It increases the risk of many health conditions including type 2 diabetes, heart disease, and sleep apnea.',
    who:'Primary care physicians, endocrinologists, and bariatric surgeons. Frequently appears on EOBs alongside other chronic condition codes.' },
  { code:'R51.9',   short:'Headache, unspecified',                                               chapter:18, chTitle:'Symptoms and abnormal clinical findings',         billable:true,
    plain:'A headache of unspecified type or cause. This code is used when a patient presents with head pain but the specific type or cause has not been established.',
    who:'Primary care physicians, urgent care providers, and neurologists. Commonly billed for initial headache evaluations.' },
  { code:'C34.90',  short:'Malignant neoplasm of unspecified part of unspecified bronchus or lung', chapter:2, chTitle:'Neoplasms',                                    billable:true,
    plain:'Lung cancer of unspecified location within the bronchi or lungs. Lung cancer is the leading cause of cancer death in the United States.',
    who:'Oncologists, pulmonologists, and thoracic surgeons. Billed for oncology office visits, chemotherapy infusions, and radiation therapy.' },
  { code:'I48.91',  short:'Unspecified atrial fibrillation',                                     chapter:9,  chTitle:'Circulatory system diseases',                    billable:true,
    plain:'Atrial fibrillation (AFib) is an irregular and often rapid heart rate caused by chaotic electrical signals in the upper chambers of the heart. It significantly increases the risk of stroke and heart failure.',
    who:'Cardiologists, electrophysiologists, and primary care physicians. Commonly billed for cardiology office visits and Holter monitor interpretations.' },
  { code:'I63.9',   short:'Cerebral infarction, unspecified',                                    chapter:9,  chTitle:'Circulatory system diseases',                    billable:true,
    plain:'A cerebral infarction is a stroke caused by a blood clot cutting off blood flow to part of the brain. Without blood and oxygen, brain cells begin to die rapidly.',
    who:'Neurologists, emergency physicians, and hospitalists. Billed for ER visits, hospital admissions, and stroke rehabilitation.' },
];

const CHAPTERS = [
  {id:1,  range:'A00–B99',  title:'Infectious and parasitic diseases'},
  {id:2,  range:'C00–D49',  title:'Neoplasms'},
  {id:3,  range:'D50–D89',  title:'Blood and immune disorders'},
  {id:4,  range:'E00–E89',  title:'Endocrine, nutritional and metabolic diseases'},
  {id:5,  range:'F01–F99',  title:'Mental and behavioral disorders'},
  {id:6,  range:'G00–G99',  title:'Diseases of the nervous system'},
  {id:7,  range:'H00–H59',  title:'Diseases of the eye and adnexa'},
  {id:8,  range:'H60–H95',  title:'Diseases of the ear and mastoid process'},
  {id:9,  range:'I00–I99',  title:'Diseases of the circulatory system'},
  {id:10, range:'J00–J99',  title:'Diseases of the respiratory system'},
  {id:11, range:'K00–K95',  title:'Diseases of the digestive system'},
  {id:12, range:'L00–L99',  title:'Diseases of the skin and subcutaneous tissue'},
  {id:13, range:'M00–M99',  title:'Diseases of the musculoskeletal system'},
  {id:14, range:'N00–N99',  title:'Diseases of the genitourinary system'},
  {id:15, range:'O00–O9A',  title:'Pregnancy, childbirth and the puerperium'},
  {id:16, range:'P00–P96',  title:'Perinatal conditions'},
  {id:17, range:'Q00–Q99',  title:'Congenital malformations'},
  {id:18, range:'R00–R99',  title:'Symptoms and abnormal clinical findings'},
  {id:19, range:'S00–T88',  title:'Injury, poisoning and external causes'},
  {id:20, range:'V00–Y99',  title:'External causes of morbidity'},
  {id:21, range:'Z00–Z99',  title:'Factors influencing health status'},
];

// ── Helpers ───────────────────────────────────────────────────
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function ensureTracking(html) {
  // Always inject GA4 + AdSense — remove any existing versions first then re-add
  // Strip existing GA4 if present (in case it's there but malformed)
  html = html.replace(/<!-- Google Analytics.*?<\/script>/gs, '');
  html = html.replace(/<!-- Google tag.*?<\/script>\s*<script>.*?<\/script>/gs, '');
  html = html.replace(/<!-- Google AdSense.*?<\/script>/gs, '');
  // Inject fresh before </head>
  html = html.replace('</head>', TRACKING_TAGS + '\n  </head>');
  return html;
}

function injectMeta(html, { title, desc, canonical, schema, bodyHtml }) {
  // Title
  html = html.replace(/<title>.*?<\/title>/s,
    `<title>${esc(title)}</title>`);
  // Meta description
  html = html.replace(/<meta name="description" content=".*?"/,
    `<meta name="description" content="${esc(desc)}"`);
  // OG tags
  html = html.replace(/<meta property="og:title" content=".*?"/,
    `<meta property="og:title" content="${esc(title)}"`);
  html = html.replace(/<meta property="og:description" content=".*?"/,
    `<meta property="og:description" content="${esc(desc)}"`);
  html = html.replace(/<meta property="og:url" content=".*?"/,
    `<meta property="og:url" content="${canonical}"`);
  // Canonical
  html = html.replace(/<link rel="canonical" href=".*?"/,
    `<link rel="canonical" href="${canonical}"`);
  // Twitter
  html = html.replace(/<meta name="twitter:title" content=".*?"/,
    `<meta name="twitter:title" content="${esc(title)}"`);
  html = html.replace(/<meta name="twitter:description" content=".*?"/,
    `<meta name="twitter:description" content="${esc(desc)}"`);
  // Schema
  if (schema) {
    const schemaStr = Array.isArray(schema)
      ? schema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ')
      : `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
    html = html.replace('</head>', `  ${schemaStr}\n</head>`);
  }
  // GA4 + AdSense — always present
  html = ensureTracking(html);
  // Visible body content — hidden by default, shown only for search bots (no-JS)
  // This prevents the white flash when React mounts over the SSR content
  if (bodyHtml) {
    html = html.replace('<div id="root"></div>',
      `<div id="root"></div>
  <style>
    #ssr-content{display:none}
    @media(scripting:none){#ssr-content{display:block!important}}
  </style>
  ${bodyHtml}`);
  }
  return html;
}

function writeFile(path, html) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, html, 'utf-8');
}

// ── Body HTML builders ────────────────────────────────────────
function codeBody(c) {
  return `<div id="ssr-content" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
  <nav style="font-size:13px;color:#64748b;margin-bottom:16px">
    <a href="/" style="color:#0066cc">Home</a> › <a href="/browse" style="color:#0066cc">ICD-10-CM</a> › <a href="/browse?chapter=${c.chapter}" style="color:#0066cc">Ch. ${c.chapter}</a> › <span style="color:#0066cc">${esc(c.code)}</span>
  </nav>
  <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;margin-bottom:20px">
    <div style="font-family:monospace;font-size:26px;font-weight:700;color:#1d4ed8">${esc(c.code)}</div>
    <h1 style="font-size:21px;font-weight:600;color:#0f172a;margin:6px 0 8px">${esc(c.short)}</h1>
    <div style="font-size:13px;color:#64748b">FY 2026 · ICD-10-CM Chapter ${c.chapter} · ${c.billable?'Billable':''}</div>
  </div>
  <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px 20px;margin-bottom:20px;border-radius:0 8px 8px 0">
    <div style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">💬 Plain English</div>
    <p style="font-size:15px;color:#78350f;line-height:1.7;margin:0">${esc(c.plain)}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px">
    <h2 style="font-size:14px;font-weight:600;color:#0f172a;margin:0 0 10px;padding-bottom:8px;border-bottom:1px solid #f1f5f9">Who uses this code</h2>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0">${esc(c.who)}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px">
    <h2 style="font-size:14px;font-weight:600;color:#0f172a;margin:0;padding:14px 16px;border-bottom:1px solid #f1f5f9">Code details</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:9px 16px;color:#64748b;width:45%">Code</td><td style="padding:9px 16px;font-family:monospace;font-weight:700;color:#1d4ed8">${esc(c.code)}</td></tr>
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:9px 16px;color:#64748b">Billable</td><td style="padding:9px 16px;color:#166534;font-weight:600">${c.billable?'Yes':'No'}</td></tr>
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:9px 16px;color:#64748b">Chapter</td><td style="padding:9px 16px">${c.chapter} — ${esc(c.chTitle)}</td></tr>
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:9px 16px;color:#64748b">FY 2026 status</td><td style="padding:9px 16px">Valid — effective October 1, 2025</td></tr>
      <tr><td style="padding:9px 16px;color:#64748b">Source</td><td style="padding:9px 16px">CMS.gov / CDC NCHS ICD-10-CM FY 2026</td></tr>
    </table>
  </div>
  <p style="font-size:12px;color:#64748b;line-height:1.6;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
    <strong>Medical disclaimer:</strong> For informational and coding reference only — not medical advice.
    Always consult a qualified healthcare provider and certified medical coder (CPC, CCS) for clinical decisions.
    ICD-10-CM data sourced from CMS.gov and CDC NCHS. Designed and Developed by StormGlass Interactive Inc.
  </p>
</div>`;
}

function homepageBody() {
  const links = TOP_CODES.slice(0,12).map(c =>
    `<a href="/code/${c.code}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;text-decoration:none;margin-bottom:6px">
      <span style="font-family:monospace;font-weight:700;color:#1d4ed8;min-width:60px">${esc(c.code)}</span>
      <span style="color:#475569;font-size:13px">${esc(c.short)}</span>
    </a>`).join('');
  const chapters = CHAPTERS.map(ch =>
    `<a href="/browse?chapter=${ch.id}" style="display:inline-block;padding:5px 11px;background:#fff;border:1px solid #e2e8f0;border-radius:6px;text-decoration:none;margin:3px;font-size:12px;color:#1d4ed8">Ch.${ch.id}: ${esc(ch.title.split(' ').slice(0,3).join(' '))}</a>`).join('');
  return `<div id="ssr-content" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
  <h1 style="font-size:28px;font-weight:700;margin-bottom:8px">ICD-10-CM Code Lookup — Plain English</h1>
  <p style="font-size:16px;color:#475569;margin-bottom:20px;line-height:1.6">Free lookup for all 98,186 ICD-10-CM diagnosis codes. Search by code or condition. Every code explained in plain English. FY 2026 current, updated annually from official CMS and CDC publications.</p>
  <h2 style="font-size:18px;font-weight:600;margin-bottom:12px">Most searched codes</h2>
  ${links}
  <h2 style="font-size:18px;font-weight:600;margin:20px 0 10px">Browse by chapter</h2>
  <div>${chapters}</div>
  <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;margin-top:20px">
    <h2 style="font-size:17px;font-weight:600;margin-bottom:10px">What is an ICD-10 code?</h2>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:10px">ICD-10-CM is the official system US healthcare providers use to classify diagnoses on medical claims. Every time a doctor bills your insurance, they attach an ICD-10 code.</p>
    <p style="font-size:14px;color:#475569;line-height:1.7">If you received an Explanation of Benefits (EOB) and wondered what codes like I10 or E11.9 mean — this site translates them into plain English. Our database contains all 98,186 FY 2026 codes sourced from CMS.gov and the CDC.</p>
  </div>
  <p style="margin-top:16px;font-size:12px;color:#94a3b8">Designed and Developed by StormGlass Interactive Inc. · ICD-10-CM data from CMS.gov and CDC NCHS · Updated annually October 1</p>
</div>`;
}

// ── Main ──────────────────────────────────────────────────────
function main() {
  console.log('\n🚀 Prerendering static HTML v3 (GA4 always injected)...\n');
  let count = 0;

  // Homepage
  writeFile(join(DIST, 'index.html'), injectMeta(template, {
    title: 'myICDCode.com — ICD-10-CM Code Lookup, Plain English',
    desc: 'Free ICD-10-CM diagnosis code lookup. Search 98,186 codes with plain English explanations. FY 2026 current — updated annually from CMS and CDC.',
    canonical: BASE_URL + '/',
    schema: { '@context':'https://schema.org','@type':'WebSite','name':'myICDCode.com','url':BASE_URL,
      'potentialAction':{'@type':'SearchAction','target':{'@type':'EntryPoint','urlTemplate':`${BASE_URL}/search?q={search_term_string}`},'query-input':'required name=search_term_string'}},
    bodyHtml: homepageBody(),
  }));
  count++;
  console.log('  ✓ Homepage');

  // Browse
  writeFile(join(DIST, 'browse', 'index.html'), injectMeta(template, {
    title: 'Browse ICD-10-CM Codes by Chapter — myICDCode.com',
    desc: 'Browse all 98,186 ICD-10-CM FY 2026 diagnosis codes organized into 21 chapters.',
    canonical: BASE_URL + '/browse',
    schema: null,
    bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
      <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Browse ICD-10-CM Codes by Chapter</h1>
      <p style="color:#475569;margin-bottom:20px">98,186 codes across 21 chapters. FY 2026 current.</p>
      ${CHAPTERS.map(ch => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:8px"><a href="/browse?chapter=${ch.id}" style="text-decoration:none"><div style="font-size:11px;color:#94a3b8;font-family:monospace">Ch. ${ch.id} · ${esc(ch.range)}</div><div style="font-size:15px;font-weight:600;color:#0f172a">${esc(ch.title)}</div></a></div>`).join('')}
    </div>`,
  }));
  count++;

  // About
  writeFile(join(DIST, 'about', 'index.html'), injectMeta(template, {
    title: 'About myICDCode.com — Free ICD-10 Code Lookup',
    desc: 'About myICDCode.com — free ICD-10-CM lookup with plain English explanations. Built by StormGlass Interactive Inc.',
    canonical: BASE_URL + '/about',
    schema: null,
    bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:860px;margin:0 auto;padding:24px 20px;color:#0f172a">
      <h1 style="font-size:26px;font-weight:700;margin-bottom:12px">About myICDCode.com</h1>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin-bottom:14px">myICDCode.com is a free, fast ICD-10-CM diagnosis code lookup built for patients, billing staff, healthcare providers, and anyone trying to understand a medical code on an insurance EOB or medical record.</p>
      <h2 style="font-size:18px;font-weight:600;margin-bottom:8px">Data source</h2>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:14px">All ICD-10-CM codes are sourced from CMS.gov and the CDC National Center for Health Statistics. Updated annually every October 1.</p>
      <h2 style="font-size:18px;font-weight:600;margin-bottom:8px">Medical disclaimer</h2>
      <p style="font-size:14px;color:#475569;line-height:1.7">For informational and coding reference only — not medical advice. Always consult a qualified healthcare provider for medical decisions.</p>
      <p style="margin-top:16px;font-size:13px;color:#64748b">Designed and Developed by <strong>StormGlass Interactive Inc.</strong> · New York, NY</p>
    </div>`,
  }));
  count++;

  // Legal pages
  for (const p of [
    { path:'privacy',   title:'Privacy Policy — myICDCode.com',   desc:'Privacy Policy for myICDCode.com.' },
    { path:'terms',     title:'Terms of Use — myICDCode.com',     desc:'Terms of Use for myICDCode.com. Medical disclaimer and usage guidelines.' },
    { path:'advertise', title:'Advertise on myICDCode.com',       desc:'Advertise on myICDCode.com — reach medical billers, coders, providers, and patients.' },
  ]) {
    writeFile(join(DIST, p.path, 'index.html'), injectMeta(template, {
      title: p.title, desc: p.desc,
      canonical: `${BASE_URL}/${p.path}`,
      schema: null,
      bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#0f172a"><h1>${esc(p.title)}</h1><p style="color:#475569;margin-top:8px">${esc(p.desc)}</p></div>`,
    }));
    count++;
  }

  // New Codes page
  writeFile(join(DIST, 'new-codes', 'index.html'), injectMeta(template, {
    title: 'New ICD-10-CM Codes | FY 2027 Updates – myICDCode.com',
    desc: 'FY 2027 ICD-10-CM update: 190 new codes, 30 deleted, 4 revised. Effective October 1, 2026. Full annual history back to FY 2023.',
    canonical: BASE_URL + '/new-codes',
    schema: null,
    bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
      <h1 style="font-size:26px;font-weight:700;margin-bottom:8px">ICD-10-CM Code Updates — FY 2027</h1>
      <p style="color:#475569;margin-bottom:16px;font-size:15px">Effective <strong>October 1, 2026</strong>. The FY 2027 update adds <strong>190 new billable codes</strong>, removes 30, and revises 4 descriptions. Total: 74,879 billable codes.</p>
      <h2 style="font-size:18px;font-weight:600;margin:16px 0 8px">Where New Codes Landed</h2>
      <ul style="list-style:none;padding:0;margin:0">
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:8px"><strong>Ch. 19 – Injury &amp; Poisoning</strong> — +60 codes. Expanded toxic-effect coding.</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:8px"><strong>Ch. 15 – Pregnancy &amp; Childbirth</strong> — +44 codes. Vanishing twin syndrome (O31.4), ectopic pregnancy expansions.</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:8px"><strong>Ch. 13 – Musculoskeletal</strong> — +31 codes. VEXAS syndrome (M04.3), plantar fasciitis laterality.</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:8px"><strong>Ch. 21 – Z Codes</strong> — +16 codes. Burn pit exposure history; new underweight BMI codes Z68.18–Z68.19.</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:8px"><strong>Ch. 9 – Circulatory</strong> — +12 codes. Dilated cardiomyopathy specificity; I42.0 becomes non-billable parent.</li>
      </ul>
      <h2 style="font-size:18px;font-weight:600;margin:20px 0 8px">Annual Update History</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f8fafc;text-align:left"><th style="padding:10px;border:1px solid #e2e8f0">FY</th><th style="padding:10px;border:1px solid #e2e8f0">Effective</th><th style="padding:10px;border:1px solid #e2e8f0">Added</th><th style="padding:10px;border:1px solid #e2e8f0">Deleted</th><th style="padding:10px;border:1px solid #e2e8f0">Total</th></tr></thead>
        <tbody>
          <tr style="background:#eff6ff"><td style="padding:10px;border:1px solid #e2e8f0"><strong>FY 2027</strong> ★</td><td style="padding:10px;border:1px solid #e2e8f0">Oct 1, 2026</td><td style="padding:10px;border:1px solid #e2e8f0;color:#22a555">+190</td><td style="padding:10px;border:1px solid #e2e8f0;color:#dc3545">-30</td><td style="padding:10px;border:1px solid #e2e8f0">74,879</td></tr>
          <tr><td style="padding:10px;border:1px solid #e2e8f0">FY 2026</td><td style="padding:10px;border:1px solid #e2e8f0">Oct 1, 2025</td><td style="padding:10px;border:1px solid #e2e8f0;color:#22a555">+487</td><td style="padding:10px;border:1px solid #e2e8f0;color:#dc3545">-28</td><td style="padding:10px;border:1px solid #e2e8f0">98,186</td></tr>
          <tr><td style="padding:10px;border:1px solid #e2e8f0">FY 2025</td><td style="padding:10px;border:1px solid #e2e8f0">Oct 1, 2024</td><td style="padding:10px;border:1px solid #e2e8f0;color:#22a555">+395</td><td style="padding:10px;border:1px solid #e2e8f0;color:#dc3545">-25</td><td style="padding:10px;border:1px solid #e2e8f0">97,699</td></tr>
          <tr><td style="padding:10px;border:1px solid #e2e8f0">FY 2024</td><td style="padding:10px;border:1px solid #e2e8f0">Oct 1, 2023</td><td style="padding:10px;border:1px solid #e2e8f0;color:#22a555">+395</td><td style="padding:10px;border:1px solid #e2e8f0;color:#dc3545">-22</td><td style="padding:10px;border:1px solid #e2e8f0">97,304</td></tr>
          <tr><td style="padding:10px;border:1px solid #e2e8f0">FY 2023</td><td style="padding:10px;border:1px solid #e2e8f0">Oct 1, 2022</td><td style="padding:10px;border:1px solid #e2e8f0;color:#22a555">+1,176</td><td style="padding:10px;border:1px solid #e2e8f0;color:#dc3545">-250</td><td style="padding:10px;border:1px solid #e2e8f0">96,909</td></tr>
        </tbody>
      </table>
      <p style="margin-top:16px;font-size:12px;color:#94a3b8">Source: CMS ICD-10 Code Files · cms.gov · Updated each October 1</p>
    </div>`,
  }));
  count++;
  console.log('  ✓ New Codes page');

  // Browse PCS
  writeFile(join(DIST, 'browse-pcs', 'index.html'), injectMeta(template, {
    title: 'Browse ICD-10-PCS Procedure Codes — myICDCode.com',
    desc: 'Browse all 79,256 ICD-10-PCS inpatient procedure codes by section. FY 2027, sourced from CMS.',
    canonical: BASE_URL + '/browse-pcs',
    schema: null,
    bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
      <h1 style="font-size:26px;font-weight:700;margin-bottom:8px">ICD-10-PCS Procedure Codes</h1>
      <p style="color:#475569;margin-bottom:20px;font-size:15px">79,256 inpatient procedure codes across 17 sections. FY 2027 — effective October 1, 2026.</p>
      <p style="font-size:14px;color:#475569;margin-bottom:20px">ICD-10-PCS codes are used for inpatient hospital procedures (not outpatient). Each 7-character code specifies section, body system, root operation, body part, approach, device, and qualifier.</p>
      <ul style="list-style:none;padding:0">
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:6px"><strong>0</strong> — Medical and Surgical (67,416 codes)</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:6px"><strong>1</strong> — Obstetrics (360 codes)</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:6px"><strong>B</strong> — Imaging (3,080 codes)</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:6px"><strong>D</strong> — Radiation Therapy (2,114 codes)</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:6px"><strong>X</strong> — New Technology (1,362 codes)</li>
        <li style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:6px">…and 12 more sections</li>
      </ul>
    </div>`,
  }));
  count++;
  console.log('  ✓ Browse PCS page');

  // DRG Grouper page
  writeFile(join(DIST, 'drg-grouper', 'index.html'), injectMeta(template, {
    title: 'DRG Grouper Tool — Medicare Reimbursement Lookup | myICDCode.com',
    desc: 'Look up MS-DRG assignments and estimate Medicare IPPS inpatient reimbursement. FY 2027 relative weights for 70+ common DRGs.',
    canonical: BASE_URL + '/drg-grouper',
    schema: null,
    bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
      <h1 style="font-size:26px;font-weight:700;margin-bottom:8px">DRG Grouper &amp; Medicare Payment Estimator</h1>
      <p style="color:#475569;margin-bottom:16px;font-size:15px">FY 2027 MS-DRG v44 — 768 Diagnosis Related Groups. Enter your principal diagnosis and complication level to estimate Medicare IPPS inpatient reimbursement. Effective October 1, 2026.</p>
      <h2 style="font-size:18px;font-weight:600;margin:20px 0 8px">How DRG Assignment Works</h2>
      <ol style="padding-left:20px;color:#475569;font-size:14px;line-height:1.8">
        <li><strong>Principal Diagnosis</strong> — ICD-10-CM code selects the Major Diagnostic Category (MDC)</li>
        <li><strong>Procedures</strong> — ICD-10-PCS codes determine surgical vs. medical pathway</li>
        <li><strong>Complication Level</strong> — Secondary diagnoses scored as MCC, CC, or none</li>
        <li><strong>Payment</strong> — DRG Relative Weight × Base Rate ($7,389) = estimated Medicare payment</li>
      </ol>
      <h2 style="font-size:18px;font-weight:600;margin:20px 0 8px">Common MS-DRGs (FY 2027)</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:#f8fafc"><th style="padding:8px;border:1px solid #e2e8f0;text-align:left">DRG</th><th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Description</th><th style="padding:8px;border:1px solid #e2e8f0">Weight</th><th style="padding:8px;border:1px solid #e2e8f0">Est. Payment</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid #e2e8f0">871</td><td style="padding:8px;border:1px solid #e2e8f0">Septicemia or severe sepsis w/o MV &gt;96h w MCC</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center">1.9320</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#15803d">$14,280</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0">291</td><td style="padding:8px;border:1px solid #e2e8f0">Heart failure and shock w MCC</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center">1.2838</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#15803d">$9,487</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0">470</td><td style="padding:8px;border:1px solid #e2e8f0">Major hip and knee joint replacement w/o MCC</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center">1.9289</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#15803d">$14,257</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0">193</td><td style="padding:8px;border:1px solid #e2e8f0">Simple pneumonia and pleurisy w MCC</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center">1.3144</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#15803d">$9,714</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0">682</td><td style="padding:8px;border:1px solid #e2e8f0">Renal failure w MCC</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center">1.4810</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#15803d">$10,950</td></tr>
        </tbody>
      </table>
      <p style="margin-top:16px;font-size:12px;color:#94a3b8">Source: CMS FY 2027 IPPS Final Rule — Table 5. Base rate: $6,848.98 operating + $540.03 capital. Excludes IME, DSH, and outlier adjustments.</p>
    </div>`,
  }));
  count++;
  console.log('  ✓ DRG Grouper page');

  // Code pages
  for (const c of TOP_CODES) {
    const schema = [
      { '@context':'https://schema.org','@type':'MedicalCode','codeValue':c.code,'codingSystem':'ICD-10-CM','name':c.short,'description':c.plain,'url':`${BASE_URL}/code/${c.code}` },
      { '@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
        {'@type':'ListItem','position':1,'name':'Home','item':BASE_URL},
        {'@type':'ListItem','position':2,'name':'ICD-10-CM','item':`${BASE_URL}/browse`},
        {'@type':'ListItem','position':3,'name':`Chapter ${c.chapter}`,'item':`${BASE_URL}/browse?chapter=${c.chapter}`},
        {'@type':'ListItem','position':4,'name':c.code,'item':`${BASE_URL}/code/${c.code}`},
      ]},
    ];
    writeFile(join(DIST, 'code', c.code, 'index.html'), injectMeta(template, {
      title: `${c.code} — ${c.short} | myICDCode.com`,
      desc: `ICD-10-CM code ${c.code}: ${c.short}. ${c.plain.slice(0,120)}... FY 2026.`,
      canonical: `${BASE_URL}/code/${c.code}`,
      schema,
      bodyHtml: codeBody(c),
    }));
    count++;
  }

  console.log(`  ✓ Browse, About, legal pages`);
  console.log(`  ✓ ${TOP_CODES.length} top code pages with MedicalCode + BreadcrumbList schema`);
  console.log(`\n✅ Prerender v3 complete — ${count} pages`);
  console.log(`   GA4 (G-H19C2ZC6XC) + AdSense injected into every page.\n`);
}

main();
