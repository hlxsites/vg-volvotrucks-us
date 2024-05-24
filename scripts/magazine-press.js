/* eslint-disable no-shadow,max-len */
import {
  readBlockConfig,
  toClassName,
} from './aem.js';

/*
* Common functions for searching the press releases and magazines
*/
function getSelectionFromUrl(field) {
  return (
    toClassName(new URLSearchParams(window.location.search).get(field)) || ''
  );
}

function createFullText(name, searchTerm, placeholder) {
  const container = document.createElement('div');
  container.className = toClassName(`${name}-field`);
  const input = document.createElement('input');
  input.type = 'text';
  input.name = name;
  if (!searchTerm) {
    input.placeholder = placeholder;
  } else {
    input.value = searchTerm;
  }
  const btn = document.createElement('button');
  btn.innerHTML = `
    <i class="fa fa-search"></i>
  `;
  container.append(input, btn);
  return container;
}

function createDropdown(options, selected, name, placeholder, label) {
  const container = document.createElement('div');
  container.className = toClassName(`${name}-field`);
  if (label) {
    const labelEl = document.createElement('label');
    labelEl.innerText = label;
    labelEl.setAttribute('for', name);
    container.append(labelEl);
  }
  const input = document.createElement('select');
  input.name = name;
  input.id = name;
  if (placeholder) {
    const optionTag = document.createElement('option');
    optionTag.innerText = placeholder;
    optionTag.value = '';
    if (!selected) {
      optionTag.selected = true;
    }
    input.append(optionTag);
  }

  options.forEach((option) => {
    const optionTag = document.createElement('option');
    optionTag.innerText = option;
    optionTag.value = toClassName(option);
    if (optionTag.value === selected) {
      optionTag.selected = true;
    }
    input.append(optionTag);
  });
  container.append(input);
  return container;
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

export function splitTags(tags) {
  if (tags) {
    return JSON.parse(tags);
  }
  return [];
}

function getActiveFilters() {
  const result = {};
  [...new URLSearchParams(window.location.search).entries()]
    // eslint-disable-next-line no-unused-vars
    .filter(([_, value]) => value !== '')
    .forEach(([key, value]) => {
      result[key] = value;
    });
  return result;
}

async function renderFilters(data, createFilters) {
  // render filters
  const filter = document.createElement('div');
  filter.className = 'list-filter';
  const form = document.createElement('form');
  form.method = 'get';
  form.name = 'list-filter';
  const formFieldSet = document.createElement('fieldset');

  const filters = await createFilters(data, getActiveFilters(), createDropdown, createFullText);
  formFieldSet.append(
    ...filters,
  );
  if (filters.length > 0) {
    form.append(formFieldSet);
    filter.append(form);
    return filter;
  }
  return null;
}

async function buildElements(pressReleases, filter, createFilters, buildPressReleaseArticle, limitPerPage, cfg) {
  const elements = {};
  let actFilter = getActiveFilters();
  let relatedPressReleases = false;
  if (cfg.tags) {
    actFilter = {
      ...actFilter,
      ...{ tags: toClassName(cfg.tags) },
    };
    relatedPressReleases = true;
  }
  let filteredData = filter ? filter(pressReleases, actFilter) : pressReleases;

  let page = parseInt(getSelectionFromUrl('page'), 10);
  page = Number.isNaN(page) ? 1 : page;

  if (!relatedPressReleases && createFilters) {
    const filterElements = await renderFilters(pressReleases, createFilters);
    if (filterElements) {
      elements.filter = filterElements;
    }
    if (limitPerPage > 0) {
      elements.pagination = createPagination(filteredData, page, limitPerPage);
    }
  }
  if (limitPerPage > 0) {
    const start = (page - 1) * limitPerPage;
    filteredData = filteredData.slice(start, start + limitPerPage);
  }
  const articleList = document.createElement('ul');
  articleList.className = 'article-list';
  filteredData.forEach((pressRelease) => {
    const articleItem = document.createElement('li');
    const pressReleaseArticle = buildPressReleaseArticle(pressRelease);
    articleItem.appendChild(pressReleaseArticle);
    articleList.appendChild(articleItem);
  });
  elements.list = articleList;
  return elements;
}

export async function createList(pressReleases, filter, createFilters, buildPressReleaseArticle, limitPerPage, mainEl) {
  /* eslint-disable no-use-before-define */
  const cfg = readBlockConfig(mainEl);

  async function reloadList(params) {
    // push the new querystring state
    const url = new URL(window.location);
    [...params.entries()].forEach(([k, v]) => url.searchParams.set(k, v));
    window.history.pushState({}, '', url);
    // rebuild the list
    const elements = await buildElements(pressReleases, filter, createFilters, buildPressReleaseArticle, limitPerPage, cfg);
    renderList(mainEl, elements);
  }

  function reloadFilteredList(event) {
    if (event) event.preventDefault();
    reloadList(new URLSearchParams(new FormData(this)));
  }

  function reloadPaginatedList(event) {
    event.preventDefault();
    reloadList(new URL(event.target.href).searchParams);
  }

  function attachSubmitListners(filter) {
    const form = filter.querySelector('form');
    if (form) {
      form.submit = reloadFilteredList.bind(form);
      form.addEventListener('submit', reloadFilteredList.bind(form));
    }
    return filter;
  }

  function attachClickListners(pagination) {
    pagination.querySelectorAll('a').forEach((a) => a.addEventListener('click', reloadPaginatedList));
    return pagination;
  }

  function renderList(el, { filter, pagination, list }) {
    const children = [];
    if (filter) children.push(attachSubmitListners(filter));
    if (pagination) children.push(attachClickListners(pagination));
    children.push(list);
    if (pagination) children.push(attachClickListners(pagination.cloneNode(true)));
    el.replaceChildren(...children);
  }

  const elements = await buildElements(pressReleases, filter, createFilters, buildPressReleaseArticle, limitPerPage, cfg);
  renderList(mainEl, elements);
}
