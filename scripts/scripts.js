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
  loadBlocks,
  loadCSS,
  createOptimizedPicture,
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

function createTabbedSection(tabItems, fullWidth, tabType) {
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
      tabItems.push(tabContent);
      section.remove();
    } else if (tabItems.length > 0) {
      const tabbedSection = createTabbedSection(tabItems, fullWidth, tabType);
      section.parentNode.insertBefore(tabbedSection, section);
      decorateBlock(tabbedSection.querySelector('.tabbed-carousel, .tabbed-accordion'));
      tabItems = [];
      fullWidth = false;
    }
  });
  if (tabItems.length > 0) {
    const tabbedCarouselSection = createTabbedSection(tabItems, fullWidth, tabType);
    main.append(tabbedCarouselSection);
    decorateBlock(tabbedCarouselSection.querySelector('.tabbed-carousel, .tabbed-accordion'));
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
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
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
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

async function* request(url, context) {
  const { chunks: chunkSize, fetch } = context;
  for (let offset = 0, total = Infinity; offset < total; offset += chunkSize) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${url}?offset=${offset}&limit=${chunkSize}`);
    if (resp.ok) {
      // eslint-disable-next-line no-await-in-loop
      const json = await resp.json();
      total = json.total;
      // eslint-disable-next-line no-restricted-syntax
      for (const entry of json.data) yield entry;
    } else {
      return;
    }
  }
}

// Operations:

function withFetch(upstream, context, fetch) {
  context.fetch = fetch;
  return upstream;
}

function withHtmlParser(upstream, context, parseHtml) {
  context.parseHtml = parseHtml;
  return upstream;
}

function chunks(upstream, context, chunkSize) {
  context.chunks = chunkSize;
  return upstream;
}

async function* skip(upstream, context, skipItems) {
  let skipped = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const entry of upstream) {
    if (skipped < skipItems) {
      skipped += 1;
    } else {
      yield entry;
    }
  }
}

async function* limit(upstream, context, limitSize) {
  let yielded = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const entry of upstream) {
    yield entry;
    yielded += 1;
    if (yielded === limitSize) {
      return;
    }
  }
}

async function* map(upstream, context, fn, maxInFlight = 5) {
  const promises = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (let entry of upstream) {
    promises.push(fn(entry));
    if (promises.length === maxInFlight) {
      // eslint-disable-next-line no-restricted-syntax
      for (entry of promises) {
        // eslint-disable-next-line no-await-in-loop
        entry = await entry;
        if (entry) yield entry;
      }
      promises.splice(0, promises.length);
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (let entry of promises) {
    // eslint-disable-next-line no-await-in-loop
    entry = await entry;
    if (entry) yield entry;
  }
}

async function* filter(upstream, context, fn) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const entry of upstream) {
    if (fn(entry)) {
      yield entry;
    }
  }
}

function slice(upstream, context, from, to) {
  return limit(skip(upstream, context, from), context, to - from);
}

function follow(upstream, context, name, maxInFlight = 5) {
  const { fetch, parseHtml } = context;
  return map(upstream, context, async (entry) => {
    const value = entry[name];
    if (value) {
      const resp = await fetch(value);
      return { ...entry, [name]: resp.ok ? parseHtml(await resp.text()) : null };
    }
    return entry;
  }, maxInFlight);
}

async function all(upstream) {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const entry of upstream) {
    result.push(entry);
  }
  return result;
}

async function first(upstream) {
  /* eslint-disable-next-line no-unreachable-loop,no-restricted-syntax */
  for await (const entry of upstream) {
    return entry;
  }
  return null;
}

// Helper

function assignOperations(generator, context) {
  // operations that return a new generator
  function createOperation(fn) {
    return (...rest) => assignOperations(fn.apply(null, [generator, context, ...rest]), context);
  }
  const operations = {
    skip: createOperation(skip),
    limit: createOperation(limit),
    slice: createOperation(slice),
    map: createOperation(map),
    filter: createOperation(filter),
    follow: createOperation(follow),
  };

  // functions that either return the upstream generator or no generator at all
  const functions = {
    chunks: chunks.bind(null, generator, context),
    all: all.bind(null, generator, context),
    first: first.bind(null, generator, context),
    withFetch: withFetch.bind(null, generator, context),
    withHtmlParser: withHtmlParser.bind(null, generator, context),
  };

  return Object.assign(generator, operations, functions);
}

export function ffetch(url) {
  let chunkSize = 255;
  const fetch = (...rest) => window.fetch.apply(null, rest);
  const parseHtml = (html) => new window.DOMParser().parseFromString(html, 'text/html');

  try {
    if ('connection' in window.navigator && window.navigator.connection.saveData === true) {
      // request smaller chunks in save data mode
      chunkSize = 64;
    }
  } catch (e) { /* ignore */ }

  const context = { chunks: chunkSize, fetch, parseHtml };
  const generator = request(url, context);

  return assignOperations(generator, context);
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

/* video helpers */
export function isVideoLink(link) {
  return link.getAttribute('href').includes('youtube.com/embed/')
      && link.closest('.block.embed') === null;
}

export function addVideoShowHandler(link) {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    import('../common/modal/modal.js').then((modal) => {
      modal.showModal(link.getAttribute('href'));
    });
  });
}

export function wrapImageWithVideoLink(videoLink, image) {
  videoLink.innerText = '';
  videoLink.appendChild(image);
  videoLink.classList.add('link-with-video');
  videoLink.classList.remove('button', 'primary');

  // play icon
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('video-icon-wrapper');
  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-play', 'video-icon');
  iconWrapper.appendChild(icon);
  videoLink.appendChild(iconWrapper);
}
