import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchCodes } from '../data/search.js';
import ThemeSwitcher from './ThemeSwitcher.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchCodes(query).slice(0, 6));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (code) => { setQuery(''); setOpen(false); navigate(`/code/${code}`); };

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoDot} />
        <span className={styles.logoText}>myICDCode</span>
        <span className={styles.logoSuffix}>.com</span>
      </Link>

      <div className={styles.searchWrap} ref={ref}>
        <form onSubmit={submit} className={styles.searchForm}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search codes or conditions…"
            autoComplete="off"
          />
        </form>
        {open && results.length > 0 && (
          <div className={styles.dropdown}>
            {results.map(r => (
              <button key={r.code} className={styles.dropItem} onClick={() => go(r.code)}>
                <span className={styles.dropCode}>{r.code}</span>
                <span className={styles.dropDesc}>{r.shortDesc}</span>
                {r.isNew && <span className={styles.newPill}>New</span>}
              </button>
            ))}
            <button className={styles.dropMore} onClick={submit}>See all results →</button>
          </div>
        )}
      </div>

      <div className={styles.navRight}>
        <Link to="/browse" className={styles.navLink}>Browse</Link>
        <Link to="/about" className={styles.navLink}>About</Link>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
