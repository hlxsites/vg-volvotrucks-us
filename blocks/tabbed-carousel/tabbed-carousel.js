function stripEmptyTags(main, child) {
  if (child !== main && child.innerHTML.trim() === '') {
    const parent = child.parentNode;
    child.remove();
    stripEmptyTags(main, parent);
  }
}

export default function decorate(block) {
  const buttons = document.createElement('ul');
  const tabContainer = block.querySelector(':scope > div');
  tabContainer.classList.add('tab-container');
  const tabItems = block.querySelectorAll(':scope > div > div');
  tabItems.forEach((tabItem, i) => {
    tabItem.classList.add('tab-item');
    const tabContent = tabItem.querySelector(':scope > div');
    const picture = tabItem.querySelector('picture');
    tabContent.prepend(picture);
    tabContent.querySelectorAll('p, div').forEach((item) => {
      stripEmptyTags(tabContent, item);
    });
    const listItem = document.createElement('li');
    if (!i) listItem.classList.add('active');
    const button = document.createElement('button');
    button.innerHTML = tabContent.dataset.carousel;
    listItem.append(button);
    button.addEventListener('click', () => {
      tabContainer.scrollTo({
        top: 0,
        left: tabItem.offsetLeft - tabItem.parentNode.offsetLeft,
        behavior: 'smooth',
      });
      [...buttons.children].forEach((r) => r.classList.remove('active'));
      listItem.classList.add('active');
    });
    buttons.append(listItem);
  });
  buttons.className = 'carousel-buttons';
  block.parentElement.prepend(buttons);

  // update the button indicator on scroll
  tabContainer.addEventListener('scroll', () => {
    const activeIndex = Math.floor(tabContainer.scrollLeft / tabContainer.clientWidth);
    const actiiveButton = buttons.children[activeIndex];
    if (!actiiveButton.classList.contains('active')) {
      // make active
      buttons.querySelector('li.active').classList.remove('active');
      actiiveButton.classList.add('active');
    }
  });
}
