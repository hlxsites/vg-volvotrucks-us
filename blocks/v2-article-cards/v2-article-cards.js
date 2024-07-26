import {
  getJsonFromUrl,
  getLanguagePath,
  getOrigin,
  createElement,
  unwrapDivs,
  getTextLabel,
} from '../../scripts/common.js';
import {
  createOptimizedPicture,
} from '../../scripts/aem.js';

const blockName = 'v2-article-cards';

const createCard = (article) => {
  const {
    path,
    image,
    title,
    publishDate,
    button = false,
  } = article;

  const shortTitle = title.split('|')[0];
  const card = createElement('article', { classes: `${blockName}__article` });
  const picture = createOptimizedPicture(image, shortTitle, false, [{ width: '380', height: '214' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
  const cardContent = document.createRange().createContextualFragment(`
          <a href="${path}" class="${blockName}__image-wrapper">
              ${pictureTag}
          </a>
          <div class="${blockName}__texts-wrapper">
              <p class="${blockName}__card-date">
                  ${date.toLocaleDateString()}
              </p>
              <h4 class="${blockName}__card-heading">
                  ${shortTitle}
              </h4>
          </div>
        `);
  const textWrapper = cardContent.querySelector(`.${blockName}__texts-wrapper`);

  if (button) {
    button.classList.add(`${blockName}__card-button`);
    textWrapper.appendChild(button);
  } else {
    const newButton = createElement('a', { classes: `${blockName}__card-button` });
    newButton.href = path;
    newButton.textContent = getTextLabel('readMore');
    textWrapper.appendChild(newButton);
  }
  card.appendChild(cardContent);
  return card;
};

const createArticleCards = (block, articles, amount = null) => {
  const articleList = createElement('div', { classes: `${blockName}__article-list` });
  articles.forEach((art) => {
    const card = createCard(art);
    articleList.append(card);
  });
  block.append(articleList);
  if (amount) articleList.classList.add(`${blockName}--${amount}-articles`);
};

export default async function decorate(block) {
  const indexUrl = new URL(`${getLanguagePath()}magazine-articles.json`, getOrigin());
  const allArticles = await getJsonFromUrl(indexUrl);
  const amountOfLinks = block.children.length;

  const selectedArticles = [];

  if (amountOfLinks !== 0) {
    const buttons = block.querySelectorAll('.button-container');
    buttons.forEach((a) => {
      const link = a.querySelector('a').href;
      [...allArticles.data].forEach((el) => {
        if (link.includes(el.path)) {
          el.button = a;
          selectedArticles.push(el);
        }
      });
    });
  }

  if (selectedArticles.length > 0) {
    createArticleCards(block, selectedArticles, amountOfLinks);
  } else {
    // TODO here goes the logic to build the full article list
    const sortedArticles = allArticles.data.sort((a, b) => a.date > b.date);
    createArticleCards(block, sortedArticles);
  }
  unwrapDivs(block);
}
