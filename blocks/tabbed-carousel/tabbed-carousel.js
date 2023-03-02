function stripEmptyTags(main, child) {
  if (child !== main && child.innerHTML.trim() === '') {
    const parent = child.parentNode;
    child.remove();
    stripEmptyTags(main, parent);
  }
}

function buildTabNavigation(tabItems, clickHandler) {
  const tabNavigation = document.createElement('ul');
  [...tabItems].forEach((tabItem, i) => {
    const listItem = document.createElement('li');
    if (!i) listItem.classList.add('active');
    const button = document.createElement('button');
    button.addEventListener('click', () => clickHandler.call(this, tabNavigation, tabItem, listItem));
    const tabContent = tabItem.querySelector(':scope > div');
    button.innerHTML = tabContent.dataset.carousel;
    listItem.append(button);
    tabNavigation.append(listItem);
  });
  tabNavigation.className = 'tab-navigation';
  return tabNavigation;
}

export default function decorate(block) {
  const tabContainer = block.querySelector(':scope > div');
  tabContainer.classList.add('tab-container');
  const tabItems = block.querySelectorAll(':scope > div > div');
  const tabNavigation = buildTabNavigation(tabItems, (nav, tabItem, listItem) => {
    tabContainer.scrollTo({
      top: 0,
      left: tabItem.offsetLeft - tabItem.parentNode.offsetLeft,
      behavior: 'smooth',
    });
    [...nav.children].forEach((r) => r.classList.remove('active'));
    listItem.classList.add('active');
  });
  tabItems.forEach((tabItem) => {
    tabItem.classList.add('tab-item');
    const tabContent = tabItem.querySelector(':scope > div');
    const picture = tabItem.querySelector('picture');
    tabContent.prepend(picture);
    tabContent.querySelectorAll('p, div').forEach((item) => {
      stripEmptyTags(tabContent, item);
    });
  });
  block.parentElement.prepend(tabNavigation);

  // update the button indicator on scroll
  tabContainer.addEventListener('scroll', () => {
    const activeIndex = Math.floor(tabContainer.scrollLeft / tabContainer.clientWidth);
    const actiiveButton = tabNavigation.children[activeIndex];
    if (!actiiveButton.classList.contains('active')) {
      // make active
      tabNavigation.querySelector('li.active').classList.remove('active');
      actiiveButton.classList.add('active');
    }
  });
}
