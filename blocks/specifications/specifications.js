function newId() {
  return (Math.random() + 1).toString(36).substring(7);
}

function expand(event) {
  const button = event.target;
  const rowgroup = event.target.closest('.row').nextElementSibling;
  if (button.ariaExpanded === 'true') {
    rowgroup.style.height = 0;
    button.ariaExpanded = false;
  } else {
    rowgroup.style.height = `${[...rowgroup.children]
      .map((child) => child.clientHeight)
      .reduce((l, r) => l + r, 0)}px`;
    button.ariaExpanded = true;
  }
}

export default async function decorate(block) {
  const colCount = block.firstElementChild.children.length;
  block.style.setProperty('--grid-col-count', colCount);
  const header = block.firstElementChild;
  const pictures = header.querySelectorAll('picture');
  let columnHeaderRow = 0;

  if (pictures.length) {
    columnHeaderRow = 1;
    const row = document.createElement('div');
    row.className = 'row image-header';
    pictures.forEach((picture) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.appendChild(picture);
      row.appendChild(cell);
    });
    header.insertAdjacentElement('beforebegin', row);
  }

  let currentRowGroupButton = null;
  let currentRowGroup = null;
  [...block.children].forEach((row, i) => {
    const cells = row.children;
    row.classList.add('row');

    if (cells.length === 1) {
      row.classList.add('rowgroup-header');
      row.innerHTML = `<button>${cells[0].innerHTML}</button>`;
      currentRowGroupButton = row.firstElementChild;
      currentRowGroupButton.addEventListener('click', expand);
      currentRowGroupButton.ariaExpanded = false;
      currentRowGroup = document.createElement('div');
      currentRowGroup.role = 'rowgroup';
      currentRowGroup.id = newId();
      currentRowGroupButton.setAttribute('aria-controls', currentRowGroup.id);
      row.insertAdjacentElement('afterend', currentRowGroup);
      return;
    }
    if (currentRowGroup) {
      currentRowGroup.appendChild(row);
    }
    if (i === columnHeaderRow) {
      row.classList.add('column-header');
    }

    [...cells].forEach((cell, j) => {
      // wrap text-only cells with a <p>
      if (!cell.children.length && cell.textContent !== '') {
        cell.innerHTML = `<p>${cell.textContent}</p>`;
      }
      if (j === 0) cell.role = 'rowheader';
      else if (i === columnHeaderRow) cell.role = 'columnheader';
      else cell.role = 'cell';
      cell.className = 'cell';
    });
  });
}
