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
