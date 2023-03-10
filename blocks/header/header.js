import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/desktop switch
const MQ = window.matchMedia('(min-width: 992px)');

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
  // temporary points to drafts until PR is approved, to not mess up layout
  const navPath = config.nav || '/drafts/mirko/nav';
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
        <div class='sections-list'>
        </div>
      </div>

      <div class='semitrans'>
      </div>

      <div class='hamburger-menu'>
        <div class='sections-list'>
        </div>
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

    // get through all section menus
    let sectionMenu = '';
    let hamburgerMenu = '';

    const sections = navContent.querySelectorAll('.menu');
    if (sections) {
      sections.forEach((section) => {
        // go through each entry in the menu table
        [...section.children].forEach((entry) => {
          switch (entry.children[0].textContent) {
            // name of the section
            case 'Name':
              // add to section menu
              sectionMenu += `<div class='section'><a href='#'>${entry.children[1].textContent}</a></div>`;
              // add to hamburger menu
              hamburgerMenu += `<div class='section'><a href='#'>${entry.children[1].textContent}</a></div>`;
              break;
            // TODO : read config props to build menus (overview, sub sections, subtitles, layout)
            default:
              break;
          }
        });
      });
      // write the section menu
      nav.querySelector('.sections .sections-list').innerHTML = sectionMenu;
      // write the hamburger menu
      nav.querySelector('.hamburger-menu .sections-list').innerHTML = hamburgerMenu;
    }

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

    /* set volvo icon */
    decorateIcons(nav);
    /* append result */
    block.append(nav);
  }
}
