// Box figure I.3.2 – traced value added in one advanced AI server rack.
// Raw values from "Marimekko Chart Raw Data.xlsx" (Sheet1, rows 2–6); all shares are derived from these.

export const SUPPLIERS = [
  { color: 'var(--un-color-blue)', key: 'fabless', label: 'Fabless company', textColor: '#fff' },
  { color: 'var(--un-color-yellow)', key: 'memory', label: 'Memory suppliers', textColor: '#000' },
  { color: 'var(--un-color-blue-darkest)', key: 'foundry', label: 'Foundry', textColor: '#fff' },
  { color: 'var(--un-color-yellow-darkest)', key: 'assemblers', label: 'Assemblers', textColor: '#fff' },
  { color: 'var(--un-color-grey)', key: 'others', label: 'Others', textColor: '#000' }
];

const RAW = [
  {
    key: 'production_labour',
    label: 'Production labour',
    lines: ['Production', 'labour'],
    values: { assemblers: 28650.830602170834, fabless: 10045.386944740705, foundry: 12843.570330728864, memory: 22172.36848337114, others: 50004.17675170915 }
  },
  {
    key: 'production_capital',
    label: 'Production capital',
    lines: ['Production', 'capital'],
    values: { assemblers: 9034.526916917615, fabless: 948.5787424962716, foundry: 35072.563928442476, memory: 37079.43866593666, others: 20086.64773018348 }
  },
  {
    key: 'non_production_labour',
    label: 'Non-production labour',
    lines: ['Non-production', 'labour'],
    values: { assemblers: 22436.24788238554, fabless: 215041.92618422888, foundry: 8753.136840746509, memory: 14945.068915208458, others: 27562.254624010147 }
  },
  {
    key: 'non_production_capital',
    label: 'Non-production capital',
    lines: ['Non-production', 'capital'],
    values: { assemblers: 1792.9079430057766, fabless: 41782.982470315925, foundry: 2435.6880846803515, memory: 4062.1205376745484, others: 4872.65058728351 }
  },
  {
    key: 'corporate_income_tax',
    label: 'Corporate income tax',
    lines: ['Corporate', 'income tax'],
    values: { assemblers: 12830.277874082385, fabless: 295681.8141406092, foundry: 16868.359076167588, memory: 21427.785442380635, others: 14700.905794721828 }
  },
  {
    key: 'post_tax_profit',
    label: 'Post-tax profit',
    lines: ['Post-tax', 'profit'],
    values: { assemblers: 59024.47704331107, fabless: 1660273.5059823466, foundry: 88688.13643423913, memory: 122415.7056069902, others: 50695.737997161814 }
  }
];

const grandTotal = RAW.reduce((sum, col) => sum + SUPPLIERS.reduce((s, sup) => s + col.values[sup.key], 0), 0);

// Columns with cumulative x0/x1 (0–1) and stacked segments y0/y1 (0–1, Fabless at the bottom).
export const COLUMNS = (() => {
  let x = 0;
  return RAW.map(col => {
    const total = SUPPLIERS.reduce((s, sup) => s + col.values[sup.key], 0);
    const share = total / grandTotal;
    let y = 0;
    const segments = SUPPLIERS.map(sup => {
      const value = col.values[sup.key] / total;
      const segment = { ...sup, columnLabel: col.label, shareOfTotal: col.values[sup.key] / grandTotal, value, y0: y, y1: y + value };
      y += value;
      return segment;
    });
    const column = { ...col, segments, share, x0: x, x1: x + share };
    x += share;
    return column;
  });
})();

export const CSV = [['Income type', 'Share of traced value added (%)', ...SUPPLIERS.map(s => `${s.label} (%)`)].join(','), ...COLUMNS.map(c => [c.label, (c.share * 100).toFixed(1), ...c.segments.map(s => (s.value * 100).toFixed(1))].join(','))].join('\n');
