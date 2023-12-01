import {
  wrapImageWithVideoLink,
  selectVideoLink,
  isVideoLink,
  addVideoShowHandler,
} from '../../scripts/video-helper.js';
import { createElement, getTextLabel, unwrapDivs } from '../../scripts/common.js';

const blockName = 'v2-resources-gallery';

export default function decorate(block) {
  const blockHeading = block.querySelector('div:first-child');
  blockHeading.classList.add(`${blockName}__heading-wrapper`);
  const title = blockHeading.querySelector('h4');
  title?.classList.add(`${blockName}__heading`);
  unwrapDivs(blockHeading);

  const viewAllButton = createElement('button', {
    classes: [`${blockName}__button`, 'tertiary'],
    props: { 'aria-expanded': false },
  });
  viewAllButton.innerHTML = `
    <span class="icon-plus">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 3.5C12.5 3.22386 12.2761 3 12 3C11.7239 3 11.5 3.22386 11.5 3.5V11.5H3.5C3.22386 11.5 3 11.7239 3 12C3 12.2761 3.22386 12.5 3.5 12.5H11.5V20.5C11.5 20.7761 11.7239 21 12 21C12.2761 21 12.5 20.7761 12.5 20.5V12.5H20.5C20.7761 12.5 21 12.2761 21 12C21 11.7239 20.7761 11.5 20.5 11.5H12.5V3.5Z" fill="var(--text-color)"/>
      </svg>
    </span>
    <span class="icon-minus">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 11.5C3.22386 11.5 3 11.7239 3 12C3 12.2761 3.22386 12.5 3.5 12.5H20.5C20.7761 12.5 21 12.2761 21 12C21 11.7239 20.7761 11.5 20.5 11.5H3.5Z" fill="var(--text-color)"/>
      </svg>
    </span>
    <span class="${blockName}__button-text"> ${getTextLabel('view all')} </span>
  `;

  blockHeading.append(viewAllButton);

  const videoWrapper = createElement('div', { classes: `${blockName}__video-list` });
  const documentWrapper = createElement('div', { classes: `${blockName}__document-list` });
  const rows = block.querySelectorAll(':scope > div > div');

  rows.forEach((row) => {
    const picture = row.querySelector('picture');
    const document = row.querySelector('.icon-documents');

    if (picture) {
      const listEle = createElement('div', { classes: `${blockName}__video-list-item` });
      listEle.innerHTML = row.innerHTML;

      const videos = [...listEle.querySelectorAll('a')].filter((link) => isVideoLink(link));

      if (videos.length) {
        // display image as link with play icon
        const selectedLink = selectVideoLink(videos);
        if (selectedLink) {
          addVideoShowHandler(selectedLink);
          wrapImageWithVideoLink(selectedLink, picture);
          selectedLink.parentElement.classList.add(`${blockName}__video-image`, 'image');
        }

        if (videoWrapper.children.length > 5) {
          listEle.classList.add(`${blockName}__video-list-item--hide`);
          listEle.setAttribute('aria-hidden', true);
        }

        const videoTitle = listEle.querySelector('h3');
        videoTitle.classList.add(`${blockName}__video-title`);

        // remove all the videos links and exclude the selected one
        videos.forEach((link) => link !== selectedLink && link.parentElement.remove());

        videoWrapper.append(listEle);
        listEle.firstElementChild.remove();
        row.innerHTML = '';
      }
    } else if (document) {
      const item = createElement('div', { classes: `${blockName}__document-list-item` });
      item.innerHTML = row.innerHTML;
      const links = item.querySelectorAll('a');
      [...links].forEach((link) => {
        link.classList.add('standalone-link');
        link.classList.remove('primary');
        const wrapper = link.parentElement;
        wrapper.className = `${blockName}__document-link-wrapper`;
        wrapper.append(wrapper.nextElementSibling);
      });

      if (documentWrapper.children.length > 5) {
        item.classList.add(`${blockName}__document-list-item--hide`);
        item.setAttribute('aria-hidden', true);
      }

      documentWrapper.append(item);
      row.innerHTML = '';
    }
  });

  block.append(videoWrapper);
  block.append(documentWrapper);

  function toggleListEle(ariaValue) {
    [...block.querySelectorAll(`li[aria-hidden="${ariaValue}"]`)].forEach((li) => {
      li.setAttribute('aria-hidden', !ariaValue);
    });
  }

  viewAllButton.addEventListener('click', () => {
    const buttonText = viewAllButton.lastElementChild;
    if (viewAllButton.ariaExpanded === 'true') {
      viewAllButton.ariaExpanded = 'false';
      buttonText.innerText = getTextLabel('view all');
      block.classList.remove(`${blockName}__list--expand`);
      toggleListEle(false);
    } else {
      viewAllButton.ariaExpanded = 'true';
      buttonText.innerText = getTextLabel('view less');
      block.classList.add(`${blockName}__list--expand`);
      toggleListEle(true);
    }
  });

  unwrapDivs(block);
}
