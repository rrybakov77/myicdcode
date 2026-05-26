import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import styles from './About.module.css';

const FEATURES = [
  { icon: "🔍", title: "98,000+ codes", desc: "Every ICD-10-CM code in the FY 2026 dataset — billable and non-billable" },
  { icon: "💬", title: "Plain English", desc: "AI-generated explanations that actually make sense to non-coders" },
  { icon: "🔄", title: "Always current", desc: "Updated every October 1 from official CMS and CDC publications" },
  { icon: "🔗", title: "ICD-9 crosswalk", desc: "Find the old ICD-9-CM equivalent for any modern code" },
  { icon: "📊", title: "Coding notes", desc: "Official includes, excludes, use-additional, and code-first instructions" },
  { icon: "📱", title: "Works everywhere", desc: "Fully responsive — works on phone, tablet, and desktop" },
];

export default function About() {
  return (
    <div className={styles.page}>
      <SEO
        title="About myICDCode.com — ICD-10 Code Lookup"
        description="Learn about myICDCode.com, a free ICD-10-CM diagnosis code lookup built by StormGlass Interactive Inc. 98,000+ codes with plain English explanations."
        canonical="/about"
      />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>About</div>
          <h1 className={styles.heroTitle}>Built to make medical codes<br />understandable</h1>
          <p className={styles.heroSub}>
            myICDCode.com is a free, fast ICD-10-CM lookup built for patients,
            billing staff, healthcare providers, and anyone trying to decode a
            medical code on an insurance EOB or medical record.
          </p>
        </div>
      </div>

      <div className={styles.container}>

        {/* Features grid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What's included</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureTitle}>{f.title}</div>
                <div className={styles.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Data source */}
        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Data source &amp; accuracy</h2>
            <p>All ICD-10-CM codes and descriptions are sourced directly from official US government publications:</p>
            <div className={styles.sourceList}>
              <div className={styles.sourceItem}>
                <span className={styles.sourceIcon}>🏛️</span>
                <div>
                  <div className={styles.sourceName}>Centers for Medicare &amp; Medicaid Services (CMS)</div>
                  <div className={styles.sourceDetail}>Publishes the annual ICD-10-CM order file — the authoritative code list</div>
                </div>
              </div>
              <div className={styles.sourceItem}>
                <span className={styles.sourceIcon}>🔬</span>
                <div>
                  <div className={styles.sourceName}>CDC National Center for Health Statistics (NCHS)</div>
                  <div className={styles.sourceDetail}>Maintains the ICD-10-CM classification and tabular index</div>
                </div>
              </div>
              <div className={styles.sourceItem}>
                <span className={styles.sourceIcon}>📅</span>
                <div>
                  <div className={styles.sourceName}>Annual update — October 1</div>
                  <div className={styles.sourceDetail}>New fiscal year codes take effect October 1. Mid-year updates incorporated when published.</div>
                </div>
              </div>
            </div>
            <p className={styles.noteText}>
              The plain-English explanations are generated to be accurate to the clinical intent of each code.
              They are for informational and reference purposes only — not clinical advice.
              Always verify against official CMS/CDC publications for billing purposes.
            </p>
          </div>
        </section>

        {/* Medical disclaimer */}
        <section className={styles.section}>
          <div className={`${styles.card} ${styles.warningCard}`}>
            <h2 className={styles.cardTitle}>⚕️ Medical disclaimer</h2>
            <p>
              myICDCode.com is for informational and medical coding reference purposes only.
              It does not constitute medical advice, diagnosis, or treatment recommendations.
              Always consult a qualified healthcare provider for medical decisions and a
              certified medical coder (CPC, CCS) for official coding guidance.
            </p>
          </div>
        </section>

        {/* Legal links */}
        <section className={styles.legalRow}>
          <Link to="/privacy" className={styles.legalLink}>
            <span className={styles.legalIcon}>🔒</span>
            <div>
              <div className={styles.legalTitle}>Privacy Policy</div>
              <div className={styles.legalDesc}>How we collect and use data</div>
            </div>
          </Link>
          <Link to="/terms" className={styles.legalLink}>
            <span className={styles.legalIcon}>📄</span>
            <div>
              <div className={styles.legalTitle}>Terms of Use</div>
              <div className={styles.legalDesc}>Rules and limitations of use</div>
            </div>
          </Link>
          <Link to="/advertise" className={styles.legalLink}>
            <span className={styles.legalIcon}>📣</span>
            <div>
              <div className={styles.legalTitle}>Advertise</div>
              <div className={styles.legalDesc}>Reach our healthcare audience</div>
            </div>
          </Link>
        </section>

        {/* Built by */}
        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Built by StormGlass Interactive Inc.</h2>
            <p>
              StormGlass Interactive Inc. is a New York-based software studio specializing in
              mobile apps, web tools, and data-driven products for consumers and small businesses.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactRow}>
                <span>📍</span> New York City, New York
              </div>
              <div className={styles.contactRow}>
                <span>✉️</span>
                <a href="mailto:support@stormglassinteractive.com">
                  support@stormglassinteractive.com
                </a>
              </div>
              <div className={styles.contactRow}>
                <span>🌐</span>
                <a href="https://stormglassinteractive.com" target="_blank" rel="noopener noreferrer">
                  stormglassinteractive.com
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
