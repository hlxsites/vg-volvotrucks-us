import { createElement, getTextLabel } from './common.js';

/* video helpers */
export function isLowResolutionVideoUrl(url) {
  return (typeof url === 'string') && url.split('?')[0].endsWith('.mp4');
}

export function isVideoLink(link) {
  const linkString = link.getAttribute('href');
  return (linkString.includes('youtube.com/embed/')
      || isLowResolutionVideoUrl(linkString))
    && link.closest('.block.embed') === null;
}

export function selectVideoLink(links, preferredType) {
  const linksList = [...links];
  const optanonConsentCookieValue = decodeURIComponent(document.cookie.split(';').find((cookie) => cookie.trim().startsWith('OptanonConsent=')));
  const cookieConsentForExternalVideos = optanonConsentCookieValue.includes('C0005:1');
  const shouldUseYouTubeLinks = cookieConsentForExternalVideos && preferredType !== 'local';
  const youTubeLink = linksList.find((link) => link.getAttribute('href').includes('youtube.com/embed/'));
  const localMediaLink = linksList.find((link) => link.getAttribute('href').split('?')[0].endsWith('.mp4'));

  if (shouldUseYouTubeLinks && youTubeLink) {
    return youTubeLink;
  }
  return localMediaLink;
}

export function createLowResolutionBanner() {
  const lowResolutionMessage = getTextLabel('Low resolution video message');
  const changeCookieSettings = getTextLabel('Change cookie settings');

  const banner = document.createElement('div');
  banner.classList.add('low-resolution-banner');
  banner.innerHTML = `${lowResolutionMessage} <button class="low-resolution-banner-cookie-settings">${changeCookieSettings}</button>`;
  banner.querySelector('button').addEventListener('click', () => {
    window.OneTrust.ToggleInfoDisplay();
  });

  return banner;
}

export function showVideoModal(linkUrl) {
  // eslint-disable-next-line import/no-cycle
  import('../common/modal/modal.js').then((modal) => {
    let beforeBanner = null;

    if (isLowResolutionVideoUrl(linkUrl)) {
      beforeBanner = createLowResolutionBanner();
    }

    modal.showModal(linkUrl, { beforeBanner });
  });
}

export function addVideoShowHandler(link) {
  link.classList.add('text-link-with-video');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    showVideoModal(link.getAttribute('href'));
  });
}

export function isSoundcloudLink(link) {
  return link.getAttribute('href').includes('soundcloud.com/player')
    && link.closest('.block.embed') === null;
}

export function addSoundcloudShowHandler(link) {
  link.classList.add('text-link-with-soundcloud');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    const thumbnail = link.closest('div')?.querySelector('picture');
    const title = link.closest('div')?.querySelector('h1, h2, h3');
    const text = link.closest('div')?.querySelector('p:not(.button-container, .image)');

    // eslint-disable-next-line import/no-cycle
    import('../common/modal/modal.js').then((modal) => {
      const episodeInfo = document.createElement('div');
      episodeInfo.classList.add('modal-soundcloud');
      episodeInfo.innerHTML = `<div class="episode-image"><picture></div>
      <div class="episode-text">
          <h2></h2>
          <p></p>
      </div>`;
      episodeInfo.querySelector('picture').innerHTML = thumbnail?.innerHTML || '';
      episodeInfo.querySelector('h2').innerText = title?.innerText || '';
      episodeInfo.querySelector('p').innerText = text?.innerText || '';

      modal.showModal(link.getAttribute('href'), { beforeIframe: episodeInfo });
    });
  });
}

export function addPlayIcon(parent) {
  const playButton = document.createRange().createContextualFragment(`
    <span class="icon icon-play-video">
      <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="30" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3312 35.9998L29.3312 24.4528L29.3312 47.5468L49.3312 35.9998ZM44.3312 35.9998L31.8312 28.7829L31.8312 43.2167L44.3312 35.9998Z" fill="#141414"/>
      </svg>
    </span>`);

  parent.appendChild(playButton);
}

export function wrapImageWithVideoLink(videoLink, image) {
  videoLink.innerText = '';
  videoLink.appendChild(image);
  videoLink.classList.add('link-with-video');
  videoLink.classList.remove('button', 'primary', 'text-link-with-video');
  addPlayIcon(videoLink);
}

export function createIframe(url, { parentEl, classes = [] }) {
  // iframe must be recreated every time otherwise the new history record would be created
  const iframe = createElement('iframe', {
    classes: Array.isArray(classes) ? classes : [classes],
    props: {
      frameborder: '0',
      allowfullscreen: 'allowfullscreen',
      src: url,
    },
  });

  if (parentEl) {
    parentEl.appendChild(iframe);
  }

  return iframe;
}

export function setPlaybackControls() {
  const playbackControls = document.querySelectorAll('video > button');
  playbackControls.forEach((control) => {
    const { parentElement } = control.parentElement;
    parentElement.append(control);
  });
}

export const createVideo = (src, className = '', props = {}) => {
  const video = createElement('video', {
    classes: className,
  });
  if (props.muted) {
    video.muted = props.muted;
  }

  if (props.autoplay) {
    video.autoplay = props.autoplay;
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      video.setAttribute(propName, props[propName]);
    });
  }

  const source = createElement('source', {
    props: {
      src,
      type: 'video/mp4',
    },
  });

  // Playback controls - play and pause button
  const playPauseButton = createElement('button', {
    props: { type: 'button', class: 'v2-video__playback-button' },
  });

  const videoControls = document.createRange().createContextualFragment(`
    <span class="icon icon-pause-video">
       <svg width="27" height="27" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="30" fill="white"/>
          <rect x="28.25" y="24.45" width="2.75" height="23.09" fill="#141414"/>
          <rect x="41" y="24.45" width="2.75" height="23.09" fill="#141414"/>
       </svg>
    </span>
    <span class="icon icon-play-video">
      <svg width="27" height="27" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="30" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3312 35.9998L29.3312 24.4528L29.3312 47.5468L49.3312 35.9998ZM44.3312 35.9998L31.8312 28.7829L31.8312 43.2167L44.3312 35.9998Z" fill="#141414"/>
      </svg>
    </span>`);

  playPauseButton.append(...videoControls.children);
  video.appendChild(playPauseButton);

  const playIcon = video.querySelector('.icon-play-video');
  const pauseIcon = video.querySelector('.icon-pause-video');

  const pauseVideoLabel = getTextLabel('Pause video');
  const playVideoLabel = getTextLabel('Play video');

  playPauseButton.setAttribute('aria-label', pauseVideoLabel);

  // Toggle the play/pause icon on click
  playPauseButton.addEventListener('click', () => {
    const isPaused = video.paused;
    video[isPaused ? 'play' : 'pause']();
    if (!isPaused) {
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'flex';
      playPauseButton.setAttribute('aria-label', playVideoLabel);
    } else {
      pauseIcon.style.display = 'flex';
      playIcon.style.display = 'none';
      playPauseButton.setAttribute('aria-label', pauseVideoLabel);
    }
  });

  setPlaybackControls();
  video.appendChild(source);

  return video;
};
