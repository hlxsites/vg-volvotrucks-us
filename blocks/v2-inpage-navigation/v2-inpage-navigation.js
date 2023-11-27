import { getMetadata } from '../../scripts/lib-franklin.js';
import { createElement, getTextLabel, debounce } from '../../scripts/common.js';

const blockName = 'v2-inpage-navigation';

const scrollToSection = (id) => {
  let timeout;

  const container = document.querySelector(`main .section[data-inpageid='${id}']`);
  container?.scrollIntoView({ behavior: 'smooth' });

  // Checking if the height of the main element changes while scrolling (caused by layout shift)
  const main = document.querySelector('main');
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(timeout);
    container?.scrollIntoView({ behavior: 'smooth' });

    timeout = setTimeout(() => {
      resizeObserver.disconnect();
    }, 500);
  });
  resizeObserver.observe(main);
};

const inpageNavigationButton = () => {
  // if we have a button title & button link
  if (getMetadata('inpage-button') && getMetadata('inpage-link')) {
    const title = getMetadata('inpage-button');
    const url = getMetadata('inpage-link');
    const link = createElement('a', {
      classes: ['button', 'marketing-cta', `${blockName}__cta`],
      props: {
        href: url,
        title,
      },
    });
    link.textContent = title;

    return link;
  }

  return null;
};

// Retrieve an array of sections with its corresponding intersectionRatio
const wrapSectionItems = (elements) => {
  const elementsData = [];
  const viewportHeight = window.innerHeight;
  elements.forEach((item) => {
    const elementRect = item.getBoundingClientRect();

    // Calculate the vertical space occupied by the element within the viewport
    const verticalSpace = Math.min(elementRect.bottom, viewportHeight)
      - Math.max(elementRect.top, 0);

    // Calculate the ratio of vertical space to the viewport height
    const spaceRatio = verticalSpace / viewportHeight;

    elementsData.push({
      element: item,
      intersectionRatio: Math.max(0, Math.min(1, spaceRatio)),
    });
  });

  return elementsData;
};

const gotoSection = (event) => {
  const { target } = event;
  const button = target.closest('button');

  if (button) {
    const { id } = button.dataset;

    scrollToSection(id);
  }
};

const updateActive = (id) => {
  const activeItemInList = document.querySelector(`.${blockName}__item--active`);

  // Prevent reassign active value
  if (activeItemInList?.firstElementChild?.dataset.id === id) return;

  // Remove focus position
  document.activeElement.blur();

  // check active id is equal to id don't do anything
  const selectedItem = document.querySelector(`.${blockName}__selected-item`);
  activeItemInList?.classList.remove(`${blockName}__item--active`);
  const itemsButton = document.querySelectorAll(`.${blockName}__items button`);
  const { pathname } = window.location;

  if (id) {
    const selectedButton = [...itemsButton].find((button) => button.dataset.id === id);
    if (!selectedButton) return;
    selectedItem.textContent = selectedButton.textContent;
    selectedButton.parentNode.classList.add(`${blockName}__item--active`);

    window.history.replaceState({}, '', `${pathname}#${id}`);
  } else {
    window.history.replaceState({}, '', `${pathname}`);
  }
};

const addHeaderScrollBehaviour = (header) => {
  let prevPosition = 0;

  window.addEventListener('scroll', () => {
    if (window.scrollY > prevPosition) {
      header.classList.add(`${blockName}--hidden`);
    } else {
      header.classList.remove(`${blockName}--hidden`);
    }

    // on Safari the window.scrollY can be negative so `> 0` check is needed
    prevPosition = window.scrollY > 0 ? window.scrollY : 0;
  });
};

export default async function decorate(block) {
  const ctaButton = inpageNavigationButton();

  const wrapper = block.querySelector(':scope > div');
  wrapper.classList.add(`${blockName}__wrapper`);
  const itemsWrapper = block.querySelector(':scope > div > div');

  const dropdownBackground = createElement('div', { classes: `${blockName}__dropdown-background` });
  const dropdownWrapper = createElement('div', { classes: `${blockName}__dropdown` });
  const selectedItemWrapper = createElement('div', { classes: `${blockName}__selected-item-wrapper` });
  const selectedItem = createElement('div', { classes: `${blockName}__selected-item` });

  const listContainer = createElement('div', { classes: `${blockName}__items-container` });
  const dropdownTitle = createElement('span', { classes: `${blockName}__dropdown-title` });

  const sectionTitle = createElement('span', { classes: `${blockName}__title` });
  const inpageTitle = getMetadata('inpage-title');
  sectionTitle.innerText = inpageTitle;

  const listCloseButton = createElement('button', { classes: `${blockName}__items-close` });
  const closeIcon = document.createRange().createContextualFragment(`
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L12 11.2929L19.6464 3.64645C19.8417 3.45118 20.1583 3.45118 20.3536 3.64645C20.5488 3.84171 20.5488 4.15829 20.3536 4.35355L12.7071 12L20.3536 19.6464C20.5488 19.8417 20.5488 20.1583 20.3536 20.3536C20.1583 20.5488 19.8417 20.5488 19.6464 20.3536L12 12.7071L4.35355 20.3536C4.15829 20.5488 3.84171 20.5488 3.64645 20.3536C3.45118 20.1583 3.45118 19.8417 3.64645 19.6464L11.2929 12L3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645Z" fill="currentColor"/>
  </svg>`);

  listCloseButton.appendChild(...closeIcon.children);
  listContainer.appendChild(listCloseButton);

  const submenuTitle = getTextLabel('Section');
  dropdownTitle.innerText = submenuTitle;
  listContainer.appendChild(sectionTitle);
  listContainer.appendChild(dropdownTitle);

  const list = createElement('ul', { classes: `${blockName}__items` });

  [...itemsWrapper.children].forEach((item, index) => {
    const classes = [`${blockName}__item`];
    if (index === 0) { // Default selected item
      classes.push(`${blockName}__item--active`);
      selectedItem.textContent = item.textContent;
    }
    const listItem = createElement('li', { classes });

    listItem.innerHTML = item.innerHTML;
    list.appendChild(listItem);
  });

  const dropdownArrowIcon = document.createRange().createContextualFragment(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.73502 9.46224C3.51675 9.29308 3.20268 9.33289 3.03353 9.55116C2.86437 9.76943 2.90418 10.0835 3.12245 10.2527L11.6939 16.8955C11.8742 17.0352 12.1262 17.0352 12.3064 16.8955L20.8779 10.2527C21.0961 10.0835 21.136 9.76943 20.9668 9.55116C20.7976 9.33289 20.4836 9.29308 20.2653 9.46224L12.0002 15.8677L3.73502 9.46224Z" fill="currentColor"/>
    </svg>`);

  selectedItemWrapper.append(selectedItem);
  selectedItemWrapper.appendChild(...dropdownArrowIcon.children);

  dropdownWrapper.append(selectedItemWrapper);
  listContainer.append(list);
  dropdownWrapper.appendChild(listContainer);

  wrapper.appendChild(dropdownBackground);
  wrapper.appendChild(dropdownWrapper);

  itemsWrapper.remove();

  if (ctaButton) {
    wrapper.appendChild(ctaButton);
  }

  list.addEventListener('click', gotoSection);

  // on load Go to section if defined
  const hash = window.location.hash.substring(1);
  if (hash) {
    updateActive(hash);

    setTimeout(() => {
      scrollToSection(hash);
    }, 1000);
  }

  // Listener to toggle the dropdown (open / close)
  document.addEventListener('click', (e) => {
    // click on selected item we show the menu
    if (e.target.closest(`.${blockName}__selected-item-wrapper`)) {
      dropdownWrapper.classList.add(`${blockName}__dropdown--open`);
      block.parentNode.classList.add(`${blockName}--open`);
      document.body.classList.add('disable-body-scroll');
    } else if (e.target.closest(`.${blockName}__dropdown-background`) || (e.target.closest(`.${blockName}__items-container`)
        && (e.target.closest(`.${blockName}__items-close`) || e.target.closest(`.${blockName}__item`)))) {
      // Hide menu:
      // - Click on black background
      // - Click on close button OR menu item
      // - Click outside the menu
      dropdownWrapper.classList.remove(`${blockName}__dropdown--open`);
      block.parentNode.classList.remove(`${blockName}--open`);
      document.body.classList.remove('disable-body-scroll');
    }
  });

  const sectionsList = document.querySelectorAll('main .section');
  // listen scroll to change the url + navigation item
  window.addEventListener('scroll', debounce(() => {
    // Calculate intersectionRatio from all section items
    const elementsData = wrapSectionItems(sectionsList);

    // Get intersected item that occupies most of the space in the viewport
    const intersectedItem = elementsData.reduce((prev, current) => (
      prev.intersectionRatio > current.intersectionRatio ? prev : current
    ));

    if (intersectedItem.element.dataset?.inpageid) {
      updateActive(intersectedItem.element.dataset.inpageid);
    } else {
      updateActive();
    }
  }));

  addHeaderScrollBehaviour(block.parentNode);
}
