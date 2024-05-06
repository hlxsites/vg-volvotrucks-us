import {
  sampleRUM,
  loadCSS,
  loadBlock,
  loadBlocks,
  loadHeader,
  buildBlock,
  decorateBlock,
} from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { createVideo, isVideoLink } from './video-helper.js';
import { COOKIE_VALUES } from './constants.js';

const { performance, targeting, social } = COOKIE_VALUES;
let placeholders = null;

/**
 * loads a block named 'footer' into footer
 */
function loadFooter(footer) {
  if (footer) {
    const footerBlock = buildBlock('footer', '');
    footer.append(footerBlock);
    decorateBlock(footerBlock);
    loadBlock(footerBlock);
  }
}

export const getLanguagePath = () => {
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  return langCodeMatch ? langCodeMatch[1] : '/';
};

export async function getPlaceholders() {
  const url = `${getLanguagePath()}placeholder.json`;
  placeholders = await fetch(url).then((resp) => resp.json());
}

export function getTextLabel(key) {
  return placeholders?.data.find((el) => el.Key === key)?.Text || key;
}

/**
 * Create an element with the given id and classes.
 * @param {string} tagName the tag
 * @param {Object} options the element options
 * @param {string[]|string} [options.classes=[]] the class or classes to add
 * @param {Object} [options.props={}] any other attributes to add to the element
 * @returns {HTMLElement} the element
 */
export function createElement(tagName, options = {}) {
  const { classes = [], props = {} } = options;
  const elem = document.createElement(tagName);
  const isString = typeof classes === 'string';
  if (classes || (isString && classes !== '') || (!isString && classes.length > 0)) {
    const classesArr = isString ? [classes] : classes;
    elem.classList.add(...classesArr);
  }
  if (!isString && classes.length === 0) elem.removeAttribute('class');

  if (props) {
    Object.keys(props).forEach((propName) => {
      const value = propName === props[propName] ? '' : props[propName];
      elem.setAttribute(propName, value);
    });
  }

  return elem;
}

/**
 * Create a new section with the specific name.
 * Append the given node to this section.
 * @param {string} blockName - Block name.
 * @param {string} sectionName - Name of the section
 *  (content-section, media-section etc...).
 * @param {HTMLElement} node - HTML element that represents
 *  the node to append to the section.
 * @returns {HTMLElement} - Returns an HTML element representing
 *  the new section with appended cell.
 */
export function createNewSection(blockName, sectionName, node) {
  const section = createElement('div', { classes: `${blockName}__${sectionName}-section` });
  section.append(node);
  return section;
}

/**
 * Provides the functionality to add a video
 * to the provided section if the link corresponds to a video.
 * @param {string} blockName - Name of the block.
 * @param {HTMLElement} section - Represents the section to which the video should be added.
 * @param {HTMLAnchorElement} link - Anchor link
 * @returns {HTMLElement} - Section with added video
 */
export function addVideoToSection(blockName, section, link) {
  const isVideo = link ? isVideoLink(link) : false;
  if (isVideo) {
    const video = createVideo(link.getAttribute('href'), `${blockName}__video`, {
      muted: true, autoplay: true, loop: true, playsinline: true,
    });
    const playbackControls = video.querySelector('button');
    link.remove();
    section.append(video, playbackControls);
  }
  return section;
}
/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = createElement('link', { props: { rel: 'icon', type: 'image/svg+xml', href } });
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

export async function loadTemplate(doc, templateName) {
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
 * loads everything that doesn't need to be delayed.
 */
export async function loadLazy(doc) {
  loadCSS(`${window.hlx.codeBasePath}/styles/header-font.css`);
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
export function loadDelayed() {
  window.setTimeout(() => {
    // eslint-disable-next-line import/no-cycle
    import('./delayed.js');
  }, 3000);
  // load anything that can be postponed to the latest here
}

export const removeEmptyTags = (block) => {
  block.querySelectorAll('*').forEach((x) => {
    const tagName = `</${x.tagName}>`;

    // exclude iframes
    if (x.tagName.toUpperCase() === 'IFRAME') {
      return;
    }
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

export const unwrapDivs = (element, options = {}) => {
  const stack = [element];
  const { ignoreDataAlign = false } = options;

  while (stack.length > 0) {
    const currentElement = stack.pop();

    let i = 0;
    while (i < currentElement.children.length) {
      const node = currentElement.children[i];
      const attributesLength = [...node.attributes].filter((el) => {
        if (ignoreDataAlign) {
          return !(el.name.startsWith('data-align') || el.name.startsWith('data-valign'));
        }

        return el;
      }).length;

      if (node.tagName === 'DIV' && attributesLength === 0) {
        while (node.firstChild) {
          currentElement.insertBefore(node.firstChild, node);
        }
        node.remove();
      } else {
        stack.push(node);
        i += 1;
      }
    }
  }
};

export const variantsClassesToBEM = (blockClasses, expectedVariantsNames, blockName) => {
  expectedVariantsNames.forEach((variant) => {
    if (blockClasses.contains(variant)) {
      blockClasses.remove(variant);
      blockClasses.add(`${blockName}--${variant}`);
    }
  });
};

/**
 * Adds a CSS class to the parent element of a child element
 * if the child element's class list includes the specified class.
 *
 * @param {HTMLElement} child - The child HTML element.
 * @param {string} className - The name of the class to check and add.
 */
export function addClassIfChildHasClass(child, className) {
  if (child.className.includes(className)) {
    child.parentElement.classList.add(className);
  }
}
/**
 *
 * @param {string} blockName - block name with '-' instead of spaces
 * @param {string} blockContent - the content that will be set as block inner HTML
 * @param {object} options - other options like variantsClasses
 * @returns
 */
export async function loadAsBlock(blockName, blockContent, options = {}) {
  const { variantsClasses = [] } = options;
  const blockEl = createElement('div', {
    classes: ['block', blockName, ...variantsClasses],
    props: { 'data-block-name': blockName },
  });
  const wrapperEl = createElement('div');
  wrapperEl.append(blockEl);

  blockEl.innerHTML = blockContent;
  await loadBlocks(wrapperEl);

  return blockEl;
}

export const adjustPretitle = (element) => {
  const headingSelector = 'h1, h2, h3, h4, h5, h6';

  [...element.querySelectorAll(headingSelector)].forEach((heading) => {
    const isNextElHeading = heading.nextElementSibling?.matches(headingSelector);

    if (!isNextElHeading) {
      return;
    }

    const currentLevel = Number(heading.tagName[1]);
    const nextElLevel = Number(heading.nextElementSibling.tagName[1]);

    if (currentLevel > nextElLevel) {
      const pretitle = createElement('span', { classes: ['pretitle'] });
      pretitle.append(...heading.childNodes);

      heading.replaceWith(pretitle);
    }
  });
};

export const slugify = (text) => (
  text.toString().toLowerCase().trim()
    // separate accent from letter
    .normalize('NFD')
    // remove all separated accents
    .replace(/[\u0300-\u036f]/g, '')
    // replace spaces with -
    .replace(/\s+/g, '-')
    // replace & with 'and'
    .replace(/&/g, '-and-')
    // remove all non-word chars
    .replace(/[^\w-]+/g, '')
    // replace multiple '-' with single '-'
    .replace(/--+/g, '-')
);

/**
 * Check if one trust group is checked.
 * @param {String} groupName the one trust croup like: C0002
 */
export function checkOneTrustGroup(groupName) {
  const oneTrustCookie = decodeURIComponent(document.cookie.split(';').find((cookie) => cookie.trim().startsWith('OptanonConsent=')));
  return oneTrustCookie.includes(`${groupName}:1`);
}

export function isPerformanceAllowed() {
  return checkOneTrustGroup(performance);
}

export function isTargetingAllowed() {
  return checkOneTrustGroup(targeting);
}

export function isSocialAllowed() {
  return checkOneTrustGroup(social);
}

/*
  The generateId function should be used only
  for generating the id for UI elements
*/
let idValue = 0;

export const generateId = (prefix = 'id') => {
  idValue += 1;
  return `${prefix}-${idValue}`;
};

/**
 * Helper for delaying a function
 * @param {function} func callback function
 * @param {number} timeout time to debouce in ms, default 200
*/
export function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

/**
 * Returns a list of properties listed in the block
 * @param {string} route get the Json data from the route
 * @returns {Object} the json data object
*/
export const getJsonFromUrl = async (route) => {
  try {
    const response = await fetch(route);
    if (!response.ok) return null;
    const json = await response.json();
    return json;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getJsonFromUrl:', { error });
  }
  return null;
};

export const deepMerge = (target, source) => {
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object') {
      if (!target[key]) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
};
