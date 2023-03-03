import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function updateSlide(index, carousel) {
  const item = carousel.children[index];
  const left = item.offsetLeft + item.offsetWidth / 2
    - (item.parentNode.offsetLeft + item.parentNode.offsetWidth / 2);
  carousel.scrollTo({ top: 0, left, behavior: 'smooth' });
}

export default function decorate($block) {
  const $gridContainer = $block.querySelector('ul');
  $gridContainer.classList.add('carousel-list');

  const $carouselItems = $block.querySelectorAll('ul > li');
  $carouselItems.forEach(($li) => {
    // Add wrapper around the content
    const $contentContainer = document.createElement('div');
    $contentContainer.classList.add('wrapper');
    $contentContainer.innerHTML = $li.innerHTML;
    $li.innerHTML = '';
    $li.append($contentContainer);

    // add link to the image and move it outside of the wrapper
    const $link = $li.querySelector('a');
    const $imageLink = $link.cloneNode(false);
    $li.prepend($imageLink);

    const $image = $li.querySelector('picture');
    $imageLink.append($image);
    $imageLink.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '370' }])));

    const $textItems = $contentContainer.innerHTML
      .split('<br>').filter((text) => text.trim() !== '');

    $contentContainer.innerHTML = `
      <p>${$textItems.join('</p><p>')}</p>
    `;
  });

  // create carousel controls for mobile
  const $controlsContainer = document.createElement('ul');
  $controlsContainer.classList.add('controls');
  $carouselItems.forEach((item, j) => {
    const $controlItem = document.createElement('li');
    const index = j + 1;
    $controlItem.innerHTML = `
      <button type="button">${index}</button>
    `;
    $controlsContainer.append($controlItem);
  });
  $gridContainer.parentNode.append($controlsContainer);

  const $controlItems = $block.querySelectorAll('ul.controls > li');
  $controlItems.forEach(($controlItem, j) => {
    if (!j) $controlItem.classList.add('active');
    const $button = $controlItem.querySelector('button');
    $button.addEventListener('click', () => {
      [...$controlItems].forEach((item) => item.classList.remove('active'));
      $controlItem.classList.add('active');
      updateSlide(j, $gridContainer);
    });
  });

  $gridContainer.addEventListener('scroll', () => {
    const computedStyle = window.getComputedStyle($gridContainer);
    const padding = Math.round(parseFloat(computedStyle.paddingLeft)
      + parseFloat(computedStyle.paddingRight));
    const width = $gridContainer.clientWidth - padding;
    const activeIndex = Math.round($gridContainer.scrollLeft / width);
    const activeButton = $controlsContainer.children[activeIndex];
    if (!activeButton.classList.contains('active')) {
      // make active
      $controlsContainer.querySelector('li.active').classList.remove('active');
      activeButton.classList.add('active');
    }
  });
}
