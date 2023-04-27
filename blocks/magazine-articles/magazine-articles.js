import {
  ffetch,
  createList,
  splitTags,
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
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
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

async function getFilterOptions(sheet) {
  const indexUrl = new URL('/news-and-stories/tags.json', window.location.origin);
  const result = await ffetch(indexUrl).sheet(sheet).map((data) => data[sheet]).all();
  return result;
}

function filterArticles(articles, activeFilters) {
  let filteredArticles = articles;

  if (activeFilters.category) {
    filteredArticles = filteredArticles
      .filter((n) => toClassName(n.tags).includes(activeFilters.category));
  }
  if (activeFilters.topic) {
    filteredArticles = filteredArticles
      .filter((n) => toClassName(n.tags).includes(activeFilters.topic));
  }
  if (activeFilters.truck) {
    filteredArticles = filteredArticles
      .filter((n) => toClassName(n.tags).includes(activeFilters.truck));
  }

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
  const fullText = createFullText('search', activeFilters.search, 'Search');
  const [categoryOptions, topicOptions, truckOptions] = await Promise.all([
    getFilterOptions('category'),
    getFilterOptions('topic'),
    getFilterOptions('truckseries'),
  ]);
  const categoryFilter = createDropdown(categoryOptions, activeFilters.category, 'category', 'All Categories');
  const categorySelection = categoryFilter.querySelector('select');
  categorySelection.addEventListener('change', (e) => {
    e.target.form.submit();
  });
  const topicFilter = createDropdown(topicOptions, activeFilters.topic, 'topic', 'All Topics');
  const topicSelection = topicFilter.querySelector('select');
  topicSelection.addEventListener('change', (e) => {
    e.target.form.submit();
  });
  const truckFilter = createDropdown(truckOptions, activeFilters.truck, 'truck', 'All Truck Series');
  const truckSelection = truckFilter.querySelector('select');
  truckSelection.addEventListener('change', (e) => {
    e.target.form.submit();
  });
  return [
    fullText,
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
  const indexUrl = new URL('/magazine-articles.json', window.location.origin);
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
