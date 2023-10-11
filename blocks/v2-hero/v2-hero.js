import {
  isVideoLink,
  createVideo,
} from '../../scripts/video-helper.js';
import {
  createElement, getTextLabel,
  removeEmptyTags,
  variantsClassesToBEM,
} from '../../scripts/common.js';

const variantClasses = ['centered', 'left', 'bottom', 'dark'];

export default async function decorate(block) {
  const blockName = 'v2-hero';

  // add Hero variant classnames
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const picture = block.querySelector('picture');
  const link = block.querySelector('a');
  const isVideo = link ? isVideoLink(link) : false;
  if (isVideo) {
    const video = createVideo(link.getAttribute('href'), `${blockName}__video`, {
      muted: true,
      autoplay: true,
      loop: true,
      playsinline: true,
    });
    block.prepend(video);
    link.remove();

    // Hero video play/pause button icons
    const contentWrapper = block.querySelector(':scope > div');
    contentWrapper.classList.add(`${blockName}__content-wrapper`);

    const playPauseButton = createElement('button', {
      props: { type: 'button', class: 'v2-hero__playback-button' },
    });

    const pauseIconFragment = document.createRange().createContextualFragment(`
    <span class="icon icon-pause-video">
       <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="30" fill="white"/>
          <rect x="28.25" y="24.45" width="2.75" height="23.09" fill="#141414"/>
          <rect x="41" y="24.45" width="2.75" height="23.09" fill="#141414"/>
       </svg>
    </span>
    `);

    const playIconFragment = document.createRange().createContextualFragment(`
    <span class="icon icon-play-video">
       <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="36" cy="36" r="30" fill="white"/>
         <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3312 35.9998L29.3312 24.4528L29.3312 47.5468L49.3312 35.9998ZM44.3312 35.9998L31.8312 28.7829L31.8312 43.2167L44.3312 35.9998Z" fill="#141414"/>
       </svg>
    </span>
    `);

    playPauseButton.appendChild(pauseIconFragment);
    playPauseButton.appendChild(playIconFragment);
    contentWrapper.appendChild(playPauseButton);

    const playIcon = block.querySelector('.icon-play-video');
    const pauseIcon = block.querySelector('.icon-pause-video');

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
  }

  if (picture) {
    const img = picture.querySelector('img');
    img.classList.add(`${blockName}__image`);
    if (picture.parentElement.tagName === 'P') {
      picture.parentElement.remove();
    }
    block.prepend(picture);
  }

  const contentWrapper = block.querySelector(':scope > div');
  contentWrapper.classList.add(`${blockName}__content-wrapper`);

  const content = block.querySelector(':scope > div > div');
  content.classList.add(`${blockName}__content`);

  // convert all headings to h1
  const headings = [...content.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  headings.forEach((heading) => {
    if (heading.tagName !== 'H1') {
      const h1 = createElement('h1', { classes: `${blockName}__title` });
      h1.setAttribute('id', heading.getAttribute('id'));
      h1.innerHTML = heading.innerHTML;
      heading.parentNode.replaceChild(h1, heading);
    } else {
      heading.classList.add(`${blockName}__title`);
    }
  });

  const buttonsWrapper = createElement('div', { classes: `${blockName}__buttons-wrapper` });
  const ctaButtons = content.querySelectorAll('.button-container > a');
  [...ctaButtons].forEach((b, i) => {
    if (i > 0) { // change next buttons to be secondary
      b.classList.add('secondary');
      b.classList.remove('primary');
    }

    if (block.classList.contains(`${blockName}--dark`)) {
      b.classList.add('dark');
    }

    b.parentElement.remove();
    buttonsWrapper.appendChild(b);
  });
  content.appendChild(buttonsWrapper);

  const scrollIcon = createElement('div', { classes: `${blockName}__scroll-icon` });
  block.append(scrollIcon);

  removeEmptyTags(content);

  block.parentElement.classList.add('full-width');
}
