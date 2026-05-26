import { Link } from 'react-router-dom';
import styles from './CodeCard.module.css';

export default function CodeCard({ code, highlight }) {
  return (
    <Link to={`/code/${code.code}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.codeBadge}>{code.code}</span>
        <h3 className={styles.title}>{code.shortDesc}</h3>
        <div className={styles.tags}>
          {code.billable && <span className="badge badge-green">✓ Billable</span>}
          {code.isNew && <span className="badge badge-amber">New {code.fyEffective}</span>}
          {code.isRevised && <span className="badge badge-blue">Revised</span>}
        </div>
      </div>
      <p className={styles.desc}>{code.plainEnglish}</p>
      <div className={styles.footer}>
        <span className={styles.chapter}>Ch. {code.chapterId} — {code.chapterTitle}</span>
        <span className={styles.arrow}>→</span>
      </div>
    </Link>
  );
}
