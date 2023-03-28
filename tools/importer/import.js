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
const meta = {};

function identifyTemplate(main, document) {
  const pressRelease = document.querySelector('#Form1 > div.container.main-content > div.wb');
  if (pressRelease) {
    meta.template = 'article';
  }
}

function setArticleTags(url) {
  const request = new XMLHttpRequest();
  request.open('GET', '/tools/importer/vtna-pa-tags.json', false);
  request.send(null);
  let inTags = {};
  if (request.status === 200) {
    inTags = JSON.parse(request.responseText);
  }
  const matchUrl = `https://www.volvotrucks.us${url.replaceAll('http://localhost:3001', '').replaceAll('?host=https%3A%2F%2Fwww.volvotrucks.us', '')}`;
  const tags = inTags.data.find((el) => el['Page URL'] === matchUrl);
  if (tags.t1) {
    meta.tags = `${tags.t1}`;
    if (tags.t2) {
      meta.tags = `${meta.tags}, ${tags.t2}`;
      if (tags.t3) {
        meta.tags = `${meta.tags}, ${tags.t3}`;
        if (tags.t4) {
          meta.tags = `${meta.tags}, ${tags.t4}`;
          if (tags.t5) {
            meta.tags = `${meta.tags}, ${tags.t5}`;
            if (tags.t6) {
              meta.tags = `${meta.tags}, ${tags.t6}`;
              if (tags.t7) {
                meta.tags = `${meta.tags}, ${tags.t7}`;
                if (tags.t8) {
                  meta.tags = `${meta.tags}, ${tags.t8}`;
                  if (tags.t9) {
                    meta.tags = `${meta.tags}, ${tags.t9}`;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const linkToHlxPage = (main, document, url) => {
  main.querySelectorAll('a').forEach((link) => {
    // eslint-disable-next-line prefer-regex-literals
    if (new RegExp('^(https?:)?//').test(link.href)) {
      // leave links with domains as is
    } else if (link.href.startsWith('/')) {
      const newUrl = new URL(link.href, 'https://main--vg-volvotrucks-us--hlxsites.hlx.page');
      link.href = newUrl.href;
    }
  });
};

const createMetadata = (main, document, url) => {
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

  if (meta.template === 'article') {
    setArticleTags(url);
    console.log(meta.tags);
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function makeIndexPage(url) {
  const newUrl = new URL('index', url);
  return url.endsWith('/') ? newUrl.toString() : url;
}

const makeTextBlockCentered = (main, document, url) => {
  const theWindow = document.defaultView;
  const rows = document.querySelectorAll('#Form1 > div.container.main-content > .newsArticle  > .row');
  const isCentered = (element) => theWindow.getComputedStyle(element).textAlign === 'center';
  rows.forEach((row) => {
    if (row) {
      if ([...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a')].every(isCentered)) {
        const textBlock = WebImporter.DOMUtils.createTable([['Text (Center)'],
          [...row.children],
        ], document);
        row.replaceWith(textBlock);
      }
    }
  });
  console.log(`text blocks(s) for center found: ${rows.length}`);
};

const createMagazineArticles = (main, document, url) => {
  const mainContent = document.querySelector('#Form1 > div.container.main-content > section.hubArticle > article > div');
  if (mainContent) {
    const mainImgs = mainContent.querySelectorAll('img');
    mainImgs.forEach((img) => {
      img.src = img.src.replace('.ashx', '.jpg');
      img.src = new URL(url).pathname + img.src;
    });

    const topics = document.querySelector('#Form1 > div.container.main-content > section.hubArticle > aside > div.topics');

    if (topics) {
      const tags = topics.querySelectorAll('ul > li');
      let artTags = '';
      tags.forEach((tag) => {
        if (artTags.length > 0) {
          artTags = `${artTags}, ${tag.textContent}`;
        } else {
          artTags = `${tag.textContent}`;
        }
      });
      meta.tags = artTags;
    }

    const artDetails = document.querySelectorAll('div.details > ul > li');
    artDetails.forEach((detail) => {
      if (detail.classList.contains('author')) {
        meta.author = detail.textContent;
      }
      if (detail.classList.contains('time')) {
        meta.readingTime = detail.textContent;
      }

      if (detail.classList.contains('date')) {
        meta['publish-date'] = detail.textContent;
      }
    });

    document.querySelector('aside.sidebar')?.remove();
    document.querySelector('section.hubArticleHero')?.remove();
    document.querySelector('section.hubTeaser.related')?.remove();
    document.querySelector('section.hubTextBlock')?.remove();

    console.log(url);
    if (url.includes('/volvo-trucks-magazine/')) {
      meta.template = 'magazine';
    }

    mainContent.append(hr(document));
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
      newA = `https://main--vg-volvotrucks-us--hlxsites.hlx.page${anchor.href}`;
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
  gi.innerHTML = `<img src='${img.src}'><br /><a href='${newA}'>${newA}</a><br />${h3}<br />${h4}`;

  if (newA === '') {
    gi.querySelector('a').remove();
  }

  return gi.outerHTML;
}

/**
 * @param div e.g. <div class="generic-grid-col col-sm-8">
 * @return e.g. 8
 */
function getColumnWidth(div) {
  const columns = [...div.classList]
    .filter((name) => name.startsWith('col-'))
    .map((name) => name.match(/\d+/)[0]);

  if (columns) {
    return columns[0];
  }
  return [];
}

function makeGenericGrid(main, document) {
  const gg = document.querySelectorAll('#Form1 div.generic-grid.full-width');
  console.log(`generic grid(s) found: ${gg.length}`);
  gg.forEach((grid) => {
    const columnLayout = [];
    const cells = [['Teaser Grid']];
    const gridCol = grid.querySelectorAll('div.generic-grid-col');
    const columns = [];
    const rows = [];
    gridCol.forEach((gc, idxCol) => {
      const columnWidth = getColumnWidth(gc);
      if (columnWidth) {
        columnLayout.push(columnWidth);
      }

      columns[idxCol] = document.createElement('ul');
      // each one of these is a column
      Array.from(gc.children).forEach((colContent, idxRow) => {
        // each one of these is col content (row)
        rows[idxRow] = document.createElement('li');
        rows[idxRow].innerHTML = makeGridItem(colContent);
        columns[idxCol].append(rows[idxRow]);
      });
    });

    if (columnLayout.length >= 2) {
      cells[0][0] += ` (layout ${columnLayout.join('-')})`;
    }

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

function convertArialCapsTitle(main, document) {
  const titles = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.newsArticle > .row p span.arialCapsTitle');
  titles.forEach((title) => {
    const h3 = document.createElement('h3');
    h3.innerHTML = title.innerHTML;
    // use copy "center" style from parent
    h3.setAttribute('style', title.parentNode.getAttribute('style'));
    title.replaceWith(h3);
  });
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

function makeImageTextGrid(main, document) {
  const itg = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.imageTextGrid');
  if (itg) {
    console.log(`image text grd(s) found: ${itg.length}`);
    itg.forEach((grids) => {
      const cells = [['Columns']];
      const rows = [];
      const item = grids.querySelectorAll('div.col-sm-3, div.col-sm-6, div.col-sm-4');
      item.forEach((col) => {
        // check for weird nesting
        rows.push(col);
      });
      if (rows.length === 0) {
        const gi = grids.querySelectorAll('div.imageText-grid > div');
        gi.forEach((nItem) => {
          rows.push([nItem, nItem]);
        });
      }
      if (rows.length > 0) {
        cells.push(rows);
        const columnBlock = WebImporter.DOMUtils.createTable(cells, document);
        grids.replaceWith(columnBlock);
      } else {
        console.log(`not imported: ${grids.id}`);
      }
    });
  }
}

function makeTabbedFeatures(main, document) {
  const tm = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.tabbedFeatures');
  if (tm) {
    console.log(`tabbed features found: ${tm.length}`);
  }
}

function makeTabbedCarousel(main, document) {
  const tc = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.tabbedCarousel');
  if (tc) {
    console.log(`tabbed carousel found: ${tc.length}`);
  }
}
function makeHubTextBlock(main, document) {
  const htb = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > section.hubTextBlock');
  if (htb) {
    console.log(`hub text block found: ${htb.length}`);
    htb.forEach((block) => {
      const cells = [['Eloqua Form']];
      const img = new Image();
      img.src = block.querySelector('div.container ').style.backgroundImage.replace(/url\(/gm, '').replace(/'/gm, '').replace(/\)/gm, '');
      cells.push(['background', `<img src='${img.src}'>`]);
      const formName = block.querySelector('#eloquaForm > fieldset > input[name=elqFormName]');
      cells.push(['elqFormName', formName.value]);
      const form = WebImporter.DOMUtils.createTable(cells, document);
      block.replaceWith(form);
    });
  }
}

function makeNewsFeaturesPanel(main, document) {
  const nfp = document.querySelectorAll('#DocumentBody_maincontent_6_NewsFeaturesPanel, #DocumentBody_maincontent_7_NewsFeaturesPanel, #DocumentBody_maincontent_8_NewsFeaturesPanel, #DocumentBody_maincontent_9_NewsFeaturesPanel');
  if (nfp) {
    console.log(`news features panel found: ${nfp.length}`);
    nfp.forEach((panel) => {
      const cells = [['Columns']];
      const rows = [];
      const item = panel.querySelectorAll('div.col-sm-4, div.col-sm-6');
      item.forEach((column) => {
        rows.push(column);
      });
      if (rows.length > 0) {
        cells.push(rows);
        const cols = WebImporter.DOMUtils.createTable(cells, document);
        panel.replaceWith(cols);
      } else {
        console.log('not imported');
      }
    });
  }
}

function make360Image(main, document) {
  const image360 = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div._360-view');
  if (image360) {
    console.log(`360 image(s) found: ${image360.length}`);
    image360.forEach((img360) => {
      const cells = [['Image 360']];
      const imgs = img360.querySelectorAll('img.slide');
      imgs.forEach((img) => {
        cells.push([img]);
      });
      const block360 = WebImporter.DOMUtils.createTable(cells, document);
      img360.replaceWith(block360);
    });
  }
}

/* this only is works with press-release 'articles' */
function makeNewsArticle(main, document) {
  const newsArticle = document.querySelectorAll('#Form1 div.newsArticle');
  if (newsArticle && meta.template === 'article') {
    console.log(`newsArticle(s) found: ${newsArticle.length}`);
    newsArticle.forEach((article) => {
      const cells = [['Fragment']];
      cells.push(['https://main--vg-volvotrucks-us--hlxsites.hlx.page/fragments/press-release-boilerplate']);
      const na = WebImporter.DOMUtils.createTable(cells, document);
      article.replaceWith(na);
      na.insertAdjacentElement('afterend', hr(document));
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
      'body > img[src="/tcpauth.ashx?"]',
      'body > img[src="/tcpauth.ashx?logout=1"]',
      'body > img[src="https://www.macktrucks.com/tcpauth.ashx?"]',
      'body > img[src="https://www.volvotrucks.us/tcpauth.ashx?"]',
      'div.modal',
    ]);

    linkToHlxPage(main, document, url);

    identifyTemplate(main, document);
    swapHero(main, document);
    makeTruckHero(main, document);
    makeTabbedCarousel(main, document);
    makeGenericGrid(main, document);
    makeProductCarousel(main, document);
    makeImageText(main, document);
    makeImageTextGrid(main, document);
    makeNewsFeaturesPanel(main, document);
    makeTabbedFeatures(main, document);
    makeTabbedCarousel(main, document);
    make360Image(main, document);
    makeHubTextBlock(main, document);
    createPRDownloadBlock(main, document);
    makeNewsArticle(main, document);
    createMagazineArticles(main, document, url);
    convertArialCapsTitle(main, document, url);
    makeTextBlockCentered(main, document, url);
    // create the metadata block and append it to the main element
    createMetadata(main, document, url);

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
    // eslint-disable-next-line no-param-reassign
    url = makeIndexPage(url);
    WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''));
  },
};
