// ICD-10-CM Index — chapter metadata only, no code arrays
// Import chapter codes dynamically: import(`./chapter_${id}.js`)

export const CHAPTERS = [
  {
    "id": 1,
    "range": "A00\u2013B99",
    "title": "Infectious and parasitic diseases",
    "count": 695
  },
  {
    "id": 2,
    "range": "C00\u2013D49",
    "title": "Neoplasms",
    "count": 1539
  },
  {
    "id": 3,
    "range": "D50\u2013D89",
    "title": "Blood and immune disorders",
    "count": 401
  },
  {
    "id": 4,
    "range": "E00\u2013E89",
    "title": "Endocrine, nutritional and metabolic diseases",
    "count": 1267
  },
  {
    "id": 5,
    "range": "F01\u2013F99",
    "title": "Mental and behavioral disorders",
    "count": 1112
  },
  {
    "id": 6,
    "range": "G00\u2013G99",
    "title": "Diseases of the nervous system",
    "count": 932
  },
  {
    "id": 7,
    "range": "H00\u2013H59",
    "title": "Diseases of the eye and adnexa",
    "count": 3466
  },
  {
    "id": 8,
    "range": "H60\u2013H95",
    "title": "Diseases of the ear and mastoid process",
    "count": 871
  },
  {
    "id": 9,
    "range": "I00\u2013I99",
    "title": "Diseases of the circulatory system",
    "count": 1798
  },
  {
    "id": 10,
    "range": "J00\u2013J99",
    "title": "Diseases of the respiratory system",
    "count": 471
  },
  {
    "id": 11,
    "range": "K00\u2013K95",
    "title": "Diseases of the digestive system",
    "count": 1109
  },
  {
    "id": 12,
    "range": "L00\u2013L99",
    "title": "Diseases of the skin and subcutaneous tissue",
    "count": 1206
  },
  {
    "id": 13,
    "range": "M00\u2013M99",
    "title": "Diseases of the musculoskeletal system",
    "count": 8674
  },
  {
    "id": 14,
    "range": "N00\u2013N99",
    "title": "Diseases of the genitourinary system",
    "count": 1044
  },
  {
    "id": 15,
    "range": "O00\u2013O9A",
    "title": "Pregnancy, childbirth and the puerperium",
    "count": 3023
  },
  {
    "id": 16,
    "range": "P00\u2013P96",
    "title": "Perinatal conditions",
    "count": 565
  },
  {
    "id": 17,
    "range": "Q00\u2013Q99",
    "title": "Congenital malformations",
    "count": 1086
  },
  {
    "id": 18,
    "range": "R00\u2013R99",
    "title": "Symptoms and abnormal clinical findings",
    "count": 962
  },
  {
    "id": 19,
    "range": "S00\u2013T88",
    "title": "Injury, poisoning and external causes",
    "count": 39718
  },
  {
    "id": 20,
    "range": "V00\u2013Y99",
    "title": "External causes of morbidity",
    "count": 5808
  },
  {
    "id": 21,
    "range": "Z00\u2013Z99",
    "title": "Factors influencing health status",
    "count": 1844
  }
];

export const FY_STATS = {
  year: 2026,
  effectiveDate: 'October 1, 2025',
  totalCodes: 98186,
  billableCodes: 74719,
  totalChapters: 21,
};

export const TRENDING = ['I10', 'E11.9', 'J06.9', 'M54.50', 'F32.1', 'Z23'];
