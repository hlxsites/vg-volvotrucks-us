import { selectVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('embed-video');

  const links = block.querySelectorAll('a');
  const selectedLink = selectVideoLink(links);
  const iframe = document.createElement('iframe');

  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('src', selectedLink);
  iframe.classList.add('embed-video-iframe');

  block.innerHTML = '';
  videoWrapper.appendChild(iframe);
  block.appendChild(videoWrapper);
}
