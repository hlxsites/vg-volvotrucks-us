import { wrapImageWithVideoLink, selectVideoLink, isVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = block.firstElementChild.children.length;
  block.parentElement.classList.add(`teaser-cards-${cols}`);
  // go through all teasers
  [...block.children].forEach((row) => [...row.children].forEach((elem) => {
    // add teaser class for each entry
    elem.classList.add('teaser');
    if (elem.querySelector('.cta-list')) {
      elem.classList.add('with-cta-list');
    }
    // give p containing the image a specific class
    const picture = elem.querySelector('picture');
    if (picture && picture.closest('p')) picture.closest('p').classList.add('image');

    const links = elem.querySelectorAll('a');
    const videos = [...links].filter((link) => isVideoLink(link));

    if (videos.length) {
      // display image as link with play icon
      const selectedLink = selectVideoLink(videos);

      if (selectedLink) {
        picture.after(selectedLink);
        wrapImageWithVideoLink(selectedLink, picture);
      }

      // removing all of the videos links excluding the selected one
      videos.forEach((link) => link !== selectedLink && link.parentElement.remove());
    }

    // give all the remainig p a text class
    elem.querySelector('p:not(.image, .button-container)')?.classList.add('text');

    // give cta's link(s) a specific class name
    const ctaLinks = elem.querySelectorAll('.button-container a.button');
    ctaLinks.forEach((cta) => {
      // enforce secondary for ctas not in cta-list and only for multi column teaser cards
      if (!cta.closest('.cta-list') && cols > 1) {
        cta.classList.remove('primary');
        cta.classList.add('secondary');
      }
      cta.classList.add('cta');
    });
  }));
}
