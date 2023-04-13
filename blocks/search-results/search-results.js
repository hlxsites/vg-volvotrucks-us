export default function decorate(block) {
  const container = block.children[0];
  const endpoint = block.innerText;
  console.log(container, endpoint);

  const searchTemplate = `
    <h1> SEARCH RESULTS</h1>
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
  `;
  container.innerHTML = searchTemplate;
  container.classList.add('search-results-content');
}
