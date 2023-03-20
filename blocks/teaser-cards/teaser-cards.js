import { wrapImageWithVideoLink, selectVideoLink, isVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.parentElement.classList.add(`teaser-cards-${block.firstElementChild.children.length}`);
  // go through all teasers
  [...block.firstElementChild.children].forEach((elem) => {
    // add teaser class for each entry
    elem.classList.add('teaser');
    // give p containing the image a specific class
    elem.querySelector('picture').parentElement.classList.add('image');
    // give all the other p a text class
    elem.querySelector('p:not(.image, .button-container)')?.classList.add('text');

    const links = elem.querySelectorAll('.button-container a');
    const videos = [...links].filter((link) => isVideoLink(link));

    if (videos.length) {
      // display image as link with play icon
      const image = elem.querySelector('.image');
      const selectedLink = selectVideoLink(videos);

      if (selectedLink) {
        wrapImageWithVideoLink(selectedLink, image);
      }

      // removing all of the videos links excluding the selected one
      videos.forEach((link) => link !== selectedLink && link.parentElement.remove());
    }

    // give cta's link(s) a specific class name
    const ctaLinks = elem.querySelectorAll('.button-container a.button');
    ctaLinks.forEach((cta) => {
      cta.classList.remove('primary');
      cta.classList.add('secondary', 'cta');
    });
  });
}
