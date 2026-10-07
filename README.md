# 2026-tdr_report

**Live demo** https://unctad-infovis.github.io/2026-tdr_report/

## About

The Trade and Development Report (TDR) is an annual UNCTAD flagship publication
analysing global macroeconomic and development trends. This project is the
interactive web publication page for the 2026 edition: a scrollytelling minisite
with narrative text, data visualisations and chapter navigation.

Content is authored in MDX (`src/Article.mdx`) and rendered as a standalone React
application that is embedded within UNCTAD's Drupal platform.

The site has an introduction and three chapters. Each chapter opens with a
side-scrolling image section, followed by the chapter header, a takeaway box, an
"In numbers" data sheet, the narrative with Datawrapper charts and a custom D3
focus chart, and calls to action. A footer links to the full report and video.

Developer handover notes and working rules are in [`CLAUDE.md`](CLAUDE.md).

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

### Entry points

* `index.html` – the complete report minisite.
* `marimekko-focus.html` – the AI-server-rack chart with its scroll-driven explanation.
* `marimekko-chart.html` – the interactive AI-server-rack chart only, for embedding without the story.

### Standalone Chapter I focus chart

The full report remains at `index.html`. Open `marimekko-focus.html` to use the
AI-server-rack focus chart on its own, with the same five scroll stages,
responsive layout, tooltips, source, note and CSV download. It omits the report
header, chapter text, navigation and footer.

Local preview: http://localhost:8080/marimekko-focus.html

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-tdr_report/js/2026-tdr_report.marimekko-focus.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-tdr_report/css/2026-tdr_report.min.css?v=1">
<div class="app-root-2026-tdr_report" id="app-root-2026-tdr_report-marimekko-focus">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

### Standalone interactive chart

Open `marimekko-chart.html` to show only the interactive AI-server-rack
Marimekko chart, without the scrolling narrative or focus-chart progression.
It includes the chart title, legend, tooltips, source, note and CSV download.

Local preview: http://localhost:8080/marimekko-chart.html

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-tdr_report/js/2026-tdr_report.marimekko-chart.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-tdr_report/css/2026-tdr_report.min.css?v=1">
<div class="app-root-2026-tdr_report" id="app-root-2026-tdr_report-marimekko-chart">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Each entry uses a unique root ID, so the standalone chart and report can also
coexist on one page. All entries use the same combined stylesheet. Keep the
outer script and stylesheet `?v=` parameters up to date when deploying.
Shared JavaScript chunks use content-hashed filenames, following
`2026-global_trade_update`, so changes automatically bypass Azure/CDN caches
even though query parameters on an entry script do not propagate to its imports.

## Used in

* [Trade and Development Report 2026](https://unctad.org/publication/trade-and-development-report-2026)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install` (requires a `GITHUB_PACKAGES_TOKEN` environment variable, see Packages)
* `npm run start`

Project should start at: http://localhost:8080

* `npx biome check src` – lint and format check (`npm run lint:fix` to fix).

For developing please refer to `package.json`.

### Deployment

* `npm run build` – production bundle into `dist/` (runs `scripts/postbuild.js` to
  rewrite absolute HTML and CSS asset paths to relative for all entry points).
  Vite content-hashes all shared JavaScript chunks and their imports. `dist/` is
  committed.
* `npm run push` – push `main` to both remotes: `origin` (GitHub) and `unctad` (Azure DevOps).
* `npm run sync-gh-pages` – push `dist/` to the `gh-pages` branch for the live demo.
* `npm run login` – Azure service-principal login (needs `AZURE_USER`, `AZURE_PW`, `AZURE_TENANT`).
* `npm run sync-prod` – copy `js`, `css` and `assets` from the build to Azure blob
  storage (`storage.unctad.org`, needs `AZURE_STORAGE_NAME`).

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

* `src/meta.json` – report title, subtitle, year, hero image, overview/full-report
  URLs, chapter list (titles, subtitles, images, chapter PDF URLs) and footer content.
* `src/Article.mdx` – the full narrative (copy + component placement).
* `src/jsx/App.jsx` – component registry passed to the MDX and theme colours.
* `src/jsx/IndexMarimekkoFocus.jsx` – standalone Chapter I scroll-story entry.
* `src/jsx/IndexMarimekkoChart.jsx` – standalone interactive chart entry, without the scroll story.
* `src/jsx/App.css` – project-specific layout and narrative styles.
* `src/jsx/components/minisite/` – local hero (`Header`), `HeaderChapter`, `Footer`
  and `InNumbers` components.
* `src/jsx/components/marimekko|trade|investment/` – the three D3 focus charts.
* `public/assets/img/` – images. The hero uses `2026-tdr_report_main_v2.jpg`;
  `2026-tdr_report_main.jpg` is kept as an alternative.

### Content driven by `meta.json`

* Chapter PDF download buttons (hero cards and chapter headers) appear only when
  the chapter's `pdf_url` is set.
* Footer blocks appear only when their content exists under `footer`: the video
  (`video_url`), language links, the launch event (`launch_event_url`) and media
  links. Items with an empty `url` are hidden.

### In numbers data sheets

Each chapter has an `InNumbers` sheet after its takeaway box: a count-up headline
figure, one visual (`bars`, a flag `pair` or a `share` bar) and up to three facts
with line icons (see the `ICONS` map in `InNumbers.jsx`).

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

* **@unctad-infovis/general-tools** – shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `CircleFlag`, `Image`, `RollingNumber`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles
* **@unctad-infovis/minisite-tools** – report/minisite layout components (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`)

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* **d3** – the three custom focus charts (Marimekko, trade, investment). Other charts are Datawrapper embeds via `ChartDataWrapper`.

### Build & Dev Server

* **vite** – development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** – adds React and JSX support to Vite

### React

* **react** – UI component library
* **react-dom** – renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** – formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** – minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** – Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** – provides React context for MDX components
