import { showModal } from '../common/modal/modal.js';
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
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  const ctaLink = main.querySelector('a');
  // check if the previous element or the previous of that is an h1
  const isCTALink = ctaLink && isCTALinkCheck(ctaLink);
  if (isCTALink) ctaLink.classList.add('cta');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const headings = document.createElement('div');
    headings.className = 'hero-headings';
    const elems = [picture, headings];
    if (h1.nextElementSibling && (h1.nextElementSibling.matches('h2,h3,h4')
      // also consider a <p> without any children as sub heading
      || (h1.nextElementSibling.matches('p') && !h1.nextElementSibling.children.length))) {
      const h4 = document.createElement('h4');
      h4.innerHTML = h1.nextElementSibling.innerHTML;
      h1.nextElementSibling.remove();
      headings.appendChild(h4);
    }
    headings.appendChild(h1);
    if (isCTALink) headings.appendChild(getCTAContainer(ctaLink));
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems }));
    // remove the empty pre-section to avoid decorate it as empty section
    const containerChildren = main.children[0].children;
    const wrapperChildren = containerChildren[0].children;
    if (containerChildren.length <= 1 && wrapperChildren.length === 0) main.children[0].remove();
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

function createTabbedSection(tabItems, tabType, { fullWidth, fullVideo }) {
  const tabSection = document.createElement('div');
  tabSection.classList.add('section', 'tabbed-container');
  if (fullWidth) tabSection.classList.add('tabbed-container-full-width');
  if (fullVideo) tabSection.classList.add('tabbed-container-full-video');
  tabSection.dataset.sectionStatus = 'initialized';
  const wrapper = document.createElement('div');
  tabSection.append(wrapper);
  const tabBlock = buildBlock(`tabbed-${tabType}`, [tabItems]);
  wrapper.append(tabBlock);
  return tabSection;
}

function buildTabbedBlock(main) {
  let tabItems = [];
  let tabType;
  let fullWidth = false;
  let fullVideo = false;

  [...main.querySelectorAll(':scope > div')].forEach((section) => {
    const sectionMeta = section.dataset.carousel || section.dataset.tabs;
    if (sectionMeta) {
      const tabContent = document.createElement('div');
      tabType = tabType || (section.dataset.carousel ? 'carousel' : 'accordion');
      tabContent.dataset[tabType] = sectionMeta;
      tabContent.className = 'tab-content';
      fullWidth = fullWidth || section.matches('.full-width');
      fullVideo = fullVideo || section.matches('.full-video');
      tabContent.innerHTML = section.innerHTML;
      tabItems.push(tabContent);
      section.remove();
    } else if (tabItems.length > 0) {
      const tabbedSection = createTabbedSection(tabItems, tabType, { fullWidth, fullVideo });
      section.parentNode.insertBefore(tabbedSection, section);
      decorateBlock(tabbedSection.querySelector('.tabbed-carousel, .tabbed-accordion'));
      tabItems = [];
      fullWidth = false;
    }
  });
  if (tabItems.length > 0) {
    const tabbedCarouselSection = createTabbedSection(tabItems, tabType, { fullWidth, fullVideo });
    main.append(tabbedCarouselSection);
    decorateBlock(tabbedCarouselSection.querySelector('.tabbed-carousel, .tabbed-accordion'));
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
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
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main, head) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main, head);
  decorateSections(main);
  decorateBlocks(main);
  decorateSectionBackgrounds(main);
  addDefaultVideoLinkBehaviour(main);
  buildTabbedBlock(main);
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
  import('../common/modal/modal.js').then((modal) => {
    let beforeBanner = null;

    if (isLowResolutionVideoUrl(linkUrl)) {
      const lowResolutionMessage = getTextLable('Low resolution video message');
      const changeCookieSettings = getTextLable('Change cookie settings');

      beforeBanner = document.createElement('div');
      beforeBanner.innerHTML = `${lowResolutionMessage} <button>${changeCookieSettings}</button`;
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

    showModal(link.getAttribute('href'));
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
