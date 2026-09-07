import crypto from 'node:crypto';
import fs from 'node:fs';

// Fix HTML: convert absolute paths to relative so the site works at any subpath.
for (const p of ['dist/index.html']) {
  const html = fs.readFileSync(p, 'utf8');
  fs.writeFileSync(p, html.replace(/href="\/(?!\/)/g, 'href="./').replace(/src="\/(?!\/)/g, 'src="./'));
}

// Add a content hash to the shared chunk's imports in the entry file so the CDN cache busts
// automatically. Rollup names the shared chunk after one of the modules bundled into it, which can
// change whenever imports move between local files and packages, so discover it instead of
// hardcoding it. If there is no shared chunk (single entry, nothing split out) this is a no-op.
const ENTRY_FILES = ['dist/js/2026-tdr_report.min.js'];
const sharedChunk = fs.readdirSync('dist/js').find(f => f.endsWith('.js') && !ENTRY_FILES.includes(`dist/js/${f}`));
if (sharedChunk) {
  const stylesContent = fs.readFileSync(`dist/js/${sharedChunk}`);
  const stylesHash = crypto.createHash('md5').update(stylesContent).digest('hex').slice(0, 8);
  const escapedChunk = sharedChunk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const entryPath of ENTRY_FILES) {
    if (!fs.existsSync(entryPath)) continue;
    fs.writeFileSync(entryPath, fs.readFileSync(entryPath, 'utf8').replace(new RegExp(`${escapedChunk}(?:\\?[^"']*)?`, 'g'), `${sharedChunk}?v=${stylesHash}`));
  }
}

// Fix CSS: convert absolute asset URLs to relative so they resolve correctly at subpaths
// (e.g. url('/assets/img/x.png') -> url('../assets/img/x.png') since CSS lives in dist/css/).
for (const p of fs.readdirSync('dist/css').map(f => `dist/css/${f}`)) {
  const css = fs.readFileSync(p, 'utf8');
  const fixed = css.replace(/url\(['"]?\/assets\//g, match => match.replace('/assets/', '../assets/'));
  fs.writeFileSync(p, fixed);
}
