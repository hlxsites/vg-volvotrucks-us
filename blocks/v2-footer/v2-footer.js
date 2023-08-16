import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createElement } from '../../scripts/scripts.js';
/* eslint-disable no-use-before-define */

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
  const scrollToTopButton = createElement('button', 'v2-scroll-to-top', {
    title: 'Go to the top of the page',
  });
  scrollToTopButton.addEventListener('click', goToTopFunction);
  window.addEventListener('scroll', () => displayScrollToTop(scrollToTopButton));
  const svgIcon = document.createRange().createContextualFragment(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 20C11.7237 20 11.4999 19.7761 11.4999 19.5L11.4999 5.70711L6.35341 10.8536C6.15815 11.0488 5.84157 11.0488 5.6463 10.8536C5.45104 10.6583 5.45104 10.3417 5.6463 10.1464L11.6463 4.14645C11.8416 3.95119 12.1581 3.95118 12.3534 4.14644L18.3535 10.1464C18.5488 10.3417 18.5488 10.6583 18.3536 10.8535C18.1583 11.0488 17.8417 11.0488 17.6465 10.8536L12.4999 5.70709L12.4999 19.5C12.4999 19.7761 12.276 20 11.9999 20Z" fill="currentColor"/>
    </svg>`);
  scrollToTopButton.append(...svgIcon.children);
  mainEl.append(scrollToTopButton);
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  const footerPath = cfg.footer || `${langCodeMatch ? langCodeMatch[1] : '/'}v2-footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = createElement('div', 'v2-footer-container');
  footer.innerHTML = html.replaceAll('{year}', new Date().getFullYear());

  const [mainLinkWrapper, footerBar, footerCopyright] = footer.children;

  openExternalLinksInNewTab(footer);
  wrapSocialMediaLinks(mainLinkWrapper);

  const headings = footer.querySelectorAll('h1, h2, h3, h4, h5, h6');
  [...headings].forEach((heading) => heading.classList.add('v2-footer__title'));

  if (mainLinkWrapper) {
    mainLinkWrapper.classList.add('v2-footer-links-wrapper');
    // in Word, it is edited like a column block, but we style it differently
    mainLinkWrapper.firstElementChild.classList.remove('columns');
    mainLinkWrapper.querySelectorAll('.v2-footer__title').forEach((title) => {
      const heading = title.firstElementChild;
      const [text, icon] = heading.childNodes;
      const spanEle = createElement('span');
      spanEle.textContent = text.textContent;

      title.append(spanEle);
      title.append(icon);
      heading.remove();

      title.parentElement.classList.add('v2-footer-list');
      title.parentElement.parentElement.classList.add('v2-footer-list-wrapper');
      title.nextElementSibling?.classList.add('v2-footer-list-item');

      title.addEventListener('click', (e) => toggleExpand(e.target));
    });
  }

  const copyrightWrapper = createElement('div', 'v2-footer-copyright-wrapper');
  const copyrightContainer = createElement('div', 'v2-footer-copyright-container');

  copyrightWrapper.append(copyrightContainer);

  if (footerBar) {
    const list = footerBar.firstElementChild;
    list?.classList.add('v2-footer-bar');
    copyrightContainer.appendChild(list);
    footerBar.remove();
  }

  if (footerCopyright) {
    copyrightContainer.appendChild(footerCopyright);
    footerCopyright?.classList.add('v2-footer-copyright');
  }

  footer.appendChild(copyrightWrapper);
  await decorateIcons(footer);
  block.append(footer);
  addScrollToTopButton(block);
}

function wrapSocialMediaLinks(footer) {
  footer.querySelectorAll('.icon-newtab').forEach((icon) => {
    const textIconWrapper = createElement('span', 'v2-footer-text-icon-wrapper');
    const anchor = icon.parentElement;
    textIconWrapper.append(icon.previousSibling);
    textIconWrapper.append(icon);
    anchor.append(textIconWrapper);
  });
}

function openExternalLinksInNewTab(footer) {
  footer.querySelectorAll('a').forEach((anchor) => {
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
}

function findList(ele) {
  if (ele.classList.contains('v2-footer-list')) {
    return ele;
  }
  return findList(ele.parentElement);
}

function toggleExpand(targetH3) {
  const clickedColumn = findList(targetH3);
  const isExpanded = clickedColumn.classList.contains('expand');
  const wrapper = targetH3.closest('.v2-footer-list-wrapper');
  const columns = wrapper.querySelectorAll('.v2-footer-list');

  columns.forEach((column) => {
    const content = column.querySelector('.v2-footer-list-item');
    if (column === clickedColumn && !isExpanded) {
      column.classList.add('expand');
      content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
      column.classList.remove('expand');
      content.style.maxHeight = null;
    }
  });
}
