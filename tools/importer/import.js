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
/* eslint-disable no-console, class-methods-use-this, no-unused-vars  */
/* eslint-disable no-plusplus, no-use-before-define */

const hr = (doc) => doc.createElement('hr');
const span = (doc, text) => {
  const el = doc.createElement('span');
  el.textContent = text;
  return el;
};
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
  if (tags && tags.t1) {
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

  if (new URL(url).pathname.startsWith('/trucks/') || new URL(url).pathname.startsWith('/our-difference/')) {
    const styles = meta.Style ? meta.Style.split(', ') : [];
    if (!(styles.includes('center'))) {
      styles.push('center');
    }
    meta.Style = styles.join(', ');
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function makeIndexPage(url) {
  const newUrl = new URL('index', url);
  return url.endsWith('/') ? newUrl.toString() : url;
}

function isCentered(element, theWindow) {
  return theWindow.getComputedStyle(element).textAlign === 'center';
}

/**
 * Subtitles are marked with italics and then rendered in gray.
 */
const styleSubtitleHeaders = (main, document, url) => {
  document.querySelectorAll(':is(h1, h2, h3, h4, h5, h6):is(.subtitle, .product-grid-subtitle)')
    .forEach((header) => {
      const em = document.createElement('em');
      em.innerHTML = header.innerHTML;

      header.textContent = '';
      header.appendChild(em);
    });
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
    if (subhead) {
      normal.innerHTML = subhead.innerHTML;
      subhead.remove();
    }
    mainHero.after(hr(document));
    mainHero.after(normal);
    mainHero.after(herohead);
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

  const txtH3 = teaser.querySelector('div.text > h3');
  const txtH4 = teaser.querySelector('div.text > h4');
  const gi = document.createElement('div');
  const giInnerItems = [`<img src='${img.src}'>`];
  if (newA) giInnerItems.push(`<a href='${newA}'>${newA}</a>`);
  if (txtH3) giInnerItems.push(txtH3.innerHTML);
  if (txtH4) giInnerItems.push(txtH4.innerHTML);
  gi.innerHTML = giInnerItems.join('<br/>');

  if (newA === '') {
    gi.querySelector('a')?.remove();
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

function fixAlternatingLeftRightColumns(main, document) {
  const grids = document.querySelectorAll('#Form1 div.container .imageTextGrid .imageTextGrid-1-right .imageText-grid');
  console.log(`alternating grid(s) found: ${grids.length}`);
  grids.forEach((grid) => {
    const childElements = Array.from(grid.children);
    childElements.reverse();

    childElements.forEach((child) => {
      grid.appendChild(child);
    });
  });
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

function distributeItemsInColumns(items, columns) {
  const cells = [];
  while (cells.length < Math.ceil(items.length / columns)) {
    cells.push([]);
  }
  items.forEach((product, index) => {
    const rowIndex = Math.floor(index / columns);
    cells[rowIndex].push(product);
  });

  // If there are multipe rows, fill last row to avoid colspan.
  const lastRow = cells[cells.length - 1];
  while (cells.length > 1 && lastRow.length < columns) {
    lastRow.push('');
  }

  return cells;
}

function makeProductCarousel(main, document) {
  const pc = document.querySelectorAll('#Form1 div.productCarousel');
  if (pc) {
    console.log(`product carousel(s) found: ${pc.length}`);
    const cells = [['Carousel']];
    const items = [];

    pc.forEach((car) => {
      const wrap = car.querySelector('div.carousel-wrapper');
      wrap.querySelectorAll('div.product').forEach((it) => {
        const item = document.createElement('div');
        item.append(
          it.querySelector('img'),
          document.createElement('br'),
          it.querySelector('.product-title'),
        );
        items.push(item);
      });
      cells.push(...distributeItemsInColumns(items, 3));

      const carousel = WebImporter.DOMUtils.createTable(cells, document);
      wrap.replaceWith(carousel);
    });
  }
}

function makeVideo(main, document) {
  document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.embeddedVideo iframe[src]')
    .forEach((video) => {
      const link = document.createElement('a');
      link.href = video.src;
      link.textContent = video.src;
      const embed = WebImporter.DOMUtils.createTable([['Embed'], [
        link,
      ], [
        span(document, 'PLEASE FIX LINK TO FALLBACK VIDEO'),
      ]], document);
      video.replaceWith(embed);
    });
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
  const it = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.imageText > div:not(.imageText-fullsize-outsideText)');
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

function mergeEqualConsecutiveBlocks(main, document) {
  const blocksToAutomerge = ['Teaser Cards', 'Columns'];

  main.querySelectorAll('table').forEach((table) => {
    const blockTitle = table.querySelector('th')?.textContent;
    const blockTypeWithoutVariant = blockTitle?.replaceAll(/\(.*$/g, '').trim();
    if (!blocksToAutomerge.includes(blockTypeWithoutVariant)) return;

    // merge if previous element is of the same kind and exact same variation
    const previousTable = table.previousElementSibling;
    if (previousTable && previousTable.tagName === 'TABLE'
          && previousTable.querySelector('th').textContent === table.querySelector('th').textContent) {
      console.log('merging Teaser Cards block');
      table.childNodes.forEach((row, index) => {
        if (index === 0) return;
        previousTable.appendChild(row);
      });
      table.remove();
    }
  });
}

function makeTabbedFeatures(main, document) {
  const tm = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.tabbedFeatures');
  if (tm) {
    console.log(`tabbed features found: ${tm.length}`);
    tm.forEach((panel) => {
      const labels = [...panel.querySelectorAll('.hidden-xs .navigation-container li')].map((li) => li.textContent.trim());
      const contents = [...panel.querySelectorAll('.hidden-xs .content-container .tab-pane')].map((content) => {
        makeImageTextGrid(content, document);
        return content;
      });

      if (contents.length === labels.length) {
        const elements = [hr(document)];
        const titleWrapper = panel.querySelector('.title-wrapper');
        if (titleWrapper) elements.unshift(titleWrapper);
        for (let i = 0; i < contents.length; i++) {
          elements.push(contents[i]);
          const metadata = [['Section Metadata'], ['Tabs', labels[i]]];
          elements.push(WebImporter.DOMUtils.createTable(metadata, document));
          elements.push(hr(document));
        }
        panel.replaceWith(...elements);
      } else {
        console.log('did not import tabbed features, labels do not match content');
      }
    });
  }
}

function makeTabbedCarousel(main, document) {
  const tc = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.tabbedCarousel');
  if (tc) {
    console.log(`tabbed carousel found: ${tc.length}`);
    tc.forEach((c) => {
      const fullWidth = !c.matches('.hasArrows');
      const slides = c.querySelectorAll('.slide:not(.slick-cloned)');
      // create a section with metadata for each slide
      const sections = [...slides].map((slide) => {
        const section = document.createElement('div');
        section.innerHTML = slide.innerHTML;
        const metadata = [['Section Metadata']];
        if (fullWidth) metadata.push(['Style', 'Full Width']);
        metadata.push(['Carousel', slide.getAttribute('tab-title')]);
        section.appendChild(WebImporter.DOMUtils.createTable(metadata, document));
        section.appendChild(hr(document));
        return section;
      });
      if (sections.length) {
        const h2 = c.querySelector('h2');
        if (h2) c.insertAdjacentElement('beforebegin', h2);
        if (c.previousElementSibling?.tagName !== 'HR') c.insertAdjacentElement('beforebegin', hr(document));
        c.replaceWith(...sections);
      }
    });
  }
}
function makeHubTextBlock(main, document) {
  const htb = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > section.hubTextBlock');
  if (htb) {
    console.log(`hub text block found: ${htb.length}`);
    htb.forEach((block) => {
      const elements = [hr(document)];
      // take the heading and eventually the text after
      const heading = block.querySelector('h2');
      if (heading) {
        elements.push(heading);
        if (heading.nextElementSibling && heading.nextElementSibling.tagName === 'P') {
          elements.push(heading.nextElementSibling);
        }
      }
      const cells = [['Eloqua Form']];
      const img = document.createElement('img');
      img.src = block.querySelector('div.container ').style.backgroundImage.replace(/url\(/gm, '').replace(/'/gm, '').replace(/\)/gm, '');
      const formName = block.querySelector('#eloquaForm > fieldset > input[name=elqFormName]');
      cells.push([formName.value]);
      const form = WebImporter.DOMUtils.createTable(cells, document);
      elements.push(form);
      elements.push(WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['Background', img],
      ], document));
      elements.push(hr(document));
      block.replaceWith(...elements);
    });
  }
}

function makeNewsFeaturesPanelAndImageTextGrid(main, document) {
  const nfp = document.querySelectorAll('.newsFeatures, .imageTextGrid');
  if (nfp) {
    console.log(`news features panel found: ${nfp.length}`);
    nfp.forEach((panel) => {
      let columns = -1;
      if (panel.firstElementChild.matches('.newsFeatures-column-3')) columns = 3;
      else if (panel.firstElementChild.matches('.newsFeatures-column-2, .imageTextGrid-2')) columns = 2;
      else if (panel.firstElementChild.matches('.imageTextGrid-4')) columns = 4;

      if (columns > 0) {
        const cells = [['Teaser Cards']];
        let hasVideos = false;
        let row = [];
        const items = panel.querySelectorAll('div.col-sm-4, div.col-sm-6, div.col-sm-3');
        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          const videoLink = item.querySelector('a[data-video-src]');
          if (videoLink && videoLink.href === 'about:blank#') {
            hasVideos = true;

            // Move image up, and add standalone link below.
            videoLink.parentNode.insertBefore(videoLink.querySelector('img'), videoLink);

            videoLink.href = videoLink.dataset.videoSrc;
            videoLink.textContent = 'YouTube Video';

            // wrap link in paragraph
            const p = document.createElement('p');
            videoLink.parentNode.insertBefore(p, videoLink);
            p.appendChild(videoLink);
          }

          const links = item.querySelector('.news-item-links'); // display: none
          if (links && !links.classList.contains('hasLinks')) links.remove();
          else if (links) {
            const ul = document.createElement('ul');
            links.querySelectorAll('a').forEach((a) => {
              const li = document.createElement('li');
              li.appendChild(a);
              ul.appendChild(li);
            });
            links.replaceWith(ul);
          }

          row.push(item);

          if (row.length === columns) {
            cells.push(row);
            row = [];
          }
        }
        if (hasVideos) {
          cells[0][0] += ' (With Video)';
        }
        if (cells.length > 1) {
          const cols = WebImporter.DOMUtils.createTable(cells, document);
          const headings = panel.querySelectorAll('h3,h2');
          if (headings && headings.length) headings.forEach((heading) => panel.insertAdjacentElement('beforebegin', heading));
          panel.replaceWith(cols);
        }
      } else {
        console.log(`unknown column count: ${panel.firstElementChild.className}`);
      }
    });
  }
}

function makeImageTextGrid(main, document) {
  const nfp = document.querySelectorAll('.imageTextGrid');
  if (nfp) {
    console.log(`image text grids found: ${nfp.length}`);
    nfp.forEach((panel) => {
      // use columns only for the image text grid 1
      const imageLeft = panel.firstElementChild.matches('.imageTextGrid-1-left');
      const imageRight = panel.firstElementChild.matches('.imageTextGrid-1-right');
      const threeCol = panel.firstElementChild.matches('.imageTextGrid-3');

      if (threeCol) {
        const cells = [['Teaser Cards']];
        const cards = panel.querySelectorAll('div.col-sm-4');
        const cardArr = [];
        cards.forEach((card) => {
          cardArr.push(card);
        });
        cells.push(cardArr);
        panel.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
      }

      if (imageLeft || imageRight) {
        const cells = [['Columns']];
        const imageContainer = panel.querySelector('.image-container');
        const contentContainer = panel.querySelector('.wrapper');
        if (imageLeft) cells.push([imageContainer, contentContainer]);
        else cells.push([contentContainer, imageContainer]);
        contentContainer.querySelectorAll('a').forEach((a) => {
          const text = a.textContent.trim();
          if (text.endsWith('>')) {
            // secondary link
            a.textContent = text.substring(0, text.length - 1).trim();
          }
          const em = document.createElement('em');
          a.after(em);
          em.append(a);
        });
        panel.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
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

function makeSpecificationTable(main, document) {
  const specTable = document.querySelectorAll('#Form1 div.container > div.specificationsTable');
  if (specTable) {
    console.log(`Specification Table(s) found: ${specTable.length}`);
    specTable.forEach((st) => {
      // clean up invalid html
      const ths = st.querySelectorAll('td[colspan="100%"]');
      ths.forEach((th) => {
        th.removeAttribute('colspan');
      });

      // remove mobile versions mobileSpecsContainer
      if (st.nextElementSibling?.matches('.mobileSpecsContainer')) st.nextElementSibling.remove();

      const cells = [['Specifications']];
      const headerTable = st.firstElementChild;
      if (headerTable.tagName === 'TABLE') {
        const images = [...headerTable.querySelectorAll('img')];
        const [name, ...titles] = [...headerTable.querySelectorAll('.header td')];
        const headerRow = [name.textContent.trim()];
        titles.forEach((title, i) => {
          const div = document.createElement('div');
          if (images[i]) div.append(images[i], document.createElement('br'));
          div.append(...title.childNodes);
          headerRow.push(div);
        });
        cells.push(headerRow);
      } else if (['H2', 'H3', 'H4'].indexOf(headerTable.tagName) >= 0) {
        st.before(headerTable);
      }

      // for each collapsible section
      st.querySelectorAll('button').forEach(({ textContent: label, nextElementSibling: content }) => {
        const button = document.createElement('strong');
        button.textContent = label.trim();
        cells.push([button]);
        content.querySelectorAll('tr').forEach((tr) => {
          cells.push([...tr.querySelectorAll('td')].map((td) => {
            const div = document.createElement('div');
            div.innerHTML = td.innerHTML;
            return div;
          }));
        });
      });

      st.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
    });
  }
}

function makeLinkList(main, document) {
  let linkLists = main.querySelectorAll('ul.links');
  if (linkLists.length) {
    linkLists.forEach((linkList) => {
      linkList.querySelectorAll('li > a').forEach((a) => {
        // wrap <a> into <em> to make them secondary links
        const em = document.createElement('em');
        a.after(em);
        em.appendChild(a);
      });
    });
  }
  linkLists = main.querySelectorAll('.vhd-button-group');
  if (linkLists.length) {
    linkLists.forEach((linkList) => {
      const list = document.createElement('ul');
      linkList.querySelectorAll('a.cta').forEach((a) => {
        // wrap <a> into <em> to make them secondary links
        const li = document.createElement('li');
        li.appendChild(a);
        list.appendChild(li);
      });
      linkList.replaceWith(list);
    });
  }
}

function swapVideoCta(main, document) {
  // set the href for the video cta
  const videoCtas = main.querySelectorAll('a.cta-video[data-video-src]');
  videoCtas.forEach((a) => {
    const { videoSrc } = a.dataset;
    a.href = videoSrc;
  });
}

function markSecondaryCta(main, document) {
  main.querySelectorAll('a.cta-link').forEach((a) => {
    const em = document.createElement('em');
    a.after(em);
    em.appendChild(a);
  });
}

function makeKeyFacts(main, document) {
  main.querySelectorAll('#Form1 > div.container > .threeColumnSpecs').forEach((source) => {
    const row = source.querySelector('.row');
    const [first, second, thrid] = row.children;
    function convertColumnContent(col) {
      const div = document.createElement('div');
      const childen = [...col.firstElementChild.children];
      for (let i = 0; i < childen.length; i += 1) {
        let child = childen[i];
        if (child.matches('.caps-subtitle')) {
          const h4 = document.createElement('h4');
          h4.innerHTML = col.querySelector('.caps-subtitle').innerHTML;
          child = h4;
        }
        if (child.matches('.block-title')) {
          let text = child.textContent.trim();
          if (child.nextElementSibling && child.nextElementSibling.matches('.bold-subtitle')) {
            text += ` ${child.nextElementSibling.textContent.trim()}`;
            i += 1;
          }
          child.innerHTML = `<strong>${text}</strong>`;
        }
        div.appendChild(child);
      }
      return div;
    }
    const cells = [
      ['Key Facts (wide columns, trailing line)'],
      [
        convertColumnContent(first),
        convertColumnContent(second),
        convertColumnContent(thrid),
      ],
    ];
    source.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
  });
}

function makeDocumentList(main, document) {
  const docLists = document.querySelectorAll('#Form1 > div.container.main-content.allow-full-width > div.documentList-container');
  if (docLists) {
    console.log(`Document List(s) found: ${docLists.length}`);
    docLists.forEach((dl) => {
      const itemDivs = dl.querySelectorAll('div.inner > a');
      const cells = [['Document List']];
      itemDivs.forEach((doc) => {
        const documentURL = doc.href;
        const ul = document.createElement('ul');
        doc.querySelectorAll('h3, small').forEach((item) => {
          const anchor = document.createElement('a');
          const li = document.createElement('li');
          anchor.href = documentURL;
          anchor.innerHTML = item.innerHTML;
          li.append(anchor);
          ul.appendChild(li);
        });
        doc.replaceWith(ul);
        cells.push([ul]);
      });
      dl.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
    });
  }
}

function makeModelIntroduction(main, document) {
  document.querySelectorAll('.modelIntroduction').forEach((mi) => {
    const elements = [];
    const heading = mi.querySelector('h2');
    if (heading) elements.push(heading);
    const description = mi.querySelector('h2 ~ p.description');
    if (description) elements.push(description);
    const cells = [['Columns (center)']];
    cells.push([...mi.querySelectorAll('.model-spec')].map((ms) => {
      const icon = ms.querySelector('.fa');
      if (icon) {
        const [, iconName] = [...icon.classList];
        icon.innerHTML = `:${iconName}:`;
      }
      return ms;
    }));
    elements.push(WebImporter.DOMUtils.createTable(cells, document));
    mi.replaceWith(...elements);
  })
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
      'body > #Form1 > header',
      'body > #Form1 > div > header',
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
    swapVideoCta(main, document);
    markSecondaryCta(main, document);
    makeTruckHero(main, document);
    makeTabbedCarousel(main, document);
    fixAlternatingLeftRightColumns(main, document);
    makeGenericGrid(main, document);
    makeProductCarousel(main, document);
    makeImageText(main, document);
    makeNewsFeaturesPanelAndImageTextGrid(main, document);
    makeImageTextGrid(main, document);
    makeTabbedFeatures(main, document);
    make360Image(main, document);
    makeHubTextBlock(main, document);
    createPRDownloadBlock(main, document);
    makeNewsArticle(main, document);
    createMagazineArticles(main, document, url);
    convertArialCapsTitle(main, document, url);
    makeVideo(main, document, url);
    makeSpecificationTable(main, document);
    mergeEqualConsecutiveBlocks(main, document, url);
    styleSubtitleHeaders(main, document, url);
    makeLinkList(main, document);
    makeKeyFacts(main, document);
    makeDocumentList(main, document);
    makeModelIntroduction(main, document);
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
