import { decorateIcons, loadScript, loadCSS } from './aem.js';

const VIDEO_JS_SCRIPT = 'https://vjs.zencdn.net/8.3.0/video.min.js';
const VIDEO_JS_CSS = 'https://vjs.zencdn.net/8.3.0/video-js.min.css';
const VIDEO_URL_REGEX = /assets\/urn:aaid:aem:[\w-]+\/[manifest.mpd|manifest.m3u8|play]/;
let videoJsScriptPromise;

function getDeviceSpecificVideoUrl(videoUrl) {
  const { userAgent } = navigator;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = (/Safari/i).test(userAgent) && !(/Chrome/i).test(userAgent) && !(/CriOs/i).test(userAgent) && !(/Android/i).test(userAgent) && !(/Edg/i).test(userAgent);

  const manifest = (isIOS || isSafari) ? 'manifest.m3u8' : 'manifest.mpd';
  return videoUrl.replace(/manifest\.mpd|manifest\.m3u8|play/, manifest);
}

export async function loadVideoJs() {
  if (videoJsScriptPromise) {
    await videoJsScriptPromise;
    return;
  }

  videoJsScriptPromise = Promise.all([
    loadCSS(VIDEO_JS_CSS),
    loadScript(VIDEO_JS_SCRIPT),
  ]);

  await videoJsScriptPromise;
}

function parseConfig(block) {
  if (block.classList.contains('video')) {
    return [];
  }

  const links = block.querySelectorAll('a');
  const videoLinks = [...links].filter((link) => link.href.match(VIDEO_URL_REGEX));
  if (videoLinks.length === 0) {
    return [];
  }

  return videoLinks.map((link) => {
    let parent = link.parentElement;
    let level = 2;
    let posterImage;
    while (parent && level > 0) {
      posterImage = parent.querySelector('picture');
      if (posterImage) {
        break;
      }

      parent = parent.parentElement;
      level -= 1;
    }

    return {
      link,
      posterImage,
      container: parent,
    };
  });
}

function setupAutopause(videoElement, player) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        player.play();
      } else {
        player.pause();
      }
    });
  }, {
    threshold: [0.5],
  });

  observer.observe(videoElement);
}

function isImageFormatSupported(format) {
  if (['image/jpeg', 'image/png'].includes(format)) {
    return true;
  }

  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL(format).indexOf(`data:${format}`) === 0;
  }

  return false;
}

function getPosterImage(posterElement) {
  const img = posterElement.querySelector('img');
  const sources = posterElement.querySelectorAll('source');
  if (!sources || !img) {
    return null;
  }

  const supportedSources = [...sources].filter((source) => {
    const format = source.getAttribute('type');
    const media = source.getAttribute('media');
    return isImageFormatSupported(format) && (window.matchMedia(media).matches || !media);
  });

  if (supportedSources.length === 0) {
    return img.src;
  }

  return supportedSources[0].srcset;
}

function setupPlayer(url, videoContainer, config) {
  const videoElement = document.createElement('video');
  videoElement.classList.add('video-js');
  videoElement.id = `video-${Math.random().toString(36).substr(2, 9)}`;
  if (config.playsinline || config.autoplay) {
    videoElement.setAttribute('playsinline', '');
  }

  videoContainer.append(videoElement);

  const poster = config.poster ? getPosterImage(config.poster) : null;
  const videojsConfig = {
    ...config,
    preload: poster && !config.autoplay ? 'none' : 'auto',
    poster,
  };

  if (config.autoplay) {
    videojsConfig.muted = true;
    videojsConfig.loop = true;
    videojsConfig.autoplay = true;
  }

  // eslint-disable-next-line no-undef
  const player = videojs(videoElement, videojsConfig);
  player.src(url);

  player.ready(() => {
    if (config.autoplay) {
      setupAutopause(videoElement, player);
    }
  });

  return player;
}

function removePlaceholders(container, videoLink, posterImage) {
  const remove = (element) => {
    let parent = element.parentElement;
    let singleChildParent = element;

    while (parent && parent !== container) {
      if (parent.children.length > 1) {
        break;
      }

      singleChildParent = parent;
      parent = parent.parentElement;
    }

    singleChildParent.remove();
  };

  remove(videoLink);
  if (posterImage) {
    remove(posterImage);
  }
}

function closeModal() {
  const dialog = document.querySelector('.video-modal-dialog');
  dialog.querySelector('.video-container').innerHTML = '';

  // eslint-disable-next-line no-use-before-define
  window.removeEventListener('click', handleOutsideClick);
  // eslint-disable-next-line no-use-before-define
  window.removeEventListener('keydown', handleEscapeKey);

  dialog.close();
  document.body.style.overflow = '';
}

function handleOutsideClick(event) {
  const modal = document.querySelector('.video-modal-dialog');
  if (event.target === modal) {
    closeModal();
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

async function openModal(config) {
  await loadVideoJs();

  const dialog = document.querySelector('.video-modal-dialog');
  const container = dialog.querySelector('.video-container');
  setupPlayer(config.videoUrl, container, {
    bigPlayButton: false,
    fluid: true,
    controls: true,
    playsinline: true,
    autoplay: true,
  });

  window.addEventListener('click', handleOutsideClick);
  window.addEventListener('keydown', handleEscapeKey);

  dialog.showModal();
  document.body.style.overflow = 'hidden';
}

function createModal() {
  const modal = document.createElement('dialog');
  modal.classList.add('video-modal-dialog');

  const container = document.createElement('div');
  container.classList.add('video-modal');

  const header = document.createElement('div');
  header.classList.add('video-modal-header');

  const closeIcon = document.createElement('span');
  closeIcon.classList.add('icon');
  closeIcon.classList.add('icon-close');
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Close dialog');
  closeBtn.classList.add('video-modal-close');
  closeBtn.append(closeIcon);
  closeBtn.addEventListener('click', () => {
    closeModal();
  });

  header.append(closeBtn);
  decorateIcons(header);

  container.append(header);

  const content = document.createElement('div');
  content.classList.add('video-modal-content');

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container');
  content.append(videoContainer);

  container.append(content);
  modal.append(container);
  document.body.append(modal);
}

async function decorateVideoModal(block, config) {
  const container = document.createElement('div');
  container.classList.add('video-component');

  const posterImage = config.posterImage.cloneNode(true);
  const playButton = document.createElement('button');
  playButton.setAttribute('aria-label', 'Play video');
  playButton.classList.add('video-play-button');

  const playIcon = document.createElement('span');
  playIcon.classList.add('icon');
  playIcon.classList.add('icon-play-video');
  playButton.append(playIcon);
  decorateIcons(playButton);

  playButton.addEventListener('click', async () => {
    await openModal(config);
  });

  container.append(posterImage);
  container.append(playButton);

  block.append(container);

  const hasVideoModal = document.querySelector('.video-modal-dialog');
  if (!hasVideoModal) {
    createModal();
  }
}

export async function decorateVideos(block) {
  const config = parseConfig(block);
  if (!config) {
    return;
  }

  await Promise.all(config.map(async (videoConfig) => {
    const {
      container,
      link,
      posterImage,
    } = videoConfig;

    removePlaceholders(container, link, posterImage);

    decorateVideoModal(container, {
      ...videoConfig,
      videoUrl: getDeviceSpecificVideoUrl(link.href),
    });
  }));
}
