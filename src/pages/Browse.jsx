import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CHAPTERS, FY_STATS } from '../data/allCodes.js';
import CodeCard from '../components/CodeCard.jsx';
import styles from './Browse.module.css';

const CHAPTER_COLORS = [
  '#4A9EFF','#2ECC8A','#F5A623','#FF7B7B','#9B8FFF',
  '#4AD4A4','#FFB84A','#FF9EFF','#4AC8FF','#A8FF78',
  '#FF8C7A','#78DBFF','#FFD700','#C8A0FF','#80FF80',
  '#FF9ECF','#9EF5FF','#FFA070','#70D4FF','#B8FF70','#FFC0CB',
];

function ChapterView({ chapter, colorIndex }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    // Try chunk file first, fall back to allCodes filter
    import(`../data/chunks/chapter_${chapter.id}.js`)
      .then(mod => {
        setCodes(mod.CODES || []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: filter from allCodes
        import('../data/allCodes.js').then(mod => {
          const filtered = (mod.CODES || []).filter(c => c.chapterId === chapter.id);
          setCodes(filtered);
          setLoading(false);
        });
      });
  }, [chapter.id]);

  const filtered = search.length >= 2
    ? codes.filter(c =>
        c.billable && (
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.shortDesc.toLowerCase().includes(search.toLowerCase())
        )
      ).slice(0, 50)
    : codes.filter(c => c.billable).slice(0, 100);

  const color = CHAPTER_COLORS[colorIndex % CHAPTER_COLORS.length];

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/browse">All chapters</Link>
        <span>›</span>
        <span>{chapter.title}</span>
      </div>

      <div className={styles.chapterHeader}>
        <div className={styles.chapterNum} style={{ color }}>Chapter {chapter.id}</div>
        <h1 className={styles.chapterTitle}>{chapter.title}</h1>
        <div className={styles.chapterRange}>
          {chapter.range} · {chapter.count?.toLocaleString() || codes.length} codes
        </div>
      </div>

      <div className={styles.chapterSearch}>
        <input
          className={styles.chapterSearchInput}
          placeholder={`Search within Chapter ${chapter.id}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading codes…</div>
      ) : (
        <>
          <div className={styles.resultCount}>
            {search.length >= 2
              ? `${filtered.length} results for "${search}"`
              : `Showing ${filtered.length} of ${codes.filter(c => c.billable).length} billable codes`}
          </div>
          <div className={styles.codesList}>
            {filtered.map(c => <CodeCard key={c.code} code={c} />)}
          </div>
          {!search && codes.filter(c => c.billable).length > 100 && (
            <div className={styles.moreHint}>
              Use the search box above to find specific codes in this chapter.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Browse() {
  const [searchParams] = useSearchParams();
  const chapterParam = searchParams.get('chapter');
  const selectedChapter = chapterParam ? parseInt(chapterParam) : null;
  const chapter = selectedChapter ? CHAPTERS.find(c => c.id === selectedChapter) : null;
  const chapterIndex = selectedChapter ? selectedChapter - 1 : 0;

  if (chapter) {
    return <ChapterView chapter={chapter} colorIndex={chapterIndex} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.browseHeader}>
        <h1 className={styles.browseTitle}>Browse ICD-10-CM by chapter</h1>
        <p className={styles.browseSub}>
          21 chapters · {FY_STATS.totalCodes?.toLocaleString()} codes · FY {FY_STATS.year}
        </p>
      </div>
      <div className={styles.chaptersGrid}>
        {CHAPTERS.map((ch, i) => (
          <Link key={ch.id} to={`/browse?chapter=${ch.id}`} className={styles.chapterCard}>
            <div className={styles.cardTop}>
              <div className={styles.chNum} style={{ color: CHAPTER_COLORS[i] }}>{ch.id}</div>
              <div className={styles.chRange}>{ch.range}</div>
            </div>
            <div className={styles.chTitle}>{ch.title}</div>
            <div className={styles.chFooter}>
              <span className={styles.chCount}>{ch.count?.toLocaleString()} codes</span>
              <span className={styles.chArrow} style={{ color: CHAPTER_COLORS[i] }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
