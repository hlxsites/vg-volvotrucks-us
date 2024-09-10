import {
  getLanguagePath,
  getOrigin,
  getTextLabel,
  createElement,
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
import { fetchData, magazineSearchQuery } from '../../scripts/search-api.js';

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
  const card = createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '380', height: '214' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
  const categoryItem = createElement('li');
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
  const card = createElement('article');
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

//#region Filter Articles
function filterArticles(articles, activeFilters) {
  const { category, topic, truck, search } = activeFilters;
  console.log('filtered articles no JSON', { category, topic, truck, search, articles });
  if (category || topic || truck) {
    // do a query again with any of these filters
    const tags = [];
    if (category) {
      tags.push(category);
    }
    if (topic) {
      tags.push(topic);
    }
    if (truck) {
      tags.push(truck);
    }

    // eslint-disable-next-line no-use-before-define
    Promise.resolve(getMagazineArticles({ tags })).then((data) => {
      console.log('%cfiltered articles no JSON', 'color:lightgreen', { data });
      return data;
    });
  }
  return articles;
}
// #endregion

function filterArticlesJSON(articles, activeFilters) {
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

async function createFilter(articles, activeFilters, createDropdown, createInputSearch) {
  const searchText = getTextLabel('Search');
  const [tagList, search] = await Promise.all([
    getFilterOptions(),
    createInputSearch(searchText.toLowerCase(), activeFilters.search, searchText),
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
  console.log('%ccreateArticleList', 'color:deeppink', { block, articles, limit });
  createList(articles, filterArticles, createFilter, buildMagazineArticle, limit, block);
}

function createArticleListJSON(block, articles, limit) {
  articles.forEach((n) => {
    n.filterTag = splitTags(n.tags);
  });
  // eslint-disable-next-line max-len
  createList(articles, filterArticlesJSON, createFilter, buildMagazineArticle, limit, block);
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

const tempData = [];

async function getMagazineArticles({
  limit, offset = 0, tags = null, q = 'truck',
} = {}) {
  const hasLimit = limit !== undefined;
  const variables = {
    tenant: 'franklin-vg-volvotrucks-us',
    language: 'EN',
    q,
    facets: [
      {
        field: 'TAGS',
      },
    ],
    filters: [{ field: 'CATEGORY', value: 'magazine' }],
    limit: hasLimit ? limit : null,
    offset,
  };

  if (tags && tags.length) {
    tags.forEach((tag) => {
      variables.filters.push({ field: 'TAGS', value: tag });
    });
  }

  const rawData = await fetchData({
    query: magazineSearchQuery(),
    variables,
  });

  const querySuccess = rawData && rawData.data && rawData.data.volvosearch;

  if (!querySuccess) {
    return tempData;
  }

  const { items, count } = rawData.data.volvosearch;
  // #region Test Data
  if (items.length > 0) {
    items[0].metadata.readTime = '12 min'; 
    items[0].metadata.articleAuthor = 'Jonatan Lledo'; 
    items[0].metadata.articleImage = '/news-and-stories/volvo-trucks-magazine/preserving-a-deep-history/media_1ddd9858e76322a897b672e9cfafc0bb1537be3a6.jpeg?width=1200&format=pjpg&optimize=medium'; 
  }
  // #endregion
  tempData.push(...items.map((item) => ({
    ...item.metadata,
    filterTag: item.metadata.tags,
    author: item.metadata.articleAuthor || getTextLabel('Volvo Trucks NA'),
    // to avoid to show a broken image, shows the og:image from the page's metadata
    // As soon we have a default image for articles, we can update this condition to show it
    image: item.metadata.articleImage.endsWith('/')
      ? getMetadata('og:image') : getOrigin() + item.metadata.articleImage,
    path: item.uuid,
    readingTime: /\d+/.test(item.metadata.readTime) ? item.metadata.readTime : getTextLabel('11 min'),
    description: getTextLabel('Volvo Trucks NA'),
  })));

  if (!hasLimit && tempData.length < count) {
    return getMagazineArticles({ limit: count, offset: tempData.length });
  }
  const sortedByDate = [...tempData.sort((a, b) => b.publishDate - a.publishDate)];
  tempData.length = 0;
  console.log('%cgetMagazineArticles', 'color:cyan', { sortedByDate });
  return sortedByDate;
}

async function getMagazineArticlesJSON(limit) {
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
  // #region Latest test
  // if (!block.classList.contains('latest')) {
  //   console.log('Not latest');
  //   block.classList.add('latest');
  // }
  // #endregion
  const latest = block.classList.contains('latest');
  const limit = latest ? 3 : undefined;
  const limitPerPage = 8;
  const magazineArticles = await getMagazineArticles({ limit });
  const magazineArticlesJSON = await getMagazineArticlesJSON(limit);
  console.log('%cmagazineArticles', 'color:gold', { magazineArticles, magazineArticlesJSON });
  if (latest) {
    createLatestMagazineArticles(block, magazineArticlesJSON);
    // createLatestMagazineArticles(block, magazineArticles);
  } else {
    // createArticleListJSON(block, magazineArticlesJSON, limitPerPage);
    createArticleList(block, magazineArticles, limitPerPage);
  }
}
