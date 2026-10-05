// Figure II.9, published Datawrapper chart JvXMb, version 2.
export const DATA = [
  [2015, 100, 100],
  [2016, 99.38391555, 100.574047],
  [2017, 99.52027175, 101.1218555],
  [2018, 99.59246619, 100.8668848],
  [2019, 100.1102251, 101.0565276],
  [2020, 100.5587993, 100.6898742],
  [2021, 101.1337038, 100.1947514],
  [2022, 101.829537, 100.8304391],
  [2023, 101.4960314, 101.1259205],
  [2024, 102.3102818, 101.9851275],
  [2025, 102.8152121, 102.4096947]
];

export const CSV = ['Year,Geographic distance,Geoeconomic compatibility', ...DATA.map(row => row.join(','))].join('\n');
export const NOTE =
  "Geographic distance is measured as the bilateral trade-weighted average geodesic (great circle) distance, in kilometres, between countries' capitals. Geoeconomic compatibility is proxied by similarity in United Nations General Assembly voting patterns (Bailey et al., 2017). This academic measure is not a United Nations classification or assessment of Member States.";
