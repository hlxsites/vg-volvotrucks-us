import { readBlockConfig, decorateIcons } from "../../scripts/lib-franklin.js";

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const currentYear = new Date().getFullYear();
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement("div");
  footer.innerHTML = html.replaceAll('{year}', currentYear);
  const footerItems = [...footer.children];
  if (footerItems.length >= 2) {
    footerItems[0].classList.add('footer--links');
    footerItems[1].classList.add('footer--copyright');
  }
  await decorateIcons(footer);
  block.append(footer);
}
