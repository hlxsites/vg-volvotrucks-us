import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import {
  createElement,
  getTextLabel,
  getPlaceholders,
  extractObjectFromArray,
  MAGAZINE_CONFIGS,
} from '../../scripts/common.js';

const templateName = 'v2-magazine';
const articleHero = `${templateName}__article-hero`;

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
  const heroContainer = createElement('div', { classes: `${articleHero}--container` });

  // Image
  const imgContainer = createElement('div', { classes: `${articleHero}--img-container` });
  const headImg = createOptimizedPicture(headPic, headAlt);

  // Text items container -> text, title and tags
  const textItemsContainer = createElement('div', { classes: `${articleHero}--text-items-container` });

  // Text row with author | date | read time
  const textContainer = createElement('div', { classes: `${articleHero}--text-container` });
  const authorSpan = createElement('span', {
    classes: `${articleHero}--author`,
    props: { itemprop: 'author' },
  });
  const pubDateEl = createElement('date', {
    classes: `${articleHero}--pubdate`,
    props: {
      datetime: new Date(pubDate).toISOString(),
      itemprop: 'datePublished',
    },
  });
  const readTimeSpan = createElement('span', { classes: `${articleHero}--readtime` });
  authorSpan.innerText = author;
  pubDate = new Intl.DateTimeFormat(locale, formatDateOptions).format(new Date(pubDate));
  pubDateEl.innerText = pubDate;
  readTimeSpan.innerText = `${readTime} ${getTextLabel('readTime')}`;
  textContainer.append(authorSpan, pubDateEl, readTimeSpan);

  // Title
  const heroTitle = createElement('h2', { classes: `${articleHero}--title` });
  heroTitle.innerText = title;
  imgContainer.append(headImg);

  // Add text items to the textItems container
  textItemsContainer.append(textContainer, heroTitle);

  // Tag list, if any, is added to the textItems container
  if (tags.length) {
    const tagList = createElement('ul', { classes: `${articleHero}--tags` });
    tags.forEach((tag) => {
      const tagLi = createElement('li', { classes: `${articleHero}--tag` });
      tagLi.innerText = tag.trim();
      tagList.append(tagLi);
    });

    textItemsContainer.append(tagList);
  }

  // Add elements to the hero container
  heroContainer.append(imgContainer, textItemsContainer);

  // Add Hero to the main container
  main.setAttribute('itemscope', '');
  main.setAttribute('itemtype', 'https://schema.org/Article');
  main.prepend(heroContainer);
};

export default async function decorate(doc) {
  await getPlaceholders();
  buildArticleHero(doc);
}
