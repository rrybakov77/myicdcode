import styles from './Legal.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Legal</div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>Effective date: June 1, 2025 · Last updated: June 1, 2025</p>
        </div>

        <div className={styles.card}>
          <p className={styles.intro}>
            myICDCode.com ("we," "us," or "our") is operated by StormGlass Interactive Inc.,
            a New York corporation. This Privacy Policy describes how we collect, use, and
            protect information when you use myICDCode.com (the "Site").
          </p>
        </div>

        <div className={styles.section}>
          <h2>1. Information We Collect</h2>
          <h3>Information you provide</h3>
          <p>myICDCode.com does not require account registration. We do not collect your name,
          email address, or any personally identifiable information through normal use of the Site.</p>

          <h3>Automatically collected information</h3>
          <p>When you visit the Site, our hosting provider and analytics services may automatically
          collect certain technical information, including:</p>
          <ul>
            <li>IP address (anonymized)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent</li>
            <li>Referring URL</li>
            <li>Search queries entered on the Site</li>
          </ul>
          <p>This information is collected in aggregate and is not linked to any individual user.</p>

          <h3>Cookies</h3>
          <p>We use essential cookies necessary for the Site to function. We may also use
          third-party advertising cookies (Google AdSense) to serve relevant advertisements.
          You can opt out of personalized advertising at{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            google.com/settings/ads
          </a>.</p>
        </div>

        <div className={styles.section}>
          <h2>2. How We Use Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Operate, maintain, and improve the Site</li>
            <li>Analyze usage patterns to improve search relevance and content</li>
            <li>Serve relevant advertisements through Google AdSense</li>
            <li>Comply with applicable laws and regulations</li>
            <li>Protect against fraudulent or unauthorized use</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>3. Advertising</h2>
          <p>myICDCode.com uses Google AdSense to display advertisements. Google may use
          cookies to serve ads based on your prior visits to this Site and other websites.
          Google's use of advertising cookies enables it and its partners to serve ads based
          on your visit to our Site and/or other sites on the Internet.</p>
          <p>You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info/choices
          </a>{' '}or{' '}
          <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">
            networkadvertising.org/choices
          </a>.</p>
        </div>

        <div className={styles.section}>
          <h2>4. Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties.
          We may share anonymized, aggregated usage data with service providers who assist
          us in operating the Site (hosting, analytics, advertising). These providers are
          contractually bound to protect your information.</p>
        </div>

        <div className={styles.section}>
          <h2>5. Medical Information Disclaimer</h2>
          <p>Search queries you enter (such as medical code numbers or condition names) may
          be logged for operational purposes. We treat all health-related search queries with
          care and do not use this data to profile individual users or share it with insurers,
          employers, or healthcare providers.</p>
        </div>

        <div className={styles.section}>
          <h2>6. Data Retention</h2>
          <p>Aggregated usage logs are retained for up to 24 months for analytical purposes,
          then deleted. We do not retain individually identifiable data beyond your browser session.</p>
        </div>

        <div className={styles.section}>
          <h2>7. Children's Privacy</h2>
          <p>myICDCode.com is not directed at children under the age of 13. We do not
          knowingly collect personal information from children under 13. If you believe
          a child has provided us personal information, please contact us and we will
          promptly delete it.</p>
        </div>

        <div className={styles.section}>
          <h2>8. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of targeted advertising</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p>To exercise these rights, contact us at the address below.</p>
        </div>

        <div className={styles.section}>
          <h2>9. Security</h2>
          <p>We implement industry-standard security measures including HTTPS encryption
          for all Site traffic. However, no method of transmission over the Internet is
          100% secure, and we cannot guarantee absolute security.</p>
        </div>

        <div className={styles.section}>
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will post the updated
          policy on this page with a new effective date. Continued use of the Site after
          changes constitutes acceptance of the updated policy.</p>
        </div>

        <div className={styles.section}>
          <h2>11. Contact Us</h2>
          <p>For privacy questions or requests:</p>
          <div className={styles.contactBlock}>
            <strong>StormGlass Interactive Inc.</strong><br />
            New York, NY<br />
            <a href="mailto:support@stormglassinteractive.com">support@stormglassinteractive.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
