import ffetch from '../../scripts/lib-ffetch.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function buildMagazineArticleCard(entry) {
  const {
    path,
    image,
    title,
    description,
    author,
    category,
    readingTime,
    publishDate,
  } = entry;
  const card = document.createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '380', height: '214' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date(publishDate * 1000);
  card.innerHTML = `<a href="${path}">
    ${pictureTag}
    </a>
    <div class="content">
    <ul><li>${date.toLocaleDateString()}</li>
    ${(category?'<li>'+category+'</li>':'')}</ul>
    <h3 class="MediumTitleSentence"><a href="${path}">${title}</a></h3>
    <p>${description}</p>
    <ul>${(author?'<li>'+author+'</li>':'')}</li>
    <li>${(readingTime?'<li>'+readingTime+'</li>':'')}</ul>
    </div>`;
    return card;
}

async function decorateArticles(mainEl) {
  mainEl.innerHTML = '';
  const articleCards = document.createElement('div');
  articleCards.classList.add('magazine-article-cards');
  mainEl.appendChild(articleCards);
  const entries = await ffetch('/magazine-articles.json').all();
  entries.forEach((entry) => {
    const articleCard = buildMagazineArticleCard(entry);
    articleCards.appendChild(articleCard);
  });
}

export default function decorate(block) {
  decorateArticles(block);
}