import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { removeEmptyTags, createElement, isVideoLink } from '../../scripts/scripts.js';

const blockName = 'v2-masonry-grid';

export default function decorate(block) {
  const ul = createElement('ul', `${blockName}__items`);

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.childElementCount) {
      const links = cell.querySelectorAll('a');
      const videos = [...links].filter((link) => isVideoLink(link));
      const picture = cell.querySelectorAll('picture');

      // if video or picture in the item, it's part of the grid
      if (videos.length > 0 || picture.length > 0) {
        const li = createElement('li', [`${blockName}__item`, 'border']);
        li.append(...cell.childNodes);
        ul.append(li);
      } else {
        // if not, text description section
        const headings = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
        [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

        links.forEach((link) => {
          link.classList.remove('primary', 'button');
          link.classList.add('standalone-link');
        });
        const textContainer = createElement('div', `${blockName}__text`);
        textContainer.append(...cell.childNodes);
        block.firstElementChild.append(textContainer);
      }
    }
    cell.remove();
  });

  block.firstElementChild.append(ul);

  // give format to the list items
  [...ul.children].forEach((li) => {
    let picture = li.querySelector('picture');

    if (picture) {
      const img = picture.lastElementChild;
      const newPicture = createOptimizedPicture(img.src, img.alt, false);
      picture.replaceWith(newPicture);
      picture = newPicture;
      li.prepend(picture);
    }

    const link = li.querySelector('a');
    const isVideo = link ? isVideoLink(link) : false;
    if (isVideo) {
      const video = createElement('video', [`${blockName}__video`], {
        loop: 'loop',
      });
      video.muted = true;
      video.autoplay = true;

      const source = createElement('source', '', {
        src: link.getAttribute('href'),
        type: 'video/mp4',
      });
      video.appendChild(source);
      li.prepend(video);
      link.remove();
    }
  });

  // remove empty tags
  removeEmptyTags(block);
}
