import { ffetch } from '../../scripts/lib-ffetch.js';
import {
  createOptimizedPicture,
  getMetadata,
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

const setCarouselPosition = (carousel, index) => {
  const elements = carousel.querySelectorAll(':scope > *');
  const scrollOffset = getScrollOffset(carousel);
  const targetX = index * scrollOffset;

  smoothScrollHorizontal(carousel, targetX, 500);
  updateActiveClass(elements, elements[index]);
};

const navigate = (carousel, direction) => {
  if (carousel.classList.contains('is-animating')) return;

  const activeItem = carousel.querySelector(`.${blockName}-item.active`);
  let index = [...activeItem.parentNode.children].indexOf(activeItem);

  if (direction === 'left') {
    index -= 1;
    if (index === -1) { // Go to the last item if at the start
      index = carousel.childElementCount - 1;
    }
  } else {
    index += 1;
    if (index > carousel.childElementCount - 1) {
      index = 0; // Go to the first item if at the end
    }
  }

  setCarouselPosition(carousel, index);
};

const createArrowControls = (carousel) => {
  const arrowControls = createElement('ul', { classes: [`${blockName}-arrowcontrols`] });
  const arrows = document.createRange().createContextualFragment(`
    <li>
      <button aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6276 3.03255C15.8458 3.20171 15.8856 3.51578 15.7165 3.73404L9.31099 11.9992L15.7165 20.2643C15.8856 20.4826 15.8458 20.7967 15.6276 20.9658C15.4093 21.135 15.0952 21.0952 14.9261 20.8769L8.2832 12.3055C8.14348 12.1252 8.14348 11.8732 8.2832 11.6929L14.9261 3.12147C15.0952 2.90321 15.4093 2.86339 15.6276 3.03255Z" fill="currentColor"/>
        </svg>
      </button>
    </li>
    <li>
      <button aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.37245 20.9674C8.15418 20.7983 8.11437 20.4842 8.28353 20.266L14.689 12.0008L8.28353 3.73567C8.11437 3.5174 8.15418 3.20333 8.37245 3.03418C8.59072 2.86502 8.90479 2.90483 9.07394 3.1231L15.7168 11.6945C15.8565 11.8748 15.8565 12.1268 15.7168 12.3071L9.07394 20.8785C8.90479 21.0968 8.59072 21.1366 8.37245 20.9674Z" fill="currentColor"/>
        </svg>
      </button>
    </li>
  `);
  arrowControls.append(...arrows.children);
  carousel.insertAdjacentElement('beforebegin', arrowControls);
  const [prevButton, nextButton] = arrowControls.querySelectorAll(':scope button');
  prevButton.addEventListener('click', () => navigate(carousel, 'left'));
  nextButton.addEventListener('click', () => navigate(carousel, 'right'));
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
    title,
    description,
    linkText,
    publishDate,
    author,
    readingTime,
  } = entry;
  const li = createElement('article', { classes: `${blockName}-item` });
  const picture = createOptimizedPicture(image, title, false);
  const pictureTag = picture.outerHTML;
  const readMore = (linkText || 'Read full story');
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
  const svgClock = `<span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.50977 12.0117C2.50977 7.04116 6.5392 3.01172 11.5098 3.01172C16.4803 3.01172 20.5098 7.04116 20.5098 12.0117C20.5098 16.9823 16.4803 21.0117 11.5098 21.0117C6.5392 21.0117 2.50977 16.9823 2.50977 12.0117ZM11.5098 2.01172C5.98692 2.01172 1.50977 6.48887 1.50977 12.0117C1.50977 17.5346 5.98692 22.0117 11.5098 22.0117C17.0326 22.0117 21.5098 17.5346 21.5098 12.0117C21.5098 6.48887 17.0326 2.01172 11.5098 2.01172ZM12.5098 6.01172C12.5098 5.73558 12.2859 5.51172 12.0098 5.51172C11.7336 5.51172 11.5098 5.73558 11.5098 6.01172V12.0117H7.50977C7.23362 12.0117 7.00977 12.2356 7.00977 12.5117C7.00977 12.7879 7.23362 13.0117 7.50977 13.0117H12.0098C12.2859 13.0117 12.5098 12.7879 12.5098 12.5117V6.01172Z" fill="currentColor"/>
  </svg></span>`;
  const svgCalendar = `<span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 3C7.77614 3 8 3.22386 8 3.5L8 6C8 6.27614 7.77614 6.5 7.5 6.5C7.22386 6.5 7 6.27614 7 6L7 3.5C7 3.22386 7.22386 3 7.5 3ZM16.5 3C16.7761 3 17 3.22386 17 3.5V6C17 6.27614 16.7761 6.5 16.5 6.5C16.2239 6.5 16 6.27614 16 6V3.5C16 3.22386 16.2239 3 16.5 3ZM3 5.5C3 5.22386 3.22386 5 3.5 5H5.73129C6.00744 5 6.23129 5.22386 6.23129 5.5C6.23129 5.77614 6.00744 6 5.73129 6H4L4 8.99609L20 8.99609V6H18.501C18.2248 6 18.001 5.77614 18.001 5.5C18.001 5.22386 18.2248 5 18.501 5H20.5C20.7761 5 21 5.22386 21 5.5L21 20.5C21 20.7761 20.7761 21 20.5 21L3.5 21C3.22386 21 3 20.7761 3 20.5L3 5.5ZM20 9.99609L4 9.99609L4 20L20 20L20 9.99609ZM8.99927 5.5C8.99927 5.22386 9.22313 5 9.49927 5L14.5027 5C14.7788 5 15.0027 5.22386 15.0027 5.5C15.0027 5.77614 14.7788 6 14.5027 6L9.49927 6C9.22313 6 8.99927 5.77614 8.99927 5.5Z" fill="currentColor"/>
  </svg></span>`;
  const svgUser = `<span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.04885 7.99609C8.04885 5.78695 9.83971 3.99609 12.0488 3.99609C14.2274 3.99609 16.0488 5.77576 16.0488 7.99609C16.0488 10.2052 14.258 11.9961 12.0488 11.9961C9.83971 11.9961 8.04885 10.2052 8.04885 7.99609ZM12.0488 2.99609C9.28742 2.99609 7.04885 5.23467 7.04885 7.99609C7.04885 9.74796 7.94981 11.2894 9.31366 12.1823C6.72461 12.5852 5.31661 13.6165 4.61191 15.0279C4.16935 15.9144 4.03702 16.8943 4.00722 17.8297C3.99226 18.2993 4.00304 18.7677 4.017 19.2149L4.02526 19.4707C4.03701 19.8283 4.04819 20.1686 4.04819 20.4961C4.04819 20.7723 4.27204 20.9961 4.54819 20.9961C4.82433 20.9961 5.04818 20.7723 5.04818 20.4961C5.04818 20.1505 5.03631 19.7897 5.02451 19.4309L5.01651 19.1837C5.00265 18.7395 4.99282 18.2976 5.00671 17.8616C5.03461 16.9859 5.15782 16.1732 5.5066 15.4746C6.17149 14.1429 7.78657 12.9961 12.0001 12.9961C16.2137 12.9961 17.8287 14.1429 18.4935 15.4746C18.8423 16.1732 18.9654 16.9858 18.9933 17.8616C19.0072 18.2976 18.9973 18.7395 18.9835 19.1837L18.9755 19.4307C18.9637 19.7895 18.9518 20.1504 18.9518 20.4961C18.9518 20.7723 19.1756 20.9961 19.4518 20.9961C19.7279 20.9961 19.9518 20.7723 19.9518 20.4961C19.9518 20.1686 19.963 19.8282 19.9747 19.4706L19.9747 19.4705L19.983 19.2149C19.9969 18.7677 20.0077 18.2993 19.9928 17.8298C19.963 16.8943 19.8307 15.9144 19.3882 15.0279C18.6907 13.6308 17.3041 12.6061 14.7649 12.1948C16.1395 11.3038 17.0488 9.75612 17.0488 7.99609C17.0488 5.21643 14.7726 2.99609 12.0488 2.99609Z" fill="currentColor"/>
  </svg></span>`;
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
        <li class="${blockName}-timetoread">
          ${svgClock}
          <span>${readingTime}</span>
        </li>
        <li class="${blockName}-author">
          ${svgUser}
          <address rel="author">${author}</address>
        </li>
        <li class="${blockName}-date">
          ${svgCalendar}
          <time datetime="${date}" pubdate="pubdate">${date.toLocaleDateString(locale)}</time>
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

  createArrowControls(carousel);
  listenScroll(carousel);
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (carousel) {
        setCarouselPosition(carousel, 1); // Scroll to the second item
      }
    });
  });
}
