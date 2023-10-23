import { unwrapDivs } from '../../scripts/common.js';

// hide buttons for, content if they are from same origin
function hideButtons(buttons) {
  buttons.forEach((element) => {
    element.classList.add('button', 'nhsta-header__langauge-switch');
    const url = element.href;
    const { location: { origin } = {} } = window.location.origin;

    if (origin === url) {
      element.classList.add('hide');
    }
  });
}

export default async function decorate(block) {
  unwrapDivs(block);
  const anchorTags = block.querySelectorAll('a');
  hideButtons(anchorTags);
}
