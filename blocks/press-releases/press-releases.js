import {
  ffetch,
  createList,
  splitTags,
} from '../../scripts/lib-ffetch.js';
import {
  toClassName,
  createOptimizedPicture,
} from '../../scripts/lib-franklin.js';

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

function filterPressReleases(pressReleases, activeFilters) {
  let filteredPressReleases = pressReleases;

  if (activeFilters.tags) {
    filteredPressReleases = filteredPressReleases
      .filter((n) => toClassName(n.tags).includes(activeFilters.tags));
  }

  if (activeFilters.search) {
    const terms = activeFilters.search.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
    const stopWords = ['a', 'an', 'the', 'and', 'to', 'for', 'i', 'of', 'on', 'into'];
    filteredPressReleases = filteredPressReleases
      .filter((n) => {
        const text = n.content.toLowerCase();
        return terms.every((term) => !stopWords.includes(term) && text.includes(term));
      });
  }
  return filteredPressReleases;
}

function createFilter(pressReleases, activeFilters, createDropdown, createFullText) {
  const tags = Array.from(new Set(pressReleases.flatMap((n) => n.filterTag).sort()));
  const fullText = createFullText('search', activeFilters.search, 'type here to search');
  const tagFilter = createDropdown(tags, activeFilters.tags, 'tags', 'All', 'filter by tags');
  const tagSelection = tagFilter.querySelector('select');
  tagSelection.addEventListener('change', (e) => {
    e.target.form.submit();
  });
  return [
    fullText,
    tagFilter,
  ];
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

function createPressReleaseList(pressReleases, limit, block) {
  pressReleases.forEach((n) => {
    n.filterTag = splitTags(n.tags);
  });
  // eslint-disable-next-line max-len
  createList(pressReleases, filterPressReleases, createFilter, buildPressReleaseArticle, limit, block);
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

export default async function decorate(block) {
  const latest = block.classList.contains('latest');
  const limit = latest ? 3 : undefined;
  const limitPerPage = 10;
  const pressReleases = await getPressReleases(limit);
  if (latest) {
    createLatestPressReleases(block, pressReleases);
  } else {
    createPressReleaseList(pressReleases, limitPerPage, block);
  }
}
