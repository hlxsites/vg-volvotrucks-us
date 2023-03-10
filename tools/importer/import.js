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
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const hr = (doc) => doc.createElement('hr');

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const publishDate = document.querySelector('div.postFullDate');
  if (publishDate) {
    meta['publish-date'] = publishDate.textContent;
    publishDate.remove();
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function makeIndexPage(url) {
  const newUrl = new URL('index', url);
  return url.endsWith('/') ? newUrl.toString() : url;
}

const createArticleColumns = (main, document, url) => {
  const mainContent = document.querySelector('#Form1 > div.container.main-content > section.hubArticle > article > div');
  if (mainContent) {
    const mainImgs = mainContent.querySelectorAll('img');
    mainImgs.forEach((img) => {
      img.src = img.src.replace('.ashx', '.jpg');
      img.src = new URL(url).pathname + img.src;
    });

    const cards = [
      ['Cards'],
    ];

    const relatedContent = document.querySelectorAll('#Form1 > div.container.main-content > section.hubTeaser.related > div > div:nth-child(2) > div.teaser');
    relatedContent.forEach((article) => {
      console.log(article.querySelector('figure > a > img').src);
      cards.push([article]);
    });

    const topics = document.querySelector('#Form1 > div.container.main-content > section.hubArticle > aside > div.topics');
    const cells = [
      ['Columns'],
      [topics, mainContent],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.prepend(table);
    main.append(WebImporter.DOMUtils.createTable(cards, document));
  }
};

function createPRDownloadBlock(main, document) {
  const h3s = document.querySelectorAll('h3');
  h3s.forEach((heads) => {
    if (heads.textContent.includes('Download Press Release Images')) {
      const cells = [['Download Images']];
      cells.push([heads.innerHTML]);
      const dimg = heads.parentNode.querySelectorAll('#img-grid > div');
      dimg.forEach((imgs) => {
        if (imgs.innerHTML.length > 0) {
          cells.push([imgs.innerHTML.replaceAll('http://localhost:3001', '')]);
        }
      });
      const downloadBlock = WebImporter.DOMUtils.createTable(cells, document);
      heads.parentNode.replaceWith(downloadBlock);
    }
  });
}

function swapHero(main, document) {
  const heroImg = document.querySelector('#Form1 > div.container.main-content > section.hubArticleHero > div > div:nth-child(1)');
  WebImporter.DOMUtils.replaceBackgroundByImg(heroImg, document);
}

function makeTruckHero(main, document) {
  const mainHero = document.querySelector('#Form1 > div.container.main-content.allow-full-width > div.heroImage.full-width');
  if (mainHero) {
    const subhead = mainHero.querySelector('div > div.wrapper > div > div > h4');
    const herohead = mainHero.querySelector('div > div.wrapper > div > div > h1');
    const normal = document.createElement('p');
    normal.innerHTML = subhead.innerHTML;
    console.log(subhead.innerHTML);
    mainHero.after(hr(document));
    mainHero.after(normal);
    mainHero.after(herohead);
    subhead.remove();
  }
}

function makeTabbedCarousel(main, document) {
  const tc = document.querySelectorAll('#Form1 div.tabbedCarousel');
  if (tc) {
    console.log(`tabbed carousel(s) found: ${tc.length}`);
  }
}

function makeGridItem(teaser) {
  const img = new Image();
  if (teaser.style.backgroundImage) {
    img.src = teaser.style.backgroundImage.replace(/url\(/gm, '').replace(/'/gm, '').replace(/\)/gm, '');
  }
  const anchor = teaser.querySelector('a');
  let newA = '';
  if (anchor) {
    if (anchor.getAttribute('data-video-src')) {
      newA = anchor.getAttribute('data-video-src');
    } else {
      newA = anchor.href;
    }
  }

  const txtH3 = teaser.querySelector('a > div > h3');
  const txtH4 = teaser.querySelector('a > div > h4');
  let h3 = '';
  let h4 = '';
  if (txtH3 && txtH4) {
    h3 = txtH3.innerHTML;
    h4 = txtH4.innerHTML;
  }
  const gi = document.createElement('div');
  gi.innerHTML = `<img src='${img.src}'><div><a href='${newA}'>${newA}</a></div><div>${h3}</div><div>${h4}</div>`;

  if (newA === '') {
    gi.querySelector('a').remove();
  }

  return gi.outerHTML;
}

function makeGenericGrid(main, document) {
  const gg = document.querySelectorAll('#Form1 div.generic-grid.full-width');
  console.log(`generic grid(s) found: ${gg.length}`);
  gg.forEach((grid) => {
    const cells = [['Teaser Grid']];
    const col1ul = document.createElement('ul');
    const col2ul = document.createElement('ul');
    const gridCol = grid.querySelectorAll('div.generic-grid-col');
    const columns = [];
    const rows = [];
    gridCol.forEach((gc, idxCol) => {
      columns[idxCol] = document.createElement('ul');
      // each one of these is a column
      Array.from(gc.children).forEach((colContent, idxRow) => {
        // each one of these is col content (row)
        rows[idxRow] = document.createElement('li');
        rows[idxRow].innerHTML = makeGridItem(colContent);
        columns[idxCol].append(rows[idxRow]);
      });
    });

    cells.push(columns);
    const teaserGrid = WebImporter.DOMUtils.createTable(cells, document);
    grid.replaceWith(teaserGrid);
  });
}

function makeProductCarousel(main, document) {
  const pc = document.querySelectorAll('#Form1 div.productCarousel');
  if (pc) {
    console.log(`product carousel(s) found: ${pc.length}`);
    const cells = [['Carousel']];

    pc.forEach((car) => {
      const wrap = car.querySelector('div.carousel-wrapper');
      const caritems = wrap.querySelectorAll('div.product');
      const carlist = document.createElement('ul');
      caritems.forEach((it) => {
        const item = document.createElement('li');
        item.innerHTML = it.innerHTML;
        carlist.appendChild(item);
      });
      cells.push([carlist]);
      const carousel = WebImporter.DOMUtils.createTable(cells, document);
      wrap.replaceWith(carousel);
    });
    // pc.replaceWith(carousel);
  }
}

function makeImageText(main, document) {
  const it = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.imageText');
  if (it) {
    console.log(`image text(s) found: ${it.length}`);
    it.forEach((its) => {
      const cells = [['Teaser Cards']];
      cells.push([its.innerHTML]);
      const teaserCards = WebImporter.DOMUtils.createTable(cells, document);
      its.replaceWith(teaserCards);
    });
  }
}

export default {
  /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '#onetrust-pc-sdk',
      '#onetrust-consent-sdk',
      'body > img:nth-child(1)',
      'body > img:nth-child(2)',
      'body > img:nth-child(3)',
      'body > img[src="tcpauth.ashx?"]',
      'body > img[src="https://www.macktrucks.com/tcpauth.ashx?"]',
      'body > img[src="https://www.volvotrucks.us/tcpauth.ashx?"]',
      'div.modal',
    ]);

    swapHero(main, document);
    makeTruckHero(main, document);
    makeTabbedCarousel(main, document);
    makeGenericGrid(main, document);
    makeProductCarousel(main, document);
    makeImageText(main, document);
    createPRDownloadBlock(main, document);

    createArticleColumns(main, document, url);
    // create the metadata block and append it to the main element
    createMetadata(main, document);

    return main;
  },

  /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    url = makeIndexPage(url);
    WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''));
  },
};
