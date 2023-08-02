import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createElement } from "../../scripts/scripts.js";
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
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  const footerPath = cfg.footer || `${langCodeMatch ? langCodeMatch[1] : '/'}drafts/lakshmi/footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = createElement('div', 'v2-footer-container');
  footer.innerHTML = html.replaceAll('{year}', new Date().getFullYear());

  const [mainLinkWrapper, footerBar, footerCopyright] = footer.children;


  openExternalLinksInNewTab(footer);
  addSocialmediaIconsToLinks(mainLinkWrapper);


  if (mainLinkWrapper) {
    mainLinkWrapper.classList.add('v2-footer-links-wrapper');
    // in Word, it is edited like a column block, but we style it differently
    mainLinkWrapper.firstElementChild.classList.remove('columns');
    mainLinkWrapper.querySelectorAll('h3').forEach((h3) => {
      const heading = h3.firstElementChild;
      const [text, icon] = heading.childNodes;
      const spanEle = createElement('span', 'column-heading');
      spanEle.textContent = text.textContent;
      
      h3.append(spanEle);
      h3.append(icon);
      heading.remove();

      h3.parentElement.classList.add('link-column');
      h3.parentElement.parentElement.classList.add('link-column-wrapper');
      h3.nextElementSibling?.classList.add('link-column-content');

      h3.addEventListener('click', (e) => toggleExpand(e.target));

    });
  }

  const seperator = createElement('hr', 'seperator');
  footer.append(seperator);

  const copyrightWrapper = createElement('div', 'copyright-wrapper');

  if (footerBar) {
    const list = footerBar.firstElementChild;
    list?.classList.add('footer-bar');
    copyrightWrapper.appendChild(list);
    footerBar.remove();
  }

  if (footerCopyright) {
    copyrightWrapper.appendChild(footerCopyright);
    footerCopyright?.classList.add('footer-copyright');
  }

  footer.appendChild(copyrightWrapper);
  
  footerCopyright?.classList.add('footer-copyright');
  await decorateIcons(footer);
  block.append(footer);
  addScrollToTopButton(block);
}

function addSocialmediaIconsToLinks(footer) {
  footer.querySelectorAll('.icon-newtab').forEach((icon) => {
    const textIconWrapper = createElement('span', 'text-icon-wrapper');
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

function toggleExpand(targetH3) {
  const clickedColumn = targetH3.parentElement;
  const isExpanded = clickedColumn.classList.contains('expand');
  const wrapper = targetH3.closest('.link-column-wrapper');
  const columns = wrapper.querySelectorAll('.link-column');

  columns.forEach((column) => {
    const content = column.querySelector('.link-column-content');
    if (column === clickedColumn && !isExpanded) {
      column.classList.add('expand');
      content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
      column.classList.remove('expand');
      content.style.maxHeight = null;
    }
  });
}
