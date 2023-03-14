function handleActiveClick(ul, event) {
  // on mobile we expand the navigation
  if (document.documentElement.clientWidth < 992) {
    if (ul.style.height) {
      ul.style.height = '';
      ul.classList.remove('expand');
    } else {
      const navHeight = [...ul.children].reduce((sum, el) => sum + el.clientHeight, 0);
      ul.style.height = `${navHeight}px`;
      ul.classList.add('expand');
    }
    event.preventDefault();
  }
}

async function createSubNav(block, ref) {
  const resp = await fetch(`${ref}.plain.html`);
  if (resp.ok) {
    const { pathname } = window.location;
    const text = await resp.text();
    const fragment = document.createRange().createContextualFragment(text);
    const ul = fragment.querySelector('ul');

    ul.querySelectorAll('picture').forEach((picture) => {
      const pictureContainer = picture.parentElement;
      const a = pictureContainer.querySelector('a');
      if (a) {
        const caption = document.createElement('span');
        caption.className = 'caption';
        caption.innerText = a.innerText;
        a.replaceChildren(picture, caption);
        pictureContainer.replaceChildren(a);
      }
    });

    // move the active link to the top
    const activeLink = [...ul.querySelectorAll('li > a')].find((a) => new URL(a.href).pathname === pathname);
    if (activeLink) activeLink.parentElement.classList.add('active');

    // create an overview link for mobile
    const lastSlash = (pathname.endsWith('/') ? pathname.substring(0, pathname.length - 1) : pathname).lastIndexOf('/');
    if (lastSlash > 0) {
      const parentLink = `${pathname.substring(0, lastSlash)}/`;
      ul.firstElementChild.insertAdjacentHTML('afterend', `<li class="overview"><a href="${parentLink}">Overview</a></li>`);
    }

    const nav = document.createElement('nav');
    nav.appendChild(ul);
    block.replaceChildren(nav);

    // attach click listner for mobile
    (activeLink || ul.querySelector('a')).addEventListener('click', handleActiveClick.bind(null, ul));
  }
}

export default async function decorate(block) {
  const { content } = document.head.querySelector('meta[name="sub-navigation"]');
  createSubNav(block, content);
}
