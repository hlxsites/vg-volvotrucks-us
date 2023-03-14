import {
  addVideoShowHandler, isVideoLink, selectVideoLink, wrapImageWithVideoLink,
} from '../../scripts/scripts.js';

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

      const links = contentContainer.querySelectorAll('a');
      const image = contentContainer.querySelector('picture');
      let selectedLink = links[0];

      if (links.length && isVideoLink(links[0])) {
        selectedLink = selectVideoLink(links);

        // remove other video links
        links.forEach((link) => link !== selectedLink && link.remove());
      }

      if (image && selectedLink) {
        // wrap the image with the link, remove the link from the content container
        selectedLink.innerText = '';
        selectedLink.appendChild(image);
        selectedLink.remove();
      }

      li.appendChild(selectedLink ?? image);

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

  // iterating through the list after the HTML manipulation
  const links = [...block.querySelectorAll('a')];

  links.filter((link) => isVideoLink(link)).forEach((link) => {
    addVideoShowHandler(link);
    wrapImageWithVideoLink(link, link.querySelector('picture'));
  });
}
