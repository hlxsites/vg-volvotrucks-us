import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateBlock,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlock,
  loadBlocks,
  loadCSS,
  createOptimizedPicture,
  toClassName,
} from './lib-franklin.js';

const LCP_BLOCKS = ['teaser-grid']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here
let placeholders = null;

async function getPlaceholders() {
  placeholders = await fetch('/placeholder.json').then((resp) => resp.json());
}

export function getTextLable(key) {
  return placeholders.data.find((el) => el.Key === key).Text;
}

function getCTAContainer(ctaLink) {
  return ['strong', 'em'].includes(ctaLink.parentElement.localName)
    ? ctaLink.parentElement.parentElement
    : ctaLink.parentElement;
}

function isCTALinkCheck(ctaLink) {
  const btnContainer = getCTAContainer(ctaLink);
  if (!btnContainer.classList.contains('button-container')) return false;
  const previousSibiling = btnContainer.previousElementSibling;
  const twoPreviousSibiling = previousSibiling?.previousElementSibling;
  return previousSibiling?.localName === 'h1' || twoPreviousSibiling?.localName === 'h1';
}

function buildHeroBlock(main) {
  // don't create a hero if the first item is a block.
  const firstSection = main.querySelector('div');
  const firstElement = firstSection.firstElementChild;
  if (firstElement.tagName === 'DIV' && firstElement.classList.length) {
    return;
  }
  const h1 = firstSection.querySelector('h1');
  const picture = firstSection.querySelector('picture');
  const ctaLink = firstSection.querySelector('a');
  // check if the previous element or the previous of that is an h1
  const isCTALink = ctaLink && isCTALinkCheck(ctaLink);
  if (isCTALink) ctaLink.classList.add('cta');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const headings = document.createElement('div');
    headings.className = 'hero-headings';
    const elems = [picture, headings];
    const isPrevSubtitle = h1.previousElementSibling.matches('h2,h3,h4');
    const subtitle = isPrevSubtitle ? h1.previousElementSibling : h1.nextElementSibling;
    if (subtitle && (subtitle.matches('h2,h3,h4')
      // also consider a <p> without any children as sub heading
      || (subtitle.matches('p') && !subtitle.children.length))) {
      const h4 = document.createElement('h4');
      h4.innerHTML = subtitle.innerHTML;
      subtitle.remove();
      headings.appendChild(h4);
    }
    headings.appendChild(h1);
    if (isCTALink) headings.appendChild(getCTAContainer(ctaLink));
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems }));
    // remove the empty pre-section to avoid decorate it as empty section
    const containerChildren = firstSection.children;
    const wrapperChildren = containerChildren[0].children;
    if (containerChildren.length <= 1 && wrapperChildren.length === 0) firstSection.remove();
    else if (wrapperChildren.length === 0) containerChildren[0].remove();
    // after all are settled, the new section can be added
    main.prepend(section);
  }
}

function buildSubNavigation(main, head) {
  const subnav = head.querySelector('meta[name="sub-navigation"]');
  if (subnav) {
    const block = buildBlock('sub-nav', []);
    main.previousElementSibling.prepend(block);
    decorateBlock(block);
  }
}

function createTabbedSection(tabItems, tabType, { fullWidth }) {
  const tabSection = document.createElement('div');
  tabSection.classList.add('section', 'tabbed-container');
  if (fullWidth) tabSection.classList.add('tabbed-container-full-width');
  tabSection.dataset.sectionStatus = 'initialized';
  const wrapper = document.createElement('div');
  tabSection.append(wrapper);
  const tabBlock = buildBlock(`tabbed-${tabType}`, [tabItems]);
  wrapper.append(tabBlock);
  return tabSection;
}

function buildCtaList(main) {
  [...main.querySelectorAll('ul')].forEach((list) => {
    const lis = [...list.querySelectorAll('li')];
    const isCtaList = lis.every((li) => {
      if (li.children.length !== 1) return false;
      const firstChild = li.firstElementChild;
      if (firstChild.tagName === 'A') return true;
      if (firstChild.children.length !== 1) return false;
      const firstGrandChild = firstChild.firstElementChild;
      return (firstChild.tagName === 'STRONG' || firstChild.tagName === 'EM') && firstGrandChild.tagName === 'A';
    });

    if (isCtaList) {
      list.classList.add('cta-list');
      lis.forEach((li, i) => {
        li.classList.add('button-container');
        const a = li.querySelector('a');
        const up = a.parentElement;
        a.classList.add('button');
        if (up.tagName === 'EM') {
          a.classList.add('secondary');
        } else {
          a.classList.add('primary');
          if (i === 0) {
            a.classList.add('dark');
          }
        }
      });
    }
  });
}

function buildTabbedBlock(main) {
  let tabItems = [];
  let tabType;
  let fullWidth = false;
  [...main.querySelectorAll(':scope > div')].forEach((section) => {
    const sectionMeta = section.dataset.carousel || section.dataset.tabs;
    if (sectionMeta) {
      const tabContent = document.createElement('div');
      tabType = tabType || (section.dataset.carousel ? 'carousel' : 'accordion');
      tabContent.dataset[tabType] = sectionMeta;
      tabContent.className = 'tab-content';
      fullWidth = fullWidth || section.matches('.full-width');
      tabContent.innerHTML = section.innerHTML;
      tabContent.querySelectorAll('p > picture').forEach((pic) => {
        if (!pic.nextElementSibling && !pic.previousElementSibling) {
          pic.parentElement.classList.add('picture');
        }
      });
      tabItems.push(tabContent);
      section.remove();
    } else if (tabItems.length > 0) {
      const tabbedSection = createTabbedSection(tabItems, tabType, { fullWidth });
      section.parentNode.insertBefore(tabbedSection, section);
      decorateBlock(tabbedSection.querySelector('.tabbed-carousel, .tabbed-accordion'));
      tabItems = [];
      tabType = undefined;
      fullWidth = false;
    }
  });
  if (tabItems.length > 0) {
    const tabbedCarouselSection = createTabbedSection(tabItems, tabType, { fullWidth });
    main.append(tabbedCarouselSection);
    decorateBlock(tabbedCarouselSection.querySelector('.tabbed-carousel, .tabbed-accordion'));
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 * @param {Element} head The header element
 */
function buildAutoBlocks(main, head) {
  try {
    buildHeroBlock(main);
    buildSubNavigation(main, head);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateSectionBackgrounds(main) {
  main.querySelectorAll(':scope > .section[data-background]').forEach((section) => {
    const src = section.dataset.background;
    const picture = createOptimizedPicture(src, '', false);
    section.appendChild(picture);
    section.classList.add('section-with-background');
  });
}

function decorateHyperlinkImages(container) {
  // picture + br + a in the same paragraph
  [...container.querySelectorAll('picture + br + a')]
    // link text is an unformatted URL paste, and matches the link href
    .filter((a) => {
      try {
        // ignore domain in comparison
        return new URL(a.href).pathname === new URL(a.textContent).pathname;
      } catch (e) {
        return false;
      }
    })
    .forEach((a) => {
      const picture = a.previousElementSibling.previousElementSibling;
      picture.remove();
      const br = a.previousElementSibling;
      br.remove();
      a.innerHTML = picture.outerHTML;
      // make sure the link is not decorated as a button
      a.parentNode.classList.remove('button-container');
      a.className = '';
    });

  // with link and image in separate paragraphs
  [...container.querySelectorAll('p > a[href]')]
    // link (in a <p>) has no siblings
    .filter((a) => a.parentNode.childElementCount === 1)
    // is preceded by an image (in a <p>) and image has no other siblings
    .filter((a) => a.parentNode.previousElementSibling?.firstElementChild?.tagName === 'PICTURE')
    .filter((a) => a.parentNode.previousElementSibling?.childElementCount === 1)
    // link text is an unformatted URL pastes and matches the link href
    .filter((a) => {
      try {
        // ignore domain in comparison
        return new URL(a.href).pathname === new URL(a.textContent)?.pathname;
      } catch (e) {
        return false;
      }
    })
    .forEach((a) => {
      const picture = a.parentNode.previousElementSibling.firstElementChild;
      picture.parentNode.remove();
      a.innerHTML = picture.outerHTML;
      // make sure the link is not decorated as a button
      a.parentNode.classList.remove('button-container');
      a.className = '';
    });
}

function addDefaultVideoLinkBehaviour(main) {
  [...main.querySelectorAll('a')]
    // eslint-disable-next-line no-use-before-define
    .filter((link) => isVideoLink(link))
    // eslint-disable-next-line no-use-before-define
    .forEach(addVideoShowHandler);
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 * @param {Element} head The header element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main, head) {
  const pageStyle = head.querySelector('[name="style"]')?.content;
  if (pageStyle) {
    pageStyle.split(',')
      .map((style) => toClassName(style.trim()))
      .forEach((style) => main.classList.add(style));
  }
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main, head);
  decorateSections(main);
  decorateBlocks(main);
  decorateHyperlinkImages(main);
  decorateSectionBackgrounds(main);
  addDefaultVideoLinkBehaviour(main);
  buildTabbedBlock(main);
  buildCtaList(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  const { head } = doc;
  if (main) {
    decorateMain(main, head);
    await waitForLCP(LCP_BLOCKS);
  }

  await getPlaceholders();
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  const header = doc.querySelector('header');

  loadHeader(header);
  loadFooter(doc.querySelector('footer'));

  const subnav = header.querySelector('.block.sub-nav');
  if (subnav) {
    loadBlock(subnav);
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

/* video helpers */
export function isLowResolutionVideoUrl(url) {
  return url.split('?')[0].endsWith('.mp4');
}

export function isVideoLink(link) {
  const linkString = link.getAttribute('href');
  return (linkString.includes('youtube.com/embed/')
    || isLowResolutionVideoUrl(linkString))
    && link.closest('.block.embed') === null;
}

export function selectVideoLink(links, preferredType) {
  const linksList = [...links];
  const shouldUseYouTubeLinks = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('OptanonConsent=1')) && preferredType !== 'local';
  const youTubeLink = linksList.find((link) => link.getAttribute('href').includes('youtube.com/embed/'));
  const localMediaLink = linksList.find((link) => link.getAttribute('href').split('?')[0].endsWith('.mp4'));
  const videoLink = shouldUseYouTubeLinks ? youTubeLink : localMediaLink;

  return videoLink;
}

export function showVideoModal(linkUrl) {
  // eslint-disable-next-line import/no-cycle
  import('../common/modal/modal.js').then((modal) => {
    let beforeBanner = null;

    if (isLowResolutionVideoUrl(linkUrl)) {
      const lowResolutionMessage = getTextLable('Low resolution video message');
      const changeCookieSettings = getTextLable('Change cookie settings');

      beforeBanner = document.createElement('div');
      beforeBanner.innerHTML = `${lowResolutionMessage} <button>${changeCookieSettings}</button>`;
      beforeBanner.querySelector('button').addEventListener('click', () => {
        window.OneTrust.ToggleInfoDisplay();
      });
    }

    modal.showModal(linkUrl, beforeBanner);
  });
}

export function addVideoShowHandler(link) {
  link.classList.add('text-link-with-video');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    import('../common/modal/modal.js').then((modal) => {
      modal.showModal(link.getAttribute('href'));
    });
  });
}

export function addPlayIcon(parent) {
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('video-icon-wrapper');
  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-play', 'video-icon');
  iconWrapper.appendChild(icon);
  parent.appendChild(iconWrapper);
}

export function wrapImageWithVideoLink(videoLink, image) {
  videoLink.innerText = '';
  videoLink.appendChild(image);
  videoLink.classList.add('link-with-video');
  videoLink.classList.remove('button', 'primary');

  addPlayIcon(videoLink);
}

export function createIframe(url, { parentEl, classes = [] }) {
  // iframe must be recreated every time otherwise the new history record would be created
  const iframe = document.createElement('iframe');
  const iframeClasses = Array.isArray(classes) ? classes : [classes];

  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', 'allowfullscreen');
  iframe.setAttribute('src', url);
  iframe.classList.add(...iframeClasses);

  if (parentEl) {
    parentEl.appendChild(iframe);
  }

  return iframe;
}
