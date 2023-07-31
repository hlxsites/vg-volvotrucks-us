import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { removeEmptyTags } from '../../scripts/scripts.js';

export default function decorate(block) {
  // all items are inside a ul list with classname called 'images-grid__items'
  const ul = document.createElement('ul');
  ul.classList.add('images-grid__items');

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    // If cell contain any element, we add them in the ul
    if (cell.childElementCount) {
      const li = document.createElement('li');
      li.classList.add('images-grid__item', 'border');
      li.append(...cell.childNodes);
      ul.append(li);
    }
    cell.remove();
  });

  block.firstElementChild.append(ul);

  // give format to the list items
  [...ul.children].forEach((li) => {
    const section = document.createElement('div');

    // add link to the image and move it outside of the wrapper
    const title = li.querySelector('h3');
    title.classList.add('images-grid__title');
    let picture = li.querySelector('picture');

    if (picture) {
      const img = picture.lastElementChild;
      // no width provided because we are using object-fit, we need the biggest option
      const newPicture = createOptimizedPicture(img.src, img.alt, false);
      picture.replaceWith(newPicture);
      picture = newPicture;
    }

    section.prepend(picture);

    // Add wrapper around the text content
    const container = document.createElement('div');
    container.className = 'images-grid__itemText';
    container.innerHTML = li.innerHTML;
    li.innerHTML = '';
    section.append(container);
    li.append(section);
  });

  // remove empty tags
  removeEmptyTags(block);
}
