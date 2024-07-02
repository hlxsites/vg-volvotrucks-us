import {
  getLanguagePath,
  getOrigin,
} from '../../scripts/common.js';
import {
  ffetch,
} from '../../scripts/lib-ffetch.js';
import {
  createList,
  splitTags,
} from '../../scripts/magazine-press.js';
import {
  createOptimizedPicture,
  getMetadata,
  toClassName,
} from '../../scripts/aem.js';

const locale = getMetadata('locale');

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
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
  const categoryItem = document.createElement('li');
  card.innerHTML = `<a href="${path}" class="imgcover">
    ${pictureTag}
    </a>
    <div class="content">
    <ul><li>${date.toLocaleDateString(locale)}</li>
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

async function getFilterOptions() {
  const resp = await fetch(`${getLanguagePath()}news-and-stories/tags.plain.html`);
  const markup = await resp.text();
  const div = document.createElement('div');
  div.innerHTML = markup;
  const categoryList = Array.from(div.querySelectorAll('li:nth-child(2) ul:first-child li:first-child li'))
    .map((li) => li.textContent);
  const topicList = Array.from(div.querySelectorAll('li:nth-child(2) ul:first-child li:nth-child(2) li'))
    .map((li) => li.textContent);
  const truckSeriesList = Array.from(div.querySelectorAll('li:nth-child(2) ul:first-child li:last-child li'))
    .map((li) => li.textContent);

  return { categoryList, topicList, truckSeriesList };
}

function filterArticles(articles, activeFilters) {
  let filteredArticles = articles;

  filteredArticles = filteredArticles.filter((n) => {
    const classNames = toClassName(n.tags);
    return (!activeFilters.category || classNames.includes(activeFilters.category))
      && (!activeFilters.topic || classNames.includes(activeFilters.topic))
      && (!activeFilters.truck || classNames.includes(activeFilters.truck));
  });

  if (activeFilters.search) {
    const terms = activeFilters.search.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
    const stopWords = ['a', 'an', 'the', 'and', 'to', 'for', 'i', 'of', 'on', 'into'];
    filteredArticles = filteredArticles
      .filter((n) => {
        const text = n.content.toLowerCase();
        return terms.every((term) => !stopWords.includes(term) && text.includes(term));
      });
  }
  return filteredArticles;
}

async function createFilter(articles, activeFilters, createDropdown, createFullText) {
  const [tagList, search] = await Promise.all([
    getFilterOptions(),
    createFullText('search', activeFilters.search, 'Search'),
  ]);

  const categoryFilter = createDropdown(tagList.categoryList, activeFilters.category, 'category', 'All Categories');
  const categorySelection = categoryFilter.querySelector('select');
  categorySelection.addEventListener('change', (e) => e.target.form.submit());

  const topicFilter = createDropdown(tagList.topicList, activeFilters.topic, 'topic', 'All Topics');
  const topicSelection = topicFilter.querySelector('select');
  topicSelection.addEventListener('change', (e) => e.target.form.submit());

  const truckFilter = createDropdown(tagList.truckSeriesList, activeFilters.truck, 'truck', 'All Truck Series');
  const truckSelection = truckFilter.querySelector('select');
  truckSelection.addEventListener('change', (e) => e.target.form.submit());

  return [
    search,
    categoryFilter,
    topicFilter,
    truckFilter,
  ];
}

function createArticleList(block, articles, limit) {
  articles.forEach((n) => {
    n.filterTag = splitTags(n.tags);
  });
  // eslint-disable-next-line max-len
  createList(articles, filterArticles, createFilter, buildMagazineArticle, limit, block);
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

async function getMagazineArticles(limit) {
  const indexUrl = new URL(`${getLanguagePath()}magazine-articles.json`, getOrigin());
  let articles;
  if (limit) {
    articles = ffetch(indexUrl).limit(limit).all();
  } else {
    articles = ffetch(indexUrl).chunks(500).all();
  }
  return articles;
}

export default async function decorate(block) {
  const latest = block.classList.contains('latest');
  const limit = latest ? 3 : undefined;
  const limitPerPage = 8;
  const magazineArticles = await getMagazineArticles(limit);
  if (latest) {
    createLatestMagazineArticles(block, magazineArticles);
  } else {
    createArticleList(block, magazineArticles, limitPerPage);
  }
}
