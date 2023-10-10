import { unwrapDivs } from '../../scripts/common.js';

// hide buttoms fro, content if they are from same origin
function hideButtons(buttons) {
  buttons.forEach((element) => {
    element.classList.add('button', 'nhsta-header__langauge-switch');
    const url = element.href;
    const { location: { origin } = {} } = window.location.origin;

    if (origin === url || ((window.location.host.includes('localhost')) && url === 'https://www.volvotrucks.us/')) {
      element.classList.add('hide');
    }
  });
}

export default async function decorate(block) {
  unwrapDivs(block);
  const anchorTags = block.querySelectorAll('a');
  hideButtons(anchorTags);
}
