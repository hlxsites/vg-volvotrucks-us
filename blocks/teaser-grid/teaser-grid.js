import { addVideoShowHandler, isVideoLink, wrapImageWithVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isTopTenVersion = block.classList.contains('top-ten');
  const grid = document.createElement('ul');
  const columns = [...block.firstElementChild.children];
  const colCount = columns.length;
  // get the max of list items per column, remove empty ones
  const rowCount = columns.map((col) => [...col.querySelectorAll('li')].filter((li) => {
    if (li.innerHTML === '') li.remove();
    return !!li.parentElement;
  }).length).reduce((l, r) => Math.max(l, r), 0);

  columns.forEach((column) => {
    const lis = column.querySelectorAll(':scope > ul > li');
    const liCount = lis.length;
    lis.forEach((li, i) => {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('teaser-grid-text-wrapper');
      contentContainer.innerHTML = li.innerHTML;
      li.innerHTML = '';

      const link = contentContainer.querySelector('a');
      const image = contentContainer.querySelector('picture');

      if (image && link) {
        // wrap the image with the link, remove the link from the content container
        link.innerText = '';
        link.appendChild(image);
        link.remove();
      }

      li.appendChild(link ?? image);

      const textItems = contentContainer.innerHTML.split('<br>').filter((text) => text.trim() !== '');
      if (textItems.length && !isTopTenVersion) {
        let html = `<h3>${textItems[0]}</h3>`;
        if (textItems.length > 1) {
          html += `<p>${textItems.slice(1).join('</p><p>')}</p>`;
        }
        contentContainer.innerHTML = html;
        li.appendChild(contentContainer);
      }
      if (isTopTenVersion && textItems.length) {
        const isNumberHeader = !Number.isNaN(parseInt(textItems[0], 10));
        const heading = isNumberHeader ? textItems[0] : '';
        const subheading = textItems[isNumberHeader ? 1 : 0];
        const description = textItems.slice(isNumberHeader ? 2 : 1).join('</p><p>');
        let html = '';

        if (heading) {
          html += `<h3>${heading}</h3>`;
        }

        html += `<h4>${subheading}</h4>`;
        html += `<p>${description}</p>`;
        contentContainer.innerHTML = html;
        li.appendChild(contentContainer);
      }

      // first item spans multiple rows
      if (i === 0 && liCount < rowCount) li.style.setProperty('--grid-row-span', rowCount - liCount + 1);

      grid.appendChild(li);
    });
  });

  block.innerHTML = grid.outerHTML;
  block.style.setProperty('--grid-row-count', rowCount);
  block.style.setProperty('--grid-col-count', colCount);

  // iterating through the list after the HTML manipulation
  const links = [...block.querySelectorAll('a')];

  links.filter((link) => isVideoLink(link)).forEach((link) => {
    addVideoShowHandler(link);
    wrapImageWithVideoLink(link, link.querySelector('picture'));
  });

  // checking if element is visible on the screen to start animation for top-ten version
  if (block.classList.contains('top-ten')) {
    const options = {
      threshold: [0.25, 0.70],
    };
    const items = block.querySelectorAll('li');

    [...items].forEach((item) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const action = entry.intersectionRatio < 0.7 ? 'remove' : 'add';

            item.classList[action]('top-ten-active');
          }
        });
      }, options);
      observer.observe(item);
    });
  }
}
