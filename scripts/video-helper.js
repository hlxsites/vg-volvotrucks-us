import { createElement, getTextLabel } from './common.js';

/* video helpers */
export function isLowResolutionVideoUrl(url) {
  return url.split('?')[0].endsWith('.mp4');
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

    modal.showModal(linkUrl, beforeBanner);
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

      modal.showModal(link.getAttribute('href'), null, episodeInfo);
    });
  });
}

export function addPlayIcon(parent) {
  const iconWrapper = createElement('div', { classes: 'video-icon-wrapper' });
  const icon = createElement('i', { classes: ['fa', 'fa-play', 'video-icon'] });
  iconWrapper.appendChild(icon);
  parent.appendChild(iconWrapper);
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

  video.appendChild(source);

  return video;
};
