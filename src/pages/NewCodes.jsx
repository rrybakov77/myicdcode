import SEO from '../components/SEO.jsx';
import styles from './NewCodes.module.css';

const FY_HISTORY = [
  {
    fy: 'FY 2027',
    effectiveDate: 'October 1, 2026',
    totalCodes: 74879,
    added: 190,
    deleted: 30,
    revised: 4,
    highlights: [
      { chapter: 'Ch. 19 – Injury & Poisoning', added: 60, note: 'Expanded toxic-effect coding; largest single chapter addition' },
      { chapter: 'Ch. 15 – Pregnancy & Childbirth', added: 44, note: 'Vanishing twin syndrome (O31.4) adds 33 codes; ectopic pregnancy expansions' },
      { chapter: 'Ch. 13 – Musculoskeletal', added: 31, note: 'VEXAS syndrome (M04.3), plantar fasciitis laterality (M67.A0x)' },
      { chapter: 'Ch. 21 – Z Codes', added: 16, note: 'Burn pit / Agent Orange exposure history; new underweight BMI codes Z68.18–Z68.19' },
      { chapter: 'Ch. 9 – Circulatory', added: 12, note: 'Dilated cardiomyopathy I42.0 becomes non-billable parent; 3 specific children added' },
    ],
    notable: [
      { code: 'M04.3', desc: 'VEXAS syndrome — new autoinflammatory disease category' },
      { code: 'O31.4–', desc: 'Continuing pregnancy after vanishing twin syndrome (33 new codes)' },
      { code: 'M67.A01', desc: 'Plantar fasciitis, right foot' },
      { code: 'M67.A02', desc: 'Plantar fasciitis, left foot' },
      { code: 'Z68.18', desc: 'Body mass index 18.4 or less, adult' },
      { code: 'Z68.19', desc: 'Body mass index 18.5–19.9, adult' },
    ],
    isCurrent: true,
  },
  {
    fy: 'FY 2026',
    effectiveDate: 'October 1, 2025',
    totalCodes: 98186,
    added: 487,
    deleted: 28,
    revised: 38,
    highlights: [
      { chapter: 'Ch. 9 – Circulatory', added: 89, note: 'Expanded heart failure, cardiomyopathy, and arrhythmia specificity' },
      { chapter: 'Ch. 4 – Endocrine', added: 72, note: 'Diabetes complication granularity; obesity coding expansions' },
      { chapter: 'Ch. 10 – Respiratory', added: 45, note: 'Post-COVID respiratory conditions; long COVID coding' },
      { chapter: 'Ch. 5 – Mental Health', added: 38, note: 'Expanded substance use disorder specificity' },
      { chapter: 'Ch. 19 – Injury & Poisoning', added: 71, note: 'New toxic substance exposures' },
    ],
    notable: [],
    isCurrent: false,
  },
  {
    fy: 'FY 2025',
    effectiveDate: 'October 1, 2024',
    totalCodes: 97699,
    added: 395,
    deleted: 25,
    revised: 28,
    highlights: [],
    notable: [],
    isCurrent: false,
  },
  {
    fy: 'FY 2024',
    effectiveDate: 'October 1, 2023',
    totalCodes: 97304,
    added: 395,
    deleted: 22,
    revised: 10,
    highlights: [],
    notable: [],
    isCurrent: false,
  },
  {
    fy: 'FY 2023',
    effectiveDate: 'October 1, 2022',
    totalCodes: 96909,
    added: 1176,
    deleted: 250,
    revised: 36,
    highlights: [],
    notable: [],
    isCurrent: false,
  },
];

export default function NewCodes() {
  const current = FY_HISTORY[0];

  return (
    <>
      <SEO
        title="New ICD-10-CM Codes | FY 2027 Updates – myICDCode.com"
        description={`FY 2027 ICD-10-CM update: ${current.added} new codes, ${current.deleted} deleted, ${current.revised} revised. Effective ${current.effectiveDate}. Full history back to FY 2023.`}
        canonical="https://myicdcode.com/new-codes"
      />

      <div className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.heroBadge}>Current • {current.fy}</span>
            <h1 className={styles.heroTitle}>ICD-10-CM Code Updates</h1>
            <p className={styles.heroSub}>
              Effective <strong>{current.effectiveDate}</strong> — {current.fy} brings{' '}
              <strong>{current.added.toLocaleString()} new codes</strong>,{' '}
              <strong>{current.deleted} deletions</strong>, and{' '}
              <strong>{current.revised} revised descriptions</strong>.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={`${styles.heroStatNum} ${styles.added}`}>{current.added}</span>
                <span className={styles.heroStatLabel}>New</span>
              </div>
              <div className={styles.heroStat}>
                <span className={`${styles.heroStatNum} ${styles.deleted}`}>{current.deleted}</span>
                <span className={styles.heroStatLabel}>Deleted</span>
              </div>
              <div className={styles.heroStat}>
                <span className={`${styles.heroStatNum} ${styles.revised}`}>{current.revised}</span>
                <span className={styles.heroStatLabel}>Revised</span>
              </div>
              <div className={styles.heroStat}>
                <span className={`${styles.heroStatNum} ${styles.total}`}>{current.totalCodes.toLocaleString()}</span>
                <span className={styles.heroStatLabel}>Total Billable</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Chapter breakdown */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Where New Codes Landed — {current.fy}</h2>
            <div className={styles.chapterGrid}>
              {current.highlights.map((h) => (
                <div key={h.chapter} className={styles.chapterCard}>
                  <div className={styles.chapterTop}>
                    <span className={styles.chapterName}>{h.chapter}</span>
                    <span className={styles.chapterCount}>+{h.added}</span>
                  </div>
                  <p className={styles.chapterNote}>{h.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Notable new codes */}
          {current.notable.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Notable New Codes — {current.fy}</h2>
              <div className={styles.notableGrid}>
                {current.notable.map((n) => (
                  <a key={n.code} href={`/code/${n.code.replace('–', '')}`} className={styles.notableCard}>
                    <span className={styles.notableCode}>{n.code}</span>
                    <span className={styles.notableDesc}>{n.desc}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* History table */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Annual Update History</h2>
            <div className={styles.tableWrap}>
              <table className={styles.histTable}>
                <thead>
                  <tr>
                    <th>Fiscal Year</th>
                    <th>Effective Date</th>
                    <th>Added</th>
                    <th>Deleted</th>
                    <th>Revised</th>
                    <th>Total Codes</th>
                  </tr>
                </thead>
                <tbody>
                  {FY_HISTORY.map((row) => (
                    <tr key={row.fy} className={row.isCurrent ? styles.currentRow : ''}>
                      <td>
                        {row.fy}
                        {row.isCurrent && <span className={styles.currentPill}>Current</span>}
                      </td>
                      <td>{row.effectiveDate}</td>
                      <td className={styles.numAdded}>+{row.added.toLocaleString()}</td>
                      <td className={styles.numDeleted}>-{row.deleted}</td>
                      <td className={styles.numRevised}>{row.revised}</td>
                      <td className={styles.numTotal}>{row.totalCodes.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.sourceNote}>
              Source: <a href="https://www.cms.gov/medicare/coding-billing/icd-10-codes" target="_blank" rel="noopener noreferrer">CMS ICD-10 Code Files</a> — updated annually each October 1.
            </p>
          </section>

          {/* CTA */}
          <section className={styles.ctaSection}>
            <h2>Looking up a specific code?</h2>
            <p>Search our full database of {current.totalCodes.toLocaleString()} billable ICD-10-CM diagnosis codes.</p>
            <a href="/search" className={styles.ctaBtn}>Search Codes →</a>
          </section>
        </div>
      </div>
    </>
  );
}
