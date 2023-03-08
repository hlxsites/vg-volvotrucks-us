import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const MQ = window.matchMedia('(min-width: 992px)');

/* function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && MQ.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!MQ.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 *
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 *
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded')
   === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || MQ.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || MQ.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (MQ.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || MQ.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}
*/

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // not really needed
  const config = readBlockConfig(block);
  // clear the block
  block.textContent = '';

  // fetch nav content
  const navPath = config.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    // get the navigation text, turn it into html elements
    const navContent = document.createRange().createContextualFragment(await resp.text());

    // start the nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    // add all the divs that will be part of the nav
    nav.innerHTML = `
      <div class='brand'>
        <div class='logo'>
        </div>
        <div class='vgsection-location'>
          <div class='vgsection'>
          </div>
          <div class='location'>
          </div>
        </div>
      </div>

      <a class="search-toggle" aria-expanded="false">
        <img class="search-icon" src="icons/search-icon.png" >
      </a>

      <a class="hamburger-toggle" aria-expanded="false" >
        <img class="hamburger-icon" src="/icons/Hamburger-mobile.png">
      </a>

      <div class='search' aria-expanded="false">
        <div>
          <label for="searchInput">Search Term</label>
          <input autocomplete="off" type="text" id="searchInput" placeholder="Search for"
          onkeypress="searchKeyCheck(event, this, 'us', '/search-results/')" >
          <a class="search-button" href="javascript:submitSearch($('#searchText_mobile'), 'us', '/search-results/')" >
            <i class="fa fa-search"></i>
          </a>
        </div>
      </div>

      <div class='tools'>
        <div class='hamburger-close'>
          <img src="/icons/Close-Icons.png">
        </div>
      </div>

      <div class='sections'>
      </div>

      <div class='semitrans'>
      </div>
    `;

    // fill in the content from nav doc
    // logo
    nav.querySelector('.logo').append(navContent.querySelector('div:first-of-type > p:first-of-type > span'));
    // vg_section
    nav.querySelector('.vgsection').append(navContent.querySelector('div:first-of-type > p:nth-of-type(2)').textContent);
    // location
    nav.querySelector('.location').append(navContent.querySelector('div:first-of-type > p:nth-of-type(3)').textContent);
    // tools
    nav.querySelector('.tools').prepend(navContent.querySelector('div:nth-of-type(2) ul'));
    // sections
    nav.querySelector('.sections').append(navContent.querySelector('div:nth-of-type(3) ul'));

    // add event listeners

    // for the mobile search icon
    nav.querySelector('.search-toggle').addEventListener('click', (e) => {
      const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
      e.currentTarget.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      document.querySelector('nav .search').setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    // for the hamburger toggle icon
    nav.querySelector('.hamburger-toggle').addEventListener('click', (e) => {
      e.currentTarget.setAttribute('aria-expanded', 'true');
      document.querySelector('nav .semitrans').setAttribute('aria-expanded', 'true');
    });

    // for the hamburger close icon
    nav.querySelector('.hamburger-close').addEventListener('click', () => {
      document.querySelector('nav .hamburger-toggle').setAttribute('aria-expanded', 'false');
    });

    // force hamburger close when in destop size
    MQ.addEventListener('change', () => {
      document.querySelector('nav .hamburger-toggle').setAttribute('aria-expanded', 'false');
    });

    /* const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (MQ.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
    }
    */

    /* set volvo icon */
    decorateIcons(nav);
    /* append result */
    block.append(nav);
  }
}
