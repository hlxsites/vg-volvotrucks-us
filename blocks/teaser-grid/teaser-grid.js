export default function decorate(block) {
  const grid = document.createElement('ul');
  const columns = [...block.firstElementChild.children];
  const colCount = columns.length;
  // get the max of list items per column, remove empty ones
  const rowCount = columns.map((col) => [...col.querySelectorAll('li')].filter((li) => {
    if (li.innerHTML === '') li.remove();
    return !!li.parentElement;
  }).length).reduce((l, r) => Math.max(l, r), 0);

  grid.style.setProperty('--grid-row-count', rowCount);
  grid.style.setProperty('--grid-col-count', colCount);

  columns.forEach((column) => {
    const lis = column.querySelectorAll(':scope > ul > li');
    const liCount = lis.length;
    lis.forEach((li, i) => {
      const contentContainer = document.createElement('div');
      contentContainer.innerHTML = li.innerHTML;
      li.innerHTML = '';

      const link = contentContainer.querySelector('a');
      let image = contentContainer.querySelector('picture');

      if (image && link) {
        // wrap the image with the link, remove the link from the content container
        link.innerText = '';
        link.appendChild(image);
        link.remove();
        image = link;
      }

      li.appendChild(image);

      const textItems = contentContainer.innerHTML.split('<br>').filter((text) => text.trim() !== '');
      if (textItems.length) {
        let html = `<h3>${textItems[0]}</h3>`;
        if (textItems.length > 1) {
          html += `<p>${textItems.slice(1).join('</p><p>')}</p>`;
        }
        contentContainer.innerHTML = html;
        li.appendChild(contentContainer);
      }

      // first item spans multiple rows
      if (i === 0 && liCount < rowCount) li.style.setProperty('--grid-row-span', rowCount - liCount + 1);

      grid.appendChild(li);
    });
  });

  block.innerHTML = grid.outerHTML;
}
