import { readBlockConfig, decorateIcons, loadScript } from '../../scripts/lib-franklin.js';
import { decorateLinks } from '../../scripts/scripts.js';

// media query match that indicates mobile/desktop switch
const MQ = window.matchMedia('(min-width: 992px)');
const ONCE = { once: true };

function toggleMenu(li, preventDefault, event) {
  const ul = li.querySelector(':scope > ul');
  if (preventDefault || (!MQ.matches && ul)) event.preventDefault();
  if (li.classList.contains('expand')) {
    // collapse
    if (!MQ.matches && ul) {
      requestAnimationFrame(() => {
        ul.style.height = `${ul.scrollHeight}px`;
        ul.addEventListener('transitionend', () => {
          ul.style.height = '0px';
          ul.addEventListener('transitionend', () => {
            ul.style.height = null;
            li.classList.remove('expand');
          }, ONCE);
        }, ONCE);
      });
    } else {
      li.classList.remove('expand');
    }
  } else {
    if (!MQ.matches && ul) {
      ul.style.height = `${ul.scrollHeight}px`;
      ul.addEventListener('transitionend', () => {
        ul.style.height = '100%';
      }, ONCE);
    } else {
      li.parentElement.querySelectorAll('.expand').forEach((expanded) => {
        expanded.classList.remove('expand');
      });
    }
    li.classList.add('expand');
  }
}

function buildSectionMenuContent(sectionMenu, navCta, menuBlock) {
  // per default the section menus are link-list
  // if there is at least one picture they will become image-list
  sectionMenu.classList.add('link-list');
  const content = document.createElement('ul');
  const [firstRow, ...flyoutSections] = menuBlock.children;
  const overviewLink = firstRow.querySelector('a');
  overviewLink.className = 'primary-link';
  overviewLink.textContent = 'Overview';
  const overviewLi = document.createElement('li');
  overviewLi.className = 'overview';
  overviewLi.append(overviewLink);

  const subSectionMenus = flyoutSections.map((section) => {
    const li = document.createElement('li');
    const ul = section.querySelector(':scope ul');
    li.append(ul);

    if (ul.querySelector('picture')) {
      sectionMenu.classList.remove('link-list');
      sectionMenu.classList.add('image-list');
    }

    const [title, subtitle] = section.querySelectorAll('p');
    if (subtitle) {
      subtitle.className = 'subtitle';
      li.prepend(subtitle);
    }
    if (title) {
      title.className = 'title';
      li.prepend(title);
      const titleLink = title.querySelector('a');
      if (titleLink) title.addEventListener('click', toggleMenu.bind(titleLink, li, false));
    }

    // find all links, first-of-type becomes .primary-link and wraps the picture if there is one
    li.querySelectorAll('a').forEach((link) => {
      if (link.matches(':first-of-type')) {
        const picture = link.parentElement.querySelector('picture');
        if (picture) {
          const clone = link.cloneNode(false);
          picture.replaceWith(clone);
          clone.append(picture);
          clone.tabIndex = -1;
        }
        link.className = 'primary-link button secondary cta';
      } else {
        link.className = 'button secondary cta';
      }
    });

    // normalize the li content: wrap orphan texts in <p>, remove <br>
    ul.querySelectorAll('li').forEach((child) => [...child.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        const textContent = node.textContent.trim();
        if (textContent) {
          const p = document.createElement('p');
          p.textContent = textContent;
          node.replaceWith(p);
        } else {
          node.remove();
        }
      }
      if (node.nodeName === 'BR') node.remove();
    }));

    return li;
  });

  if (navCta) {
    const li = document.createElement('li');
    li.className = 'navigation-cta';
    li.innerHTML = navCta.innerHTML;
    subSectionMenus.push(li);
  }

  content.append(overviewLi, ...subSectionMenus);
  decorateLinks(content);
  sectionMenu.append(content);
}

function toggleSectionMenu(sectionMenu, navCta, menuBlock, event) {
  if (!sectionMenu.querySelector(':scope > ul')) {
    buildSectionMenuContent(sectionMenu, navCta, menuBlock);
  }
  toggleMenu(sectionMenu, true, event);
}

async function loadSearchWidget() {
  loadScript('https://static.searchstax.com/studio-js/v3/js/search-widget.min.js', { type: 'text/javascript', charset: 'UTF-8' })
    .then(() => {
      function initiateSearchWidget() {
        // eslint-disable-next-line no-new, no-undef
        new SearchstudioWidget(
          'c2ltYWNrdm9sdm86V2VsY29tZUAxMjM=',
          'https://ss705916-dy2uj8v7-us-east-1-aws.searchstax.com/solr/productionvolvotrucks-1157-suggester/emsuggest',
          `${window.location.origin}/search-results`,
          3,
          'searchStudioQuery',
          'div-widget-id',
          'en',
        );
      }
      window.initiateSearchWidget = initiateSearchWidget;
    });
}
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
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  const navPath = config.nav || `${langCodeMatch ? langCodeMatch[1] : '/'}nav`;
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    // get the navigation text, turn it into html elements
    const navContent = document.createRange().createContextualFragment(await resp.text());

    // start the nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    // add all the divs that will be part of the nav
    nav.innerHTML = `
      <div class="brand">
        <a class="logo" title="Homepage" href="/">
        </a>
        <div class='vgsection-location'>
          <div class='vgsection'>
          </div>
          <div class='location'>
          </div>
        </div>
      </div>

      <a href="#" class="search-toggle" role="button" title="toggle search" aria-expanded="false" aria-controls="main-nav-search">
        <img class="search-icon" alt="" src="/icons/search-icon.png">
      </a>

      <a href="#" class="hamburger-toggle semitrans-trigger" role="button" title="open menu" aria-expanded="false" aria-controls="main-nav-sections,main-menu-tools">
        <img class="hamburger-icon" alt="" src="/icons/Hamburger-mobile.png">
      </a>

      <div id="main-menu-tools" class="tools">
        <a href="#" class="hamburger-close" role="button" title="close menu" aria-expanded="false" aria-controls="main-nav-sections,main-menu-tools">
          <img alt="close-icon" src="/icons/Close-Icons.png">
        </a>
      </div>

      <div id="man-nav-search" class="search">
        <div class="search-container">
          <div id="div-widget-id" class="studio-search-widget">
            <button class="search-button" aria-label="submit">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div id="main-nav-sections" class="sections">
        <ul class="sections-list">
        </ul>
      </div>

      <div class="semitrans">
      </div>
    `;

    // fill in the content from nav doc
    // logo
    const logo = nav.querySelector('.logo');
    logo.append(navContent.children[0].querySelector('p:first-of-type > span'));
    const authoredLogoLink = navContent.children[0].querySelector('p:first-of-type > a');
    if (authoredLogoLink) {
      logo.title = authoredLogoLink.innerText;
      logo.href = authoredLogoLink.href;
    }

    // vg_section
    nav.querySelector('.vgsection').append(navContent.children[0].querySelector('p:nth-of-type(2)').textContent);
    // location
    nav.querySelector('.location').append(navContent.children[0].querySelector('p:nth-of-type(3)').textContent);
    // tools
    nav.querySelector('.tools').prepend(navContent.children[1].querySelector('ul'));

    const navCta = navContent.children[3];
    const sectionList = nav.querySelector('.sections .sections-list');

    // get through all section menus
    const sectionMenus = [...navContent.children[2].querySelectorAll('.menu')].map((menuBlock) => {
      const sectionMenu = document.createElement('li');
      sectionMenu.className = 'section';
      const sectionTitle = menuBlock.firstElementChild.textContent;
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = sectionTitle;
      a.addEventListener('click', toggleSectionMenu.bind(a, sectionMenu, navCta, menuBlock));
      sectionMenu.appendChild(a);
      return sectionMenu;
    });
    // write the section menu
    if (sectionMenus.length) {
      sectionList.append(...sectionMenus);
    }

    // add event listeners
    // for desktop when clicking anywhere on the document
    document.addEventListener('click', (event) => {
      if (!sectionList.contains(event.target)) {
        const openItem = sectionList.querySelector('.section.expand');
        if (openItem) {
          toggleMenu(openItem, false, event);
        }
      }
    });

    // for the mobile search icon
    nav.querySelector('.search-toggle').addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
      e.currentTarget.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    // for the hamburger toggle icon
    nav.querySelector('.hamburger-toggle').addEventListener('click', (e) => {
      e.preventDefault();
      e.currentTarget.setAttribute('aria-expanded', 'true');
      document.querySelector('header nav .semitrans').setAttribute('aria-expanded', 'true');
      if (!MQ.matches) {
        document.body.classList.add('disable-scroll');
      }
    });

    // for the hamburger close icon
    nav.querySelector('.hamburger-close').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('header nav .hamburger-toggle').setAttribute('aria-expanded', 'false');
      document.body.classList.remove('disable-scroll');
    });

    // force hamburger close when in destop size
    MQ.addEventListener('change', () => {
      document.querySelector('header nav .hamburger-toggle').setAttribute('aria-expanded', 'false');
      document.querySelectorAll('header nav .sections .expand').forEach((el) => el.classList.remove('expand'));
      // remove hard styled heights (from animations)
      document.querySelectorAll('header nav .sections ul').forEach((ul) => {
        ul.style.height = null;
      });
      document.body.classList.remove('disable-scroll');
    });

    /* set volvo icon */
    decorateIcons(nav);
    /* append result */
    block.append(nav);
    loadSearchWidget();
  }
}
