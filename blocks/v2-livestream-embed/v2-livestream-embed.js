/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { loadScript } from '../../scripts/lib-franklin.js';
import { createElement, getTextLabel, isExternalVideoAllowed } from '../../scripts/common.js';
import { updateCookieValue } from '../../scripts/delayed.js';
import { hideModal } from '../../common/modal/modal.js';

let player;

function onPlayerReady(event) {
  console.info('Event: onPlayerReady');
  event.target.playVideo();
}

function onPlayerError(event) {
  console.warn('Event: onPlayerError');
  console.warn(event.data);
}

function onPlayerAutoplayBlocked(event) {
  console.warn('Event: onPlayerAutoplayBlocked');
  console.warn(event.data);
}

export function playVideo() {
  if (player && player.playVideo) {
    player.playVideo();
  }
}

export default function decorate(block) {
  loadScript('https://www.youtube.com/iframe_api');

  let [videoLink] = block.querySelectorAll('a');
  const [, videoId] = videoLink.getAttribute('href').split('/embed/');
  const [videoCode] = videoId.split('?');
  videoLink = videoCode;

  console.info(`video id: ${videoLink}`);

  if (!videoLink) {
    block.innerHTML = '';
    /* eslint-disable-next-line no-console */
    console.warn('V2 Livestream Embed block: There is no video link. Please check the provided URL.');
    return;
  }

  // eslint-disable-next-line func-names
  window.onYouTubeIframeAPIReady = function () {
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      player = new YT.Player('livestream', {
        events: {
          onReady: onPlayerReady,
          onError: onPlayerError,
          onAutoplayBlocked: onPlayerAutoplayBlocked,
        },
      });
    }, 3000);
  };

  if (!isExternalVideoAllowed()) {
    const img = block.querySelector('picture img');
    block.innerHTML = '';

    const cookieMsgContainer = createElement('div', {
      classes: 'cookie-message',
    });
    cookieMsgContainer.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.80) 100%), url(${img.src}) center / cover no-repeat`;

    const cookieMessage = document.createRange().createContextualFragment(`
      <h3 class="cookie-message__title">${getTextLabel('single video message title')}</h3>
      ${getTextLabel('single video message text')}
      <div class="cookie-message__button-container">
        <button class="primary dark">${getTextLabel('single video message button')}</button>
        <button class="button secondary dark">${getTextLabel('single video message button deny')}</button>
      </div>
    `);

    cookieMsgContainer.append(cookieMessage);
    block.append(cookieMsgContainer);

    block.querySelector('.cookie-message__button-container .primary')?.addEventListener('click', () => {
      const domain = 'localhost';
      const path = '/'; // assuming root path
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year from now
      const sameSite = 'Lax';

      console.log('updatecookie');

      updateCookieValue('OptanonConsent=', 'C0005:0', 'C0005:1', domain, path, expirationDate, sameSite);
    });

    block.querySelector('.cookie-message__button-container .secondary')?.addEventListener('click', () => {
      hideModal();
    });

    return;
  }

  const iframeYT = document.createRange().createContextualFragment(`
    <iframe class="v2-livestream-embed" id="livestream"
      frameborder="0" allowfullscreen="" allow="autoplay"
      src="https://www.youtube.com/embed/${videoLink}?color=white&amp;rel=0&amp;playsinline=1&amp;enablejsapi=1&amp;autoplay=1">
    </iframe>
  `);

  block.innerHTML = '';

  block.append(...iframeYT.childNodes);
}
