import { removeEmptyTags, variantsClassesToBEM } from '../../scripts/common.js';
import { createVideo, setPlaybackControls } from '../../scripts/video-helper.js';

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

const variantClasses = ['expanding'];

export default async function decorate(block) {
  const blockName = 'v2-video';
  const videoLink = block.querySelector('a');
  const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const ctaButtons = block.querySelectorAll('.button-container a');
  const contentWrapper = block.querySelector(':scope > div');
  const content = block.querySelector(':scope > div > div');

  variantsClassesToBEM(block.classList, variantClasses, blockName);

  if (!videoLink) {
    // eslint-disable-next-line no-console
    console.warn('Video for v2-video block is required and not provided. The block will not render!');
    block.innerHTML = '';
  }

  const video = createVideo(videoLink.getAttribute('href'), `${blockName}__video`, {
    muted: true,
    autoplay: true,
    loop: true,
    playsinline: true,
  });

  contentWrapper.classList.add(`${blockName}__content-wrapper`);
  content.classList.add(`${blockName}__content`);
  [...headings].forEach((heading) => heading.classList.add(`${blockName}__heading`));
  [...ctaButtons].forEach((button) => {
    button.classList.add(`${blockName}__button`, 'dark');
  });

  videoLink.remove();

  block.prepend(video);

  setPlaybackControls();

  removeEmptyTags(block);

  if (contentWrapper.innerHTML.trim().length === 0) {
    contentWrapper.remove();
  }

  if (block.classList.contains(`${blockName}--expanding`)) {
    onHoverOrScroll(block, (val) => {
      const action = val ? 'add' : 'remove';

      block.classList[action](`${blockName}--full-width`);
    });
  } else {
    block.classList.add(`${blockName}--full-width`);
  }
}
