import { ffetch } from '../../scripts/lib-ffetch.js';
import {
  createOptimizedPicture,
  getMetadata,
  decorateIcons,
} from '../../scripts/aem.js';
import {
  createElement,
  getLanguagePath,
  getOrigin,
} from '../../scripts/common.js';
import { smoothScrollHorizontal } from '../../scripts/motion-helper.js';

const blockName = 'v2-stories-carousel';
const locale = getMetadata('locale');

const updateActiveClass = (elements, targetElement) => {
  elements.forEach((el) => {
    if (el === targetElement) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
};

const listenScroll = (carousel) => {
  const elements = carousel.querySelectorAll(':scope > *');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveClass(elements, entry.target);
      }
    });
  }, {
    root: carousel,
    threshold: 1,
  });

  elements.forEach((el) => io.observe(el));
};

const getScrollOffset = (carousel) => {
  const first = carousel.firstElementChild;
  const second = first.nextElementSibling;
  return second.getBoundingClientRect().x - first.getBoundingClientRect().x;
};

const updateArrowButtonsState = (carousel, arrowLeftButton, arrowRightButton, index) => {
  const isAtStart = index === 0;
  const isAtEnd = index === carousel.childElementCount - 1;

  arrowLeftButton.disabled = isAtStart;
  arrowRightButton.disabled = isAtEnd;
};

const setCarouselPosition = (carousel, index, arrowLeftButton, arrowRightButton) => {
  const elements = carousel.querySelectorAll(':scope > *');
  const scrollOffset = getScrollOffset(carousel);
  const targetX = index * scrollOffset;

  smoothScrollHorizontal(carousel, targetX, 500);
  updateActiveClass(elements, elements[index]);
  updateArrowButtonsState(carousel, arrowLeftButton, arrowRightButton, index);
};

const navigate = (carousel, direction, arrowLeftButton, arrowRightButton) => {
  if (carousel.classList.contains('is-animating')) return;

  const activeItem = carousel.querySelector(`.${blockName}-item.active`);
  let index = [...activeItem.parentNode.children].indexOf(activeItem);

  if (direction === 'left') {
    index -= 1;
    if (index === -1) {
      index = 0;
    }
  } else {
    index += 1;
    if (index > carousel.childElementCount - 1) {
      index = carousel.childElementCount - 1;
    }
  }

  setCarouselPosition(carousel, index, arrowLeftButton, arrowRightButton);
};

const createArrowButton = (direction) => {
  const button = createElement('button', { classes: [`${blockName}-arrowbutton`] });
  button.setAttribute('aria-label', direction === 'left' ? 'Previous' : 'Next');
  const icon = createElement('span', { classes: ['icon', `icon-arrow-${direction}`] });
  button.append(icon);
  return button;
};

const createArrowControls = (carousel) => {
  const arrowControls = createElement('ul', { classes: [`${blockName}-arrowcontrols`] });
  const arrowLeftButton = createArrowButton('left');
  const arrowRightButton = createArrowButton('right');

  const leftArrowListItem = createElement('li');
  leftArrowListItem.append(arrowLeftButton);

  const rightArrowListItem = createElement('li');
  rightArrowListItem.append(arrowRightButton);

  arrowControls.append(leftArrowListItem, rightArrowListItem);
  carousel.insertAdjacentElement('beforebegin', arrowControls);

  decorateIcons(arrowControls);

  arrowLeftButton.addEventListener('click', () => navigate(carousel, 'left', arrowLeftButton, arrowRightButton));
  arrowRightButton.addEventListener('click', () => navigate(carousel, 'right', arrowLeftButton, arrowRightButton));

  updateArrowButtonsState(carousel, arrowLeftButton, arrowRightButton, 0);

  return arrowControls;
};

const getMagazineArticles = async (limit = 5) => {
  const indexUrl = new URL(`${getLanguagePath()}magazine-articles.json`, getOrigin());
  const articles = ffetch(indexUrl).limit(limit).all();

  return articles;
};

const buildStoryCard = (entry) => {
  const {
    path,
    image,
    title: originalTitle,
    description,
    linkText,
    publishDate,
    readingTime,
  } = entry;
  const title = originalTitle.split('|')[0].trim();
  const li = createElement('article', { classes: `${blockName}-item` });
  const picture = createOptimizedPicture(image, title, false);
  const pictureTag = picture.outerHTML;
  const readMore = (linkText || 'Read full story');
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
  const svgArrowRight = `<span class="icon icon-arrow-right"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1464 5.6463C13.3417 5.45104 13.6583 5.45104 13.8536 5.6463L19.8536 11.6463C20.0488 11.8416 20.0488 12.1581 19.8536 12.3534L13.8536 18.3535C13.6583 18.5488 13.3417 18.5488 13.1465 18.3536C12.9512 18.1583 12.9512 17.8417 13.1464 17.6465L18.2929 12.4999L4.5 12.4999C4.22386 12.4999 4 12.276 4 11.9999C4 11.7237 4.22386 11.4999 4.5 11.4999L18.2929 11.4999L13.1464 6.35341C12.9512 6.15815 12.9512 5.84157 13.1464 5.6463Z" fill="currentColor"/>
  </svg></span>`;
  const card = document.createRange().createContextualFragment(`
    <a href="${path}">
      ${pictureTag}
    </a>
    <div class="${blockName}-text">
      <h3>${title}</h3>
      <p>${description}</p>
      <ul class="${blockName}-meta">
        <li class="${blockName}-date">
          <time datetime="${date}" pubdate="pubdate">
            ${date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        </li>
        <li class="${blockName}-timetoread">
          <span>${readingTime} read</span>
        </li>
      </ul>
      <a href="${path}" class="${blockName}-cta button tertiary">
        ${readMore}
        ${svgArrowRight}
      </a>
    </div>`);
  li.append(...card.children);
  return li;
};

const createStoriesCarousel = (block, stories) => {
  const storiesSection = createElement('section', { classes: `${blockName}-items` });
  block.appendChild(storiesSection);
  stories.forEach((entry) => {
    const storyArticle = buildStoryCard(entry);
    storiesSection.appendChild(storyArticle);
  });
};

export default async function decorate(block) {
  let limit = parseFloat(block.textContent.trim()) || 5;
  if (limit < 3) limit = 3;

  block.innerHTML = '';
  const stories = await getMagazineArticles(limit);
  createStoriesCarousel(block, stories);

  const carousel = block.querySelector(`.${blockName}-items`);

  const arrowControls = createArrowControls(carousel);
  const arrowLeftButton = arrowControls.querySelector('button[aria-label="Previous"]');
  const arrowRightButton = arrowControls.querySelector('button[aria-label="Next"]');

  listenScroll(carousel);
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (carousel) {
        // Scroll to the second item
        setCarouselPosition(carousel, 1, arrowLeftButton, arrowRightButton);
      }
    });
  });
}
