# 2026-tdr_report

**Live demo** https://unctad-infovis.github.io/2026-tdr_report/

## About

The Trade and Development Report (TDR) is an annual UNCTAD flagship publication
analysing global macroeconomic and development trends. This project is the
interactive web publication page for the 2026 edition: a scrollytelling minisite
with narrative text, data visualisations and chapter navigation.

Content is authored in MDX (`src/Article.mdx`) and rendered as a standalone React
application that is embedded within UNCTAD's Drupal platform.

> **Status:** scaffold only. The chapter titles, copy, images and chart ids are
> placeholders mirroring last year's World Investment Report minisite. Replace
> them as the real TDR 2026 content becomes available.

## Embedding

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-tdr_report/js/2026-tdr_report.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-tdr_report/css/2026-tdr_report.min.css?v=1">
<div class="app-root-2026-tdr_report" id="app-root-2026-tdr_report">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Update the `?v=` query parameter to match the current build version to bust the cache.

## Used in

* [Trade and Development Report 2026](https://unctad.org/publication/trade-and-development-report-2026)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`.

### Deployment

* `npm run build` – production bundle into `dist/` (runs `scripts/postbuild.js` to
  rewrite absolute asset paths to relative and content-hash the shared chunk).
* `npm run sync-gh-pages` – push `dist/` to the `gh-pages` branch for the live demo.
* `npm run sync-prod` – copy the build to Azure blob storage (`storage.unctad.org`).

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

* `src/meta.json` – report title, subtitle, year, chapter list and PDF/overview URLs.
* `src/Article.mdx` – the full narrative (copy + component placement).
* `src/jsx/App.jsx` – component registry passed to the MDX, scroll-reveal observer, theme colours.
* `src/jsx/App.css` – project-specific layout and narrative styles.
* `src/jsx/components/` – project-specific components (chart wrappers etc.).

### Marimekko scroll narrative

Box Figure I.3.2 uses `marimekko/ChartMarimekkoStory.jsx` to keep a single
Marimekko chart sticky beside five explanation panels. The `STAGES` array defines
the introduction, three column highlights and conclusion. The introduction and
conclusion both show the full-colour chart with no column highlight. The card
nearest a reading line at 55% of the viewport height determines the active stage, in either scroll
direction, including after layout changes. Column keys come from `marimekko/custom/data.js`. Scrolling in
either direction updates the emphasis without changing column widths or supplier
colours. Hover effects and tooltips are disabled during column highlights and
restored when the full chart is shown. The underlying `ChartMarimekko.jsx` also supports standalone use without
the `scrollStory` prop. On mobile, the explanation panels scroll over the chart;
transparent space around the cards passes touch input through to the chart,
including its internal scrolling and data-download link;
reduced-motion preferences disable the emphasis transitions. The source, note and
CSV download stay inside the sticky chart wrapper, below the plot. The scrolling
version omits the blue bottom border and allows internal scrolling on short
screens when the chart and its metadata cannot fit together. The plot keeps a
minimum height of 140px so its ticks and supplier segments remain readable.

## Packages

### Trade focus chart

Figure II.9 uses `trade/ChartFocusTrade.jsx` instead of the Datawrapper embed.
Its five stages show the axes, geographic distance, compatibility through 2018,
the full compatibility trend, and both lines with endpoint labels. Data in
`trade/data.js` preserves the published values from chart `JvXMb`, version 2.
The scale is 99–103 with a marked 2015 = 100 baseline. Endpoint labels show only
the value in the matching line colour. The metadata and CSV
download stay inside the chart, including the academic-measure disclaimer.
Gridlines and inline y-axis labels start at the plot edge, while the 2015 data
points are inset to prevent the lines from covering the labels.
Hover or tap the plot for a shared yearly tooltip and tracking markers. Only
series revealed by the current stage appear, including compatibility through
2018 in its introductory stage. Keyboard users can focus the plot and use arrow
keys, Home, End and Escape. Changing stages or resizing dismisses the tooltip.

All focus charts use `shared/FocusChartStory.jsx` for scroll activation and the
existing responsive focus layout. Reduced-motion users see the trade chart's
final frame throughout the narrative; print also shows the final frame.

### Strategic investment focus chart

Figure III.6 uses `investment/ChartFocusInvestment.jsx`, with published data from
Datawrapper chart `9IWbQ`, version 3. Non-strategic sectors appear first (49/51),
followed by an empty strategic-sector band, semiconductors and advanced
technologies, AI and energy transition, critical minerals, and the complete chart.
The source and CSV download remain in the chart wrapper. Reduced-motion and
print views show all sector pairs. All three focus-chart titles are black, with
44px arrows centred against the title block and Inter at weight 700. Desktop
titles use the 24px token and compact line spacing; small screens use the 16px
token.
Focus-chart legends use `--un-color-grey-darkest` Inter labels, with line keys for the trade chart
and square keys for the bar charts. Source and note text uses Datawrapper's black
12px treatment; source-only organization names have no trailing full stop.

The following packages are used in this project by default.

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** — shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `Image`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles
* **@unctad-infovis/minisite-tools** — report/minisite layout components (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`)

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* none yet — `d3`, `highcharts` and `uuid4` (used by the sibling report projects for data visualisations) will be added once the first TDR chart is built

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components
