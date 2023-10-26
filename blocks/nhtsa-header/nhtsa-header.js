import { unwrapDivs } from '../../scripts/common.js';

// hide buttons for, content if they are from same origin
function hideButtons(buttons) {
  buttons.forEach((element) => {
    if (element.href.match(/\/recalls/)) {
      element.classList.add('button', 'nhsta-header__langauge-switch');
    } else if (element.href.match(/www.volvotrucks.us/)) {
      element.target = '_blank';
    }
  });
}

export default async function decorate(block) {
  unwrapDivs(block);
  const anchorTags = block.querySelectorAll('a');
  hideButtons(anchorTags);
}
