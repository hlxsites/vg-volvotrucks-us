import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import {
  createElement,
  getTextLabel,
  getPlaceholders,
  extractObjectFromArray,
  MAGAZINE_CONFIGS,
} from '../../scripts/common.js';

const templateName = 'v2-magazine';
const articleHero = `${templateName}-article-hero`;

const buildArticleHero = (doc) => {
  const main = doc.querySelector('main');
  let title = getMetadata('og:title');
  if (title.includes('|')) [title] = title.split(' |');
  const author = getMetadata('author');
  let pubDate = getMetadata('publish-date');
  const { DATE_LANGUAGE, DATE_OPTIONS } = MAGAZINE_CONFIGS;
  const locale = getMetadata('locale') || DATE_LANGUAGE;
  const formatDateOptions = extractObjectFromArray(JSON.parse(DATE_OPTIONS));
  const readTime = getMetadata('readingtime');
  const headPic = getMetadata('og:image');
  const headAlt = getMetadata('og:image:alt');
  const tags = getMetadata('article:tag').split(',');

  // Hero container
  const heroContainer = createElement('div', { classes: `${articleHero}__container` });

  // Title
  const heroTitle = createElement('h1', { classes: `${articleHero}__title` });

  // Image
  const headImg = createOptimizedPicture(headPic, headAlt);

  // Metadata Text row with author | date | read time
  const textContainer = createElement('div', { classes: `${articleHero}__text-container` });
  const authorSpan = createElement('span', {
    classes: `${articleHero}--author`,
    props: { itemprop: 'author' },
  });
  const pubDateEl = createElement('date', {
    classes: `${articleHero}__pubdate`,
    props: {
      datetime: new Date(pubDate).toISOString(),
      itemprop: 'datePublished',
    },
  });
  const readTimeSpan = createElement('span', { classes: `${articleHero}__readtime` });

  heroTitle.innerText = title;
  headImg.classList.add(`${articleHero}__img-container`);
  authorSpan.innerText = author;
  pubDate = new Intl.DateTimeFormat(locale, formatDateOptions).format(new Date(pubDate));
  pubDateEl.innerText = pubDate;
  readTimeSpan.innerText = `${readTime} ${getTextLabel('readTime')}`;
  textContainer.append(authorSpan, pubDateEl, readTimeSpan);

  // Add items to the Hero container
  heroContainer.append(heroTitle, headImg, textContainer);

  // Tag list, if any, is added to the Hero container
  if (tags.length) {
    const tagList = createElement('ul', { classes: `${articleHero}__tags` });
    tags.forEach((tag) => {
      const tagLi = createElement('li', { classes: `${articleHero}__tag` });
      tagLi.innerText = tag.trim();
      tagList.append(tagLi);
    });

    heroContainer.append(tagList);
  }

  // Add Hero to the main container
  main.setAttribute('itemscope', '');
  main.setAttribute('itemtype', 'https://schema.org/Article');
  main.prepend(heroContainer);
};

export default async function decorate(doc) {
  await getPlaceholders();
  buildArticleHero(doc);
}
