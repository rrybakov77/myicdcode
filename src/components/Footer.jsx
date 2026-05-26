import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>myICDCode.com</div>
          <div className={styles.copy}>
            ICD-10-CM data sourced from CMS.gov and CDC NCHS · Updated annually each October 1
          </div>
        </div>
        <div className={styles.links}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/advertise">Advertise</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <div className={styles.stormglass}>
        Designed and Developed by StormGlass Interactive Inc.
      </div>
    </footer>
  );
}
