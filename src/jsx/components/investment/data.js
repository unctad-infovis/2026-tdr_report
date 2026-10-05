// Figure III.6, published Datawrapper chart 9IWbQ, version 3.
export const SECTORS = [
  { key: 'non-strategic', label: 'Non-strategic sectors', lines: ['Non-strategic', 'sectors'], developed: 49, developing: 51, stage: 0 },
  { key: 'semiconductors', label: 'Semiconductor value chain', lines: ['Semiconductor', 'value chain'], developed: 79, developing: 21, stage: 2 },
  { key: 'advanced', label: 'Advanced and sensitive technologies', lines: ['Advanced and', 'sensitive technologies'], narrowLines: ['Advanced and', 'sensitive', 'technologies'], developed: 77, developing: 23, stage: 2 },
  { key: 'ai', label: 'AI infrastructure and related technologies', lines: ['AI infrastructure', 'and related technologies'], narrowLines: ['AI infrastructure', 'and related', 'technologies'], developed: 64, developing: 36, stage: 3 },
  { key: 'energy', label: 'Energy transition technologies and services', lines: ['Energy transition', 'technologies and services'], narrowLines: ['Energy transition', 'technologies', 'and services'], developed: 61, developing: 39, stage: 3 },
  { key: 'minerals', label: 'Critical minerals and strategic materials', lines: ['Critical minerals', 'and strategic materials'], narrowLines: ['Critical minerals', 'and strategic', 'materials'], developed: 41, developing: 59, stage: 4 }
];

export const GROUPS = [
  { key: 'developed', label: 'Developed economies' },
  { key: 'developing', label: 'Developing economies' }
];
export const SOURCE = 'UN Trade and Development (UNCTAD) based on information from The Financial Times Ltd, fDi Markets (www.fDimarkets.com).';
export const CSV = ['Sector,Developed economies (%),Developing economies (%)', ...SECTORS.map(sector => `${sector.label},${sector.developed},${sector.developing}`)].join('\n');
