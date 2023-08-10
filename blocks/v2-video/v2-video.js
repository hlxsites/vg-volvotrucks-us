import { createElement } from '../../scripts/scripts.js';

const onHoverOrScroll = (element, handler) => {
  let isInViewport = false;
  let isMouseOver = false;
  const onChange = () => {
    handler(isInViewport || isMouseOver);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isInViewport = entry.intersectionRatio >= 0.5;
        onChange();
      }
    });
  }, {
    threshold: [0.4, 0.5, 0.6],
  });
  observer.observe(element);

  element.addEventListener('mouseover', () => {
    isMouseOver = true;
    onChange();
  });

  element.addEventListener('mouseout', () => {
    isMouseOver = false;
    onChange();
  });
};

export default async function decorate(block) {
  const blockClass = 'v2-video';
  const videoLink = block.querySelector('a');
  const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const ctaButtons = block.querySelectorAll('.button-container a');
  const contentWrapper = block.querySelector(':scope > div');
  const content = block.querySelector(':scope > div > div');

  if (!videoLink) {
    // eslint-disable-next-line no-console
    console.warn('Video for v2-video block is required and not provided. The block will not render!');
    block.innerHTML = '';
  }

  const video = createElement('video', [`${blockClass}__video`], {
    loop: 'loop',
  });
  video.muted = true;
  video.autoplay = true;

  const source = createElement('source', '', {
    src: videoLink.getAttribute('href'),
    type: 'video/mp4',
  });
  video.appendChild(source);

  contentWrapper.classList.add(`${blockClass}__content-wrapper`);
  content.classList.add(`${blockClass}__content`);
  [...headings].forEach((heading) => heading.classList.add(`${blockClass}__heading`));
  [...ctaButtons].forEach((button) => button.classList.add(`${blockClass}__button`));

  videoLink.remove();
  block.prepend(video);

  onHoverOrScroll(block.querySelector(`.${blockClass}__content-wrapper`), (val) => {
    const action = val ? 'add' : 'remove';

    block.classList[action](`${blockClass}--full-width`);
  });
}
