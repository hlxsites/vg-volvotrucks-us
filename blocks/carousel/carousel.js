import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const debounceDelay = 30;

function adjustWidthAndControls(carousel, ...controls) {
  function toggleControls() {
    const containerWidth = carousel.parentElement.clientWidth;
    const gap = parseInt(window.getComputedStyle(carousel).gap, 10);
    const itemWidth = carousel.firstElementChild.clientWidth;
    const itemsFullWidth = itemWidth * carousel.children.length + gap * (carousel.children.length - 1);
    const showControls = itemsFullWidth > containerWidth;
    controls.forEach((ul) => showControls ? ul.classList.remove('hidden') : ul.classList.add('hidden'));
    if (showControls) carousel.classList.remove('centered'); else carousel.classList.add('centered');
    // 2x50px minimum margin left and right
    const maxItems = Math.floor((containerWidth - 100) / (itemsFullWidth / carousel.children.length));
    const width = maxItems * itemWidth + gap * (maxItems - 1);
    carousel.style.width = `${width}px`;
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(toggleControls, debounceDelay);
  });

  window.setTimeout(toggleControls);
}

function createDesktopControls(ul) {
  function scroll(direction) {
    const first = ul.firstElementChild;
    const second = first.nextElementSibling;
    const scrollOffset = second.getBoundingClientRect().x - first.getBoundingClientRect().x;
    const left = direction === 'left' ? -1 * scrollOffset : scrollOffset;
    ul.scrollBy({ top: 0, left, behavior: 'smooth' });
  }

  const desktopControls = document.createElement('ul');
  desktopControls.className = 'desktop-controls hidden';
  desktopControls.innerHTML = '<li><button type="button">Left</button></li><li><button type="button">Right</button></li>';
  ul.insertAdjacentElement('beforebegin', desktopControls);
  const [prevButton, nextButton] = desktopControls.querySelectorAll(':scope button');
  prevButton.addEventListener('click', () => scroll('left'));
  nextButton.addEventListener('click', () => scroll('right'));
  return desktopControls;
}

function createMobileControls(ul) {
  // create carousel controls for mobile
  const mobileControls = document.createElement('ul');
  mobileControls.className = 'mobile-controls';
  [...ul.children].forEach((item, j) => {
    const control = document.createElement('li');
    if (!j) control.className = 'active';
    control.innerHTML = `<button type="button">${j + 1}</button>`;
    control.firstElementChild.addEventListener('click', () => {
      mobileControls.querySelector('li.active').classList.remove('active');
      control.classList.add('active');

      const left = item.offsetLeft + item.offsetWidth / 2
        - (item.parentNode.offsetLeft + item.parentNode.offsetWidth / 2);
      ul.scrollTo({ top: 0, left, behavior: 'smooth' });
    });

    mobileControls.append(control);
  });
  ul.insertAdjacentElement('beforebegin', mobileControls);

  let scrollTimeout;
  ul.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const first = ul.firstElementChild;
      const second = first.nextElementSibling;
      const scrollOffset = second.getBoundingClientRect().x - first.getBoundingClientRect().x;
      let index = 0;
      // how many items have scrolled out?
      while (ul.scrollLeft - scrollOffset * (index + 1) > 0) index++;
      mobileControls.querySelector('li.active').classList.remove('active');
      mobileControls.children[index].classList.add('active');
    }, debounceDelay);
  });
  return mobileControls;
}

export default function decorate(block) {
  const ul = block.querySelector('ul');
  ul.classList.add('items');

  [...ul.children].forEach((li) => {
    // Add wrapper around the content
    const container = document.createElement('div');
    container.className = 'wrapper';
    container.innerHTML = li.innerHTML;
    li.innerHTML = '';
    li.append(container);

    // add link to the image and move it outside of the wrapper
    const a = li.querySelector('a');
    let picture = li.querySelector('picture');
    if (picture) {
      const img = picture.lastElementChild;
      const newPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '370' }]);
      picture.replaceWith(newPicture);
      picture = newPicture;
    }
    if (a && picture) {
      const clone = a.cloneNode(false);
      picture.replaceWith(clone);
      clone.append(picture);
      li.prepend(clone);
    }

    const textItems = container.innerHTML
      .split('<br>').filter((text) => text.trim() !== '');

    container.innerHTML = `
      <p>${textItems.join('</p><p>')}</p>
    `;
  });

  const desktopControls = createDesktopControls(ul);
  const mobileControls = createMobileControls(ul)

  adjustWidthAndControls(ul, mobileControls, desktopControls);
}
