import ButtonAnchor from '@unctad-infovis/general-tools/components/ButtonAnchor.jsx';
import Image from '@unctad-infovis/general-tools/components/Image.jsx';

import './HeaderChapter.css';

function HeaderChapter({ pdf_url, image_url, subtitle, title }) {
  return (
    <div className="container_chapter_header">
      <div>
        <h3>{title}</h3>
        <h4>{subtitle}</h4>
      </div>
      {pdf_url && <ButtonAnchor className="chapter_download" text="Download" url={pdf_url} />}
      <Image alt={title} image_url={image_url} parallax={false} />
    </div>
  );
}

export default HeaderChapter;
