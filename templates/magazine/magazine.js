import {
  getMetadata,
  decorateIcons,
  createOptimizedPicture,
} from '../../scripts/lib-franklin.js';
import { createElement } from '../../scripts/scripts.js';

async function buildArticleHero(container) {
  const title = getMetadata('og:title');
  const author = getMetadata('author');
  const pubdate = getMetadata('publish-date');
  const readtime = getMetadata('readingtime');
  const headPic = getMetadata('og:image');
  const headAlt = getMetadata('og:image:alt');

  const row = createElement('div', ['row', 'size-img']);
  const headImg = createOptimizedPicture(headPic, headAlt);
  const content = createElement('div', 'content');
  const topDetails = createElement('div', ['top-details', 'hide-desktop']);
  content.append(topDetails);
  const calendarIcon = createElement('span', ['icon', 'icon-fa-calendar']);
  topDetails.append(calendarIcon);
  const pubDateSpan = createElement('span', 'date');
  pubDateSpan.innerHTML = pubdate;
  topDetails.append(pubDateSpan);

  const timeIcon = createElement('span', ['icon', 'icon-fa-clock-o']);
  topDetails.append(timeIcon);
  const timeSpan = createElement('span', 'time');
  timeSpan.innerHTML = readtime;
  topDetails.append(timeSpan);

  const titleH3 = createElement('h3', 'title-sentence');
  titleH3.innerHTML = title;
  content.append(titleH3);
  const details = createElement('div', 'details');
  content.append(details);

  const userIcon = createElement('span', ['icon', 'icon-fa-user']);
  details.append(userIcon);
  const authorSpan = createElement('span', 'author');
  authorSpan.innerHTML = author;
  details.append(authorSpan);

  const calendarIconClone = calendarIcon.cloneNode();
  calendarIconClone.classList.add('hide-mobile');
  details.append(calendarIconClone);
  const pubDateSpanClone = pubDateSpan.cloneNode(true);
  pubDateSpanClone.classList.add('hide-mobile');
  details.append(pubDateSpanClone);
  const timeIconClone = timeIcon.cloneNode();
  timeIconClone.classList.add('hide-mobile');
  details.append(timeIconClone);
  const timeSpanClone = timeSpan.cloneNode(true);
  timeSpanClone.classList.add('hide-mobile');
  details.append(timeSpanClone);

  // row
  row.append(headImg);
  row.append(content);
  const section = createElement('div', ['section', 'template', 'article-hero']);
  section.insertAdjacentElement('afterbegin', row);
  container.insertAdjacentElement('afterbegin', section);
}

export default async function decorate(doc) {
  const container = doc.querySelector('main');
  buildArticleHero(container);

  const classes = ['section', 'template', 'article-sidebar', 'loading'];
  const sidebarSection = createElement('div', classes, {'id':'sidebar'});
  // topics
  const topicsSidebar = createElement('div', 'topics');
  sidebarSection.append(topicsSidebar);
  const topicsHeading = createElement('p');
  topicsHeading.innerHTML = 'Topics in this article';
  topicsSidebar.append(topicsHeading);
  const topics = getMetadata('article:tag').split(',');
  const topicsList = createElement('ul', 'topic-list');
  topics.forEach((topic) => {
    const topicItem = createElement('li');
    topicItem.innerHTML = topic;
    topicsList.appendChild(topicItem);
  });
  topicsSidebar.append(topicsList);

  // share
  const shareItems = [
    ['envelope', 'Share via email', 'mailto:?body='],
    ['twitter', 'Share on Twitter', 'https://twitter.com/intent/tweet?url='],
    ['linkedin', 'Share on LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url='],
    ['facebook', 'Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u='],
  ];
  const shareSidebar = createElement('div', 'share');
  const shareHeading = createElement('p');
  shareHeading.innerHTML = 'Share this article';
  shareSidebar.append(shareHeading);
  const shareList = createElement('div', 'share-icons');
  shareItems.forEach((share) => {
    const icon = createElement('span', ['icon', `icon-fa-${share[0]}`]);
    const shareItem = createElement('button', share[0], { title: share[1], type: 'button' });
    shareItem.addEventListener('click', () => {
      window.open(`${share[2]}${window.location.href}`, '_blank');
    });
    shareItem.append(icon);
    shareList.append(shareItem);
  });
  shareSidebar.append(shareList);
  sidebarSection.append(shareSidebar);

  // subscribe
  const subscribeSidebar = createElement('div', 'subscribe');
  const button = createElement('a', 'cta');
  button.href = '#subscribe';
  button.innerText = 'Subscribe';
  const arrowIcon = createElement('span', ['icon', 'icon-fa-angle-right']);
  button.append(arrowIcon);
  subscribeSidebar.append(button);
  sidebarSection.append(subscribeSidebar);

  let sidebarPreviousSection;
  let sectionFound = false;
  const sections = [...doc.querySelectorAll('.section')];
  while (!sectionFound && sections.length > 0) {
    const section = sections.pop();
    if (!sidebarPreviousSection) {
      sidebarPreviousSection = section;
    } else if (section.classList.contains('related-articles-container')) {
      sidebarPreviousSection = section;
    } else {
      sectionFound = true;
    }
  }
  sidebarPreviousSection.insertAdjacentElement('beforebegin', sidebarSection);
  decorateIcons(doc);
  // show hidden sidebar once loaded to improve CLS
  window.onload = doc.querySelector('#sidebar').classList.remove('loading');
}
