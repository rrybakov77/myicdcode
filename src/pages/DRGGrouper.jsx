import { useState, useMemo } from 'react';
import SEO from '../components/SEO.jsx';
import styles from './DRGGrouper.module.css';

// ── FY 2027 MS-DRG data (CMS Table 5, effective Oct 1 2026) ──────────────────
// Base rate: $6,848.98 operating + $540.03 capital = $7,389.01 combined
// Payment estimate = relative_weight × $7,389.01 (national avg, excludes IME/DSH/outliers)
const BASE_RATE = 7389.01;

const DRG_DATA = [
  // Pre-MDC
  { drg:'003', mdc:'Pre',  title:'ECMO or tracheostomy w MV >96h or PDX except face/mouth/neck w major OR',   weight:21.5621, gmlos:26.5, mcc:true,  cc:false },
  { drg:'004', mdc:'Pre',  title:'Tracheostomy w MV >96h or PDX except face/mouth/neck w/o major OR proc',     weight:11.5900, gmlos:17.9, mcc:false, cc:false },
  // MDC 1 – Nervous System
  { drg:'020', mdc:'01', title:'Intracranial vascular procedures w PDX hemorrhage w MCC',     weight:8.2963, gmlos:8.2,  mcc:true,  cc:false },
  { drg:'064', mdc:'01', title:'Intracranial hemorrhage or cerebral infarction w MCC',        weight:2.0110, gmlos:4.4,  mcc:true,  cc:false },
  { drg:'065', mdc:'01', title:'Intracranial hemorrhage or cerebral infarction w CC or tPA',  weight:1.2033, gmlos:3.2,  mcc:false, cc:true  },
  { drg:'066', mdc:'01', title:'Intracranial hemorrhage or cerebral infarction w/o CC/MCC',   weight:0.7782, gmlos:2.3,  mcc:false, cc:false },
  { drg:'069', mdc:'01', title:'Transient ischemia',                                           weight:0.6991, gmlos:2.0,  mcc:false, cc:false },
  { drg:'101', mdc:'01', title:'Seizures w MCC',                                               weight:1.2561, gmlos:3.4,  mcc:true,  cc:false },
  { drg:'102', mdc:'01', title:'Seizures w/o MCC',                                             weight:0.6800, gmlos:2.2,  mcc:false, cc:false },
  // MDC 2 – Eye
  { drg:'124', mdc:'02', title:'Other disorders of the eye w MCC',                             weight:1.1073, gmlos:4.4,  mcc:true,  cc:false },
  // MDC 3 – ENT
  { drg:'154', mdc:'03', title:'Other ear, nose, mouth and throat diagnoses w MCC',            weight:1.3090, gmlos:4.5,  mcc:true,  cc:false },
  // MDC 4 – Respiratory
  { drg:'177', mdc:'04', title:'Respiratory infections and inflammations w MCC',               weight:1.5627, gmlos:4.4,  mcc:true,  cc:false },
  { drg:'178', mdc:'04', title:'Respiratory infections and inflammations w CC',                weight:0.9876, gmlos:3.3,  mcc:false, cc:true  },
  { drg:'179', mdc:'04', title:'Respiratory infections and inflammations w/o CC/MCC',          weight:0.6612, gmlos:2.5,  mcc:false, cc:false },
  { drg:'189', mdc:'04', title:'Pulmonary edema and respiratory failure',                      weight:1.2354, gmlos:3.5,  mcc:true,  cc:false },
  { drg:'190', mdc:'04', title:'Chronic obstructive pulmonary disease w MCC',                  weight:1.1077, gmlos:3.3,  mcc:true,  cc:false },
  { drg:'191', mdc:'04', title:'Chronic obstructive pulmonary disease w CC',                   weight:0.8430, gmlos:2.6,  mcc:false, cc:true  },
  { drg:'192', mdc:'04', title:'Chronic obstructive pulmonary disease w/o CC/MCC',             weight:0.6420, gmlos:2.1,  mcc:false, cc:false },
  { drg:'193', mdc:'04', title:'Simple pneumonia and pleurisy w MCC',                          weight:1.3144, gmlos:3.9,  mcc:true,  cc:false },
  { drg:'194', mdc:'04', title:'Simple pneumonia and pleurisy w CC',                           weight:0.8059, gmlos:2.8,  mcc:false, cc:true  },
  { drg:'195', mdc:'04', title:'Simple pneumonia and pleurisy w/o CC/MCC',                     weight:0.6285, gmlos:2.2,  mcc:false, cc:false },
  { drg:'202', mdc:'04', title:'Bronchitis and asthma w CC/MCC',                               weight:0.7423, gmlos:2.6,  mcc:false, cc:true  },
  { drg:'203', mdc:'04', title:'Bronchitis and asthma w/o CC/MCC',                             weight:0.5356, gmlos:2.0,  mcc:false, cc:false },
  // MDC 5 – Circulatory
  { drg:'231', mdc:'05', title:'Coronary bypass w cardiac cath w MCC',                         weight:7.9726, gmlos:11.3, mcc:true,  cc:false },
  { drg:'232', mdc:'05', title:'Coronary bypass w cardiac cath w/o MCC',                       weight:5.2861, gmlos:7.6,  mcc:false, cc:false },
  { drg:'280', mdc:'05', title:'Acute myocardial infarction, discharged alive w MCC',          weight:1.7856, gmlos:4.1,  mcc:true,  cc:false },
  { drg:'281', mdc:'05', title:'Acute myocardial infarction, discharged alive w CC',           weight:1.1149, gmlos:2.8,  mcc:false, cc:true  },
  { drg:'282', mdc:'05', title:'Acute myocardial infarction, discharged alive w/o CC/MCC',     weight:0.7237, gmlos:2.0,  mcc:false, cc:false },
  { drg:'291', mdc:'05', title:'Heart failure and shock w MCC',                                weight:1.2838, gmlos:3.8,  mcc:true,  cc:false },
  { drg:'292', mdc:'05', title:'Heart failure and shock w CC',                                  weight:0.8490, gmlos:2.9,  mcc:false, cc:true  },
  { drg:'293', mdc:'05', title:'Heart failure and shock w/o CC/MCC',                           weight:0.5660, gmlos:2.1,  mcc:false, cc:false },
  { drg:'305', mdc:'05', title:'Hypertension w MCC',                                           weight:1.1234, gmlos:3.5,  mcc:true,  cc:false },
  { drg:'306', mdc:'05', title:'Hypertension w/o MCC',                                         weight:0.6023, gmlos:2.3,  mcc:false, cc:false },
  { drg:'308', mdc:'05', title:'Cardiac arrhythmia and conduction disorders w MCC',            weight:1.2040, gmlos:3.4,  mcc:true,  cc:false },
  { drg:'309', mdc:'05', title:'Cardiac arrhythmia and conduction disorders w CC',             weight:0.7280, gmlos:2.4,  mcc:false, cc:true  },
  { drg:'310', mdc:'05', title:'Cardiac arrhythmia and conduction disorders w/o CC/MCC',       weight:0.4799, gmlos:1.8,  mcc:false, cc:false },
  { drg:'312', mdc:'05', title:'Syncope and collapse',                                          weight:0.7150, gmlos:2.2,  mcc:false, cc:false },
  // MDC 6 – Digestive
  { drg:'329', mdc:'06', title:'Major small and large bowel procedures w MCC',                 weight:4.9186, gmlos:10.0, mcc:true,  cc:false },
  { drg:'330', mdc:'06', title:'Major small and large bowel procedures w CC',                   weight:2.5553, gmlos:6.0,  mcc:false, cc:true  },
  { drg:'331', mdc:'06', title:'Major small and large bowel procedures w/o CC/MCC',             weight:1.5791, gmlos:3.7,  mcc:false, cc:false },
  { drg:'372', mdc:'06', title:'Major gastrointestinal disorders and peritoneal infections w MCC', weight:1.6998, gmlos:4.9, mcc:true, cc:false },
  { drg:'392', mdc:'06', title:'Esophagitis, gastroenteritis, misc digestive disorders w MCC', weight:1.1224, gmlos:3.7,  mcc:true,  cc:false },
  { drg:'393', mdc:'06', title:'Esophagitis, gastroenteritis, misc digestive disorders w/o MCC', weight:0.6421, gmlos:2.5, mcc:false, cc:false },
  // MDC 7 – Hepatobiliary
  { drg:'419', mdc:'07', title:'Laparoscopic cholecystectomy w/o CDE w MCC',                   weight:2.5280, gmlos:5.8,  mcc:true,  cc:false },
  { drg:'420', mdc:'07', title:'Laparoscopic cholecystectomy w/o CDE w CC',                    weight:1.3873, gmlos:3.0,  mcc:false, cc:true  },
  { drg:'421', mdc:'07', title:'Laparoscopic cholecystectomy w/o CDE w/o CC/MCC',              weight:0.9148, gmlos:1.8,  mcc:false, cc:false },
  // MDC 8 – Musculoskeletal
  { drg:'460', mdc:'08', title:'Spinal fusion except cervical w MCC',                          weight:5.7979, gmlos:7.3,  mcc:true,  cc:false },
  { drg:'461', mdc:'08', title:'Spinal fusion except cervical w/o MCC',                        weight:3.3164, gmlos:3.4,  mcc:false, cc:false },
  { drg:'469', mdc:'08', title:'Major hip and knee joint replacement or reattachment of lower extremity w MCC or total ankle replacement', weight:3.0476, gmlos:3.7, mcc:true, cc:false },
  { drg:'470', mdc:'08', title:'Major hip and knee joint replacement or reattachment of lower extremity w/o MCC', weight:1.9289, gmlos:1.9, mcc:false, cc:false },
  { drg:'480', mdc:'08', title:'Hip and femur procedures except major joint w MCC',             weight:2.9123, gmlos:6.1,  mcc:true,  cc:false },
  { drg:'481', mdc:'08', title:'Hip and femur procedures except major joint w CC',              weight:1.8620, gmlos:4.2,  mcc:false, cc:true  },
  { drg:'482', mdc:'08', title:'Hip and femur procedures except major joint w/o CC/MCC',        weight:1.3889, gmlos:3.0,  mcc:false, cc:false },
  { drg:'536', mdc:'08', title:'Fractures of hip and pelvis w MCC',                            weight:1.1742, gmlos:4.4,  mcc:true,  cc:false },
  { drg:'537', mdc:'08', title:'Fractures of hip and pelvis w/o MCC',                          weight:0.7051, gmlos:3.1,  mcc:false, cc:false },
  // MDC 10 – Endocrine
  { drg:'637', mdc:'10', title:'Diabetes w MCC',                                               weight:1.1476, gmlos:3.5,  mcc:true,  cc:false },
  { drg:'638', mdc:'10', title:'Diabetes w CC',                                                weight:0.7024, gmlos:2.5,  mcc:false, cc:true  },
  { drg:'639', mdc:'10', title:'Diabetes w/o CC/MCC',                                          weight:0.5029, gmlos:1.9,  mcc:false, cc:false },
  // MDC 11 – Kidney
  { drg:'682', mdc:'11', title:'Renal failure w MCC',                                          weight:1.4810, gmlos:4.3,  mcc:true,  cc:false },
  { drg:'683', mdc:'11', title:'Renal failure w CC',                                           weight:0.8673, gmlos:3.0,  mcc:false, cc:true  },
  { drg:'684', mdc:'11', title:'Renal failure w/o CC/MCC',                                     weight:0.5643, gmlos:2.1,  mcc:false, cc:false },
  { drg:'689', mdc:'11', title:'Kidney and urinary tract infections w MCC',                    weight:1.1603, gmlos:3.8,  mcc:true,  cc:false },
  { drg:'690', mdc:'11', title:'Kidney and urinary tract infections w/o MCC',                  weight:0.6884, gmlos:2.7,  mcc:false, cc:false },
  // MDC 18 – Infectious Disease
  { drg:'853', mdc:'18', title:'Infectious and parasitic diseases w OR procedure w MCC',       weight:4.9386, gmlos:9.3,  mcc:true,  cc:false },
  { drg:'854', mdc:'18', title:'Infectious and parasitic diseases w OR procedure w CC',        weight:2.5978, gmlos:6.0,  mcc:false, cc:true  },
  { drg:'855', mdc:'18', title:'Infectious and parasitic diseases w OR procedure w/o CC/MCC',  weight:1.3840, gmlos:3.9,  mcc:false, cc:false },
  { drg:'856', mdc:'18', title:'Postoperative or post-traumatic infections w OR procedure w MCC', weight:4.3826, gmlos:9.0, mcc:true, cc:false },
  // MDC 18 – Sepsis
  { drg:'870', mdc:'18', title:'Septicemia or severe sepsis w MV >96h',                        weight:5.8785, gmlos:11.6, mcc:true,  cc:false },
  { drg:'871', mdc:'18', title:'Septicemia or severe sepsis w/o MV >96h w MCC',               weight:1.9320, gmlos:4.8,  mcc:true,  cc:false },
  { drg:'872', mdc:'18', title:'Septicemia or severe sepsis w/o MV >96h w/o MCC',             weight:1.0066, gmlos:3.4,  mcc:false, cc:false },
  // MDC 20 – Alcohol/Drug
  { drg:'894', mdc:'20', title:'Alcohol/drug abuse or dependence, left AMA',                   weight:0.4870, gmlos:1.8,  mcc:false, cc:false },
  { drg:'895', mdc:'20', title:'Alcohol/drug abuse or dependence w rehabilitation therapy',    weight:0.7521, gmlos:5.8,  mcc:false, cc:false },
  // MDC 21 – Injury, Poisoning
  { drg:'917', mdc:'21', title:'Poisoning and toxic effects of drugs w MCC',                   weight:1.5228, gmlos:3.7,  mcc:true,  cc:false },
  { drg:'918', mdc:'21', title:'Poisoning and toxic effects of drugs w/o MCC',                 weight:0.7232, gmlos:2.3,  mcc:false, cc:false },
];

// MDC labels
const MDC_LABELS = {
  'Pre':'Pre-MDC', '01':'MDC 01 – Nervous System', '02':'MDC 02 – Eye',
  '03':'MDC 03 – Ear, Nose, Mouth, Throat', '04':'MDC 04 – Respiratory System',
  '05':'MDC 05 – Circulatory System', '06':'MDC 06 – Digestive System',
  '07':'MDC 07 – Hepatobiliary System & Pancreas', '08':'MDC 08 – Musculoskeletal & Connective Tissue',
  '10':'MDC 10 – Endocrine, Nutritional & Metabolic', '11':'MDC 11 – Kidney & Urinary Tract',
  '18':'MDC 18 – Infectious & Parasitic Diseases', '20':'MDC 20 – Alcohol/Drug Use & Induced Mental Disorders',
  '21':'MDC 21 – Injuries, Poisoning & Toxic Effects',
};

function fmt(n) { return n.toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }); }

export default function DRGGrouper() {
  const [search, setSearch]   = useState('');
  const [severity, setSeverity] = useState('all'); // all | mcc | cc | none
  const [mdc, setMdc]         = useState('all');
  const [selected, setSelected] = useState(null);

  const mdcOptions = useMemo(() => {
    const keys = [...new Set(DRG_DATA.map(d => d.mdc))].sort();
    return keys;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DRG_DATA.filter(d => {
      if (q && !d.drg.includes(q) && !d.title.toLowerCase().includes(q)) return false;
      if (mdc !== 'all' && d.mdc !== mdc) return false;
      if (severity === 'mcc' && !d.mcc) return false;
      if (severity === 'cc'  && !(d.cc && !d.mcc)) return false;
      if (severity === 'none' && (d.mcc || d.cc)) return false;
      return true;
    });
  }, [search, severity, mdc]);

  const payment = (w) => w * BASE_RATE;

  return (
    <>
      <SEO
        title="DRG Grouper Tool — Medicare Reimbursement Lookup | myICDCode.com"
        description="Look up MS-DRG assignments and estimate Medicare IPPS reimbursement. FY 2027 relative weights and payment estimates for 70+ common DRGs."
        canonical="https://myicdcode.com/drg-grouper"
      />

      <div className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.heroBadge}>FY 2027 · MS-DRG v44</span>
            <h1 className={styles.heroTitle}>DRG Grouper & Medicare Payment Estimator</h1>
            <p className={styles.heroSub}>
              Look up Diagnosis Related Groups and estimate Medicare IPPS inpatient reimbursement.
              FY 2027 relative weights — effective <strong>October 1, 2026</strong>.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}><span className={styles.heroNum}>768</span><span className={styles.heroLabel}>MS-DRGs</span></div>
              <div className={styles.heroStat}><span className={styles.heroNum}>25</span><span className={styles.heroLabel}>MDCs</span></div>
              <div className={styles.heroStat}><span className={styles.heroNum}>$6,849</span><span className={styles.heroLabel}>Base Rate</span></div>
              <div className={styles.heroStat}><span className={styles.heroNum}>FY 2027</span><span className={styles.heroLabel}>Edition</span></div>
            </div>
          </div>
        </header>

        <div className={styles.content}>

          {/* How it works */}
          <section className={styles.infoBox}>
            <h2 className={styles.infoTitle}>How DRG Assignment Works</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoStep}>1</div>
                <strong>Principal Diagnosis</strong>
                <p>The ICD-10-CM code for the main reason for admission selects the Major Diagnostic Category (MDC).</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoStep}>2</div>
                <strong>Procedures</strong>
                <p>ICD-10-PCS procedure codes determine whether the case is surgical or medical within that MDC.</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoStep}>3</div>
                <strong>Complication Level</strong>
                <p>Secondary diagnoses are scored: <strong>MCC</strong> (Major Complication/Comorbidity), <strong>CC</strong>, or none — selecting the final DRG within the family.</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoStep}>4</div>
                <strong>Payment</strong>
                <p>DRG Relative Weight × National Base Rate ($7,389 combined) = estimated Medicare IPPS payment before IME, DSH and outlier adjustments.</p>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>DRG Lookup — {filtered.length} results</h2>
            <div className={styles.filters}>
              <input
                className={styles.searchInput}
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelected(null); }}
                placeholder="Search DRG number or description…"
              />
              <select className={styles.select} value={mdc} onChange={e => setMdc(e.target.value)}>
                <option value="all">All MDCs</option>
                {mdcOptions.map(k => (
                  <option key={k} value={k}>{MDC_LABELS[k] || `MDC ${k}`}</option>
                ))}
              </select>
              <select className={styles.select} value={severity} onChange={e => setSeverity(e.target.value)}>
                <option value="all">All severities</option>
                <option value="mcc">MCC only</option>
                <option value="cc">CC only</option>
                <option value="none">No CC/MCC</option>
              </select>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.drgTable}>
                <thead>
                  <tr>
                    <th>DRG</th>
                    <th>Description</th>
                    <th>MDC</th>
                    <th>Severity</th>
                    <th>Rel. Weight</th>
                    <th>GMLOS</th>
                    <th>Est. Medicare Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr
                      key={d.drg}
                      className={`${styles.row} ${selected?.drg === d.drg ? styles.rowSelected : ''}`}
                      onClick={() => setSelected(selected?.drg === d.drg ? null : d)}
                    >
                      <td><span className={styles.drgNum}>{d.drg}</span></td>
                      <td className={styles.titleCell}>{d.title}</td>
                      <td><span className={styles.mdcBadge}>{d.mdc}</span></td>
                      <td>
                        {d.mcc ? <span className={styles.pillMcc}>MCC</span>
                               : d.cc ? <span className={styles.pillCc}>CC</span>
                               : <span className={styles.pillNone}>None</span>}
                      </td>
                      <td className={styles.numCell}>{d.weight.toFixed(4)}</td>
                      <td className={styles.numCell}>{d.gmlos.toFixed(1)} days</td>
                      <td className={styles.payCell}>{fmt(payment(d.weight))}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className={styles.empty}>No DRGs match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detail panel */}
          {selected && (
            <section className={styles.detail}>
              <div className={styles.detailHeader}>
                <h2>DRG {selected.drg} — Detail</h2>
                <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
              </div>
              <p className={styles.detailTitle}>{selected.title}</p>
              <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>MDC</span>
                  <span className={styles.detailVal}>{MDC_LABELS[selected.mdc] || selected.mdc}</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Severity Level</span>
                  <span className={styles.detailVal}>
                    {selected.mcc ? 'MCC — Major Complication/Comorbidity'
                     : selected.cc ? 'CC — Complication/Comorbidity'
                     : 'No CC/MCC'}
                  </span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Relative Weight</span>
                  <span className={styles.detailVal}>{selected.weight.toFixed(4)}</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Geometric Mean LOS</span>
                  <span className={styles.detailVal}>{selected.gmlos.toFixed(1)} days</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Est. Operating Payment</span>
                  <span className={styles.detailVal}>{fmt(selected.weight * 6848.98)}</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Est. Capital Payment</span>
                  <span className={styles.detailVal}>{fmt(selected.weight * 540.03)}</span>
                </div>
                <div className={`${styles.detailCard} ${styles.detailCardTotal}`}>
                  <span className={styles.detailLabel}>Est. Total Medicare Payment</span>
                  <span className={`${styles.detailVal} ${styles.detailTotal}`}>{fmt(payment(selected.weight))}</span>
                </div>
              </div>
              <p className={styles.detailNote}>
                Estimate based on FY 2027 national base rate ($6,848.98 operating + $540.03 capital) × relative weight.
                Actual payment varies by hospital wage index, IME/DSH add-ons, outlier threshold, and transfer policy.
              </p>
            </section>
          )}

          {/* MDC Reference */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Major Diagnostic Categories (MDC)</h2>
            <div className={styles.mdcGrid}>
              {[
                ['01','Nervous System'],['02','Eye'],['03','Ear, Nose, Mouth & Throat'],
                ['04','Respiratory System'],['05','Circulatory System'],['06','Digestive System'],
                ['07','Hepatobiliary System & Pancreas'],['08','Musculoskeletal & Connective Tissue'],
                ['09','Skin, Subcutaneous Tissue & Breast'],['10','Endocrine, Nutritional & Metabolic'],
                ['11','Kidney & Urinary Tract'],['12','Male Reproductive System'],
                ['13','Female Reproductive System'],['14','Pregnancy, Childbirth & Puerperium'],
                ['15','Newborns & Other Neonates'],['16','Blood & Blood Forming Organs'],
                ['17','Myeloproliferative & Poorly Differentiated Neoplasms'],
                ['18','Infectious & Parasitic Diseases'],['19','Mental Diseases & Disorders'],
                ['20','Alcohol/Drug Use & Induced Mental Disorders'],
                ['21','Injuries, Poisoning & Toxic Effects'],['22','Burns'],
                ['23','Factors Influencing Health Status & Health Services'],
                ['24','Multiple Significant Trauma'],['25','HIV Infections'],
              ].map(([num, label]) => (
                <div key={num} className={styles.mdcCard}>
                  <span className={styles.mdcNum}>{num}</span>
                  <span className={styles.mdcLabel}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className={styles.disclaimer}>
            <h3>⚠️ Important Disclaimer</h3>
            <p>
              Payment estimates are for <strong>educational and planning purposes only</strong>. Actual Medicare IPPS
              reimbursement depends on the hospital's wage index, teaching status (IME), disproportionate share (DSH),
              outlier thresholds, and transfer policies. For billing, coding, and compliance decisions, consult a
              certified medical coder or billing specialist and refer to the official{' '}
              <a href="https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2027-ipps-final-rule-home-page" target="_blank" rel="noopener noreferrer">
                CMS IPPS Final Rule
              </a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
