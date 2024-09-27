import {
  createElement,
  debounce,
  decorateIcons,
} from '../../scripts/common.js';

/**
 * Creates a button element with specified text, classes, click handler, and disabled state.
 *
 * @param {string} text - The text content of the button.
 * @param {string|string[]} classes - The CSS class or classes to apply to the button.
 * @param {Function} onClick - The click event handler function for the button.
 * @param {boolean} [isDisabled=false] - Whether the button should be disabled.
 * @param {HTMLElement} [icon] - Optional icon to append to the button.
 * @returns {HTMLElement} The created button element.
 */
const createButton = (text, classes, onClick, isDisabled = false, icon = null) => {
  const classList = Array.isArray(classes) ? classes : [classes];
  const button = createElement('button', {
    classes: classList,
    props: { type: 'button' },
  });

  if (text) {
    const span = createElement('span', {});
    span.textContent = text;
    button.appendChild(span);
  }

  if (icon) {
    button.appendChild(icon);
  }

  if (isDisabled) button.disabled = true;

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
};

/**
 * Creates a pagination button for a specific page.
 *
 * @param {number} pageIndex - The index of the page (0-based).
 * @param {number} currentPage - The current active page index.
 * @param {Function} onClick - The function to call when the page button is clicked.
 * @returns {HTMLElement} - The created pagination button element.
 */
const createPageButton = (pageIndex, currentPage, onClick) => {
  const classes = pageIndex === currentPage ? ['pagination-button', 'active'] : 'pagination-button';
  return createButton(
    pageIndex + 1,
    classes,
    () => onClick(pageIndex),
  );
};

/**
 * Creates an arrow button for pagination navigation (previous or next).
 *
 * @param {'prev'|'next'} direction - The direction of the arrow (previous or next).
 * @param {boolean} isDisabled - Whether the arrow button should be disabled.
 * @param {Function} onClick - The function to call when the arrow button is clicked.
 * @returns {HTMLElement} - The created arrow button element.
 */
const createArrowButton = (direction, isDisabled, onClick) => {
  const chevronLeft = createElement('span', { classes: ['icon', 'icon-chevron-left'] });
  const chevronRight = createElement('span', { classes: ['icon', 'icon-chevron-right'] });

  const icon = direction === 'prev' ? chevronLeft : chevronRight;
  const classes = ['pagination-arrow', direction];

  return createButton(null, classes, onClick, isDisabled, icon);
};

/**
 * Creates an ellipsis element (...) for use in the pagination
 * when there is a gap between page numbers.
 *
 * @returns {HTMLElement} - The created ellipsis element.
 */
const createEllipsis = () => {
  const ellipsis = createElement('span', {
    classes: ['pagination-dots'],
  });
  ellipsis.textContent = '...';
  return ellipsis;
};

/**
 * Appends page buttons to the pagination container for the specified range of pages.
 *
 * @param {HTMLElement} paginationDiv - The container where pagination buttons will be appended.
 * @param {Array<string|number>} pages - Array of page numbers and ellipses to display.
 * @param {number} currentPage - The current active page index.
 * @param {Function} changePage - The function to call when a page button is clicked.
 */
const appendPages = (paginationDiv, pages, currentPage, changePage) => {
  const fragment = document.createDocumentFragment();

  pages.forEach((page) => {
    if (page === 'ellipsis') {
      fragment.appendChild(createEllipsis());
    } else {
      fragment.appendChild(createPageButton(page, currentPage, changePage));
    }
  });

  paginationDiv.appendChild(fragment);
};

/**
 * Determines which pages and ellipses should be displayed in the pagination,
 * depending on the current page.
 *
 * @param {number} currentPage - The current active page index.
 * @param {number} totalPages - The total number of pages.
 * @returns {Array<string|number>} - An array of page numbers and ellipses to be displayed.
 */
const getPageRange = (currentPage, totalPages) => {
  const pages = [];
  const addPageRange = (start, end) => {
    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }
  };

  pages.push(0);

  if (totalPages <= 7) {
    addPageRange(1, totalPages - 1);
  } else if (currentPage <= 3) {
    addPageRange(1, 4);
    pages.push('ellipsis', totalPages - 1);
  } else if (currentPage >= totalPages - 4) {
    pages.push('ellipsis');
    addPageRange(totalPages - 5, totalPages - 1);
  } else {
    pages.push('ellipsis');
    addPageRange(currentPage - 1, currentPage + 1);
    pages.push('ellipsis', totalPages - 1);
  }

  return pages;
};

/**
 * Creates and appends the pagination controls (arrows, page buttons, ellipses)
 * to the pagination div.
 *
 * @param {HTMLElement} paginationDiv - The container where pagination controls will be appended.
 * @param {number} currentPage - The currently active page index.
 * @param {number} totalPages - The total number of pages.
 * @param {Function} changePage - The function to call when changing the page.
 */
const createPaginationControls = (paginationDiv, currentPage, totalPages, changePage) => {
  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createArrowButton(
      'prev',
      currentPage === 0, // Disable if on the first page
      () => changePage(currentPage - 1),
    ),
  );

  const pages = getPageRange(currentPage, totalPages);
  appendPages(fragment, pages, currentPage, changePage);

  fragment.appendChild(
    createArrowButton(
      'next',
      currentPage === totalPages - 1, // Disable if on the last page
      () => changePage(currentPage + 1),
    ),
  );

  paginationDiv.appendChild(fragment);
  decorateIcons(paginationDiv);
};

/**
 * Creates and appends the pagination controls (arrows, page buttons, ellipses) to the block.
 *
 * @param {Array} chunkedItems - Array of paginated items (each entry is a page of items).
 * @param {HTMLElement} block - The container where items and pagination controls will be displayed.
 * @param {number} [currentPage=0] - The currently active page index (default is 0).
 * @param {Function} renderItems - The function to call to render items for the given page.
 */
const createPagination = (chunkedItems, block, renderItems, currentPage = 0) => {
  const totalPages = chunkedItems.length;

  let paginationDiv = block.querySelector('.pagination');
  if (!paginationDiv) {
    paginationDiv = createElement('div', { classes: ['pagination'] });
    block.appendChild(paginationDiv);
  } else {
    paginationDiv.innerHTML = '';
  }

  const changePage = debounce((newPage) => {
    if (newPage < 0 || newPage >= totalPages) return; // Prevent out-of-bounds page numbers
    block.innerHTML = '';
    renderItems(block, chunkedItems[newPage]);
    createPagination(chunkedItems, block, newPage, renderItems);
  }, 200); // Debounce to prevent rapid clicks

  createPaginationControls(paginationDiv, currentPage, totalPages, changePage);
};

export default createPagination;
