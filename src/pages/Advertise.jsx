import styles from './Advertise.module.css';

const STATS = [
  { num: "98,000+",  label: "ICD-10 codes indexed" },
  { num: "3M+",      label: "Monthly searches (projected)" },
  { num: "72%",      label: "Healthcare professional audience" },
  { num: "4:32",     label: "Avg. session duration" },
];

const AUDIENCES = [
  { icon: "🏥", title: "Medical billers & coders",       desc: "Certified coders (CPC, CCS) using the site as a daily reference tool" },
  { icon: "👨‍⚕️", title: "Healthcare providers",         desc: "Physicians, NPs, PAs, and nurses looking up unfamiliar codes" },
  { icon: "📋", title: "Patients & caregivers",          desc: "People decoding their EOB statements and medical records" },
  { icon: "🎓", title: "Medical billing students",       desc: "Students in coding certification programs using the site to study" },
  { icon: "⚖️", title: "Healthcare attorneys",           desc: "Legal professionals researching diagnoses for medical-legal cases" },
  { icon: "💼", title: "Healthcare administrators",      desc: "Hospital and practice managers overseeing coding accuracy" },
];

const AD_UNITS = [
  {
    name: "Homepage banner",
    placement: "Above the fold on homepage",
    size: "728×90 leaderboard",
    cpm: "Contact for rates",
  },
  {
    name: "Code detail sidebar",
    placement: "Right sidebar on every code page",
    size: "300×250 medium rectangle",
    cpm: "Contact for rates",
  },
  {
    name: "Search results",
    placement: "Between search results (every 5th result)",
    size: "728×90 or 300×250",
    cpm: "Contact for rates",
  },
  {
    name: "Sponsored content",
    placement: "Labeled sponsored section on homepage",
    size: "Custom",
    cpm: "Contact for rates",
  },
];

export default function Advertise() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>Advertising</div>
          <h1 className={styles.heroTitle}>Reach healthcare professionals<br />where they look up codes</h1>
          <p className={styles.heroSub}>
            myICDCode.com serves medical billers, coders, providers, and patients actively
            researching diagnosis codes — a highly engaged, high-intent healthcare audience.
          </p>
          <a href="mailto:support@stormglassinteractive.com?subject=Advertising%20Inquiry%20-%20myICDCode.com"
             className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statCell}>
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.body}>

        {/* Audience */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our audience</h2>
          <p className={styles.sectionSub}>
            People who visit myICDCode.com are actively engaged with healthcare — they're
            not casual browsers. They're professionals and patients with specific, high-intent needs.
          </p>
          <div className={styles.audienceGrid}>
            {AUDIENCES.map(a => (
              <div key={a.title} className={styles.audienceCard}>
                <div className={styles.audienceIcon}>{a.icon}</div>
                <div className={styles.audienceTitle}>{a.title}</div>
                <div className={styles.audienceDesc}>{a.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Ad units */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ad placements</h2>
          <p className={styles.sectionSub}>
            All ads are clearly labeled. We do not accept ads for competing medical code
            lookup tools, or content that could be misleading to patients.
          </p>
          <div className={styles.adTable}>
            <div className={styles.adTableHeader}>
              <span>Placement</span>
              <span>Location</span>
              <span>Size</span>
              <span>Pricing</span>
            </div>
            {AD_UNITS.map(u => (
              <div key={u.name} className={styles.adTableRow}>
                <span className={styles.adName}>{u.name}</span>
                <span className={styles.adLocation}>{u.placement}</span>
                <span className={styles.adSize}>{u.size}</span>
                <span className={styles.adCpm}>{u.cpm}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Google AdSense note */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Programmatic advertising</h2>
          <p>
            myICDCode.com also runs Google AdSense across the site for programmatic display
            advertising. If you're interested in reaching our audience through Google's ad
            network, you can target myICDCode.com directly through Google Display &amp; Video 360
            or Google Ads placement targeting.
          </p>
        </section>

        {/* Contact */}
        <section className={styles.contactSection}>
          <h2>Ready to advertise?</h2>
          <p>Send us a note with your product, target audience, and budget and we'll get back
          to you within 2 business days.</p>
          <a
            href="mailto:support@stormglassinteractive.com?subject=Advertising%20Inquiry%20-%20myICDCode.com"
            className={styles.contactBtn}
          >
            Email us at support@stormglassinteractive.com
          </a>
          <p className={styles.contactNote}>
            Operated by StormGlass Interactive Inc. · New York, NY
          </p>
        </section>
      </div>
    </div>
  );
}
