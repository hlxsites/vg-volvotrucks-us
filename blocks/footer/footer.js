import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

function displayScrollToTop(buttonEl) {
  if (document.body.scrollTop > 160 || document.documentElement.scrollTop > 160) {
    buttonEl.style.display = 'block';
  } else {
    buttonEl.style.display = 'none';
  }
}
function goToTopFunction() {
  let timeOut;
  if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
    window.scrollBy(0, -50);
    timeOut = setTimeout(goToTopFunction, 10);
  } else {
    clearTimeout(timeOut);
  }
}

function addScrollToTopButton(mainEl) {
  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.addEventListener('click', goToTopFunction);
  window.addEventListener('scroll', () => displayScrollToTop(scrollToTopButton));
  scrollToTopButton.classList.add('scroll-to-top');
  scrollToTopButton.setAttribute('title', 'Go to the top of the page');
  scrollToTopButton.innerHTML = `
    <i class="fa fa-angle-up"><i/>
  `;
  mainEl.append(scrollToTopButton);
}
/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const currentYear = new Date().getFullYear();
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  const footerPath = cfg.footer || `${langCodeMatch ? langCodeMatch[1] : '/'}footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html.replaceAll('{year}', currentYear);
  const anchors = footer.querySelectorAll('a');
  anchors.forEach((anchor) => {
    try {
      const { origin } = new URL(anchor.href, window.location.href);
      if (origin && origin !== window.location.origin) {
        anchor.setAttribute('target', '_blank');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid link ${anchor.href}`);
    }
  });
  const footerItems = [...footer.children];
  if (footerItems.length >= 2) {
    footerItems[0].classList.add('footer-links');
    footerItems[1].classList.add('footer-copyright');
  }
  await decorateIcons(footer);
  block.append(footer);
  addScrollToTopButton(block);
}
