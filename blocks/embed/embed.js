export default function decorate(block) {
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('embed-video');

  const videoLinkEl = block.querySelector('a');

  if (videoLinkEl) {
    const link = videoLinkEl.getAttribute('href');
    const iframe = document.createElement('iframe');

    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', link);
    iframe.classList.add('embed-video-iframe');

    block.innerHTML = '';

    videoWrapper.appendChild(iframe);
    block.appendChild(videoWrapper);
  }

  block.appendChild(videoWrapper);
}
