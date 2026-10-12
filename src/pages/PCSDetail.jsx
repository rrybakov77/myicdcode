import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import styles from './PCSDetail.module.css';

const SECTION_MAP = {
  '0': 'Medical and Surgical',
  '1': 'Obstetrics',
  '2': 'Placement',
  '3': 'Administration',
  '4': 'Measurement and Monitoring',
  '5': 'Extracorporeal or Systemic Assistance and Performance',
  '6': 'Extracorporeal or Systemic Therapies',
  '7': 'Osteopathic',
  '8': 'Other Procedures',
  '9': 'Chiropractic',
  'B': 'Imaging',
  'C': 'Nuclear Medicine',
  'D': 'Radiation Therapy',
  'F': 'Physical Rehabilitation and Diagnostic Audiology',
  'G': 'Mental Health',
  'H': 'Substance Abuse Treatment',
  'X': 'New Technology',
};

const SLUG_MAP = {
  '0':'medical_and_surgical','1':'obstetrics','2':'placement',
  '3':'administration','4':'measurement_and_monitoring',
  '5':'extracorporeal_or_systemic_assistance_and_performance',
  '6':'extracorporeal_or_systemic_therapies','7':'osteopathic',
  '8':'other_procedures','9':'chiropractic','B':'imaging',
  'C':'nuclear_medicine','D':'radiation_therapy',
  'F':'physical_rehabilitation_and_diagnostic_audiology',
  'G':'mental_health','H':'substance_abuse_treatment','X':'new_technology',
};

// Character position labels by section
const CHAR_LABELS = {
  '0': ['Section','Body System','Root Operation','Body Part','Approach','Device','Qualifier'],
  '1': ['Section','Body System','Root Operation','Body Part','Approach','Device','Qualifier'],
  '2': ['Section','Body System','Root Operation','Body Region','Approach','Device','Qualifier'],
  '3': ['Section','Body System','Root Operation','Body System / Region','Approach','Substance','Qualifier'],
  '4': ['Section','Body System','Root Operation','Body System','Approach','Function / Device','Qualifier'],
  '5': ['Section','Body System','Root Operation','Body System','Duration','Function','Qualifier'],
  '6': ['Section','Body System','Root Operation','Body System','Duration','Qualifier','Qualifier'],
  '7': ['Section','Body System','Root Operation','Body Region','Approach','Method','Qualifier'],
  '8': ['Section','Body System','Root Operation','Body Region','Approach','Method','Qualifier'],
  '9': ['Section','Body System','Root Operation','Body Region','Approach','Method','Qualifier'],
  'B': ['Section','Body System','Root Type','Body Part','Contrast','Qualifier','Qualifier'],
  'C': ['Section','Body System','Root Type','Body Part','Radionuclide','Qualifier','Qualifier'],
  'D': ['Section','Body System','Modality','Treatment Site','Modality Qualifier','Isotope','Qualifier'],
  'F': ['Section','Section Qualifier','Root Type','Body System / Region','Type Qualifier','Equipment','Qualifier'],
  'G': ['Section','Body System','Root Type','Type Qualifier','Qualifier','Qualifier','Qualifier'],
  'H': ['Section','Body System','Root Type','Type Qualifier','Qualifier','Qualifier','Qualifier'],
  'X': ['Section','Body System','Root Operation','Body Part','Approach','Device / Substance / Technology','Qualifier'],
};

export default function PCSDetail() {
  const { code } = useParams();
  const upperCode = code?.toUpperCase();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const ch = upperCode?.[0] || '0';
        const slug = SLUG_MAP[ch] || 'medical_and_surgical';
        const mod = await import(`../data/pcs_chunks/section_${slug}.js`);
        const allCodes = mod[`pcs_${slug}`] || [];
        const found = allCodes.find(c => c.code === upperCode);
        if (!cancelled) { setEntry(found || null); setLoading(false); }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    if (upperCode) load();
    return () => { cancelled = true; };
  }, [upperCode]);

  if (loading) return (
    <div className={styles.loadingPage}>
      <div className={styles.spinner} />
      <p>Loading procedure code…</p>
    </div>
  );

  if (!entry) return (
    <div className={styles.notFoundPage}>
      <SEO title={`PCS Code ${upperCode} Not Found`} description="This ICD-10-PCS procedure code was not found in the FY 2027 database." />
      <div className={styles.notFoundInner}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1>Procedure Code Not Found</h1>
        <p>Code <strong>{upperCode}</strong> is not in the FY 2027 ICD-10-PCS database.</p>
        <Link to="/browse-pcs" className={styles.backBtn}>Browse Procedure Codes →</Link>
      </div>
    </div>
  );

  const chars = upperCode.split('');
  const sectionChar = chars[0];
  const section = SECTION_MAP[sectionChar] || 'Unknown Section';
  const labels = CHAR_LABELS[sectionChar] || Array.from({length:7}, (_,i) => `Character ${i+1}`);

  return (
    <>
      <SEO
        title={`${upperCode} ICD-10-PCS — ${entry.desc.slice(0,80)}`}
        description={`ICD-10-PCS procedure code ${upperCode}: ${entry.desc}. Section: ${section}. FY 2027.`}
        canonical={`https://myicdcode.com/pcs/${upperCode}`}
      />

      <div className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumb} aria-label="breadcrumb">
              <Link to="/">Home</Link>
              <span className={styles.sep}>›</span>
              <Link to="/browse-pcs">Procedure Codes</Link>
              <span className={styles.sep}>›</span>
              <span>{upperCode}</span>
            </nav>
            <div className={styles.heroBadgeRow}>
              <span className={styles.pcsBadge}>ICD-10-PCS</span>
              <span className={styles.fyBadge}>FY 2027</span>
            </div>
            <h1 className={styles.codeTitle}>{upperCode}</h1>
            <p className={styles.codeDesc}>{entry.desc}</p>
            <p className={styles.sectionLine}>
              <span className={styles.sectionDot} />
              Section <strong>{sectionChar}</strong> — {section}
            </p>
          </div>
        </header>

        <div className={styles.content}>

          {/* 7-character breakdown */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>7-Character Code Structure</h2>
            <div className={styles.charGrid}>
              {chars.map((ch, i) => (
                <div key={i} className={styles.charCell}>
                  <span className={styles.charPos}>Position {i + 1}</span>
                  <span className={styles.charValue}>{ch}</span>
                  <span className={styles.charLabel}>{labels[i]}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick facts */}
          <section className={styles.factsGrid}>
            <div className={styles.factCard}>
              <span className={styles.factLabel}>Code System</span>
              <span className={styles.factValue}>ICD-10-PCS</span>
            </div>
            <div className={styles.factCard}>
              <span className={styles.factLabel}>Fiscal Year</span>
              <span className={styles.factValue}>FY 2027</span>
            </div>
            <div className={styles.factCard}>
              <span className={styles.factLabel}>Effective Date</span>
              <span className={styles.factValue}>October 1, 2026</span>
            </div>
            <div className={styles.factCard}>
              <span className={styles.factLabel}>Code Type</span>
              <span className={styles.factValue}>Inpatient Procedure</span>
            </div>
          </section>

          {/* About PCS */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>About ICD-10-PCS</h2>
            <p className={styles.cardText}>
              ICD-10-PCS (Procedure Coding System) is used to code inpatient procedures in US hospitals.
              Every code is exactly 7 characters, each character drawn from a specific set of values for
              that position within the section. The system was designed to be complete, expandable, and
              multi-axial — meaning each character retains consistent meaning within a section.
            </p>
            <p className={styles.cardText}>
              PCS codes are reported on <strong>UB-04 / Form CMS-1450</strong> claims for inpatient
              hospital stays and are required for Medicare and Medicaid inpatient billing.
            </p>
          </section>

          <Link to="/browse-pcs" className={styles.browseLink}>← Browse all Procedure Codes</Link>
        </div>
      </div>
    </>
  );
}
