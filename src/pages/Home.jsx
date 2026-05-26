import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CHAPTERS, FY_STATS, TRENDING, CODE_MAP } from '../data/allCodes.js';
import { searchCodes } from '../data/search.js';
import styles from './Home.module.css';

const CHAPTER_COLORS = [
  '#4A9EFF','#2ECC8A','#F5A623','#FF7B7B','#9B8FFF',
  '#4AD4A4','#FFB84A','#FF9EFF','#4AC8FF','#A8FF78',
  '#FF8C7A','#78DBFF','#FFD700','#C8A0FF','#80FF80',
  '#FF9ECF','#9EF5FF','#FFA070','#70D4FF','#B8FF70','#FFC0CB',
];

const QUICK_SEARCHES = [
  { label: "J45.51 — severe asthma",     code: "J45.51"  },
  { label: "E11.9 — type 2 diabetes",    code: "E11.9"   },
  { label: "I10 — hypertension",          code: "I10"     },
  { label: "M54.50 — low back pain",     code: "M54.50"  },
  { label: "F32.1 — depression",          code: "F32.1"   },
  { label: "J06.9 — common cold",        code: "J06.9"   },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const exact = CODE_MAP[q.toUpperCase()];
    if (exact) navigate(`/code/${exact.code}`);
    else navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={styles.page}>
      {/* Update banner */}
      <div className={styles.updateBanner}>
        <span className={styles.bannerDot} />
        <strong>FY 2026 active</strong> — 487 new codes, 38 revisions effective October 1, 2025
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={styles.gridCell} style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }} />
          ))}
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            ICD-10-CM · FY 2026 · {FY_STATS.totalCodes?.toLocaleString()} codes
          </div>
          <h1 className={styles.heroTitle}>
            Decode any medical<br />diagnosis code — plain English
          </h1>
          <p className={styles.heroSub}>
            The fastest ICD-10 lookup on the web. Free, current, and actually readable.
          </p>

          <form onSubmit={submit} className={styles.searchForm}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                className={styles.searchInput}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter code (J45.51) or condition (asthma, diabetes, hypertension…)"
                autoFocus
              />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </div>
          </form>

          <div className={styles.quickRow}>
            <span className={styles.quickLabel}>Popular:</span>
            {QUICK_SEARCHES.map(q => (
              <button
                key={q.code}
                className={styles.quickPill}
                onClick={() => navigate(`/code/${q.code}`)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsRow}>
        <div className={styles.statCell}>
          <div className={styles.statNum}>{FY_STATS.totalCodes?.toLocaleString()}</div>
          <div className={styles.statLabel}>Diagnosis codes</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statNum}>{FY_STATS.totalChapters}</div>
          <div className={styles.statLabel}>Code chapters</div>
        </div>
        <div className={styles.statCell}>
          <div className={`${styles.statNum} ${styles.statNew}`}>487</div>
          <div className={styles.statLabel}>New in FY 2026</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statNum}>Oct 1</div>
          <div className={styles.statLabel}>Annual update</div>
        </div>
      </section>

      {/* Browse chapters */}
      <section className={styles.chaptersSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse by chapter</h2>
          <Link to="/browse" className={styles.seeAll}>View all →</Link>
        </div>
        <div className={styles.chaptersGrid}>
          {CHAPTERS.map((ch, i) => (
            <Link
              key={ch.id}
              to={`/browse?chapter=${ch.id}`}
              className={styles.chapterCard}
            >
              <div className={styles.chapterAccent} style={{
                background: CHAPTER_COLORS[i % CHAPTER_COLORS.length] + '28',
                borderColor: CHAPTER_COLORS[i % CHAPTER_COLORS.length] + '50'
              }}>
                <span className={styles.chapterRange} style={{ color: CHAPTER_COLORS[i % CHAPTER_COLORS.length] }}>
                  Ch. {ch.id}
                </span>
                <span className={styles.chapterCode}>{ch.range}</span>
              </div>
              <div className={styles.chapterTitle}>{ch.title}</div>
              <div className={styles.chapterCount}>{ch.count?.toLocaleString()} codes</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className={styles.trendingSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Most searched codes</h2>
        </div>
        <div className={styles.trendingGrid}>
          {TRENDING.map(codeStr => {
            const c = CODE_MAP[codeStr];
            if (!c) return null;
            return (
              <Link key={c.code} to={`/code/${c.code}`} className={styles.trendCard}>
                <div className={styles.trendCode}>{c.code}</div>
                <div className={styles.trendTitle}>{c.shortDesc}</div>
                <div className={styles.trendTags}>
                  {c.billable && <span className="badge badge-green">Billable</span>}
                  {c.isNew && <span className="badge badge-amber">New FY {c.fyEffective}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Explainer */}
      <section className={styles.explainerSection}>
        <div className={styles.explainerCard}>
          <h2 className={styles.explainerTitle}>What is an ICD-10 code?</h2>
          <p className={styles.explainerText}>
            ICD-10-CM (International Classification of Diseases, 10th Revision, Clinical Modification)
            is the official system US healthcare providers use to classify and code diagnoses on medical
            claims and records. Every time a doctor bills your insurance, they attach an ICD-10 code
            to describe your diagnosis.
          </p>
          <p className={styles.explainerText}>
            If you've received an Explanation of Benefits (EOB) from your insurance company and
            wondered what codes like <Link to="/code/I10" className={styles.inlineCode}>I10</Link> or{' '}
            <Link to="/code/E11.9" className={styles.inlineCode}>E11.9</Link> mean —
            this site translates them into plain English.
          </p>
          <div className={styles.explainerGrid}>
            <div className={styles.explainerItem}>
              <div className={styles.explainerIcon}>🔍</div>
              <div className={styles.explainerItemTitle}>Fast lookup</div>
              <div className={styles.explainerItemDesc}>Search by code or condition name — results in milliseconds</div>
            </div>
            <div className={styles.explainerItem}>
              <div className={styles.explainerIcon}>📋</div>
              <div className={styles.explainerItemTitle}>Plain English</div>
              <div className={styles.explainerItemDesc}>Every code explained in language anyone can understand</div>
            </div>
            <div className={styles.explainerItem}>
              <div className={styles.explainerIcon}>🔄</div>
              <div className={styles.explainerItemTitle}>Always current</div>
              <div className={styles.explainerItemDesc}>Updated automatically from CMS every October 1</div>
            </div>
            <div className={styles.explainerItem}>
              <div className={styles.explainerIcon}>🔗</div>
              <div className={styles.explainerItemTitle}>ICD-9 crosswalk</div>
              <div className={styles.explainerItemDesc}>Find the old ICD-9 equivalent for any modern code</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
