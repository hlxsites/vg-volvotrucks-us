import { createOptimizedPicture, readBlockConfig } from '../../scripts/lib-franklin.js';
import { ffetch } from '../../scripts/lib-ffetch.js';

async function getArticles(path, limit) {
  const indexUrl = new URL(path, window.location.origin);
  const articles = ffetch(indexUrl).sheet('sorted').limit(limit).all();
  return articles;
}

function buildNews(elm, releases, quantity) {
  let newsDivs = '';
  releases.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    return 0;
  });
  releases.forEach((release) => {
    const excelDate = new Date(release.date * 1000);
    let readmore = '';
    if (quantity !== 'max') {
      readmore = `<p><a class='rm' href='${release.path}'>Read more</a></p>`;
    }
    newsDivs += `<div class="news-list">
    <div class="list-teaser">
        <div class="image-container">
            <a href="${release.path}">
                <picture>
                    <img src="${release.image}" alt="${release.title}">
                </picture>
            </a>
        </div>
        <div class="news-item-metadata">
            <span class="news-item-date">${excelDate.toLocaleDateString('en-US')}</span>
        </div>
        <div class="news-item-content">
            <h3><a href="${release.path}">${release.title}</a></h3>
            <p>${release.description}</p>
        </div>
        ${readmore}
    </div>
</div>`;
  });
  elm.innerHTML = newsDivs;
  elm.querySelectorAll('img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '370px' }]));
  });
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  if (config && Object.keys(config).length >= 1) {
    const newsElement = document.createElement('div');
    let limit = 25; // artificial limit set
    if (config.quantity !== 'max') {
      limit = 3;
      newsElement.classList.add('bb-news-list-small');
    } else {
      newsElement.classList.add('bb-news-list');
    }
    const articles = await getArticles(config.source, limit);
    buildNews(newsElement, articles, config.quantity);
    block.replaceWith(newsElement);
  }
}
