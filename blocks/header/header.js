import { createElement, getTextLabel } from '../../scripts/common.js';
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

  list.setAttribute('id', 'header-main-nav');
  list.classList.add(`${blockClass}__main-nav`);
  list.querySelectorAll('li').forEach((listItem) => {
    listItem.classList.add(`${blockClass}__main-nav-item`);
    const accordionContainer = createElement('div', { classes: `${blockClass}__accortion-container` });
    const accordionContentWrapper = createElement('div', { classes: `${blockClass}__accortion-content-wrapper` });

    accordionContainer.append(accordionContentWrapper);
    listItem.append(accordionContainer);
  });
  list.querySelectorAll('li > a').forEach((link) => {
    link.classList.add(`${blockClass}__main-nav-link`, `${blockClass}__link`, `${blockClass}__link-accordion`);
  });

  return list;
};

const createActions = (actionsWrapper) => {
  const list = actionsWrapper.querySelector('ul');

  list.setAttribute('id', 'header-actions-list');
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

  const closeMenuLabel = getTextLabel('Close menu');
  const closeIcon = document.createRange().createContextualFragment(`
    <li class="header__action-item header__action-item--close-menu">
      <button
        aria-label="${closeMenuLabel}"
        class="${blockClass}__close-menu"
        aria-expanded="false"
        aria-controls="header-main-nav, header-actions-list"
      >
        <span class="icon icon-close" />
      </button>
    </li>
  `);

  list.append(closeIcon);

  return list;
};

const mobileActions = () => {
  const mobileActionsEl = createElement('div', { classes: [`${blockClass}__mobile-actions`] });
  const searchLable = getTextLabel('Search');
  const openMenuLable = getTextLabel('Open menu');

  const actions = document.createRange().createContextualFragment(`
    <a
      href="#"
      aria-label="${searchLable}"
      class="${blockClass}__search-button ${blockClass}__action-link ${blockClass}__link"
    >
      <span class="icon icon-search-icon"></span>
    </a>
    <button
      aria-label="${openMenuLable}"
      class="${blockClass}__hamburger-menu ${blockClass}__action-link ${blockClass}__link"
      aria-expanded="false"
      aria-controls="header-main-nav, header-actions-list"
    >
      <span class="icon icon-hamburger-icon"></span>
    </button>
  `);

  mobileActionsEl.append(...actions.childNodes);

  return mobileActionsEl;
};

const addHeaderScrollBehaviour = (header) => {
  let prevPosition = 0;

  window.addEventListener('scroll', () => {
    if (window.scrollY > prevPosition) {
      header.classList.add(`${blockClass}--hidden`);
    } else {
      header.classList.remove(`${blockClass}--hidden`);
    }

    // on Safari the window.scrollY can be negative so `> 0` check is needed
    prevPosition = window.scrollY > 0 ? window.scrollY : 0;
  });
};

const buildMenuContent = (menuData, navEl) => {
  const menus = [...menuData.querySelectorAll('.menu')];
  const navLinks = [...navEl.querySelectorAll(`.${blockClass}__main-nav-link`)];

  menus.forEach((menuItemData) => {
    const tabName = menuItemData.querySelector(':scope > div > div');
    const categories = [...menuItemData.querySelectorAll(':scope > div > div')].slice(1);
    const navLink = navLinks.find((el) => el.textContent.trim() === tabName.textContent.trim());
    const onAccortionItemClick = (el) => {
      el.preventDefault();
      el.target.parentElement.classList.toggle(`${blockClass}__menu-open`);
    };

    categories.forEach((cat) => {
      const title = cat.querySelector(':scope > p > a');
      const subtitle = cat.querySelector(':scope >p:nth-child(2)');
      const list = cat.querySelector(':scope > ul');

      title.classList.add(`${blockClass}__link`, `${blockClass}__link-accordion`);
      list.classList.add(`${blockClass}__category-items`);
      [...list.querySelectorAll('li')].forEach((item) => {
        item.classList.add(`${blockClass}__category-item`);

        [...item.childNodes].forEach((el) => {
          // removing new lines and empty text nodes
          if (el.tagName === 'BR') el.remove();

          // wrapping orphan text
          if (el.nodeType === Node.TEXT_NODE) {
            if (el.textContent.trim().length) {
              el.remove();
            }

            const textNode = createElement('span', { classes: `${blockClass}__link-description` });
            textNode.textContent = el.textContent.trim();
            el.replaceWith(textNode);
          }
        });
      });
      [...list.querySelectorAll('a')].forEach((el) => el.classList.add(`${blockClass}__link`));

      const menuContent = document.createRange().createContextualFragment(`
        <div class="${blockClass}__menu-content">
          ${title.outerHTML}
          <span class="${blockClass}__category-subtitle">${subtitle?.innerHTML || ''}</span>
          <div class="${blockClass}__category-content ${blockClass}__accortion-container">
            <div class="${blockClass}__accortion-content-wrapper">
              ${list.outerHTML}
            </div>
          </div>
        </div>
      `);

      menuContent.querySelector(`.${blockClass}__link-accordion`).addEventListener('click', onAccortionItemClick);
      navLink?.closest(`.${blockClass}__main-nav-item`).querySelector(`.${blockClass}__accortion-content-wrapper`).append(menuContent);
    });

    navLink?.addEventListener('click', onAccortionItemClick);
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
  const [logoContainer, navigationContainer, actionsContainer, menuContent] = content.children;
  const nav = createElement('nav', { classes: [`${blockClass}__nav`] });
  const navContent = document.createRange().createContextualFragment(`
    <div class="${blockClass}__menu-overlay"></div>
    ${createLogo(logoContainer).outerHTML}
    <div class="${blockClass}__main-links">
      ${createMainLinks(navigationContainer).outerHTML}
    </div>
    <div class="${blockClass}__actions">
      ${mobileActions().outerHTML}
      ${createActions(actionsContainer).outerHTML}
    </div>
  `);

  decorateIcons(navContent);

  const setAriaForMenu = (isMenuVisible) => {
    nav.querySelectorAll(`.${blockClass}__close-menu, .${blockClass}__hamburger-menu`).forEach((control) => {
      control.setAttribute('aria-expanded', isMenuVisible);
    });
    nav.querySelectorAll('#header-main-nav, #header-actions-list').forEach((item) => {
      item.setAttribute('aria-hidden', !isMenuVisible);
    });
  };

  const closeHamburgerMenu = () => {
    block.classList.remove('header--hamburger-open');
    document.body.classList.remove('disable-scroll');

    setAriaForMenu(false);
  };

  // add actions for search
  navContent.querySelector(`.${blockClass}__search-button`).addEventListener('click', () => {
    window.location.href = '/search-results';
  });

  // add action for hamburger
  navContent.querySelector(`.${blockClass}__hamburger-menu`).addEventListener('click', () => {
    block.classList.add('header--hamburger-open');
    document.body.classList.add('disable-scroll');

    setAriaForMenu(true);
  });

  navContent.querySelectorAll(`.${blockClass}__menu-overlay, .${blockClass}__close-menu`).forEach((el) => {
    el.addEventListener('click', closeHamburgerMenu);
  });

  // hiding the hamburger menu when switch to desktop
  desktopMQ.addEventListener('change', closeHamburgerMenu);

  addHeaderScrollBehaviour(block);

  nav.append(navContent);
  block.append(nav);

  setAriaForMenu(false);
  buildMenuContent(menuContent, nav);
}
