import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/desktop switch
const MQ = window.matchMedia('(min-width: 992px)');
const ONCE = { once: true };

function toggleMenu(li, event) {
  const ul = li.querySelector(':scope > ul');
  if (!MQ.matches && ul) event.preventDefault();
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
    li.className = 'sub-section';
    const ul = section.querySelector(':scope ul');
    ul.className = 'entries';
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
      if (titleLink) title.addEventListener('click', toggleMenu.bind(titleLink, li));
    }

    li.querySelectorAll('a').forEach((link) => {
      if (link.matches(':first-of-type')) {
        const picture = link.parentElement.querySelector('picture');
        if (picture) {
          const clone = link.cloneNode(false);
          picture.replaceWith(clone);
          clone.append(picture);
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
  sectionMenu.append(content);
}

function toggleSectionMenu(sectionMenu, navCta, menuBlock, event) {
  if (!sectionMenu.querySelector(':scope > ul')) {
    buildSectionMenuContent(sectionMenu, navCta, menuBlock);
  }
  toggleMenu(sectionMenu, event);
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
        <ul class='sections-list'>
        </ul>
      </div>

      <div class='semitrans'>
      </div>
    `;

    // fill in the content from nav doc
    // logo
    nav.querySelector('.logo').append(navContent.children[0].querySelector('p:first-of-type > span'));
    // vg_section
    nav.querySelector('.vgsection').append(navContent.children[0].querySelector('div:first-of-type > p:nth-of-type(2)').textContent);
    // location
    nav.querySelector('.location').append(navContent.children[0].querySelector('div:first-of-type > p:nth-of-type(3)').textContent);
    // tools
    nav.querySelector('.tools').prepend(navContent.children[1].querySelector('ul'));

    const navCta = navContent.children[3];

    // get through all section menus
    const sectionMenus = [...navContent.children[2].querySelectorAll('.menu')].map((menuBlock) => {
      const sectionMenu = document.createElement('li');
      sectionMenu.className = 'section';
      const sectionTitle = menuBlock.firstElementChild.textContent;
      const a = document.createElement('a');
      a.textContent = sectionTitle;
      a.addEventListener('click', toggleSectionMenu.bind(a, sectionMenu, navCta, menuBlock));
      sectionMenu.appendChild(a);
      return sectionMenu;
    });
    // write the section menu
    if (sectionMenus.length) {
      nav.querySelector('.sections .sections-list').append(...sectionMenus);
    }

    // add event listeners
    // for the mobile search icon
    nav.querySelector('.search-toggle').addEventListener('click', (e) => {
      const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
      e.currentTarget.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      document.querySelector('header nav .search').setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    // for the hamburger toggle icon
    nav.querySelector('.hamburger-toggle').addEventListener('click', (e) => {
      e.currentTarget.setAttribute('aria-expanded', 'true');
      document.querySelector('header nav .semitrans').setAttribute('aria-expanded', 'true');
      if (!MQ.matches) {
        document.body.classList.add('disable-scroll');
      }
    });

    // for the hamburger close icon
    nav.querySelector('.hamburger-close').addEventListener('click', () => {
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
  }
}
