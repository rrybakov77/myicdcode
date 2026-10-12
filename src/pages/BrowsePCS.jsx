import { useState, useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import styles from './Browse.module.css';

const PCS_SECTIONS = [
  { slug: 'medical_and_surgical',     label: 'Medical and Surgical',                                    char: '0', count: 67416 },
  { slug: 'obstetrics',               label: 'Obstetrics',                                              char: '1', count: 360 },
  { slug: 'placement',                label: 'Placement',                                               char: '2', count: 861 },
  { slug: 'administration',           label: 'Administration',                                          char: '3', count: 1308 },
  { slug: 'measurement_and_monitoring', label: 'Measurement and Monitoring',                            char: '4', count: 442 },
  { slug: 'extracorporeal_or_systemic_assistance_and_performance', label: 'Extracorporeal / Systemic Assistance & Performance', char: '5', count: 51 },
  { slug: 'extracorporeal_or_systemic_therapies', label: 'Extracorporeal / Systemic Therapies',         char: '6', count: 46 },
  { slug: 'osteopathic',              label: 'Osteopathic',                                             char: '7', count: 100 },
  { slug: 'other_procedures',         label: 'Other Procedures',                                        char: '8', count: 92 },
  { slug: 'chiropractic',             label: 'Chiropractic',                                            char: '9', count: 91 },
  { slug: 'imaging',                  label: 'Imaging',                                                 char: 'B', count: 3080 },
  { slug: 'nuclear_medicine',         label: 'Nuclear Medicine',                                        char: 'C', count: 502 },
  { slug: 'radiation_therapy',        label: 'Radiation Therapy',                                       char: 'D', count: 2114 },
  { slug: 'physical_rehabilitation_and_diagnostic_audiology', label: 'Physical Rehabilitation & Diagnostic Audiology', char: 'F', count: 1425 },
  { slug: 'mental_health',            label: 'Mental Health',                                           char: 'G', count: 40 },
  { slug: 'substance_abuse_treatment', label: 'Substance Abuse Treatment',                              char: 'H', count: 66 },
  { slug: 'new_technology',           label: 'New Technology',                                          char: 'X', count: 1362 },
];

export default function BrowsePCS() {
  const [active, setActive] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadSection(sec) {
    if (active?.slug === sec.slug) { setActive(null); setCodes([]); return; }
    setActive(sec);
    setLoading(true);
    try {
      const mod = await import(`../data/pcs_chunks/section_${sec.slug}.js`);
      setCodes(mod[`pcs_${sec.slug}`] || []);
    } catch {
      setCodes([]);
    }
    setLoading(false);
  }

  return (
    <>
      <SEO
        title="Browse ICD-10-PCS Procedure Codes — myICDCode.com"
        description="Browse all 79,256 ICD-10-PCS inpatient procedure codes by section. FY 2027, sourced from CMS."
        canonical="https://myicdcode.com/browse-pcs"
      />
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.pageTitle}>ICD-10-PCS Procedure Codes</h1>
          <p className={styles.pageSub}>
            79,256 inpatient procedure codes · FY 2027 · Click a section to expand codes
          </p>

          <div className={styles.chapterList}>
            {PCS_SECTIONS.map((sec) => (
              <div key={sec.slug} className={styles.chapterBlock}>
                <button
                  className={`${styles.chapterBtn} ${active?.slug === sec.slug ? styles.active : ''}`}
                  onClick={() => loadSection(sec)}
                >
                  <span className={styles.chNum}>{sec.char}</span>
                  <span className={styles.chName}>{sec.label}</span>
                  <span className={styles.chCount}>{sec.count.toLocaleString()} codes</span>
                  <span className={styles.chArrow}>{active?.slug === sec.slug ? '▲' : '▼'}</span>
                </button>

                {active?.slug === sec.slug && (
                  <div className={styles.codeList}>
                    {loading ? (
                      <p className={styles.loadingMsg}>Loading…</p>
                    ) : (
                      codes.slice(0, 200).map((c) => (
                        <a key={c.code} href={`/pcs/${c.code}`} className={styles.codeRow}>
                          <span className={styles.codeNum}>{c.code}</span>
                          <span className={styles.codeLabel}>{c.desc}</span>
                        </a>
                      ))
                    )}
                    {!loading && codes.length > 200 && (
                      <p className={styles.more}>Showing first 200 of {codes.length.toLocaleString()}. Use search to find specific codes.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
