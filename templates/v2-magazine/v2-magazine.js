import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { createElement, getTextLabel, getPlaceholders } from '../../scripts/common.js';

const templateName = 'v2-magazine';
const articleHero = `${templateName}__article-hero`;

const buildArticleHero = (doc) => {
  const main = doc.querySelector('main');
  const titleRaw = getMetadata('og:title');
  const title = titleRaw.includes('|') ? titleRaw.split('|')[0] : titleRaw;
  const author = getMetadata('author');
  const pubdate = getMetadata('publish-date');
  const readtime = getMetadata('readingtime');
  const headPic = getMetadata('og:image');
  const headAlt = getMetadata('og:image:alt');
  const topics = getMetadata('article:tag').split(',');

  // Hero container
  const heroContainer = createElement('div', { classes: `${articleHero}--container` });

  // Image
  const imgContainer = createElement('div', { classes: `${articleHero}--img-container` });
  const headImg = createOptimizedPicture(headPic, headAlt);

  // Text items container -> text, title and topics
  const textItemsContainer = createElement('div', { classes: `${articleHero}--text-items-container` });

  // Text row with author | date | read time
  const textContainer = createElement('div', { classes: `${articleHero}--text-container` });
  const authorSpan = createElement('span', { classes: `${articleHero}--author` });
  authorSpan.innerText = author;
  textContainer.append(authorSpan);
  const pubDateSpan = createElement('span', { classes: `${articleHero}--pubdate` });
  pubDateSpan.innerText = pubdate;
  textContainer.append(pubDateSpan);
  const readTimeSpan = createElement('span', { classes: `${articleHero}--readtime` });
  readTimeSpan.innerText = `${readtime} ${getTextLabel('readTime')}`;
  textContainer.append(readTimeSpan);

  // Title
  const heroTitle = createElement('h2', { classes: `${articleHero}--title` });
  heroTitle.innerText = title;
  imgContainer.append(headImg);

  // Add text items container to the hero container
  textItemsContainer.append(textContainer, heroTitle);

  // Topic list, if any, is added to the hero container
  if (topics.length) {
    const topicList = createElement('ul', { classes: `${articleHero}--topics` });
    topics.forEach((topic) => {
      const topicLi = createElement('li', { classes: `${articleHero}--topic` });
      topicLi.innerText = topic;
      topicList.append(topicLi);
    });

    textItemsContainer.append(topicList);
  }

  // Add elements to the hero container
  heroContainer.append(imgContainer, textItemsContainer);

  // Add Hero to the main container
  main.prepend(heroContainer);
};

export default async function decorate(doc) {
  await getPlaceholders();
  buildArticleHero(doc);
}
