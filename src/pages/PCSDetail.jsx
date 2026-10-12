import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import styles from './CodeDetail.module.css';
import pcsStyles from './PCSDetail.module.css';

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

// Root Operation definitions for Section 0 (Medical & Surgical)
const ROOT_OPERATIONS = {
  '0': { name: 'Alteration', def: 'Modifying the anatomic structure of a body part without affecting the function of the body part.' },
  '1': { name: 'Bypass', def: 'Altering the route of passage of the contents of a tubular body part.' },
  '2': { name: 'Change', def: 'Taking out or off a device from a body part and putting back an identical or similar device in or on the same body part without cutting or puncturing the skin or a mucous membrane.' },
  '3': { name: 'Control', def: 'Stopping, or attempting to stop, postprocedural or other acute bleeding.' },
  '4': { name: 'Creation', def: 'Putting in or on biological or synthetic material to form a new body part that to the extent possible replicates the anatomic structure or function of an absent body part.' },
  '5': { name: 'Destruction', def: 'Physical eradication of all or a portion of a body part by the direct use of energy, force, or a destructive agent.' },
  '6': { name: 'Detachment', def: 'Cutting off all or a portion of the upper or lower extremities.' },
  '7': { name: 'Dilation', def: 'Expanding an orifice or the lumen of a tubular body part.' },
  '8': { name: 'Division', def: 'Cutting into a body part, without draining fluids and/or gases from the body part, in order to separate or transect a body part.' },
  '9': { name: 'Drainage', def: 'Taking or letting out fluids and/or gases from a body part.' },
  'B': { name: 'Excision', def: 'Cutting out or off, without replacement, a portion of a body part.' },
  'C': { name: 'Extirpation', def: 'Taking or cutting out solid matter from a body part.' },
  'D': { name: 'Extraction', def: 'Pulling or stripping out or off all or a portion of a body part by the use of force.' },
  'F': { name: 'Fragmentation', def: 'Breaking solid matter in a body part into pieces.' },
  'G': { name: 'Fusion', def: 'Joining together portions of an articular body part rendering the articular body part immobile.' },
  'H': { name: 'Insertion', def: 'Putting in a nonbiological appliance that monitors, assists, performs, or prevents a physiological function but does not physically take the place of a body part.' },
  'J': { name: 'Inspection', def: 'Visually and/or manually exploring a body part.' },
  'K': { name: 'Map', def: 'Locating the route of passage of electrical impulses and/or locating functional areas in a body part.' },
  'L': { name: 'Occlusion', def: 'Completely closing an orifice or the lumen of a tubular body part.' },
  'M': { name: 'Reattachment', def: 'Putting back in or on all or a portion of a separated body part to its normal location or other suitable location.' },
  'N': { name: 'Release', def: 'Freeing a body part from an abnormal physical constraint by cutting or by the use of force.' },
  'P': { name: 'Removal', def: 'Taking out or off a device from a body part.' },
  'Q': { name: 'Repair', def: 'Restoring, to the extent possible, a body part to its normal anatomic structure and function.' },
  'R': { name: 'Replacement', def: 'Putting in or on biological or synthetic material that physically takes the place and/or function of all or a portion of a body part.' },
  'S': { name: 'Reposition', def: 'Moving to its normal location, or other suitable location, all or a portion of a body part.' },
  'T': { name: 'Resection', def: 'Cutting out or off, without replacement, all of a body part.' },
  'U': { name: 'Supplement', def: 'Putting in or on biological or synthetic material that physically reinforces and/or augments the function of a portion of a body part.' },
  'V': { name: 'Restriction', def: 'Partially closing an orifice or the lumen of a tubular body part.' },
  'W': { name: 'Revision', def: 'Correcting, to the extent possible, a portion of a malfunctioning device or the position of a displaced device.' },
  'X': { name: 'Transfer', def: 'Moving, without taking out, all or a portion of a body part to another location to take over the function of all or a portion of a body part.' },
  'Y': { name: 'Transplantation', def: 'Putting in or on all or a portion of a living body part taken from another individual or animal to physically take the place and/or function of all or a portion of a similar body part.' },
};

export default function PCSDetail() {
  const { code } = useParams();
  const upperCode = code?.toUpperCase();
  const [entry, setEntry] = useState(null);
  const [relatedCodes, setRelatedCodes] = useState([]);
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

        // Related codes: same first 6 chars, different code, capped at 15
        const prefix6 = upperCode.slice(0, 6);
        const related = allCodes
          .filter(c => c.code !== upperCode && c.code.startsWith(prefix6))
          .slice(0, 15);

        if (!cancelled) {
          setEntry(found || null);
          setRelatedCodes(related);
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

  // Root Operation: Section 0 only, character at index 2
  const rootOpChar = chars[2];
  const rootOp = chars[0] === '0' ? ROOT_OPERATIONS[rootOpChar] : null;

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

          {/* Root Operation card — Section 0 only */}
          {rootOp && (
            <div className={pcsStyles.rootOpCard}>
              <div className={pcsStyles.rootOpHeader}>
                <span className={pcsStyles.rootOpBadge}>{rootOpChar}</span>
                <h2 className={pcsStyles.rootOpName}>Root Operation: {rootOp.name}</h2>
              </div>
              <p className={pcsStyles.rootOpDef}>{rootOp.def}</p>
            </div>
          )}

          {/* Related codes — same first 6 chars, different qualifier */}
          {relatedCodes.length > 0 && (
            <div className={pcsStyles.relatedSection}>
              <h2 className={pcsStyles.relatedTitle}>Related Codes (Same Procedure, Different Qualifier)</h2>
              <div className={pcsStyles.relatedTableWrap}>
                <table className={pcsStyles.relatedTable}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedCodes.map(rc => (
                      <tr key={rc.code} className={pcsStyles.relatedRow}>
                        <td>
                          <a href={`/pcs/${rc.code}`} className={pcsStyles.relatedCode}>
                            {rc.code}
                          </a>
                        </td>
                        <td className={pcsStyles.relatedDesc}>{rc.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
