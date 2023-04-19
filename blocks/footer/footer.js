import { decorateIcons, readBlockConfig } from '../../scripts/lib-franklin.js';

/* eslint-disable no-use-before-define */

function toggleExpand(target) {
  if (target.parentElement.classList.contains('expand')) {
    target.parentElement.classList.remove('expand');
    const content = target.parentElement.querySelector('.link-column-content');
    content.style.maxHeight = null;
  } else {
    // close all others
    target.closest('.link-column-wrapper').querySelectorAll('.link-column').forEach((column) => {
      column.classList.remove('expand');
      const content = column.querySelector('.link-column-content');
      content.style.maxHeight = null;
    });

    const content = target.parentElement.querySelector('.link-column-content');
    content.style.maxHeight = `${content.scrollHeight}px`;

    target.parentElement.classList.add('expand');
  }
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
  const footerPath = '/drafts/wingeier/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html.replaceAll('{year}', new Date().getFullYear());

  openExternalLinksInNewTab(footer);
  addSocialmediaIconsToLinks(footer);

  // eslint-disable-next-line prefer-const
  let [grayFooter, footerBar, footerCopyright] = footer.children;

  // gray footer
  grayFooter?.classList.add('footer-gray');
  grayFooter?.firstElementChild.classList.remove('columns');
  grayFooter.querySelectorAll('h3').forEach((h3) => {
    h3.parentElement.classList.add('link-column');
    h3.parentElement.parentElement.classList.add('link-column-wrapper');
    h3.addEventListener('click', (e) => toggleExpand(e.target));
  });
  // move each link into the first paragraph
  grayFooter.querySelectorAll('a').forEach((a) => {
    const firstParagraph = a.closest('.link-column').querySelector('p');
    firstParagraph.classList.add('link-column-content');
    if (a.parentElement !== firstParagraph) {
      a.parentElement.remove();
    }
    firstParagraph.append(a);
  });
  // initialize first column to be expanded
  grayFooter.querySelector('.link-column').classList.add('expand');

  footerBar?.classList.add('footer-bar');
  footerCopyright?.classList.add('footer-copyright');
  await decorateIcons(footer);
  block.append(footer);
  addScrollToTopButton(block);
}

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
