import { useSearchParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { searchCodes } from '../data/search.js';
import CodeCard from '../components/CodeCard.jsx';
import styles from './Search.module.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [filter, setFilter] = useState('all');

  const allResults = useMemo(() => searchCodes(q), [q]);

  const results = useMemo(() => {
    if (filter === 'billable') return allResults.filter(c => c.billable);
    if (filter === 'new')      return allResults.filter(c => c.isNew);
    return allResults;
  }, [allResults, filter]);

  const billableCount = allResults.filter(c => c.billable).length;
  const newCount      = allResults.filter(c => c.isNew).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>
          {allResults.length > 0
            ? <>{allResults.length} result{allResults.length !== 1 ? 's' : ''} for{' '}
                <span className={styles.queryHighlight}>"{q}"</span></>
            : <>No results for "{q}"</>
          }
        </h1>

        {allResults.length > 0 && (
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({allResults.length})
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'billable' ? styles.filterActive : ''}`}
              onClick={() => setFilter('billable')}
            >
              Billable ({billableCount})
            </button>
            {newCount > 0 && (
              <button
                className={`${styles.filterBtn} ${filter === 'new' ? styles.filterActive : ''}`}
                onClick={() => setFilter('new')}
              >
                New FY 2026 ({newCount})
              </button>
            )}
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className={styles.results}>
          {results.map((code, i) => (
            <div key={code.code} className="fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <CodeCard code={code} />
            </div>
          ))}
          {allResults.length === 30 && (
            <div className={styles.limitBanner}>
              Showing top 30 results. Try a more specific search to narrow results.
            </div>
          )}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2>No results found</h2>
          <p>
            Try searching by code number (e.g.{' '}
            <Link to="/code/I10" className={styles.exLink}>I10</Link>) or
            condition name (e.g. "hypertension", "fracture", "diabetes").
          </p>
          <div className={styles.suggestions}>
            <div className={styles.suggestLabel}>Try these:</div>
            {['I10', 'E11.9', 'J06.9', 'M54.50', 'F32.1', 'Z23'].map(c => (
              <Link key={c} to={`/code/${c}`} className={styles.suggestPill}>{c}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
