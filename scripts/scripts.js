import {
  sampleRUM,
  buildBlock,
  loadHeader,
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
  getMetadata,
  toClassName,
} from './lib-franklin.js';

const LCP_BLOCKS = ['teaser-grid']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here
let placeholders = null;

async function getPlaceholders() {
  placeholders = await fetch('/placeholder.json').then((resp) => resp.json());
}

export function getTextLabel(key) {
  return placeholders.data.find((el) => el.Key === key)?.Text || key;
}

/**
 * Create an element with the given id and classes.
 * @param {string} tagName the tag
 * @param {string[]|string} classes the class or classes to add
 * @param {object} props any other attributes to add to the element
 * @returns the element
 */
export function createElement(tagName, classes, props) {
  const elem = document.createElement(tagName);
  if (classes) {
    const classesArr = (typeof classes === 'string') ? [classes] : classes;
    elem.classList.add(...classesArr);
  }
  if (props) {
    Object.keys(props).forEach((propName) => {
      elem.setAttribute(propName, props[propName]);
    });
  }

  return elem;
}

function getCTAContainer(ctaLink) {
  return ['strong', 'em'].includes(ctaLink.parentElement.localName)
    ? ctaLink.parentElement.parentElement
    : ctaLink.parentElement;
}

function isCTALinkCheck(ctaLink) {
  const btnContainer = getCTAContainer(ctaLink);
  if (!btnContainer.classList.contains('button-container')) return false;
  const nextSibling = btnContainer?.nextElementSibling;
  const previousSibling = btnContainer?.previousElementSibling;
  const twoPreviousSibling = previousSibling?.previousElementSibling;
  const siblings = [previousSibling, nextSibling, twoPreviousSibling];
  return siblings.some((elem) => elem?.localName === 'h1');
}

function buildHeroBlock(main) {
  // switching off hero autoblock for redesign
  if (document.body.classList.contains('redesign-v2')) {
    return;
  }

  // don't create a hero if the first item is a block, except hero block
  const firstSection = main.querySelector('div');
  if (!firstSection) return;
  const firstElement = firstSection.firstElementChild;
  if (firstElement.tagName === 'DIV' && firstElement.classList.length && !firstElement.classList.contains('hero')) return;

  const h1 = firstSection.querySelector('h1');
  const picture = firstSection.querySelector('picture');
  let ctaLink = firstSection.querySelector('a');
  let video = null;

  // eslint-disable-next-line no-use-before-define
  if (ctaLink && isLowResolutionVideoUrl(ctaLink.getAttribute('href'))) {
    const videoTemp = `
      <video muted loop class="hero-video">
        <source src="${ctaLink.getAttribute('href')}" type="video/mp4"></source>
      </video>
    `;

    const videoWrapper = document.createElement('div');
    videoWrapper.innerHTML = videoTemp;
    video = videoWrapper.querySelector('video');
    ctaLink.parentElement.remove();
    ctaLink = firstSection.querySelector('a');

    // adding video with delay to not affect page loading time
    setTimeout(() => {
      picture.replaceWith(video);
      video.play();
    }, 3000);
  }

  // check if the previous element or the previous of that is an h1
  const isCTALink = ctaLink && isCTALinkCheck(ctaLink);
  if (isCTALink) ctaLink.classList.add('cta');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const headings = document.createElement('div');
    headings.className = 'hero-headings';
    const elems = [picture, headings];
    if (h1.nextElementSibling && (h1.nextElementSibling.matches('h2,h3,h4')
      // also consider a <p> without any children as sub heading except BR
      || (h1.nextElementSibling.matches('p') && ![...h1.nextElementSibling.children].filter((el) => el.tagName !== 'BR').length))) {
      const h4 = document.createElement('h4');
      h4.innerHTML = h1.nextElementSibling.innerHTML;
      h1.nextElementSibling.remove();
      headings.appendChild(h4);
    }
    headings.appendChild(h1);
    if (isCTALink) headings.appendChild(getCTAContainer(ctaLink));
    const section = document.createElement('div');
    const newHeroBlock = buildBlock('hero', { elems });
    newHeroBlock.classList.add(...firstElement.classList);
    section.append(newHeroBlock);
    // remove the empty pre-section to avoid decorate it as empty section
    const containerChildren = firstSection.children;
    const wrapperChildren = containerChildren[0].children;
    if (containerChildren.length <= 1 && wrapperChildren.length === 0) firstSection.remove();
    else if (wrapperChildren.length === 0) containerChildren[0].remove();

    if (video) {
      section.querySelector('.hero')?.classList.add('hero-with-video');
    }

    // after all are settled, the new section can be added
    main.prepend(section);
  }
}

function buildSubNavigation(main, head) {
  const subnav = head.querySelector('meta[name="sub-navigation"]');
  if (subnav && subnav.content.startsWith('/')) {
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
      const primaryLink = lis[0].querySelector('a.primary');
      if (primaryLink) primaryLink.classList.add('dark');
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
  [...container.querySelectorAll('picture + br + a, picture + a')]
    // link text is an unformatted URL paste
    .filter((a) => a.textContent.trim().startsWith('http'))
    .forEach((a) => {
      const br = a.previousElementSibling;
      let picture = br.previousElementSibling;
      if (br.tagName === 'PICTURE') picture = br;
      picture.remove();
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
    // link text is an unformatted URL paste
    .filter((a) => a.textContent.trim().startsWith('http'))
    .forEach((a) => {
      const picture = a.parentNode.previousElementSibling.firstElementChild;
      picture.parentNode.remove();
      a.innerHTML = picture.outerHTML;
      // make sure the link is not decorated as a button
      a.parentNode.classList.remove('button-container');
      a.className = '';
    });
}

export function decorateLinks(block) {
  [...block.querySelectorAll('a')]
    .filter(({ href }) => !!href)
    .forEach((link) => {
      /* eslint-disable no-use-before-define */
      if (isVideoLink(link)) {
        addVideoShowHandler(link);
        return;
      }
      if (isSoundcloudLink(link)) {
        addSoundcloudShowHandler(link);
      }

      const url = new URL(link.href);
      const external = !url.host.match('volvotrucks.(us|ca)') && !url.host.match('.hlx.(page|live)') && !url.host.match('localhost');
      if (url.host.match('build.volvotrucks.(us|ca)') || url.pathname.endsWith('.pdf') || url.pathname.endsWith('.jpeg') || external) {
        link.target = '_blank';
      }
    });
}

function decorateOfferLinks(main) {
  async function openOffer(event) {
    event.preventDefault();
    const module = await import(`${window.hlx.codeBasePath}/blocks/get-an-offer/get-an-offer.js`);
    if (module.showOffer) {
      await module.showOffer(event.target);
    }
  }
  main.querySelectorAll('a[href*="offer"]').forEach((a) => {
    if (a.href.endsWith('-offer')) {
      let list = a.closest('ul');
      if (!list) {
        list = document.createElement('ul');
        const parent = a.parentElement;
        const li = document.createElement('li');
        list.append(li);
        li.append(a);
        parent.after(list);
        if (parent.textContent === '' && parent.children.length === 0) parent.remove();
      }
      list.classList.add('inline');
      const li = document.createElement('li');
      const clone = a.cloneNode(true);
      clone.textContent = 'Details';
      clone.title = clone.textContent;
      li.append(clone);
      list.append(li);
      a.addEventListener('click', openOffer);
      clone.addEventListener('click', openOffer);
    }
  });
}

/**
 * loads a block named 'v2-footer' into footer
 */
function loadFooter(footer) {
  if (footer) {
    const footerBlock = buildBlock('v2-footer', '');
    footer.append(footerBlock);
    decorateBlock(footerBlock);
    loadBlock(footerBlock);
  }
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
  decorateLinks(main);
  buildTabbedBlock(main);
  decorateOfferLinks(main);
  buildCtaList(main);
}

async function loadTemplate(doc, templateName) {
  try {
    const cssLoaded = new Promise((resolve) => {
      loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`, resolve);
    });
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(`../templates/${templateName}/${templateName}.js`);
          if (mod.default) {
            await mod.default(doc);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`failed to load module for ${templateName}`, error);
        }
        resolve();
      })();
    });
    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`failed to load block ${templateName}`, error);
  }
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
    const templateName = getMetadata('template');
    if (templateName) await loadTemplate(doc, templateName);
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

  const subnav = header?.querySelector('.block.sub-nav');
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
  window.setTimeout(() => {
    import('./delayed.js');
  }, 3000);
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
  const optanonConsentCookieValue = decodeURIComponent(document.cookie.split(';').find((cookie) => cookie.trim().startsWith('OptanonConsent=')));
  const cookieConsentForExternalVideos = optanonConsentCookieValue.includes('C0005:1');
  const shouldUseYouTubeLinks = cookieConsentForExternalVideos && preferredType !== 'local';
  const youTubeLink = linksList.find((link) => link.getAttribute('href').includes('youtube.com/embed/'));
  const localMediaLink = linksList.find((link) => link.getAttribute('href').split('?')[0].endsWith('.mp4'));

  if (shouldUseYouTubeLinks && youTubeLink) {
    return youTubeLink;
  }
  return localMediaLink;
}

export function createLowResolutionBanner() {
  const lowResolutionMessage = getTextLabel('Low resolution video message');
  const changeCookieSettings = getTextLabel('Change cookie settings');

  const banner = document.createElement('div');
  banner.classList.add('low-resolution-banner');
  banner.innerHTML = `${lowResolutionMessage} <button class="low-resolution-banner-cookie-settings">${changeCookieSettings}</button>`;
  banner.querySelector('button').addEventListener('click', () => {
    window.OneTrust.ToggleInfoDisplay();
  });

  return banner;
}

export function showVideoModal(linkUrl) {
  // eslint-disable-next-line import/no-cycle
  import('../common/modal/modal.js').then((modal) => {
    let beforeBanner = null;

    if (isLowResolutionVideoUrl(linkUrl)) {
      beforeBanner = createLowResolutionBanner();
    }

    modal.showModal(linkUrl, beforeBanner);
  });
}

export function addVideoShowHandler(link) {
  link.classList.add('text-link-with-video');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    showVideoModal(link.getAttribute('href'));
  });
}

export function isSoundcloudLink(link) {
  return link.getAttribute('href').includes('soundcloud.com/player')
    && link.closest('.block.embed') === null;
}

export function addSoundcloudShowHandler(link) {
  link.classList.add('text-link-with-soundcloud');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    const thumbnail = link.closest('div')?.querySelector('picture');
    const title = link.closest('div')?.querySelector('h1, h2, h3');
    const text = link.closest('div')?.querySelector('p:not(.button-container, .image)');

    // eslint-disable-next-line import/no-cycle
    import('../common/modal/modal.js').then((modal) => {
      const episodeInfo = document.createElement('div');
      episodeInfo.classList.add('modal-soundcloud');
      episodeInfo.innerHTML = `<div class="episode-image"><picture></div>
      <div class="episode-text">
          <h2></h2>
          <p></p>
      </div>`;
      episodeInfo.querySelector('picture').innerHTML = thumbnail?.innerHTML || '';
      episodeInfo.querySelector('h2').innerText = title?.innerText || '';
      episodeInfo.querySelector('p').innerText = text?.innerText || '';

      modal.showModal(link.getAttribute('href'), null, episodeInfo);
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
  videoLink.classList.remove('button', 'primary', 'text-link-with-video');

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

export const removeEmptyTags = (block) => {
  block.querySelectorAll('*').forEach((x) => {
    const tagName = `</${x.tagName}>`;

    // checking that the tag is not autoclosed to make sure we don't remove <meta />
    // checking the innerHTML and trim it to make sure the content inside the tag is 0
    if (
      x.outerHTML.slice(tagName.length * -1).toUpperCase() === tagName
      // && x.childElementCount === 0
      && x.innerHTML.trim().length === 0) {
      x.remove();
    }
  });
};

export const MEDIA_BREAKPOINTS = {
  MOBILE: 'MOBILE',
  TABLET: 'TABLET',
  DESKTOP: 'DESKTOP',
};

export function getImageForBreakpoint(imagesList, onChange = () => {}) {
  const mobileMQ = window.matchMedia('(max-width: 743px)');
  const tabletMQ = window.matchMedia('(min-width: 744px) and (max-width: 1199px)');
  const desktopMQ = window.matchMedia('(min-width: 1200px)');

  const [mobilePic, tabletPic, desktopPic] = imagesList.querySelectorAll('picture');

  const onBreakpointChange = (mq, picture, breakpoint) => {
    if (mq.matches) {
      onChange(picture, breakpoint);
    }
  };
  const onMobileChange = (mq) => onBreakpointChange(mq, mobilePic, MEDIA_BREAKPOINTS.MOBILE);
  const onTabletChange = (mq) => onBreakpointChange(mq, tabletPic, MEDIA_BREAKPOINTS.TABLET);
  const onDesktopChange = (mq) => onBreakpointChange(mq, desktopPic, MEDIA_BREAKPOINTS.DESKTOP);

  mobileMQ.addEventListener('change', onMobileChange);
  tabletMQ.addEventListener('change', onTabletChange);
  desktopMQ.addEventListener('change', onDesktopChange);

  if (mobileMQ.matches) {
    onMobileChange(mobileMQ);
    return;
  }

  if (tabletMQ.matches) {
    onTabletChange(tabletMQ);
    return;
  }
  onDesktopChange(desktopMQ);
}

/* REDESING CLASS CHECK */
if (document.querySelector('main').classList.contains('redesign-v2')) {
  document.querySelector('html').classList.add('redesign-v2');
  document.querySelector('main').classList.remove('redesign-v2');
}
