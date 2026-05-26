// AUTO-GENERATED — myICDCode.com — StormGlass Interactive Inc.
// This file assembles all ICD-10-CM codes from the committed chapter chunks.
// The full per-chapter data lives in src/data/chunks/chapter_N.js
// This file provides: CHAPTERS, FY_STATS, TRENDING, and lazy CODE_MAP helpers.

// Import the index for metadata
export { CHAPTERS, FY_STATS, TRENDING } from './chunks/index.js';

// Build full CODES array and CODE_MAP by eagerly importing all chapters.
// Vite will tree-shake and chunk these automatically at build time.
import { CODES as C1  } from './chunks/chapter_1.js';
import { CODES as C2  } from './chunks/chapter_2.js';
import { CODES as C3  } from './chunks/chapter_3.js';
import { CODES as C4  } from './chunks/chapter_4.js';
import { CODES as C5  } from './chunks/chapter_5.js';
import { CODES as C6  } from './chunks/chapter_6.js';
import { CODES as C7  } from './chunks/chapter_7.js';
import { CODES as C8  } from './chunks/chapter_8.js';
import { CODES as C9  } from './chunks/chapter_9.js';
import { CODES as C10 } from './chunks/chapter_10.js';
import { CODES as C11 } from './chunks/chapter_11.js';
import { CODES as C12 } from './chunks/chapter_12.js';
import { CODES as C13 } from './chunks/chapter_13.js';
import { CODES as C14 } from './chunks/chapter_14.js';
import { CODES as C15 } from './chunks/chapter_15.js';
import { CODES as C16 } from './chunks/chapter_16.js';
import { CODES as C17 } from './chunks/chapter_17.js';
import { CODES as C18 } from './chunks/chapter_18.js';
import { CODES as C19 } from './chunks/chapter_19.js';
import { CODES as C20 } from './chunks/chapter_20.js';
import { CODES as C21 } from './chunks/chapter_21.js';

export const CODES = [
  ...C1, ...C2, ...C3, ...C4, ...C5, ...C6, ...C7,
  ...C8, ...C9, ...C10, ...C11, ...C12, ...C13, ...C14,
  ...C15, ...C16, ...C17, ...C18, ...C19, ...C20, ...C21,
];

export const CODE_MAP = Object.fromEntries(CODES.map(c => [c.code, c]));
