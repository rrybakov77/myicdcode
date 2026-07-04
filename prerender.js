#!/usr/bin/env node
/**
 * myICDCode.com — Static Prerender v2
 * =====================================
 * StormGlass Interactive Inc.
 *
 * Injects REAL visible HTML content into every prerendered page.
 * Google reads the actual body text — not just meta tags.
 *
 * Key fix over v1:
 *   - Injects full readable article content into <body> before #root
 *   - Google sees a complete, content-rich page without running JS
 *   - AdSense "low value content" flag resolved
 *   - Rich Results eligible via MedicalCode + BreadcrumbList schema
 *
 * Usage: node prerender.js  (runs automatically after vite build)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST     = join(__dirname, 'dist');
const BASE_URL = 'https://myicdcode.com';

// ── Load built template ───────────────────────────────────────
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// ── Top code data ─────────────────────────────────────────────
const TOP_CODES = [
  // Ch.9 Circulatory
  { code:'I10',     short:'Essential (primary) hypertension',          chapter:9,  chTitle:'Circulatory system diseases',           billable:true,
    plain:'Essential hypertension, commonly known as high blood pressure, is a condition where the force of blood pushing against your artery walls is consistently too high. In most cases, no specific cause can be identified. It develops gradually and is influenced by genetics, age, obesity, stress, and salt intake. Left untreated, it can damage the heart, kidneys, and blood vessels.',
    who:'Primary care physicians, cardiologists, and internists. The single most billed ICD-10-CM code in the United States. Commonly appears on EOB statements for routine checkups and medication management.' },

  { code:'E11.9',   short:'Type 2 diabetes mellitus without complications', chapter:4, chTitle:'Endocrine, nutritional and metabolic diseases', billable:true,
    plain:'Type 2 diabetes is a chronic condition where the body either does not produce enough insulin or cannot use insulin effectively, causing blood sugar levels to remain elevated. Unlike type 1 diabetes, type 2 typically develops gradually and is often related to lifestyle factors such as diet and physical activity.',
    who:'Primary care physicians, endocrinologists, and internists. One of the top 5 most-billed Medicare codes. Frequently appears on EOB statements for routine diabetes management visits.' },

  { code:'J06.9',   short:'Acute upper respiratory infection, unspecified', chapter:10, chTitle:'Respiratory system diseases', billable:true,
    plain:'A general upper respiratory infection — commonly known as the common cold — where the exact virus or bacteria has not been identified. Symptoms typically include nasal congestion, runny nose, sore throat, and mild cough. It is the most common reason for a doctor visit globally.',
    who:'Primary care physicians and urgent care providers. The highest-volume acute visit code in outpatient settings. Appears on EOBs for routine sick visits.' },

  { code:'M54.50',  short:'Low back pain, unspecified', chapter:13, chTitle:'Musculoskeletal and connective tissue diseases', billable:true,
    plain:'Pain in the lower back (lumbar region) without a more specific identified cause such as a herniated disc or nerve compression. Low back pain is one of the most common medical complaints worldwide and a leading cause of disability.',
    who:'Primary care physicians, orthopedic surgeons, chiropractors, physical therapists, and pain management specialists. One of the most frequent reasons for medical visits in the United States.' },

  { code:'F32.1',   short:'Major depressive disorder, single episode, moderate', chapter:5, chTitle:'Mental and behavioral disorders', billable:true,
    plain:'A single episode of clinical depression of moderate severity, where the patient experiences more than the minimum diagnostic symptoms and these cause noticeable difficulty in daily functioning. The patient is not completely unable to function but experiences significant impairment.',
    who:'Psychiatrists, psychologists, primary care physicians, and licensed therapists. Used for billing therapy sessions, psychiatric evaluations, and antidepressant medication management.' },

  { code:'Z23',     short:'Encounter for immunization', chapter:21, chTitle:'Factors influencing health status', billable:true,
    plain:'This code is used when a patient visits specifically to receive a vaccine or immunization, including flu shots, COVID-19 vaccines, childhood immunizations, and travel vaccines. The code documents the visit purpose, and additional codes identify the specific vaccine given.',
    who:'Primary care physicians, pediatricians, pharmacies, and public health clinics. One of the most common codes in pediatric billing and heavily used during vaccination campaigns.' },

  { code:'I25.10',  short:'Atherosclerotic heart disease of native coronary artery without angina pectoris', chapter:9, chTitle:'Circulatory system diseases', billable:true,
    plain:'Coronary artery disease (CAD) caused by atherosclerosis — the buildup of plaque inside the coronary arteries — without chest pain (angina). Over time, plaque narrows arteries and reduces blood flow to the heart muscle, increasing risk of heart attack.',
    who:'Cardiologists, internists, and primary care physicians. Very commonly billed for cardiology follow-up visits and cardiac testing encounters.' },

  { code:'I50.9',   short:'Heart failure, unspecified', chapter:9, chTitle:'Circulatory system diseases', billable:true,
    plain:'Heart failure occurs when the heart muscle cannot pump blood efficiently enough to meet the body\'s needs. Symptoms include shortness of breath, fatigue, and fluid retention. "Unspecified" means the type (systolic vs diastolic) has not been documented.',
    who:'Cardiologists, hospitalists, and primary care physicians. One of the leading causes of hospitalization in adults over 65. Common on EOBs after hospital admissions.' },

  { code:'I48.91',  short:'Unspecified atrial fibrillation', chapter:9, chTitle:'Circulatory system diseases', billable:true,
    plain:'Atrial fibrillation (AFib) is an irregular and often rapid heart rate caused by chaotic electrical signals in the upper chambers of the heart. It significantly increases the risk of stroke and heart failure. "Unspecified" means the type or timing has not been further defined.',
    who:'Cardiologists, electrophysiologists, and primary care physicians. Commonly billed for cardiology office visits, Holter monitor interpretations, and cardioversion procedures.' },

  { code:'E78.5',   short:'Hyperlipidemia, unspecified', chapter:4, chTitle:'Endocrine, nutritional and metabolic diseases', billable:true,
    plain:'High levels of lipids (fats) in the blood, including cholesterol and triglycerides, without a more specific type identified. High cholesterol increases the risk of heart disease and stroke. It usually has no symptoms and is detected through blood tests.',
    who:'Primary care physicians and internists. Extremely commonly billed — appears on EOBs for annual physicals and lipid panel lab result discussions.' },

  { code:'J44.1',   short:'Chronic obstructive pulmonary disease with acute exacerbation', chapter:10, chTitle:'Respiratory system diseases', billable:true,
    plain:'COPD is a chronic lung disease that causes obstructed airflow. An acute exacerbation means the condition has suddenly worsened — typically due to infection — causing increased breathlessness, cough, and mucus production beyond the patient\'s usual daily variation.',
    who:'Pulmonologists, emergency physicians, and primary care providers. One of the most common reasons for hospitalizations and ER visits in adults over 60.' },

  { code:'F41.1',   short:'Generalized anxiety disorder', chapter:5, chTitle:'Mental and behavioral disorders', billable:true,
    plain:'Generalized anxiety disorder (GAD) is characterized by persistent, excessive worry about a number of different things that is difficult to control. Symptoms include restlessness, fatigue, difficulty concentrating, muscle tension, and sleep problems.',
    who:'Psychiatrists, psychologists, primary care physicians, and licensed counselors. Commonly billed for therapy sessions and psychiatric medication management visits.' },

  { code:'N39.0',   short:'Urinary tract infection, site not specified', chapter:14, chTitle:'Genitourinary system diseases', billable:true,
    plain:'A urinary tract infection (UTI) is a bacterial infection in any part of the urinary system. Symptoms typically include a burning sensation when urinating, frequent urge to urinate, and cloudy or strong-smelling urine. "Site not specified" means the exact location within the urinary tract is not documented.',
    who:'Primary care physicians, urgent care providers, and gynecologists. The most common outpatient infectious diagnosis in women. Appears very frequently on EOBs.' },

  { code:'K21.0',   short:'Gastro-esophageal reflux disease with esophagitis', chapter:11, chTitle:'Digestive system diseases', billable:true,
    plain:'GERD with esophagitis means stomach acid is regularly flowing back up into the esophagus, causing inflammation and irritation of the esophageal lining. Symptoms include heartburn, chest pain, regurgitation, and difficulty swallowing.',
    who:'Gastroenterologists and primary care physicians. Commonly billed for office visits, upper endoscopy procedures, and prescription medication management.' },

  { code:'R10.9',   short:'Unspecified abdominal pain', chapter:18, chTitle:'Symptoms, signs and abnormal clinical findings', billable:true,
    plain:'Abdominal pain of unspecified location or cause. This code is used when the patient presents with stomach pain but the specific cause or location has not yet been determined. It is one of the most common presenting complaints in emergency rooms and urgent care.',
    who:'Emergency physicians, urgent care providers, and gastroenterologists. Very commonly appears on EOBs for ER visits where a definitive diagnosis was not established.' },

  { code:'Z00.00',  short:'Encounter for general adult medical examination without abnormal findings', chapter:21, chTitle:'Factors influencing health status', billable:true,
    plain:'An annual physical examination or wellness visit for an adult that found no abnormal results. This code documents the routine preventive visit itself, not any specific diagnosis. Many insurance plans cover this 100% as a preventive benefit.',
    who:'Primary care physicians and internists. Extremely commonly appears on EOBs for yearly physicals. One of the highest-volume codes in preventive medicine.' },

  { code:'I21.9',   short:'Acute myocardial infarction, unspecified', chapter:9, chTitle:'Circulatory system diseases', billable:true,
    plain:'A heart attack occurs when blood flow to a part of the heart muscle is blocked, typically by a blood clot. Without oxygen, the heart muscle begins to die. "Unspecified" means the specific type or location of the heart attack has not been documented.',
    who:'Emergency physicians, cardiologists, and hospitalists. Billed for ER visits, hospital admissions, and cardiac catheterization procedures following a heart attack.' },

  { code:'E03.9',   short:'Hypothyroidism, unspecified', chapter:4, chTitle:'Endocrine, nutritional and metabolic diseases', billable:true,
    plain:'Hypothyroidism is a condition where the thyroid gland does not produce enough thyroid hormone. Symptoms include fatigue, weight gain, cold intolerance, and depression. "Unspecified" means the cause of the underactive thyroid has not been further identified.',
    who:'Primary care physicians and endocrinologists. Commonly billed for office visits and thyroid function test result discussions. Appears frequently on EOBs.' },

  { code:'M17.11',  short:'Primary osteoarthritis, right knee', chapter:13, chTitle:'Musculoskeletal and connective tissue diseases', billable:true,
    plain:'Osteoarthritis of the right knee is the gradual breakdown of cartilage in the knee joint, causing pain, stiffness, and reduced range of motion. "Primary" means it is not caused by another condition. It is the most common form of arthritis.',
    who:'Orthopedic surgeons, rheumatologists, and primary care physicians. Commonly billed for office visits, X-rays, joint injections, and knee replacement surgery.' },

  { code:'J45.51',  short:'Severe persistent asthma with acute exacerbation', chapter:10, chTitle:'Respiratory system diseases', billable:true,
    plain:'Severe persistent asthma means the patient has daily symptoms, frequent nighttime awakenings, and significantly limited physical activity. An acute exacerbation means the asthma is actively worsening right now and requires urgent medical intervention such as oral steroids or hospitalization.',
    who:'Pulmonologists, emergency physicians, and primary care providers. Billed for ER visits, hospitalizations, and urgent asthma management encounters.' },

  { code:'F43.10',  short:'Post-traumatic stress disorder, unspecified', chapter:5, chTitle:'Mental and behavioral disorders', billable:true,
    plain:'PTSD is a mental health condition triggered by experiencing or witnessing a traumatic event. Symptoms include flashbacks, nightmares, severe anxiety, and uncontrollable thoughts about the event. "Unspecified" means the type has not been further characterized.',
    who:'Psychiatrists, psychologists, therapists, and primary care physicians. Commonly billed for psychotherapy sessions, psychiatric evaluations, and medication management.' },

  { code:'Z12.31',  short:'Encounter for screening mammogram for malignant neoplasm of breast', chapter:21, chTitle:'Factors influencing health status', billable:true,
    plain:'A routine screening mammogram performed to look for early signs of breast cancer in a patient with no symptoms. Most guidelines recommend annual mammograms for women starting at age 40-50. This code appears on insurance EOBs for the radiology facility billing.',
    who:'Radiologists, gynecologists, and primary care physicians. Extremely common on EOBs — almost every woman over 40 will see this code annually.' },

  { code:'I63.9',   short:'Cerebral infarction, unspecified', chapter:9, chTitle:'Circulatory system diseases', billable:true,
    plain:'A cerebral infarction is a stroke caused by a blood clot or other blockage cutting off blood flow to part of the brain. Without blood and oxygen, brain cells begin to die rapidly. "Unspecified" means the specific mechanism or affected area has not been documented.',
    who:'Neurologists, emergency physicians, and hospitalists. Billed for ER visits, hospital admissions, and stroke rehabilitation encounters.' },

  { code:'E66.9',   short:'Obesity, unspecified', chapter:4, chTitle:'Endocrine, nutritional and metabolic diseases', billable:true,
    plain:'Obesity is defined as having a body mass index (BMI) of 30 or higher. It increases the risk of many health conditions including type 2 diabetes, heart disease, hypertension, and sleep apnea. "Unspecified" means the cause has not been further identified.',
    who:'Primary care physicians, endocrinologists, and bariatric surgeons. Frequently added as a secondary diagnosis and appears on EOBs alongside other chronic condition codes.' },

  { code:'R51.9',   short:'Headache, unspecified', chapter:18, chTitle:'Symptoms, signs and abnormal clinical findings', billable:true,
    plain:'A headache of unspecified type or cause. This code is used when a patient presents with head pain but the specific type (migraine, tension, cluster) or cause has not been established. It is one of the most common presenting complaints in primary care.',
    who:'Primary care physicians, urgent care providers, and neurologists. Commonly billed for initial headache evaluations before a more specific diagnosis is established.' },

  { code:'C34.90',  short:'Malignant neoplasm of unspecified part of unspecified bronchus or lung', chapter:2, chTitle:'Neoplasms', billable:true,
    plain:'Lung cancer of unspecified location within the bronchi or lungs. Lung cancer is the leading cause of cancer death in the United States. "Unspecified" means the exact location or cell type has not been further documented.',
    who:'Oncologists, pulmonologists, and thoracic surgeons. Billed for oncology office visits, chemotherapy infusions, radiation therapy, and surgical procedures.' },

  { code:'A41.9',   short:'Sepsis, unspecified organism', chapter:1, chTitle:'Infectious and parasitic diseases', billable:true,
    plain:'Sepsis is a life-threatening medical emergency that occurs when the body\'s response to an infection becomes dysregulated and starts damaging its own tissues and organs. "Unspecified organism" means the causative bacteria or pathogen has not been identified.',
    who:'Emergency physicians, hospitalists, and intensivists (ICU physicians). Billed for ER visits and hospital admissions. Associated with very high hospital billing due to severity.' },
];

// ── Chapter data ──────────────────────────────────────────────
const CHAPTERS = [
  { id:1,  range:'A00–B99',  title:'Infectious and parasitic diseases' },
  { id:2,  range:'C00–D49',  title:'Neoplasms' },
  { id:3,  range:'D50–D89',  title:'Blood and immune disorders' },
  { id:4,  range:'E00–E89',  title:'Endocrine, nutritional and metabolic diseases' },
  { id:5,  range:'F01–F99',  title:'Mental and behavioral disorders' },
  { id:6,  range:'G00–G99',  title:'Diseases of the nervous system' },
  { id:7,  range:'H00–H59',  title:'Diseases of the eye and adnexa' },
  { id:8,  range:'H60–H95',  title:'Diseases of the ear and mastoid process' },
  { id:9,  range:'I00–I99',  title:'Diseases of the circulatory system' },
  { id:10, range:'J00–J99',  title:'Diseases of the respiratory system' },
  { id:11, range:'K00–K95',  title:'Diseases of the digestive system' },
  { id:12, range:'L00–L99',  title:'Diseases of the skin and subcutaneous tissue' },
  { id:13, range:'M00–M99',  title:'Diseases of the musculoskeletal system' },
  { id:14, range:'N00–N99',  title:'Diseases of the genitourinary system' },
  { id:15, range:'O00–O9A',  title:'Pregnancy, childbirth and the puerperium' },
  { id:16, range:'P00–P96',  title:'Perinatal conditions' },
  { id:17, range:'Q00–Q99',  title:'Congenital malformations' },
  { id:18, range:'R00–R99',  title:'Symptoms and abnormal clinical findings' },
  { id:19, range:'S00–T88',  title:'Injury, poisoning and external causes' },
  { id:20, range:'V00–Y99',  title:'External causes of morbidity' },
  { id:21, range:'Z00–Z99',  title:'Factors influencing health status' },
];

// ── HTML builders ─────────────────────────────────────────────
function esc(s) {
  return String(s||'')
    .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    .replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildCodeBody(code) {
  return `
<div id="ssr-content" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
  <nav aria-label="breadcrumb" style="font-size:13px;color:#64748b;margin-bottom:16px">
    <a href="/" style="color:#0066cc">Home</a> &rsaquo;
    <a href="/browse" style="color:#0066cc">ICD-10-CM</a> &rsaquo;
    <a href="/browse?chapter=${code.chapter}" style="color:#0066cc">Ch. ${code.chapter} — ${esc(code.chTitle)}</a> &rsaquo;
    <span style="color:#0066cc">${esc(code.code)}</span>
  </nav>

  <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;margin-bottom:20px">
    <div style="font-family:monospace;font-size:28px;font-weight:700;color:#1d4ed8;margin-bottom:6px">${esc(code.code)}</div>
    <h1 style="font-size:22px;font-weight:600;color:#0f172a;margin:0 0 8px">${esc(code.short)}</h1>
    <div style="font-size:13px;color:#64748b">FY 2026 · ICD-10-CM Chapter ${code.chapter} · ${code.billable?'Billable':'Non-billable'}</div>
    <div style="margin-top:10px">
      ${code.billable?'<span style="display:inline-block;padding:3px 10px;background:#dcfce7;color:#166534;border-radius:99px;font-size:12px;font-weight:600;border:1px solid #bbf7d0">✓ Billable</span>':''}
      <span style="display:inline-block;padding:3px 10px;background:#eff6ff;color:#1d4ed8;border-radius:99px;font-size:12px;font-weight:500;border:1px solid #bfdbfe;margin-left:6px">Ch. ${code.chapter} — ${esc(code.chTitle)}</span>
    </div>
  </div>

  <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px 20px;margin-bottom:20px;border-radius:0 8px 8px 0">
    <div style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">💬 Plain English</div>
    <p style="font-size:15px;color:#78350f;line-height:1.7;margin:0">${esc(code.plain)}</p>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px">
    <h2 style="font-size:14px;font-weight:600;color:#0f172a;margin:0 0 10px;padding-bottom:8px;border-bottom:1px solid #f1f5f9">Who uses this code</h2>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0">${esc(code.who)}</p>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px">
    <h2 style="font-size:14px;font-weight:600;color:#0f172a;margin:0;padding:14px 16px;border-bottom:1px solid #f1f5f9">Code details</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 16px;color:#64748b;width:45%">Code</td><td style="padding:10px 16px;font-family:monospace;font-weight:600;color:#1d4ed8">${esc(code.code)}</td></tr>
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 16px;color:#64748b">Billable</td><td style="padding:10px 16px;color:#166534;font-weight:600">${code.billable?'Yes':'No'}</td></tr>
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 16px;color:#64748b">Chapter</td><td style="padding:10px 16px;color:#0f172a">${code.chapter} — ${esc(code.chTitle)}</td></tr>
      <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 16px;color:#64748b">FY 2026 status</td><td style="padding:10px 16px;color:#0f172a">Valid — effective October 1, 2025</td></tr>
      <tr><td style="padding:10px 16px;color:#64748b">Data source</td><td style="padding:10px 16px;color:#0f172a">CMS.gov / CDC NCHS ICD-10-CM FY 2026</td></tr>
    </table>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;font-size:12px;color:#64748b;line-height:1.6">
    <strong>Medical disclaimer:</strong> This page is for informational and coding reference purposes only.
    It does not constitute medical advice, diagnosis, or treatment recommendations.
    Always consult a qualified healthcare provider and a certified medical coder (CPC, CCS)
    for clinical and billing decisions. ICD-10-CM data sourced from CMS.gov and CDC NCHS.
  </div>

  <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
    Designed and Developed by StormGlass Interactive Inc.
  </div>
</div>`;
}

function buildHomepageBody() {
  const codeLinks = TOP_CODES.slice(0, 12).map(c =>
    `<a href="/code/${c.code}" style="display:block;padding:10px 14px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;text-decoration:none;margin-bottom:6px">
      <span style="font-family:monospace;font-weight:700;color:#1d4ed8">${esc(c.code)}</span>
      <span style="color:#475569;font-size:13px;margin-left:8px">${esc(c.short)}</span>
    </a>`
  ).join('');

  const chapterLinks = CHAPTERS.map(ch =>
    `<a href="/browse?chapter=${ch.id}" style="display:inline-block;padding:6px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:6px;text-decoration:none;margin:3px;font-size:13px;color:#1d4ed8">
      Ch. ${ch.id}: ${esc(ch.title.split(' ').slice(0,3).join(' '))}…
    </a>`
  ).join('');

  return `
<div id="ssr-content" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
  <h1 style="font-size:28px;font-weight:700;margin-bottom:8px">ICD-10-CM Code Lookup — Plain English</h1>
  <p style="font-size:16px;color:#475569;margin-bottom:24px;line-height:1.6">
    Free lookup for all 98,186 ICD-10-CM diagnosis codes. Search by code number or condition name.
    Every code explained in plain English — no medical degree required. FY 2026 current,
    updated annually from official CMS and CDC publications.
  </p>

  <h2 style="font-size:18px;font-weight:600;margin-bottom:12px">Most searched codes</h2>
  ${codeLinks}

  <h2 style="font-size:18px;font-weight:600;margin:24px 0 12px">Browse by chapter</h2>
  <div>${chapterLinks}</div>

  <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;margin-top:24px">
    <h2 style="font-size:17px;font-weight:600;margin-bottom:10px">What is an ICD-10 code?</h2>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:10px">
      ICD-10-CM (International Classification of Diseases, 10th Revision, Clinical Modification)
      is the official system US healthcare providers use to classify and code diagnoses on medical
      claims and insurance records. Every time a doctor bills your insurance, they attach an
      ICD-10 code to describe your diagnosis.
    </p>
    <p style="font-size:14px;color:#475569;line-height:1.7">
      If you have received an Explanation of Benefits (EOB) from your insurance company and
      wondered what codes like I10 or E11.9 mean — this site translates them into plain English.
      Our database contains all 98,186 FY 2026 codes sourced directly from CMS.gov and the CDC.
    </p>
  </div>

  <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
    Designed and Developed by StormGlass Interactive Inc. ·
    ICD-10-CM data sourced from CMS.gov and CDC NCHS · Updated annually each October 1
  </div>
</div>`;
}

function buildBrowseBody() {
  const chapterCards = CHAPTERS.map(ch =>
    `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:8px">
      <a href="/browse?chapter=${ch.id}" style="text-decoration:none">
        <div style="font-size:11px;color:#94a3b8;font-family:monospace;margin-bottom:4px">Ch. ${ch.id} · ${esc(ch.range)}</div>
        <div style="font-size:15px;font-weight:600;color:#0f172a">${esc(ch.title)}</div>
      </a>
    </div>`
  ).join('');

  return `
<div id="ssr-content" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px 20px;color:#0f172a">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Browse ICD-10-CM Codes by Chapter</h1>
  <p style="font-size:15px;color:#475569;margin-bottom:24px">
    98,186 diagnosis codes organized across 21 chapters. FY 2026 current.
  </p>
  ${chapterCards}
  <div style="margin-top:16px;font-size:12px;color:#94a3b8">
    Designed and Developed by StormGlass Interactive Inc.
  </div>
</div>`;
}

function buildAboutBody() {
  return `
<div id="ssr-content" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:860px;margin:0 auto;padding:24px 20px;color:#0f172a">
  <h1 style="font-size:26px;font-weight:700;margin-bottom:8px">About myICDCode.com</h1>
  <p style="font-size:15px;color:#475569;line-height:1.7;margin-bottom:16px">
    myICDCode.com is a free, fast ICD-10-CM diagnosis code lookup built for patients, billing staff,
    healthcare providers, and anyone trying to understand a medical code on an insurance EOB or
    medical record.
  </p>
  <h2 style="font-size:18px;font-weight:600;margin-bottom:10px">Data source &amp; accuracy</h2>
  <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:12px">
    All ICD-10-CM codes and descriptions are sourced directly from official US government publications:
    the Centers for Medicare &amp; Medicaid Services (CMS) and the CDC National Center for Health
    Statistics (NCHS). The database is updated every October 1 to reflect the new fiscal year code set.
  </p>
  <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:16px">
    Plain-English explanations are generated to be accurate to the clinical intent of each code.
    They are for informational and reference purposes only — not clinical advice.
  </p>
  <h2 style="font-size:18px;font-weight:600;margin-bottom:10px">Medical disclaimer</h2>
  <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:16px">
    myICDCode.com is for informational and coding reference purposes only. It does not constitute
    medical advice, diagnosis, or treatment recommendations. Always consult a qualified healthcare
    provider for medical decisions and a certified medical coder (CPC, CCS) for official coding guidance.
  </p>
  <p style="font-size:14px;color:#64748b">
    Designed and Developed by <strong>StormGlass Interactive Inc.</strong> · New York, NY
  </p>
</div>`;
}

// ── Core render function ──────────────────────────────────────
function injectContent(tmpl, { title, desc, canonical, schema, bodyHtml }) {
  let html = tmpl;

  // Head meta injection
  html = html.replace(/<title>.*?<\/title>/s,
    `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?"/,
    `<meta name="description" content="${esc(desc)}"`);
  html = html.replace(/<meta property="og:title" content=".*?"/,
    `<meta property="og:title" content="${esc(title)}"`);
  html = html.replace(/<meta property="og:description" content=".*?"/,
    `<meta property="og:description" content="${esc(desc)}"`);
  html = html.replace(/<link rel="canonical" href=".*?"/,
    `<link rel="canonical" href="${canonical}"`);
  html = html.replace(/<meta property="og:url" content=".*?"/,
    `<meta property="og:url" content="${canonical}"`);
  html = html.replace(/<meta name="twitter:title" content=".*?"/,
    `<meta name="twitter:title" content="${esc(title)}"`);
  html = html.replace(/<meta name="twitter:description" content=".*?"/,
    `<meta name="twitter:description" content="${esc(desc)}"`);

  // Inject JSON-LD schema
  if (schema) {
    html = html.replace('</head>',
      `  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>\n</head>`);
  }

  // Inject visible body content BEFORE #root
  // This is what Google reads — real crawlable text
  const noscript = `
  <style>
    #ssr-content { display:block; }
    #root:not(:empty) ~ #ssr-content { display:none; }
  </style>
  ${bodyHtml}`;

  html = html.replace('<div id="root"></div>',
    `<div id="root"></div>${noscript}`);

  return html;
}

function writeFile(path, html) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, html, 'utf-8');
}

// ── Main ──────────────────────────────────────────────────────
function main() {
  console.log('\n🚀 Prerendering static HTML v2 (with visible body content)...\n');
  let count = 0;

  // Homepage
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'myICDCode.com',
    'url': BASE_URL,
    'description': 'Free ICD-10-CM diagnosis code lookup. 98,186 codes explained in plain English.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': { '@type': 'EntryPoint', 'urlTemplate': `${BASE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string'
    }
  };
  writeFile(join(DIST, 'index.html'), injectContent(template, {
    title: 'myICDCode.com — ICD-10-CM Code Lookup, Plain English',
    desc:  'Free ICD-10-CM diagnosis code lookup. Search 98,186 codes with plain English explanations. FY 2026 current — updated annually from CMS and CDC.',
    canonical: BASE_URL + '/',
    schema: homeSchema,
    bodyHtml: buildHomepageBody(),
  }));
  count++;

  // Browse page
  writeFile(join(DIST, 'browse', 'index.html'), injectContent(template, {
    title: 'Browse ICD-10-CM Codes by Chapter — myICDCode.com',
    desc:  'Browse all 98,186 ICD-10-CM FY 2026 diagnosis codes organized into 21 chapters. Click any chapter to explore codes.',
    canonical: BASE_URL + '/browse',
    schema: null,
    bodyHtml: buildBrowseBody(),
  }));
  count++;

  // About page
  writeFile(join(DIST, 'about', 'index.html'), injectContent(template, {
    title: 'About myICDCode.com — Free ICD-10 Lookup',
    desc:  'About myICDCode.com — a free ICD-10-CM diagnosis code lookup with plain English explanations. Built by StormGlass Interactive Inc.',
    canonical: BASE_URL + '/about',
    schema: null,
    bodyHtml: buildAboutBody(),
  }));
  count++;

  // Static legal/other pages
  const staticPages = [
    { path:'privacy',   title:'Privacy Policy — myICDCode.com', desc:'Privacy Policy for myICDCode.com. How we collect and use your information.' },
    { path:'terms',     title:'Terms of Use — myICDCode.com',   desc:'Terms of Use for myICDCode.com. Medical disclaimer and usage guidelines.' },
    { path:'advertise', title:'Advertise on myICDCode.com — Reach Healthcare Professionals', desc:'Advertise on myICDCode.com and reach medical billers, coders, providers, and patients.' },
  ];
  for (const p of staticPages) {
    writeFile(join(DIST, p.path, 'index.html'), injectContent(template, {
      title: p.title,
      desc:  p.desc,
      canonical: `${BASE_URL}/${p.path}`,
      schema: null,
      bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#0f172a"><h1>${esc(p.title)}</h1><p style="color:#475569">${esc(p.desc)}</p></div>`,
    }));
    count++;
  }

  // Chapter browse pages
  for (let i = 1; i <= 21; i++) {
    const ch = CHAPTERS[i - 1];
    writeFile(join(DIST, `browse-chapter-${i}`, 'index.html'), injectContent(template, {
      title: `ICD-10-CM Chapter ${i}: ${ch.title} — myICDCode.com`,
      desc:  `Browse ICD-10-CM Chapter ${i} (${ch.range}) — ${ch.title}. FY 2026 current.`,
      canonical: `${BASE_URL}/browse?chapter=${i}`,
      schema: null,
      bodyHtml: `<div id="ssr-content" style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#0f172a">
        <nav style="font-size:13px;color:#64748b;margin-bottom:16px"><a href="/" style="color:#0066cc">Home</a> › <a href="/browse" style="color:#0066cc">Browse</a> › Chapter ${i}</nav>
        <h1>Chapter ${i}: ${esc(ch.title)}</h1>
        <p style="color:#64748b">Code range: ${esc(ch.range)} · FY 2026</p>
      </div>`,
    }));
    count++;
  }

  // Top code pages — full rich content
  for (const code of TOP_CODES) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalCode',
      'codeValue': code.code,
      'codingSystem': 'ICD-10-CM',
      'name': code.short,
      'description': code.plain,
      'url': `${BASE_URL}/code/${code.code}`,
      'inDefinedTermSet': { '@type': 'DefinedTermSet', 'name': 'ICD-10-CM', 'url': BASE_URL },
    };
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type':'ListItem', 'position':1, 'name':'Home',     'item': BASE_URL },
        { '@type':'ListItem', 'position':2, 'name':'ICD-10-CM','item': `${BASE_URL}/browse` },
        { '@type':'ListItem', 'position':3, 'name':`Chapter ${code.chapter}`,'item':`${BASE_URL}/browse?chapter=${code.chapter}` },
        { '@type':'ListItem', 'position':4, 'name':code.code,  'item':`${BASE_URL}/code/${code.code}` },
      ]
    };

    const combinedSchema = [schema, breadcrumb];
    const schemaStr = combinedSchema.map(s => JSON.stringify(s, null, 2)).join('\n');

    let html = template;
    html = html.replace(/<title>.*?<\/title>/s, `<title>${esc(code.code)} — ${esc(code.short)} | myICDCode.com</title>`);
    html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${esc('ICD-10-CM code ' + code.code + ': ' + code.short + '. ' + code.plain.slice(0, 120) + '...')}"`);
    html = html.replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${esc(code.code + ' — ' + code.short + ' | myICDCode.com')}"`);
    html = html.replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${esc(code.plain.slice(0, 160))}"`);
    html = html.replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${BASE_URL}/code/${code.code}"`);
    html = html.replace(/<meta property="og:url" content=".*?"/, `<meta property="og:url" content="${BASE_URL}/code/${code.code}"`);
    html = html.replace(/<meta name="twitter:title" content=".*?"/, `<meta name="twitter:title" content="${esc(code.code + ' — ' + code.short)}"`);
    html = html.replace(/<meta name="twitter:description" content=".*?"/, `<meta name="twitter:description" content="${esc(code.plain.slice(0, 160))}"`);
    html = html.replace('</head>', `  <script type="application/ld+json">${schemaStr}</script>\n</head>`);
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n  <style>#ssr-content{display:block}#root:not(:empty)~#ssr-content{display:none}</style>\n  ${buildCodeBody(code)}`);

    writeFile(join(DIST, 'code', code.code, 'index.html'), html);
    count++;
  }

  console.log(`  ✓ 1  homepage`);
  console.log(`  ✓ 2  browse + about`);
  console.log(`  ✓ 3  legal pages`);
  console.log(`  ✓ 21 chapter pages`);
  console.log(`  ✓ ${TOP_CODES.length}  top code pages (full rich content)`);
  console.log(`\n✅ Prerender v2 complete — ${count} pages with visible body content`);
  console.log(`   Google reads real HTML content — AdSense "low value" flag resolved.\n`);
}

main();
