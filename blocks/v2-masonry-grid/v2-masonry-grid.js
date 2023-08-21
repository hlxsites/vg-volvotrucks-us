import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { removeEmptyTags, createElement, isVideoLink } from '../../scripts/scripts.js';

const blockName = 'v2-masonry-grid';

export default function decorate(block) {
  const ul = createElement('ul', `${blockName}__items`);

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.childElementCount) {
      const links = cell.querySelectorAll('a');
      const videos = [...links].filter((link) => isVideoLink(link));
      const picture = cell.querySelector('picture');

      // if video or picture available, it's part of the grid
      if (videos.length > 0 || picture) {
        const li = createElement('li', [`${blockName}__item`, 'border']);

        if (picture) {
          const img = picture.lastElementChild;
          const newPicture = createOptimizedPicture(img.src, img.alt, false);
          li.prepend(newPicture);
        }

        if (videos.length > 0) {
          const video = createElement('video', [`${blockName}__video`], {
            loop: 'loop',
          });
          video.muted = true;
          video.autoplay = true;

          const source = createElement('source', '', {
            src: videos[0].getAttribute('href'),
            type: 'video/mp4',
          });
          video.appendChild(source);
          li.prepend(video);
          videos[0].remove();
        }

        ul.append(li);
      }
    }
    cell.remove();
  });

  block.firstElementChild.append(ul);

  // remove empty tags
  removeEmptyTags(block);
}
