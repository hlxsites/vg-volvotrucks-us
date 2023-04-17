import {
  ffetch,
  createList,
  splitTags,
} from '../../scripts/lib-ffetch.js';
import {
  toClassName,
  createOptimizedPicture,
} from '../../scripts/lib-franklin.js';

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

async function getPressReleases(limit, filter) {
  const indexUrl = new URL('/press-releases.json', window.location.origin);
  let pressReleases = ffetch(indexUrl).chunks(500);
  if (filter) pressReleases = pressReleases.filter(filter);
  if (limit) pressReleases = pressReleases.limit(limit);
  return pressReleases.all();
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
    <span class="date">${date.toLocaleDateString('en-US')}</span>
    <h3><a href="${path}">${title}</a></h3>
    <p>${description}</p>
  </div>`;
  return card;
}

function createPressReleaseList(block, pressReleases, {
  filter = filterPressReleases,
  filterFactory = createFilter,
  articleFactory = buildPressReleaseArticle,
  limit,
}) {
  // eslint-disable-next-line no-param-reassign
  pressReleases = pressReleases.map((pr) => ({ ...pr, filterTag: splitTags(pr.tags) }));
  createList(pressReleases, filter, filterFactory, articleFactory, limit, block);
}

function createFeaturedPressReleaseList(block, pressReleases) {
  createPressReleaseList(block, pressReleases, { filter: null, filterFactory: null });
}

function createLatestPressReleases(block, pressReleases) {
  createPressReleaseList(block, pressReleases, { filterFactory: null });
}

export default async function decorate(block) {
  const isFeatured = block.classList.contains('featured');
  const isLatest = !isFeatured && block.classList.contains('latest');

  if (isFeatured) {
    const links = [...block.firstElementChild.querySelectorAll('a')]
      .map(({ href }) => (href ? new URL(href).pathname : null))
      .filter((pathname) => !!pathname);
    const pressReleases = await getPressReleases(
      links.length,
      ({ path }) => links.indexOf(path) >= 0,
    );
    createFeaturedPressReleaseList(block, pressReleases);
  } else if (isLatest) {
    const pressReleases = await getPressReleases(3);
    createLatestPressReleases(block, pressReleases);
  } else {
    const pressReleases = await getPressReleases();
    createPressReleaseList(block, pressReleases, { limit: 10 });
  }
}
