import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import styles from './CodeDetail.module.css';

// PCS section label lookup
const PCS_SECTION_MAP = {
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

// Character position labels for PCS 7-character codes
const PCS_CHAR_LABELS = {
  '0': ['Section', 'Body System', 'Root Operation', 'Body Part', 'Approach', 'Device', 'Qualifier'],
};
const DEFAULT_LABELS = ['Character 1', 'Character 2', 'Character 3', 'Character 4', 'Character 5', 'Character 6', 'Character 7'];

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
        // Dynamically import the right section chunk
        const section = upperCode?.[0] || '0';
        const sectionSlug = {
          '0': 'medical_and_surgical',
          '1': 'obstetrics',
          '2': 'placement',
          '3': 'administration',
          '4': 'measurement_and_monitoring',
          '5': 'extracorporeal_or_systemic_assistance_and_performance',
          '6': 'extracorporeal_or_systemic_therapies',
          '7': 'osteopathic',
          '8': 'other_procedures',
          '9': 'chiropractic',
          'B': 'imaging',
          'C': 'nuclear_medicine',
          'D': 'radiation_therapy',
          'F': 'physical_rehabilitation_and_diagnostic_audiology',
          'G': 'mental_health',
          'H': 'substance_abuse_treatment',
          'X': 'new_technology',
        }[section] || 'medical_and_surgical';

        const mod = await import(`../data/pcs_chunks/section_${sectionSlug}.js`);
        const key = `pcs_${sectionSlug}`;
        const allCodes = mod[key] || [];
        const found = allCodes.find(c => c.code === upperCode);
        if (!cancelled) {
          setEntry(found || null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    if (upperCode) load();
    return () => { cancelled = true; };
  }, [upperCode]);

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!entry) return (
    <div className={styles.notFound}>
      <SEO title={`PCS Code ${upperCode} Not Found`} description="This ICD-10-PCS procedure code was not found." />
      <h1>PCS Code Not Found</h1>
      <p>Code <strong>{upperCode}</strong> is not in the FY 2027 ICD-10-PCS database.</p>
      <a href="/browse-pcs">Browse Procedure Codes →</a>
    </div>
  );

  const chars = upperCode.split('');
  const labels = DEFAULT_LABELS;
  const section = PCS_SECTION_MAP[chars[0]] || 'Unknown Section';

  return (
    <>
      <SEO
        title={`${upperCode} ICD-10-PCS — ${entry.desc}`}
        description={`ICD-10-PCS procedure code ${upperCode}: ${entry.desc}. Section: ${section}.`}
        canonical={`https://myicdcode.com/pcs/${upperCode}`}
      />
      <div className={styles.page}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <a href="/">Home</a> › <a href="/browse-pcs">Procedure Codes</a> › {upperCode}
          </nav>

          <div className={styles.codeHeader}>
            <span className={styles.codeBadge} style={{background:'var(--accent-2, #6366f1)'}}>PCS</span>
            <h1 className={styles.codeTitle}>{upperCode}</h1>
          </div>

          <p className={styles.codeDesc}>{entry.desc}</p>
          <p className={styles.sectionLabel}>Section: <strong>{section}</strong></p>

          {/* 7-character breakdown */}
          <div className={styles.charBreakdown}>
            <h2>7-Character Code Structure</h2>
            <div className={styles.charRow}>
              {chars.map((ch, i) => (
                <div key={i} className={styles.charCell}>
                  <span className={styles.charValue}>{ch}</span>
                  <span className={styles.charLabel}>{labels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
