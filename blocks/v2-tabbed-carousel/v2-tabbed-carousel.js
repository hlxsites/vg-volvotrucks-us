import { createElement } from '../../scripts/scripts.js';

const blockName = 'v2-tabbed-carousel';

function stripEmptyTags(main, child) {
  if (child !== main && child.innerHTML.trim() === '') {
    const parent = child.parentNode;
    child.remove();
    stripEmptyTags(main, parent);
  }
}

function buildTabNavigation(tabItems, clickHandler) {
  const tabNavigation = createElement('ul', `${blockName}__navigation`);
  [...tabItems].forEach((tabItem, i) => {
    const listItem = createElement('li');
    const button = createElement('button');
    button.addEventListener('click', () => clickHandler.call(this, i));
    const tabContent = tabItem.querySelector(':scope > div');
    button.innerHTML = tabContent.dataset.truckCarousel;
    listItem.append(button);
    tabNavigation.append(listItem);
  });
  return tabNavigation;
}

const updateActiveItem = (index) => {
  const images = document.querySelector(`.${blockName}__imagesContainer`);
  const descriptions = document.querySelector(`.${blockName}__descriptionContainer`);
  const navigation = document.querySelector(`.${blockName}__navigation`);

  [images, descriptions, navigation].forEach((c) => c.querySelectorAll('.active').forEach((i) => i.classList.remove('active')));
  images.children[index].classList.add('active');
  descriptions.children[index].classList.add('active');
  navigation.children[index].classList.add('active');
};

const listenScroll = (carousel) => {
  const elements = carousel.querySelectorAll(':scope > *');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting
        && entry.intersectionRatio >= 0.75
      ) {
        const activeItem = entry.target;
        const currentIndex = [...activeItem.parentNode.children].indexOf(activeItem);
        updateActiveItem(currentIndex);
      }
    });
  }, {
    root: carousel,
    threshold: 0.75,
  });

  elements.forEach((el) => {
    io.observe(el);
  });
};

const setCarouselPosition = (carousel, index) => {
  const firstEl = carousel.firstElementChild;
  const scrollOffset = firstEl.getBoundingClientRect().width;
  const style = window.getComputedStyle(firstEl);
  const marginleft = parseFloat(style.marginLeft);

  carousel.scrollTo({
    left: index * scrollOffset + marginleft,
    behavior: 'smooth',
  });
};

const createArrowControls = (imagesContainer) => {
  function scroll(direction) {
    const activeItem = imagesContainer.querySelector(`.${blockName}__imageItem.active`);
    let index = [...activeItem.parentNode.children].indexOf(activeItem);
    if (direction === 'left') {
      index -= 1;
      if (index === -1) {
        index = imagesContainer.childElementCount;
      }
    } else {
      index += 1;
      if (index > imagesContainer.childElementCount - 1) {
        index = 0;
      }
    }

    const firstEl = imagesContainer.firstElementChild;
    const scrollOffset = firstEl.getBoundingClientRect().width;
    const style = window.getComputedStyle(firstEl);
    const marginleft = parseFloat(style.marginLeft);

    imagesContainer.scrollTo({
      left: index * scrollOffset + marginleft,
      behavior: 'smooth',
    });
  }

  const arrowControls = createElement('ul', [`${blockName}__arrowControls`]);
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
  imagesContainer.insertAdjacentElement('beforebegin', arrowControls);
  const [prevButton, nextButton] = arrowControls.querySelectorAll(':scope button');
  prevButton.addEventListener('click', () => scroll('left'));
  nextButton.addEventListener('click', () => scroll('right'));
};

export default function decorate(block) {
  const descriptionContainer = block.querySelector(':scope > div');
  descriptionContainer.classList.add(`${blockName}__descriptionContainer`);

  const tabItems = block.querySelectorAll(':scope > div > div');

  const carouselWrapper = createElement('div', `${blockName}__carouselWrapper`);
  const imagesContainer = createElement('div', `${blockName}__imagesContainer`);
  descriptionContainer.parentNode.prepend(carouselWrapper);
  carouselWrapper.appendChild(imagesContainer);

  const tabNavigation = buildTabNavigation(tabItems, (index) => {
    setCarouselPosition(imagesContainer, index);
  });

  // Arrows
  createArrowControls(imagesContainer);

  descriptionContainer.parentNode.append(tabNavigation);

  tabItems.forEach((tabItem) => {
    tabItem.classList.add(`${blockName}__descItem`);
    const tabContent = tabItem.querySelector(':scope > div');
    const headings = tabContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

    // create div for image and append inside image div container
    const picture = tabItem.querySelector('picture');
    const imageItem = createElement('div', `${blockName}__imageItem`);
    imageItem.appendChild(picture);
    imagesContainer.appendChild(imageItem);

    // remove empty tags
    tabContent.querySelectorAll('p, div').forEach((item) => {
      stripEmptyTags(tabContent, item);
    });

    const descriptions = tabContent.querySelectorAll('p:not(.button-container)');
    [...descriptions].forEach((description) => description.classList.add(`${blockName}__description`));

    // Wrap text in container
    const textContainer = createElement('div', `${blockName}__text`);
    const text = tabContent.querySelector('.default-content-wrapper')?.querySelectorAll(':scope > *:not(.button-container)');
    if (text) {
      const parentTextContainer = text[0].parentNode;
      textContainer.append(...text);
      parentTextContainer.appendChild(textContainer);
    }

    // Wrap links in container
    const buttonContainer = createElement('div', `${blockName}__buttonsContainer`);
    const buttons = tabContent.querySelectorAll('.button-container');

    buttons.forEach((bt, i) => {
      const buttonLink = bt.firstElementChild;
      buttonLink.classList.remove('primary');
      buttonLink.classList.add('secondary');

      if (i > 0) {
        buttonLink.classList.add('outline');
      } else {
        const svgArrowRight = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1464 5.6463C13.3417 5.45104 13.6583 5.45104 13.8536 5.6463L19.8536 11.6463C20.0488 11.8416 20.0488 12.1581 19.8536 12.3534L13.8536 18.3535C13.6583 18.5488 13.3417 18.5488 13.1465 18.3536C12.9512 18.1583 12.9512 17.8417 13.1464 17.6465L18.2929 12.4999L4.5 12.4999C4.22386 12.4999 4 12.276 4 11.9999C4 11.7237 4.22386 11.4999 4.5 11.4999L18.2929 11.4999L13.1464 6.35341C12.9512 6.15815 12.9512 5.84157 13.1464 5.6463Z" fill="currentColor"/>
        </svg>`;

        const arrow = document.createRange().createContextualFragment(svgArrowRight);
        buttonLink.appendChild(...arrow.children);
      }
    });

    if (buttons.length) {
      const parentButtonContainer = buttons[0].parentNode;
      buttonContainer.append(...buttons);
      parentButtonContainer.appendChild(buttonContainer);
    }
  });

  // update the button indicator on scroll
  listenScroll(imagesContainer);

  // Update description position to be equal to image position
  imagesContainer.addEventListener('scroll', () => {
    const itemWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tabbed-carousel-img-width'));

    const firstCarouselItemWidth = imagesContainer.offsetWidth * (itemWidth / 100);
    const secondCarouselItemWidth = descriptionContainer.offsetWidth;

    // // Determine the number of items visible in the first carousel
    // const firstCarouselVisibleItems = Math.ceil(
    //   imagesContainer.offsetWidth / firstCarouselItemWidth
    // );

    // Determine the number of items in the second carousel
    // that correspond to one item in the first carousel
    const itemsInSecondCarouselPerItemInFirst = Math.ceil(
      firstCarouselItemWidth / secondCarouselItemWidth,
    );

    // Calculate the scrollLeft position of the second carousel
    const firstCarouselScrollLeft = imagesContainer.scrollLeft;
    const secondCarouselScrollLeft = Math.floor(firstCarouselScrollLeft / firstCarouselItemWidth)
      * (secondCarouselItemWidth * itemsInSecondCarouselPerItemInFirst);

    // Apply the calculated scrollLeft position to the second carousel
    descriptionContainer.scrollLeft = secondCarouselScrollLeft;
  });
}
