import styles from './Legal.module.css';

export default function TermsOfUse() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Legal</div>
          <h1 className={styles.title}>Terms of Use</h1>
          <p className={styles.meta}>Effective date: June 1, 2025 · Last updated: June 1, 2025</p>
        </div>

        <div className={styles.card}>
          <p className={styles.intro}>
            Please read these Terms of Use carefully before using myICDCode.com.
            By accessing or using the Site, you agree to be bound by these Terms.
            If you do not agree, please do not use the Site.
          </p>
        </div>

        <div className={styles.section}>
          <h2>1. About the Site</h2>
          <p>myICDCode.com is operated by StormGlass Interactive Inc. ("Company," "we," "us").
          The Site provides a free reference tool for looking up ICD-10-CM diagnosis codes
          and their plain-English descriptions. The Site is intended for informational and
          medical coding reference purposes only.</p>
        </div>

        <div className={styles.section}>
          <h2>2. Medical Disclaimer</h2>
          <div className={styles.warningBox}>
            <strong>Important:</strong> myICDCode.com is NOT a medical advice service.
            The information provided on this Site is for general informational and coding
            reference purposes only. It does not constitute medical advice, diagnosis,
            or treatment recommendations.
          </div>
          <p>Always seek the advice of a qualified healthcare provider with any questions
          you may have regarding a medical condition. Never disregard professional medical
          advice or delay seeking it because of something you have read on this Site.</p>
          <p>For official medical coding guidance, always consult a certified medical coder
          (CPC, CCS) or refer directly to the official ICD-10-CM guidelines published by
          CMS and the CDC.</p>
        </div>

        <div className={styles.section}>
          <h2>3. Data Accuracy</h2>
          <p>ICD-10-CM code data is sourced from official publications by the Centers for
          Medicare &amp; Medicaid Services (CMS) and the CDC National Center for Health
          Statistics (NCHS). We strive to keep this data current and accurate.</p>
          <p>However, we make no warranties or representations, express or implied, regarding
          the accuracy, completeness, or timeliness of the code data. Medical codes and
          guidelines are updated annually and may change. Always verify codes against the
          official CMS and CDC publications for billing and clinical purposes.</p>
        </div>

        <div className={styles.section}>
          <h2>4. Permitted Use</h2>
          <p>You may use myICDCode.com for lawful purposes including:</p>
          <ul>
            <li>Personal research and reference</li>
            <li>Medical coding education and training</li>
            <li>Understanding your own medical records or insurance EOB statements</li>
            <li>Healthcare provider coding reference (with verification against official sources)</li>
          </ul>
          <p>You may not use the Site in any way that:</p>
          <ul>
            <li>Violates any applicable law or regulation</li>
            <li>Infringes the intellectual property rights of others</li>
            <li>Involves scraping or automated data harvesting without our written permission</li>
            <li>Attempts to interfere with or disrupt the Site's infrastructure</li>
            <li>Misrepresents the Site's information as official medical or legal advice</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>5. Intellectual Property</h2>
          <p>The ICD-10-CM code data displayed on this Site is sourced from U.S. government
          publications and is in the public domain. The plain-English descriptions, site design,
          code, and all original content are owned by StormGlass Interactive Inc. and are
          protected by copyright law.</p>
          <p>You may not reproduce, distribute, or create derivative works of our original
          content without prior written permission from StormGlass Interactive Inc.</p>
        </div>

        <div className={styles.section}>
          <h2>6. Third-Party Links and Advertising</h2>
          <p>The Site may contain links to third-party websites and display third-party
          advertisements. We do not endorse, control, or assume responsibility for any
          third-party content, products, or services. Your interactions with advertisers
          and third-party sites are solely between you and those parties.</p>
        </div>

        <div className={styles.section}>
          <h2>7. Disclaimer of Warranties</h2>
          <p>THE SITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT
          THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL
          COMPONENTS.</p>
        </div>

        <div className={styles.section}>
          <h2>8. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STORMGLASS INTERACTIVE INC.
          SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE, EVEN IF
          WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          <p>Our total liability to you for any claim arising from these Terms or your use
          of the Site shall not exceed one hundred dollars ($100).</p>
        </div>

        <div className={styles.section}>
          <h2>9. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of
          the State of New York, without regard to conflict of law principles. Any disputes
          shall be resolved by binding arbitration in New York County, New York, under the
          rules of the American Arbitration Association.</p>
        </div>

        <div className={styles.section}>
          <h2>10. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Changes will be posted
          on this page with an updated effective date. Continued use of the Site after changes
          constitutes acceptance of the updated Terms.</p>
        </div>

        <div className={styles.section}>
          <h2>11. Contact</h2>
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
