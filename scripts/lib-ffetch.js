/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-shadow,no-await-in-loop,no-restricted-syntax,max-len */

import {
  readBlockConfig,
  toClassName,
} from './lib-franklin.js';

async function* request(url, context) {
  const { chunks, sheet, fetch } = context;
  for (let offset = 0, total = Infinity; offset < total; offset += chunks) {
    const params = new URLSearchParams(`offset=${offset}&limit=${chunks}`);
    if (sheet) params.append('sheet', sheet);
    const resp = await fetch(`${url}?${params.toString()}`);
    if (resp.ok) {
      const json = await resp.json();
      total = json.total;
      for (const entry of json.data) yield entry;
    } else {
      return;
    }
  }
}

// Operations:

function withFetch(upstream, context, fetch) {
  context.fetch = fetch;
  return upstream;
}

function withHtmlParser(upstream, context, parseHtml) {
  context.parseHtml = parseHtml;
  return upstream;
}

function chunks(upstream, context, chunks) {
  context.chunks = chunks;
  return upstream;
}

function sheet(upstream, context, sheet) {
  context.sheet = sheet;
  return upstream;
}

async function* skip(upstream, context, skip) {
  let skipped = 0;
  for await (const entry of upstream) {
    if (skipped < skip) {
      skipped += 1;
    } else {
      yield entry;
    }
  }
}

async function* limit(upstream, context, limit) {
  let yielded = 0;
  for await (const entry of upstream) {
    yield entry;
    yielded += 1;
    if (yielded === limit) {
      return;
    }
  }
}

async function* map(upstream, context, fn, maxInFlight = 5) {
  const promises = [];
  for await (let entry of upstream) {
    promises.push(fn(entry));
    if (promises.length === maxInFlight) {
      for (entry of promises) {
        entry = await entry;
        if (entry) yield entry;
      }
      promises.splice(0, promises.length);
    }
  }
  for (let entry of promises) {
    entry = await entry;
    if (entry) yield entry;
  }
}

async function* filter(upstream, context, fn) {
  for await (const entry of upstream) {
    if (fn(entry)) {
      yield entry;
    }
  }
}

function slice(upstream, context, from, to) {
  return limit(skip(upstream, context, from), context, to - from);
}

function follow(upstream, context, name, maxInFlight = 5) {
  const { fetch, parseHtml } = context;
  return map(upstream, context, async (entry) => {
    const value = entry[name];
    if (value) {
      const resp = await fetch(value);
      return { ...entry, [name]: resp.ok ? parseHtml(await resp.text()) : null };
    }
    return entry;
  }, maxInFlight);
}

async function all(upstream) {
  const result = [];
  for await (const entry of upstream) {
    result.push(entry);
  }
  return result;
}

async function first(upstream) {
  /* eslint-disable-next-line no-unreachable-loop */
  for await (const entry of upstream) {
    return entry;
  }
  return null;
}

// Helper

function assignOperations(generator, context) {
  // operations that return a new generator
  function createOperation(fn) {
    return (...rest) => assignOperations(fn.apply(null, [generator, context, ...rest]), context);
  }
  const operations = {
    skip: createOperation(skip),
    limit: createOperation(limit),
    slice: createOperation(slice),
    map: createOperation(map),
    filter: createOperation(filter),
    follow: createOperation(follow),
  };

  // functions that either return the upstream generator or no generator at all
  const functions = {
    chunks: chunks.bind(null, generator, context),
    all: all.bind(null, generator, context),
    first: first.bind(null, generator, context),
    withFetch: withFetch.bind(null, generator, context),
    withHtmlParser: withHtmlParser.bind(null, generator, context),
    sheet: sheet.bind(null, generator, context),
  };

  return Object.assign(generator, operations, functions);
}

export function ffetch(url) {
  let chunks = 255;
  const fetch = (...rest) => window.fetch.apply(null, rest);
  const parseHtml = (html) => new window.DOMParser().parseFromString(html, 'text/html');

  try {
    if ('connection' in window.navigator && window.navigator.connection.saveData === true) {
      // request smaller chunks in save data mode
      chunks = 64;
    }
  } catch (e) { /* ignore */ }

  const context = { chunks, fetch, parseHtml };
  const generator = request(url, context);

  return assignOperations(generator, context);
}

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
