import {
    ffetch,
} from '../../scripts/lib-ffetch.js';
import {
    createOptimizedPicture,
} from '../../scripts/lib-franklin.js';

function buildRelatedMagazineArticle(entry) {
    const {
        path,
        image,
        title,
        author,
        readingTime,
        publishDate,
    } = entry;
    const card = document.createElement('article');
    const picture = createOptimizedPicture(image, title, false, [{ width: '380', height: '214' }]);
    const pictureTag = picture.outerHTML;
    const date = new Date(publishDate * 1000);
    card.innerHTML = `<a href="${path}" class="imgcover">
    ${pictureTag}
    </a>
    <div class="content">
    <ul><li>${date.toLocaleDateString()}</li></ul>
    <h3><a href="${path}">${title}</a></h3>
    <ul>
    <li>${author}</li>
    <li>${readingTime}</li>
    </ul>
    </div>`;
    return card;
}

async function createRelatedtMagazineArticles(mainEl, magazineArticles) {
    mainEl.innerHTML = '';
    const articleCards = document.createElement('div');
    articleCards.classList.add('related-magazine-articles');
    mainEl.appendChild(articleCards);
    magazineArticles.forEach((entry) => {
        const articleCard = buildRelatedMagazineArticle(entry);
        articleCards.appendChild(articleCard);
    });
}

async function getMagazineArticles(limit) {
    const indexUrl = new URL('/magazine-articles.json', window.location.origin);
    let articles;
    articles = ffetch(indexUrl).slice(0, 3).all();
    return articles;
}

export default async function decorate(block) {
    const limit = 3;
    const magazineArticles = await getMagazineArticles(limit);
    createRelatedtMagazineArticles(block, magazineArticles);
}
