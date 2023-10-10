import { unwrapDivs, createElement } from '../../scripts/common.js';

const siteoOptions = [{
  origin: 'us',
  url: 'https://www.volvotrucks.us/',
  textValue: 'English',
}, {
  origin: 'french',
  url: 'https://www.volvotrucks.fr/',
  textValue: 'French',
}];

export default async function decorate(block) {
  unwrapDivs(block);
  const currentOrigin = window.location.host.includes('hlx.page') || window.location.host.includes('localhost') ? 'us' : window.location.origin.split('volvotrucks.').pop();
  const buttonProps = siteoOptions.find((item) => item.origin !== currentOrigin);
  const langSwitch = createElement('a', {
    classes: ['button', 'nhsta-header__langauge-switch'],
    props: {
      href: buttonProps.url,
    },
  });
  langSwitch.innerText = buttonProps.textValue;
  block.append(langSwitch);
}
