import ffetch from '../../scripts/lib-ffetch.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function buildPressReleaseCard(entry) {
  const {
    path,
    image,
    title,
    description,
    publishDate,
  } = entry;
  const card = document.createElement('article');
  const picture = createOptimizedPicture(image, title, false, [{ width: '414' }]);
  const pictureTag = picture.outerHTML;
  const date = new Date(publishDate * 1000);
  card.innerHTML = `<a href="${path}">
    ${pictureTag}
  </a>
  <h4 class="date">${date.toLocaleDateString()}</h4>
  <h3><a href="${path}">${title}</a></h3>
  <p>${description}</p>`;
  return card;
}

function buildHeader(mainEl) {
  const defaultWrapperEl = mainEl.parentNode.previousElementSibling;
  if (defaultWrapperEl) {
    const headerEl = defaultWrapperEl.querySelector('h1, h2');
    const headline = document.createElement('h2');
    headline.innerText = headerEl.innerText;
    mainEl.prepend(headline);
    defaultWrapperEl.remove();
  }
}

function buildButtonContainer(mainEl) {
  const defaultWrapperEl = mainEl.parentNode.nextElementSibling;
  if (defaultWrapperEl) {
    const buttonEl = defaultWrapperEl.querySelector('p.button-container');
    if (buttonEl) {
      mainEl.appendChild(buttonEl);
      defaultWrapperEl.remove();
    }
  }
}

async function decoratePressReleases(mainEl) {
  mainEl.innerHTML = '';
  buildHeader(mainEl);
  const articleCards = document.createElement('div');
  articleCards.classList.add('press-releases-cards');
  mainEl.appendChild(articleCards);
  const entries = await ffetch('/press-releases.json').slice(0, 3).all();
  entries.forEach((entry) => {
    const pressReleaseCard = buildPressReleaseCard(entry);
    articleCards.appendChild(pressReleaseCard);
  });
  buildButtonContainer(mainEl);
}

export default function decorate(block) {
  decoratePressReleases(block);
}
