import { getTextLable } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = block.children[0];
  const endpoint = block.innerText;
  console.log(container, endpoint);
  const searchText = '';

  const noResults = () => {
    const noResultsText = getTextLable('No search results').replace('{{$0}}', searchText);
    const noResultsPrompt = getTextLable('No search results promp');
    const noResultsEl = document.createElement('div');

    noResultsEl.classList.add('search-no-results');
    noResultsEl.innerHTML = `
      <p class="search-no-results-message">${noResultsText}</p>
      <br />
      <p class="search-no-results-promp">${noResultsPrompt}</p>
    `;

    return noResultsEl;
  };

  const filters = () => {
    const filterByText = getTextLable('Filter By');
    const filtersElement = document.createElement('div');

    filtersElement.classList.add('search-filters-section');
    filtersElement.innerHTML = `
      <div class="search-filter-by"><button>${filterByText}</button></div>
      <div class="search-filters-container">
        <div class="search-filters-header">
          <span>${filterByText}</span>
          <i class="fa fa-close"></i>
        </div>
        <div class="search-filters">
          <div class="search-filter-group">
            <a href="#" class="search-filter-group-header">
              TAGS
              <i class="fa fa-angle-up"></i>
            </a>
            <ul class="search-filter-group-items">
              <li class="search-filter-group-item">
                <input type="checkbox">
                <label>VNR (6)</label>
              </li>
              <li class="search-filter-group-item">
                <input type="checkbox">
                <label>VNR ELECTRIC (1)</label>
              </li>
            </ul>
          </div>
          <div class="search-filter-group">
            <a href="#" class="search-filter-group-header">
              TYPES
              <i class="fa fa-angle-up"></i>
            </a>
            <ul class="search-filter-group-items">
              <li class="search-filter-group-item">
                <input type="checkbox">
                <label>VTNA Press Release (67)</label>
              </li>
              <li class="search-filter-group-item">
                <input type="checkbox">
                <label>MOVIES (15)</label>
              </li>
              <li class="search-filter-group-item">
                <input type="checkbox">
                <label>Hub Detail Page (11)</label>
              </li>
            </ul>
            <button class="search-filter-more">MORE</button>
          </div>
        </div>
        <button class="search-filter-done">Done</button>
      </div>
    `;
    return filtersElement;
  };

  const searchTemplate = `
    <h1 class="search-header"> SEARCH RESULTS</h1>
    <div class="search-input-wrapper">
      <input type="text" class="search-term" placeholder="SEARCH FOR...">
      <button type="submit" class="search-button">
        <i class="fa fa-search"></i>
      </button>
    </div>
    <div class="search-summary-options-wrapper">
      <div class="search-summary">
        Showing 1 - 12 of 16 results for "electromobility"
      </div>
      <div class="search-sort">
        <label for="sort by" class="search-select-label"> Sort By </label>
        <select class="search-select">
          <option>Relevance</option>
          <option value="new">Newest content</option>
          <option value="old"> Oldest content</option>
        </select>
      </div>
    </div>
    ${filters().outerHTML}
    ${noResults().outerHTML}
  `;
  container.innerHTML = searchTemplate;
  container.classList.add('search-results-content');
}
