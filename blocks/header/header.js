import { createElement } from '../../scripts/common.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

const blockClass = 'header';

const desktopMQ = window.matchMedia('(min-width: 1200px)');

const createLogo = (logoWrapper) => {
  const logoImage = logoWrapper.querySelector('span.icon');
  let logoLink = null;

  if (logoImage.parentElement.tagName === 'A') {
    logoLink = logoImage.parentElement;
    logoLink.classList.add(`${blockClass}__logo-link`);
  }

  logoImage.classList.add(`${blockClass}__logo-image`);

  return logoLink || logoImage;
};

const createMainLinks = (mainLinksWrapper) => {
  const list = mainLinksWrapper.querySelector('ul');

  list.classList.add(`${blockClass}__main-nav`);
  list.querySelectorAll('li').forEach((listItem) => {
    listItem.classList.add(`${blockClass}__main-nav-item`);
  });
  list.querySelectorAll('li > a').forEach((link) => {
    link.classList.add(`${blockClass}__main-nav-link`, `${blockClass}__link`);
  });

  return list;
};

const createActions = (actionsWrapper) => {
  const list = actionsWrapper.querySelector('ul');

  list.classList.add(`${blockClass}__actions-list`);
  list.querySelectorAll('li').forEach((listItem) => {
    listItem.classList.add(`${blockClass}__action-item`);
  });
  list.querySelectorAll('li > a').forEach((link) => {
    link.classList.add(`${blockClass}__action-link`, `${blockClass}__link`);

    // wrapping text nodes into spans &
    // adding aria labels (because text labels are hidden on mobile)
    [...link.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .forEach((textNode) => {
        const spanWrapper = createElement('span', { classes: [`${blockClass}__action-link-text`] });

        textNode.replaceWith(spanWrapper);
        spanWrapper.append(textNode);
        link.setAttribute('aria-label', textNode.textContent);
      });
  });

  /* ADD EXPANDED AND COLTROLS ARIA */
  const closeIcon = document.createRange().createContextualFragment(`
    <button aria-label="Close menu" class="${blockClass}__close-menu" aria-expanded="false" aria-controls="main-nav-search">
      <span class="icon icon-close" />
    </button>
  `);

  list.append(closeIcon);

  return list;
};

const mobileActions = () => {
  const mobileActionsEl = createElement('div', { classes: [`${blockClass}__mobile-actions`] });

  /* ADD EXPANDED AND COLTROLS ARIA */
  const actions = document.createRange().createContextualFragment(`
    <a
      href="#"
      aria-label="Search"
      class="${blockClass}__search-button ${blockClass}__action-link ${blockClass}__link"
      aria-expanded="false"
      aria-controls="main-nav-search"
    >
      <span class="icon icon-search-icon"></span>
      <span class="${blockClass}__search-label">Search</span>
    </a>
    <a
      href="#"
      aria-label="Open menu"
      class="${blockClass}__hamburger-menu ${blockClass}__action-link ${blockClass}__link"
      aria-expanded="false"
      aria-controls="main-nav"
    >
      <span class="icon icon-hamburger-icon"></span>
    </a>
  `);

  mobileActionsEl.append(...actions.childNodes);

  return mobileActionsEl;
};

const addHeaderScrollBehavtios = (header) => {
  let prevPosition = 0;

  window.addEventListener('scroll', () => {
    if (window.scrollY > prevPosition) {
      header.classList.add(`${blockClass}--hidden`);
    } else {
      header.classList.remove(`${blockClass}--hidden`);
    }

    prevPosition = window.scrollY;
  });
};

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // clear the block
  block.textContent = '';

  // fetch nav content
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  const navPath = `${langCodeMatch ? langCodeMatch[1] : '/'}nav`;
  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error(`Header is not loaded: ${resp.status}`);
  }

  // get the navigation text, turn it into html elements
  const content = document.createRange().createContextualFragment(await resp.text());
  const [logoContainer, navigationContainer, actionsContainer] = [...content.querySelectorAll('div')];
  const nav = createElement('nav', { classes: [`${blockClass}__nav`] });
  const navContent = document.createRange().createContextualFragment(`
    <div class="${blockClass}__menu-background"></div>
    <div class="${blockClass}__logo-wrapper">
      ${createLogo(logoContainer).outerHTML}
    </div>
    <div class="${blockClass}__main-links">
      ${createMainLinks(navigationContainer).outerHTML}
    </div>
    <div class="${blockClass}__actions">
      ${mobileActions().outerHTML}
      ${createActions(actionsContainer).outerHTML}
    </div>
  `);

  decorateIcons(navContent);

  const closeHamburderMenu = () => {
    block.classList.remove('header--hamburger-open');
    document.body.classList.remove('disable-scroll');
  };

  // add actions for search
  navContent.querySelector(`.${blockClass}__search-button`).addEventListener('click', () => {
    window.location.href = '/search-results';
  });

  // add action for hamburger
  navContent.querySelector(`.${blockClass}__hamburger-menu`).addEventListener('click', () => {
    block.classList.add('header--hamburger-open');
    document.body.classList.add('disable-scroll');
  });

  navContent.querySelectorAll(`.${blockClass}__menu-background, .${blockClass}__close-menu`).forEach((el) => {
    el.addEventListener('click', closeHamburderMenu);
  });

  // hiding the hamburger menu when switch to desktop
  desktopMQ.addEventListener('change', closeHamburderMenu);

  addHeaderScrollBehavtios(block);

  nav.append(navContent);
  block.append(nav);
}
