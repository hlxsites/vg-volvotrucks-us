import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block.querySelectorAll('ul > li').forEach((li) => {

    // Add wrapper around the content
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('wrapper');
    contentContainer.innerHTML = li.innerHTML;
    li.innerHTML = '';
    li.append(contentContainer);

    // add link to the image and move it outside of the wrapper
    const link = li.querySelector('a');
    const imageLink = link.cloneNode(false);
    li.prepend(imageLink);

    const image = li.querySelector('picture');
    imageLink.append(image);

    const textItems = contentContainer.innerHTML
      .split('<br>').filter((text) => text.trim() !== '');

    contentContainer.innerHTML = `
      <h3>${textItems[0]}</h3>
      <p>${textItems.slice(1).join('</p><p>')}</p>
    `;
  });
}
