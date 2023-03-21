import {
  ffetch,
} from '../../scripts/lib-ffetch.js';
import {
  createOptimizedPicture,
  toClassName,
} from '../../scripts/lib-franklin.js';

function buildMagazineArticle(entry) {
  const {
    path,
    image,
    title,
    description,
    author,
    category,
    readingTime,
    publishDate,
  } = entry;
  const card = document.createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '380', height: '214' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date(publishDate * 1000);
  const categoryItem = document.createElement('li');
  card.innerHTML = `<a href="${path}" class="imgcover">
    ${pictureTag}
    </a>
    <div class="content">
    <ul><li>${date.toLocaleDateString()}</li>
    ${(category ? categoryItem.textContent(category) : '')}</ul>
    <h3><a href="${path}">${title}</a></h3>
    <p>${description}</p>
    <ul>
    <li>${author}</li>
    <li>${readingTime}</li>
    </ul>
    </div>`;
  return card;
}

function buildLatestMagazineArticle(entry) {
  const {
    path,
    image,
    title,
    description,
    linkText,
  } = entry;
  const card = document.createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '590', height: '410' }]);
  const pictureTag = picture.outerHTML;
  const readMore = (linkText || 'Read more...');
  card.innerHTML = `<a href="${path}" class="imgcover">
    ${pictureTag}
    </a>
    <div class="content">
    <h3>${title}</h3>
    <p>${description}</p>
    <a href="${path}" class="cta">${readMore}</a>
    </div>`;
  return card;
}

function buildRelatedMagazineArticle(entry) {
  const {
    path,
    image,
    title,
    author,
    readingTime,
    publishDate,
  } = entry;
  const card = document.createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '380', height: '214' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date(publishDate * 1000);
  card.innerHTML = `<a href="${path}" class="imgcover">
    ${pictureTag}
    </a>
    <div class="content">
    <ul><li>${date.toLocaleDateString()}</li></ul>
    <h3><a href="${path}">${title}</a></h3>
    <ul>
    <li>${author}</li>
    <li>${readingTime}</li>
    </ul>
    </div>`;
  return card;
}

function getSelectionFromUrl(field) {
  return (
    toClassName(new URLSearchParams(window.location.search).get(field)) || ''
  );
}

function createPaginationLink(page, label) {
  const newUrl = new URL(window.location);
  const listElement = document.createElement('li');
  const link = document.createElement('a');
  newUrl.searchParams.set('page', page);
  link.href = newUrl.toString();
  link.className = label;
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
    if (page === 1) {
      list.append(createPaginationLink(page + 1, 'next'));
      list.append(createPaginationLink(maxPages, 'last'));
    } else if (page > 1 && page < maxPages) {
      list.append(createPaginationLink(1, 'first'));
      list.append(createPaginationLink(page - 1, 'prev'));
      list.append(createPaginationLink(page + 1, 'next'));
      list.append(createPaginationLink(maxPages, 'last'));
    } else if (page === maxPages) {
      list.append(createPaginationLink(1, 'first'));
      list.append(createPaginationLink(page - 1, 'prev'));
    }

    pagination.append(listSize, list);
    listPagination.appendChild(pagination);
  }
  return listPagination;
}

async function createMagazineArticles(mainEl, magazineArticles, limitPerPage) {
  let page = parseInt(getSelectionFromUrl('page'), 10);
  page = Number.isNaN(page) ? 1 : page;
  const start = (page - 1) * limitPerPage;
  const dataToDisplay = magazineArticles.slice(start, start + limitPerPage);
  const pagination = createPagination(magazineArticles, page, limitPerPage);
  mainEl.appendChild(pagination);
  const articleCards = document.createElement('div');
  articleCards.className = 'articles';
  dataToDisplay.forEach((article) => {
    const magazineArticle = buildMagazineArticle(article);
    articleCards.appendChild(magazineArticle);
  });
  mainEl.appendChild(articleCards);
  mainEl.appendChild(pagination.cloneNode(true));
}

async function createLatestMagazineArticles(mainEl, magazineArticles) {
  mainEl.innerHTML = '';
  const articleCards = document.createElement('div');
  articleCards.classList.add('latest-magazine-articles');
  mainEl.appendChild(articleCards);
  magazineArticles.forEach((entry) => {
    const articleCard = buildLatestMagazineArticle(entry);
    articleCards.appendChild(articleCard);
  });
}

async function createRelatedtMagazineArticles(mainEl, magazineArticles) {
  mainEl.innerHTML = '';
  const articleCards = document.createElement('div');
  articleCards.classList.add('related-magazine-articles');
  mainEl.appendChild(articleCards);
  magazineArticles.forEach((entry) => {
    const articleCard = buildRelatedMagazineArticle(entry);
    articleCards.appendChild(articleCard);
  });
}

async function getMagazineArticles(limit) {
  const indexUrl = new URL('/magazine-articles.json', window.location.origin);
  let articles;
  if (limit) {
    articles = ffetch(indexUrl).slice(0, 3).all();
  } else {
    articles = ffetch(indexUrl).all();
  }
  return articles;
}

export default async function decorate(block) {
  const latest = block.classList.contains('latest');
  const related = block.classList.contains('related');
  const limit = (latest || related) ? 3 : undefined;
  const limitPerPage = 8;
  const magazineArticles = await getMagazineArticles(limit);
  if (latest) {
    createLatestMagazineArticles(block, magazineArticles);
  } else if (related) {
    createRelatedtMagazineArticles(block, magazineArticles);
  } else {
    createMagazineArticles(block, magazineArticles, limitPerPage);
  }
}
