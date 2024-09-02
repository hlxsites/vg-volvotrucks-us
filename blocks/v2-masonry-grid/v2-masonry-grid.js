import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  isVideoLink,
  createVideo,
} from '../../scripts/video-helper.js';
import {
  createElement,
  removeEmptyTags,
} from '../../scripts/common.js';

const blockName = 'v2-masonry-grid';

export default function decorate(block) {
  const ul = createElement('ul', { classes: `${blockName}__items` });

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.childElementCount) {
      const links = cell.querySelectorAll('a');
      const videos = [...links].filter((link) => isVideoLink(link));
      const picture = cell.querySelector('picture');

      // if video or picture available, it's part of the grid
      if (videos.length > 0 || picture) {
        const li = createElement('li', { classes: [`${blockName}__item`] });

        if (videos.length > 0) {
          const video = createVideo(videos[0], `${blockName}__video`, {
            muted: true,
            autoplay: true,
            loop: true,
            playsinline: true,
          });
          li.prepend(video);
        } else if (picture) {
          const img = picture.lastElementChild;
          const newPicture = createOptimizedPicture(img.src, img.alt, false);
          li.prepend(newPicture);
        }

        ul.append(li);
      }
    }
    cell.remove();
  });

  block.append(ul);

  // remove empty tags
  removeEmptyTags(block);
}
