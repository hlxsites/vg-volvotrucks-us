import { selectVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('embed-video');

  const links = block.querySelectorAll('a');
  const selectedLink = selectVideoLink(links);
  const iframe = document.createElement('iframe');

  block.innerHTML = '';
  block.appendChild(videoWrapper);

  const loadEmbed = () => {
    if (iframe.classList.contains('embed-video-iframe-loaded') || !selectedLink) {
      return;
    }

    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', selectedLink.getAttribute('href'));
    iframe.classList.add('embed-video-iframe');
    iframe.classList.add('embed-video-iframe-loaded');

    videoWrapper.appendChild(iframe);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed();
    }
  });
  observer.observe(block);
}
