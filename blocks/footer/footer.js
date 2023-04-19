import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
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
  const footerPath = cfg.footer || `${langCodeMatch ? langCodeMatch[1] : '/'}footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html.replaceAll('{year}', new Date().getFullYear());

  openExternalLinksInNewTab(footer);
  addSocialmediaIconsToLinks(footer);

  // eslint-disable-next-line prefer-const
  let [grayFooter, footerBar, footerCopyright] = footer.children;

  if (grayFooter) {
    grayFooter.classList.add('footer-gray');
    // in Word, it is edited like a column block, but we style it differently
    grayFooter.firstElementChild.classList.remove('columns');
    grayFooter.querySelectorAll('h3').forEach((h3) => {
      h3.parentElement.classList.add('link-column');
      h3.parentElement.parentElement.classList.add('link-column-wrapper');
      h3.addEventListener('click', (e) => toggleExpand(e.target));
      const list = h3.parentElement.querySelector('ul');
      list.classList.add('link-column-content');
    });
    // First column is initially expanded
    setTimeout(
      () => toggleExpand(grayFooter.querySelector('.link-column h3')),
      500
    );
  }

  // footer bar with dark background
  footerBar?.classList.add('footer-bar');

  // copyright line
  footerCopyright?.classList.add('footer-copyright');
  await decorateIcons(footer);
  block.append(footer);
  addScrollToTopButton(block);
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

function addSocialmediaIconsToLinks(footer) {
  footer.querySelectorAll('a[href^="https://twitter.com/"]').forEach((anchor) => {
    anchor.innerHTML = `<i class="fa fa-twitter"></i> ${anchor.innerHTML}`;
  });
  footer.querySelectorAll('a[href^="https://www.facebook.com/"]').forEach((anchor) => {
    anchor.innerHTML = `<i class="fa fa-facebook"></i> ${anchor.innerHTML}`;
  });
  footer.querySelectorAll('a[href^="https://www.linkedin.com/"]').forEach((anchor) => {
    anchor.innerHTML = `<i class="fa fa-linkedin"></i> ${anchor.innerHTML}`;
  });
  footer.querySelectorAll('a[href^="https://www.youtube.com/"]').forEach((anchor) => {
    anchor.innerHTML = `<i class="fa fa-youtube"></i> ${anchor.innerHTML}`;
  });
  footer.querySelectorAll('a[href^="https://www.instagram.com/"]').forEach((anchor) => {
    anchor.innerHTML = `<i class="fa fa-instagram"></i> ${anchor.innerHTML}`;
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
