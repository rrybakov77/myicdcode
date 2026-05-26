import { CODES, CODE_MAP } from './allCodes.js';

export function searchCodes(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toUpperCase();
  const ql = query.trim().toLowerCase();

  // Exact code match first
  const exact = CODES.filter(c => c.code === q);
  // Code prefix match (e.g. "J45" returns all J45.x)
  const prefix = CODES.filter(c => c.code.startsWith(q) && c.code !== q);
  // Description keyword match — billable codes only for cleaner results
  const keyword = CODES.filter(c =>
    c.billable &&
    !c.code.startsWith(q) &&
    (c.shortDesc.toLowerCase().includes(ql) ||
     (c.plainEnglish && c.plainEnglish.toLowerCase().includes(ql)))
  );

  return [...exact, ...prefix, ...keyword].slice(0, 30);
}

export function getRelatedCodes(code) {
  const related = code.related || [];
  return related.map(r => CODE_MAP[r]).filter(Boolean);
}

export function getCodesByChapter(chapterId) {
  return CODES.filter(c => c.chapterId === chapterId && c.billable);
}
