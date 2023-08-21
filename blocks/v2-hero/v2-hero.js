import {
  createElement,
  isVideoLink,
  removeEmptyTags,
  variantsClassesToBEM,
} from '../../scripts/scripts.js';

const checkVideoTime = (event) => {
  const video = event.target;
  if (video.currentTime > 3) {
    video.pause();
    video.removeEventListener('timeupdate', checkVideoTime);
  }
};

const variantClasses = ['centered', 'left', 'bottom', 'dark'];

export default async function decorate(block) {
  const blockName = 'v2-hero';

  // add Hero variant classnames
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const picture = block.querySelector('picture');
  const link = block.querySelector('a');
  const isVideo = link ? isVideoLink(link) : false;
  if (isVideo) {
    const video = createElement('video', [`${blockName}__video`]);
    video.muted = true;
    video.autoplay = true;

    const source = createElement('source', '', {
      src: link.getAttribute('href'),
      type: 'video/mp4',
    });
    video.appendChild(source);
    block.prepend(video);
    link.remove();

    // prevent video to reproduce more than 3s
    video.addEventListener('timeupdate', checkVideoTime);
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
      const h1 = createElement('h1', `${blockName}__title`);
      h1.setAttribute('id', heading.getAttribute('id'));
      h1.innerHTML = heading.innerHTML;
      heading.parentNode.replaceChild(h1, heading);
    } else {
      heading.classList.add(`${blockName}__title`);
    }
  });

  const buttonsWrapper = createElement('div', `${blockName}__buttons-wrapper`);
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

  const scrollIcon = createElement('div', `${blockName}__scroll-icon`);
  block.append(scrollIcon);

  removeEmptyTags(content);

  block.parentElement.classList.add('full-width');
}
