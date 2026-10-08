import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';

import './ReportCard.css';

function ReportCard({ cover_url, languages = [] }) {
  const publishedLanguages = languages.filter(language => language.published && language.url);
  return (
    <section className="report_card" aria-labelledby="report_card_title">
      {cover_url && <img className="report_card_cover" src={resolveAsset(cover_url)} alt="Cover of the Trade and Development Report 2026" width="180" loading="lazy" />}
      <div className="report_card_content">
        <div className="report_card_label">FULL REPORT</div>
        <h3 id="report_card_title">Trade and Development Report 2026</h3>
        {publishedLanguages.length > 0 && (
          <>
            <p>Download the report in</p>
            <nav className="report_card_languages" aria-label="Full report PDF languages">
              {publishedLanguages.map(language => (
                <a key={language.code} href={language.url} hrefLang={language.code} lang={language.code} dir={language.code === 'ar' ? 'rtl' : undefined} target="_blank" rel="noreferrer">{language.label}</a>
              ))}
            </nav>
          </>
        )}
      </div>
    </section>
  );
}

export default ReportCard;
