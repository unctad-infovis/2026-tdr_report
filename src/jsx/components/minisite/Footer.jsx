import './Footer.css';

const hasUrl = link => Boolean(link?.label && link?.url);

function VideoEmbed({ title, url }) {
  const playerUrl = new URL(url);
  playerUrl.searchParams.set('autoplay', '0');
  return <div className="iframe_container iframe_16_9"><iframe allow="autoplay; fullscreen; picture-in-picture; encrypted-media" frameBorder="0" src={playerUrl.toString()} loading="lazy" title={title} /></div>;
}

function Footer({ content = {}, reportUrl = '' }) {
  const { language_links = [], video_title = '', video_url = '', launch_event_title = '', launch_event_url = '', media_links = [] } = content;
  const languageLinks = language_links.filter(hasUrl);
  const mediaLinks = media_links.filter(hasUrl);
  const hasElements = video_url || launch_event_url || mediaLinks.length > 0;

  if (!reportUrl && !hasElements) return null;

  return (
    <div className="footer_container">
      <h2>What do you want to do next?</h2>
      {reportUrl && (
        <div className="footer_download">
          <a href={reportUrl} target="_blank" rel="noreferrer">
            Download the full report
          </a>
        </div>
      )}
      {hasElements && (
        <div className="footer_elements">
          <div className="footer_element">
            <div className="footer_content">
              {video_url && (
                <>
                  <h3>Watch the video</h3>
                  <VideoEmbed title={video_title || 'Video'} url={video_url} />
                  {languageLinks.length > 0 && (
                    <p className="language_links">Also in{' '}
                      {languageLinks.map((link, index) => (
                        <span key={link.label}>
                          {index > 0 && ' · '}
                          <a href={link.url} lang={link.lang} dir={link.dir} target="_blank" rel="noreferrer"><bdi>{link.label}</bdi></a>
                        </span>
                      ))}
                    </p>
                  )}
                </>
              )}
              {launch_event_url && (
                <div>
                  <h4>Watch the launch event</h4>
                  <VideoEmbed title={launch_event_title || 'Launch event'} url={launch_event_url} />
                  {launch_event_title && <p>{launch_event_title}</p>}
                </div>
              )}
              {mediaLinks.length > 0 && (
                <div>
                  <h4>Media assets</h4>
                  <ul>
                    {mediaLinks.map(link => (
                      <li key={link.label}>
                        <a href={link.url} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
