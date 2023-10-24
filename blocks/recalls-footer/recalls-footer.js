import { getMetadata, readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createElement, getLanguagePath } from '../../scripts/common.js';

const blockName = 'recalls-footer';
/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const footerPath = cfg.footer || `${getLanguagePath()}${getMetadata('footer')}`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = createElement('div', { classes: `${blockName}__container` });
  footer.innerHTML = html.replaceAll('{year}', new Date().getFullYear());

  const [logoContainer, footerCopyright, footerLinks] = footer.children;

  if (footerLinks) {
    footerLinks.classList.add(`${blockName}__link-container`);
    const list = footerLinks.firstElementChild;
    list?.classList.add(`${blockName}__link-list`);
  }

  if (footerCopyright) {
    footerCopyright.classList.add(`${blockName}__copyright`);
  }

  if (logoContainer) {
    logoContainer.classList.add(`${blockName}__logo-container`);
  }

  block.append(footer);
  await decorateIcons(footer);
}
