import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CODE_MAP } from '../data/allCodes.js';
import { getRelatedCodes } from '../data/search.js';
import styles from './CodeDetail.module.css';

const TABS = ['Overview', 'Coding notes', 'ICD-9 crosswalk', 'Related codes'];

export default function CodeDetail() {
  const { code: codeParam } = useParams();
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const code = CODE_MAP[codeParam?.toUpperCase()];

  if (!code) {
    return (
      <div className={styles.notFound}>
        <div className={styles.nfCode}>{codeParam}</div>
        <h2>Code not found</h2>
        <p>"{codeParam}" was not found in the ICD-10-CM FY 2026 dataset. Check the code and try again.</p>
        <div className={styles.nfActions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>← Go back</button>
          <Link to="/" className={styles.backBtn}>Search codes</Link>
        </div>
      </div>
    );
  }

  const related = getRelatedCodes(code);

  const copyCode = () => {
    navigator.clipboard?.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/browse">ICD-10-CM</Link>
        <span>›</span>
        <Link to={`/browse?chapter=${code.chapterId}`}>Ch. {code.chapterId}</Link>
        <span>›</span>
        <Link to={`/search?q=${code.category}`}>{code.category}</Link>
        <span>›</span>
        <span className={styles.bcCurrent}>{code.code}</span>
      </div>

      <div className={styles.layout}>
        {/* Main content */}
        <div className={styles.main}>

          {/* Code hero */}
          <div className={styles.codeHero}>
            <div className={styles.codeHeroTop}>
              <div>
                <div className={styles.codeBig}>{code.code}</div>
                <h1 className={styles.codeTitle}>{code.shortDesc}</h1>
                <div className={styles.codeMeta}>
                  FY {code.fyEffective} · ICD-10-CM Ch. {code.chapterId}
                  {code.block ? ` · ${code.block}` : ''}
                </div>
              </div>
              <div className={styles.codeActions}>
                <button className={styles.actionBtn} onClick={copyCode}>
                  {copied ? '✓ Copied' : '⎘ Copy code'}
                </button>
                <button className={styles.actionBtn} onClick={() => {
                  if (navigator.share) navigator.share({ title: code.code, url: window.location.href });
                  else copyCode();
                }}>
                  ↗ Share
                </button>
              </div>
            </div>
            <div className={styles.codeTags}>
              {code.billable && <span className="badge badge-green">✓ Billable</span>}
              {code.isNew && <span className="badge badge-amber">New FY {code.fyEffective}</span>}
              {code.isRevised && <span className="badge badge-blue">Revised</span>}
              {code.poaExempt && <span className="badge badge-muted">POA Exempt</span>}
              <span className="badge badge-muted">Ch. {code.chapterId} — {code.chapterTitle}</span>
            </div>
          </div>

          {/* Plain English */}
          <div className={styles.plainEnglish}>
            <div className={styles.peLabel}>
              <span className={styles.peLabelIcon}>💬</span>
              Plain English
            </div>
            <p className={styles.peText}>{code.plainEnglish || code.longDesc || code.shortDesc}</p>
          </div>

          {/* Who uses */}
          {code.whoUses && (
            <div className={styles.whoUses}>
              <h3 className={styles.sectionHeading}>Who uses this code</h3>
              <p className={styles.whoUsesText}>{code.whoUses}</p>
            </div>
          )}

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`}
                onClick={() => setTab(i)}
              >
                {t}
                {i === 1 && code.codingNotes?.length > 0 &&
                  <span className={styles.tabCount}>{code.codingNotes.length}</span>}
                {i === 2 && code.crosswalks?.length > 0 &&
                  <span className={styles.tabCount}>{code.crosswalks.length}</span>}
                {i === 3 && related.length > 0 &&
                  <span className={styles.tabCount}>{related.length}</span>}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.tabContent}>

            {/* Overview */}
            {tab === 0 && (
              <div className={styles.overviewGrid}>
                <div className={styles.infoTable}>
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>Code</span>
                    <span className={`${styles.irVal} mono`}>{code.code}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>Billable / valid for billing</span>
                    <span className={styles.irVal} style={{ color: 'var(--green)' }}>
                      {code.billable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>FY {code.fyEffective} status</span>
                    <span className={styles.irVal}>
                      {code.isNew ? `New (added FY ${code.fyEffective})` : code.isRevised ? 'Revised' : 'No change'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>Chapter</span>
                    <span className={styles.irVal}>{code.chapterId} — {code.chapterTitle}</span>
                  </div>
                  {code.block && (
                    <div className={styles.infoRow}>
                      <span className={styles.irLabel}>Block</span>
                      <span className={styles.irVal}>{code.block} {code.blockTitle}</span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>Parent category</span>
                    <span className={`${styles.irVal} mono`}>
                      {code.category}{code.categoryTitle ? ` — ${code.categoryTitle}` : ''}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>POA exempt</span>
                    <span className={styles.irVal}>{code.poaExempt ? 'Yes' : 'No'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.irLabel}>Applicable to</span>
                    <span className={styles.irVal}>Encounters from Oct 1, {code.fyEffective - 1} onward</span>
                  </div>
                </div>

                {/* Includes / Excludes */}
                {(code.includes?.length > 0 || code.excludes1?.length > 0 || code.excludes2?.length > 0) && (
                  <div className={styles.notesBlock}>
                    {code.includes?.length > 0 && (
                      <div className={styles.noteGroup}>
                        <div className={styles.noteGroupLabel}>Includes</div>
                        {code.includes.map((n, i) => (
                          <div key={i} className={styles.noteItem}>{n}</div>
                        ))}
                      </div>
                    )}
                    {code.excludes1?.length > 0 && (
                      <div className={styles.noteGroup}>
                        <div className={styles.noteGroupLabel} style={{ color: 'var(--red)' }}>
                          Excludes 1 — never use together
                        </div>
                        {code.excludes1.map((n, i) => (
                          <div key={i} className={styles.noteItem}>{n}</div>
                        ))}
                      </div>
                    )}
                    {code.excludes2?.length > 0 && (
                      <div className={styles.noteGroup}>
                        <div className={styles.noteGroupLabel} style={{ color: 'var(--amber)' }}>
                          Excludes 2 — may coexist
                        </div>
                        {code.excludes2.map((n, i) => (
                          <div key={i} className={styles.noteItem}>{n}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Coding notes */}
            {tab === 1 && (
              <div className={styles.codingNotes}>
                {code.codingNotes?.length > 0 ? (
                  code.codingNotes.map((note, i) => (
                    <div key={i} className={styles.noteCard}>
                      <span className={styles.noteBullet}>→</span>
                      <span>{note}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyMsg}>No special coding notes for this code.</p>
                )}
                {(code.includes?.length > 0 || code.excludes1?.length > 0 || code.excludes2?.length > 0) && (
                  <div className={styles.noteSection}>
                    {code.includes?.length > 0 && (
                      <>
                        <div className={styles.noteSectionLabel}>Includes</div>
                        {code.includes.map((n, i) => (
                          <div key={i} className={styles.noteCard}>
                            <span className={styles.noteBullet} style={{ color: 'var(--green)' }}>✓</span>
                            <span>{n}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {code.excludes1?.length > 0 && (
                      <>
                        <div className={styles.noteSectionLabel} style={{ color: 'var(--red)' }}>
                          Excludes 1 (never use together with this code)
                        </div>
                        {code.excludes1.map((n, i) => (
                          <div key={i} className={styles.noteCard}>
                            <span className={styles.noteBullet} style={{ color: 'var(--red)' }}>✕</span>
                            <span>{n}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {code.excludes2?.length > 0 && (
                      <>
                        <div className={styles.noteSectionLabel} style={{ color: 'var(--amber)' }}>
                          Excludes 2 (may coexist — code separately if present)
                        </div>
                        {code.excludes2.map((n, i) => (
                          <div key={i} className={styles.noteCard}>
                            <span className={styles.noteBullet} style={{ color: 'var(--amber)' }}>!</span>
                            <span>{n}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ICD-9 crosswalk */}
            {tab === 2 && (
              <div>
                <p className={styles.crosswalkIntro}>
                  ICD-9-CM codes that map to <strong>{code.code}</strong> under the General Equivalence Mappings (GEMs):
                </p>
                {code.crosswalks?.length > 0 ? (
                  code.crosswalks.map((cw, i) => (
                    <div key={i} className={styles.crosswalkRow}>
                      <span className={`${styles.cwCode} mono`}>{cw.icd9}</span>
                      <span className={styles.cwArrow}>→</span>
                      <span className={`${styles.cwNew} mono`}>{code.code}</span>
                      <span className={styles.cwDesc}>{cw.desc}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyMsg}>
                    No direct ICD-9 crosswalk mapping available for this code.
                    This may be a new code added after ICD-10 transition.
                  </p>
                )}
              </div>
            )}

            {/* Related codes */}
            {tab === 3 && (
              <div>
                {related.length > 0 ? (
                  <div className={styles.relatedList}>
                    {related.map(r => (
                      <Link key={r.code} to={`/code/${r.code}`} className={styles.relatedItem}>
                        <span className={`${styles.relCode} mono`}>{r.code}</span>
                        <span className={styles.relTitle}>{r.shortDesc}</span>
                        <span className={styles.relArrow}>→</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className={styles.emptyMsg}>
                      No related codes linked for this entry.
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Try searching for <Link to={`/search?q=${code.category}`} style={{ color: 'var(--blue)' }}>
                        all {code.category} codes
                      </Link> to find related entries.
                    </p>
                  </div>
                )}
                <p className={styles.relatedNote}>
                  Category <span className="mono" style={{ color: 'var(--blue)' }}>{code.category}</span>
                  {code.categoryTitle ? ` — ${code.categoryTitle}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Quick facts</div>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Status</span>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>Valid FY 2026</span>
            </div>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Billable</span>
              <span style={{ fontSize: '13px', color: code.billable ? 'var(--green)' : 'var(--red)' }}>
                {code.billable ? 'Yes' : 'No'}
              </span>
            </div>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Chapter</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{code.chapterId}</span>
            </div>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Effective</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Oct 1, {code.fyEffective - 1}
              </span>
            </div>
          </div>

          {related.length > 0 && (
            <div className={styles.sideCard}>
              <div className={styles.sideHeading}>Related codes</div>
              {related.slice(0, 6).map(r => (
                <Link key={r.code} to={`/code/${r.code}`} className={styles.sideRelItem}>
                  <span className={`${styles.sideRelCode} mono`}>{r.code}</span>
                  <span className={styles.sideRelTitle}>{r.shortDesc}</span>
                </Link>
              ))}
            </div>
          )}

          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Browse category</div>
            <Link
              to={`/search?q=${code.category}`}
              className={styles.categoryLink}
            >
              <span className="mono" style={{ color: 'var(--blue)' }}>{code.category}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'block', marginTop: '2px' }}>
                {code.categoryTitle || 'View all codes in this category →'}
              </span>
            </Link>
          </div>

          <div className={styles.disclaimer}>
            <strong>Medical disclaimer</strong><br />
            For informational and coding reference only — not medical advice.
            Consult a qualified healthcare provider or certified medical coder for clinical decisions.
          </div>
        </aside>
      </div>
    </div>
  );
}
