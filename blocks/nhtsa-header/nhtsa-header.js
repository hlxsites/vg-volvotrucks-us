import { removeEmptyTags, unwrapDivs } from '../../scripts/common.js';

// hide buttons for, content if they are from same origin
function hideButtons(buttons) {
  buttons.forEach((element) => {
    if (element.classList.contains('tertiary')) {
      element.classList.remove('button', 'tertiary');
    }
    if (element.href.match(/\/recalls/)) {
      element.classList.add('button', 'nhsta-header__langauge-switch');
    } else if (element.href.match(/www.volvotrucks/)) {
      element.target = '_blank';
    }
  });
}

export default async function decorate(block) {
  unwrapDivs(block);
  const anchorTags = block.querySelectorAll('a');
  anchorTags.forEach((element) => {
    block.insertBefore(element, element.parentNode);
  });
  removeEmptyTags(block);
  hideButtons(anchorTags);
}
