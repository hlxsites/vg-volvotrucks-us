import {
  buildBlock,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateBlock,
  decorateTemplateAndTheme,
  waitForLCP,
  createOptimizedPicture,
  getMetadata,
  toClassName,
  getHref,
} from './lib-franklin.js';

import {
  getPlaceholders,
  loadLazy,
  loadDelayed,
  loadTemplate,
  createElement,
  slugify,
  variantsClassesToBEM,
} from './common.js';

import {
  isVideoLink,
  isSoundcloudLink,
  isLowResolutionVideoUrl,
  addVideoShowHandler,
  addSoundcloudShowHandler,
} from './video-helper.js';

const LCP_BLOCKS = ['teaser-grid']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

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

/**
 * Returns a picture element with webp and fallbacks / allow multiple src paths for every breakpoint
 * @param {string} src Default image URL (if no src is passed to breakpoints object)
 * @param {boolean} eager load image eager
 * @param {Array} breakpoints breakpoints and corresponding params (eg. src, width, media)
 */
export function createCustomOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, getHref());
  const picture = document.createElement('picture');
  let { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  breakpoints.forEach((br) => {
    // custom src path in breakpoint
    if (br.src) {
      const customUrl = new URL(br.src, getHref());
      pathname = customUrl.pathname;
    }

    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      img.setAttribute('width', br.width);
      img.setAttribute('height', br.height);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

function buildHeroBlock(main) {
  // switching off hero autoblock for redesign
  if (document.querySelector('main').classList.contains('redesign-v2')) {
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
    const headings = createElement('div', { classes: 'hero-headings' });
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
function createTabbedSection(tabItems, tabType, { fullWidth }) {
  const tabSection = createElement('div', { classes: ['section', 'tabbed-container'] });
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

function createTruckLineupSection(tabItems) {
  const tabSection = createElement('div', { classes: 'section' });
  tabSection.dataset.sectionStatus = 'initialized';
  const wrapper = createElement('div');
  tabSection.append(wrapper);
  const tabBlock = buildBlock('v2-truck-lineup', [tabItems]);
  wrapper.append(tabBlock);
  return tabSection;
}

function buildTruckLineupBlock(main) {
  const tabItems = [];
  let nextElement;
  const BREAKPOINTS = {
    0: '(min-width: 400px)',
    1: '(min-width: 1200px)',
  };

  const mainChildren = [...main.querySelectorAll(':scope > div')];
  mainChildren.forEach((section, i) => {
    const isTruckCarousel = section.dataset.truckCarousel;
    if (!isTruckCarousel) return;

    // save carousel position
    nextElement = mainChildren[i + 1];
    const sectionMeta = section.dataset.truckCarousel;

    const tabContent = createElement('div', { classes: 'v2-truck-lineup__content' });
    tabContent.dataset.truckCarousel = sectionMeta;
    tabContent.innerHTML = section.innerHTML;
    const images = tabContent.querySelectorAll('p > picture');

    const imageBreakpoints = [];
    const firstImage = images[0]?.lastElementChild;
    const baseImageObj = {
      src: firstImage?.src,
      alt: firstImage?.alt,
    };

    images.forEach((pic, j) => {
      const img = pic.lastElementChild;
      imageBreakpoints.push({
        src: img.src,
        width: img.width,
        height: img.height,
        media: BREAKPOINTS[j],
      });

      pic.parentNode.remove();
    });
    imageBreakpoints.reverse(); // order first big and then small version
    const newPicture = createCustomOptimizedPicture(
      baseImageObj.src,
      baseImageObj.alt,
      false,
      imageBreakpoints,
    );

    tabContent.prepend(newPicture);

    tabItems.push(tabContent);
    section.remove();
  });

  if (tabItems.length > 0) {
    const truckLineupSection = createTruckLineupSection(tabItems);
    if (nextElement) { // if we saved a position push the carousel in that position if not
      main.insertBefore(truckLineupSection, nextElement);
    } else {
      main.append(truckLineupSection);
    }
    decorateIcons(truckLineupSection);
    decorateBlock(truckLineupSection.querySelector('.v2-truck-lineup'));
  }
}

function decorateSectionBackgrounds(main) {
  const variantClasses = ['black-background', 'gray-background'];

  main.querySelectorAll(':scope > .section').forEach((section) => {
    // transform background color variants into BEM classnames
    variantsClassesToBEM(section.classList, variantClasses, 'section');

    // If the section contains a background image
    const src = section.dataset.background;
    if (src) {
      const picture = createOptimizedPicture(src, '', false);
      section.appendChild(picture);
      section.classList.add('section-with-background');
    }
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

const createInpageNavigation = (main) => {
  const navItems = [];
  const tabItemsObj = [];

  // Extract the inpage navigation info from sections
  [...main.querySelectorAll(':scope > div')].forEach((section) => {
    const title = section.dataset.inpage;
    if (title) {
      const countDuplcated = tabItemsObj.filter((item) => item.title === title)?.length || 0;
      const order = parseFloat(section.dataset.inpageOrder);
      const anchorID = (countDuplcated > 0) ? slugify(`${section.dataset.inpage}-${countDuplcated}`) : slugify(section.dataset.inpage);
      const obj = {
        title,
        id: anchorID,
      };

      if (order) {
        obj.order = order;
      }

      tabItemsObj.push(obj);

      // Set section with ID
      section.dataset.inpageid = anchorID;
    }
  });

  // Sort the object by order
  const sortedObject = tabItemsObj.slice().sort((obj1, obj2) => {
    if (!obj1.order) {
      return 1; // Move 'a' to the end
    }
    if (!obj2.order) {
      return -1; // Move 'b' to the end
    }
    return obj1.order - obj2.order;
  });

  // From the array of objects create the DOM
  sortedObject.forEach((item) => {
    const subnavItem = createElement('div');
    const subnavLink = createElement('button', {
      props: {
        'data-id': item.id,
        title: item.title,
      },
    });

    subnavLink.textContent = item.title;

    subnavItem.append(subnavLink);
    navItems.push(subnavItem);
  });

  return navItems;
};

function buildInpageNavigationBlock(main) {
  const inapgeClassName = 'v2-inpage-navigation';

  const items = createInpageNavigation(main);

  if (items.length > 0) {
    const section = createElement('div');
    Object.assign(section.style, {
      height: '48px',
      overflow: 'hidden',
    });

    section.append(buildBlock(inapgeClassName, { elems: items }));
    main.prepend(section);

    decorateBlock(section.querySelector(`.${inapgeClassName}`));
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

  // redesign
  buildTruckLineupBlock(main);
  buildInpageNavigationBlock(main);
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

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

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
