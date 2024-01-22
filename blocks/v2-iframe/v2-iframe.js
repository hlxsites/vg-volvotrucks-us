import { createElement, variantsClassesToBEM } from '../../scripts/common.js';

export default async function decorate(block) {
  let link = block.querySelector('a')?.getAttribute('href') || block.textContent.trim();
  link += window.location.search ? `#/summary/${window.location.search}` : '';
  const title = block.querySelector('h1, h2, h3, h4, h5, h6').textContent;
  const iframe = createElement('iframe', { props: { src: link, frameborder: 0, title } });
  const fixedHeightClass = [...block.classList].find((el) => /[0-9]+px/.test(el));

  variantsClassesToBEM(block.classList, ['full-viewport'], 'v2-iframe');

  if (fixedHeightClass) {
    iframe.height = fixedHeightClass;
  }

  block.replaceChildren(iframe);
}
