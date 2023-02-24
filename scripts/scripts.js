import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  readBlockConfig,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = ['teaser-grid']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const headings = document.createElement('div');
    headings.className = 'hero-headings';
    const elems = [picture, headings];
    if (h1.nextElementSibling && h1.nextElementSibling.matches('p,h2,h3,h4')) {
      const h4 = document.createElement('h4');
      h4.innerHTML = h1.nextElementSibling.innerHTML;
      h1.nextElementSibling.remove();
      headings.appendChild(h4);
    }
    headings.appendChild(h1);
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems }));
    main.prepend(section);
  }
}

function buildTabbedCarouselBlock(main) {
  const tabItems = [];
  [...main.querySelectorAll(':scope > div')].forEach((section) => {
    const sectionMeta = section.querySelector('.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      if (meta?.carousel !== '') {
        // get header from previous section and set it as a new header
        const preSection = section.previousElementSibling;
        if (preSection) {
          const preSectionHeadings = preSection.querySelector('h2');
          if (preSectionHeadings) {
            const h2 = document.createElement('h2');
            h2.innerHTML = preSectionHeadings.innerHTML;
            preSection.remove();
            tabItems.push(h2);
          }
        }
        const tabContent = document.createElement('div');
        tabContent.dataset.carousel = meta.carousel;
        tabContent.className = 'tab-content';
        tabContent.innerHTML = section.innerHTML;
        const picture = tabContent.querySelector('picture');
        tabContent.prepend(picture);
        tabContent.querySelector('.section-metadata').remove();
        tabContent.querySelectorAll('p').forEach(($paragraph) => {
          if ($paragraph.innerHTML.trim() === '') {
            $paragraph.remove();
          }
        });
        tabItems.push(tabContent);
        section.remove();
      }
    } else {
      if (tabItems.length > 0) {
        const tabSection = document.createElement('div');
        tabSection.append(buildBlock('tabbed-carousel', [tabItems]));
        section.parentNode.insertBefore(tabSection, section);
      }
      tabItems.splice(0, tabItems.length);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildTabbedCarouselBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
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

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

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
