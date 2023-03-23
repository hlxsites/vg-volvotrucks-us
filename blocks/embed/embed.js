import { selectVideoLink, addPlayIcon, showVideoModal } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isAutoplay = block.classList.contains('autoplay');
  const isLoopedVideo = block.classList.contains('loop');
  const isFullWidth = block.classList.contains('full-width');
  const videoWrapper = document.createElement('div');
  // removing classes to avoid collision with other css
  block.classList.remove('loop', 'autoplay', 'full-width');
  videoWrapper.classList.add('embed-video');

  const links = block.querySelectorAll('a');
  const selectedLink = selectVideoLink(links, isFullWidth ? 'local' : 'auto');
  const video = document.createElement('video');
  const source = document.createElement('source');

  video.appendChild(source);
  block.innerHTML = '';
  block.appendChild(videoWrapper);

  const loadEmbed = () => {
    if (video.classList.contains('embed-video-loaded') || !selectedLink) {
      return;
    }

    if (isAutoplay) {
      video.autoplay = true;
      // autoplay requires the video to be muted otherwise the autoplay
      // can be block by the browser
      // https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
      video.muted = true;
    }

    if (isLoopedVideo) {
      video.loop = true;
    }

    video.playsInline = true;
    video.classList.add('embed-video-element');
    video.classList.add('embed-video-loaded');
    source.setAttribute('src', selectedLink.getAttribute('href'));
    source.setAttribute('type', 'video/mp4');
    videoWrapper.appendChild(video);

    if (isFullWidth) {
      const link = document.createElement('a');
      link.setAttribute('href', selectVideoLink(links).getAttribute('href'));
      block.classList.add('embed-full-width');
      addPlayIcon(block);

      video.addEventListener('click', () => {
        showVideoModal(selectVideoLink(links).getAttribute('href'));
      });
    }
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed();
    }
  });
  observer.observe(block);
}
