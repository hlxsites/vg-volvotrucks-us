import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function updateSlide(index, $block) {
  const $trucksContainer = $block.querySelector('.trucks-list');
  $block.querySelector('.controls li.active').classList.remove('active');
  $block.querySelectorAll('.controls li')[index].classList.add('active');

  $trucksContainer.style.transform = `translateX(-${index * 380 + 80}px)`;
}

export default function decorate($block) {
  const $gridContainer = $block.querySelector('ul');
  $gridContainer.classList.add('trucks-list');
  $block.append($gridContainer);

  const $truckItems = $block.querySelectorAll('ul > li');
  $truckItems.forEach(($li) => {
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
  $block.append($controlsContainer);
  $truckItems.forEach((item, j) => {
    const $controlItem = document.createElement('li');
    const index = j + 1;
    $controlItem.innerHTML = `
      <button type="button">${index}</button>
    `;
    $controlsContainer.append($controlItem);
  });
  $block.querySelector('ul.controls li:first-child').classList.add('active');
  const $controls = $block.querySelectorAll('ul.controls > li > button');
  $controls.forEach(($control, j) => {
    $control.addEventListener('click', () => {
      updateSlide(j, $block);
    });
  });

  // clone first and last truck item for carousel
  const $firstItem = $block.querySelector('ul.trucks-list li:first-child');
  const $lastItem = $block.querySelector('ul.trucks-list li:last-child');
  const $firstItemClone = $firstItem.cloneNode(true);
  const $lastItemClone = $lastItem.cloneNode(true);
  $firstItemClone.classList.add('clone');
  $lastItemClone.classList.add('clone');
  $lastItem.after($firstItemClone);
  $firstItem.before($lastItemClone);
}
