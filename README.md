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

## Packages

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** — shared React components (`BackToTop`,
  `ChartDataWrapper`, `Image`, `ProgressBar`, `Quote`, `UNCTADSiteHeader`, …),
  helpers and base design-token styles.
* **@unctad-infovis/minisite-tools** — report/minisite layout components
  (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`).

These are published from the `un-init-project` monorepo to GitHub Packages, so
`.npmrc` + a `GITHUB_PACKAGES_TOKEN` env var are required to install.

### Build & Dev Server

* **vite** — dev server with HMR and production bundler.
* **@vitejs/plugin-react** — React / JSX support for Vite.

### React

* **react** / **react-dom** — UI library and DOM renderer.

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS.

### Minification

* **terser** — minifies the production bundle, drops `console.*` in production builds.

### MDX

* **@mdx-js/rollup** — compiles MDX files into React components.
* **@mdx-js/react** — React context provider for MDX components.

### To be added when charts arrive

`d3`, `highcharts` and `uuid4` are used by the sibling report projects for
data visualisations; add them here once the first TDR chart is built.
