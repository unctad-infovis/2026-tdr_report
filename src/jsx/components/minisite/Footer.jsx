import './Footer.css';

const hasUrl = link => Boolean(link?.label && link?.url);

function VideoEmbed({ title, url }) {
  return <div className="iframe_container iframe_16_9"><iframe allow="autoplay; fullscreen; picture-in-picture; encrypted-media" frameBorder="0" src={url} title={title} /></div>;
}

function Footer({ content = {}, reportUrl = '' }) {
  const { launch_event_title = '', launch_event_url = '', media_links = [] } = content;
  const mediaLinks = media_links.filter(hasUrl);
  const hasElements = launch_event_url || mediaLinks.length > 0;

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
