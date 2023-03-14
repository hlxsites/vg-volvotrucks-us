import ffetch from '../../scripts/lib-ffetch.js';
import {
  createOptimizedPicture,
  toClassName,
} from '../../scripts/lib-franklin.js';

function buildPressReleaseArticle(entry) {
  const {
    path,
    image,
    title,
    description,
    publishDate,
  } = entry;
  const card = document.createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '414' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date(publishDate * 1000);
  card.innerHTML = `<a href="${path}">
    ${pictureTag}
  </a>
  <div>
    <span class="date">${date.toLocaleDateString()}</span>
    <h3><a href="${path}">${title}</a></h3>
    <p>${description}</p>
  </div>`;
  return card;
}

function buildHeader(mainEl) {
  const defaultWrapperEl = mainEl.parentNode.previousElementSibling;
  if (defaultWrapperEl) {
    const headerEl = defaultWrapperEl.querySelector('h1, h2');
    const headline = document.createElement('h2');
    headline.innerText = headerEl.innerText;
    mainEl.prepend(headline);
    defaultWrapperEl.remove();
  }
}

function buildButtonContainer(mainEl) {
  const defaultWrapperEl = mainEl.parentNode.nextElementSibling;
  if (defaultWrapperEl) {
    const buttonEl = defaultWrapperEl.querySelector('p.button-container');
    if (buttonEl) {
      mainEl.appendChild(buttonEl);
      defaultWrapperEl.remove();
    }
  }
}

function createLatestPressReleases(mainEl, pressReleases) {
  mainEl.innerHTML = '';
  buildHeader(mainEl);
  const articleCards = document.createElement('div');
  articleCards.classList.add('press-releases-cards');
  mainEl.appendChild(articleCards);
  pressReleases.forEach((pressRelease) => {
    const pressReleaseCard = buildPressReleaseArticle(pressRelease);
    articleCards.appendChild(pressReleaseCard);
  });
  buildButtonContainer(mainEl);
}

function createPaginationLink(page, label) {
  const newUrl = new URL(window.location);
  const listElement = document.createElement('li');
  const link = document.createElement('a');
  newUrl.searchParams.set('page', page);
  link.href = newUrl.toString();
  link.innerText = label;
  listElement.append(link);
  return listElement;
}

function createPagination(entries, page, limit) {
  const listPagination = document.createElement('div');
  listPagination.className = 'pager';

  const totalResults = document.createElement('div');
  totalResults.className = 'total';
  totalResults.textContent = `${entries.length} results`;
  listPagination.appendChild(totalResults);
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  if (entries.length > limit) {
    const maxPages = Math.ceil(entries.length / limit);

    const listSize = document.createElement('span');
    listSize.classList.add('size');
    if (entries.length > limit) {
      listSize.innerHTML = `<strong>Page ${page}</strong> of ${maxPages}`;
    }
    const list = document.createElement('ol');
    list.className = 'scroll';
    if (page > 1) {
      list.append(createPaginationLink(page - 1, '<'));
    } else {
      const listElement = document.createElement('li');
      listElement.innerText = '<';
      list.append(listElement);
    }
    if (page < maxPages) {
      list.append(createPaginationLink(page + 1, '>'));
    } else {
      const listElement = document.createElement('li');
      listElement.innerText = '>';
      list.append(listElement);
    }

    pagination.append(listSize, list);
    listPagination.appendChild(pagination);
  }
  return listPagination;
}

function getSelectionFromUrl(field) {
  return (
    toClassName(new URLSearchParams(window.location.search).get(field)) || ''
  );
}

function createPressReleases(mainEl, pressReleases, limitPerPage) {
  let page = parseInt(getSelectionFromUrl('page'), 10);
  page = Number.isNaN(page) ? 1 : page;
  const start = (page - 1) * limitPerPage;
  const dataToDisplay = pressReleases.slice(start, start + limitPerPage);
  const pagination = createPagination(pressReleases, page, limitPerPage);
  mainEl.appendChild(pagination);
  const articleList = document.createElement('ul');
  articleList.className = 'article-list';
  dataToDisplay.forEach((pressRelease) => {
    const articleItem = document.createElement('li');
    const pressReleaseArticle = buildPressReleaseArticle(pressRelease);
    articleItem.appendChild(pressReleaseArticle);
    articleList.appendChild(articleItem);
  });
  mainEl.appendChild(articleList);
  mainEl.appendChild(pagination.cloneNode(true));
}

async function getPressReleases(limit) {
  const indexUrl = new URL('/press-releases.json', window.location.origin);
  let pressReleases;
  if (limit) {
    pressReleases = ffetch(indexUrl).slice(0, 3).all();
  } else {
    pressReleases = ffetch(indexUrl).all();
  }
  return pressReleases;
}

export default async function decorate(block) {
  const latest = block.classList.contains('latest');
  const limit = latest ? 3 : undefined;
  const limitPerPage = 10;
  const pressReleases = await getPressReleases(limit);
  if (latest) {
    createLatestPressReleases(block, pressReleases);
  } else {
    createPressReleases(block, pressReleases, limitPerPage);
  }
}
