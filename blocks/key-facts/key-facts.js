import {
  createElement, isVideoLink, loadAsBlock, variantsClassesToBEM,
} from '../../scripts/scripts.js';

function stripEmptyTags(main, child) {
  if (child !== main && child.innerHTML.trim() === '') {
    const parent = child.parentNode;
    child.remove();
    stripEmptyTags(main, parent);
  }
}

const blockName = 'key-facts';
const variantClasses = ['trailing-line'];

const keyFactsColumns = (el, v2) => {
  el.classList.add(`${blockName}__key-item`);

  // adding icon
  const icon = el.querySelector('i, .icon');

  if (icon) {
    el.prepend(icon);
    icon.classList.add(`${blockName}__icon`);
  }

  // clearing empty paragraphs
  const paragraphs = el.querySelectorAll('p');
  paragraphs.forEach((paragraph) => {
    stripEmptyTags(el, paragraph);
  });

  const preSubheading = el.querySelector(':scope > :not(strong, i):first-child');
  preSubheading?.classList.add('sub-2');

  // find and split number/unit
  const value = el.querySelector('strong:only-child');
  // separate number and unit. e.g. up | +31% | Freight efficiency, or 120,000 | psi,
  const [, prenumber, number, postnumber, text] = value.innerHTML.match('([\\+,\\-]*)([0-9,\\.,]+)([\\%]*) *(.*)');
  let newValue = null;

  if (value) {
    if (v2) {
      newValue = `<span class="${blockName}__number">${prenumber}${number}${postnumber} ${text}</span>`;
    } else {
      newValue = `
        <span class="${blockName}__number">
          <span class="${blockName}__number--small">${prenumber}</span>
          ${number}
          <span class="${blockName}__number--small">${postnumber}</span>
        </span>
      `;
    }

    const numberFragment = document.createRange().createContextualFragment(newValue);
    value.innerHTML = '';
    value.append(...numberFragment.childNodes);
    value.classList.add(`${blockName}__number-wrapper`, 'h2');

    if (!v2 && text) {
      const unit = createElement('strong', [`${blockName}__unit`, 'sub-2']);
      unit.innerText = text;
      value.parentNode.append(unit);
    }
  }

  const div = createElement('div', `${blockName}__trailing-line`);
  el.append(div);
};

export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  Array.from(block.children).forEach((row) => {
    row.classList.add(`${blockName}__row`);

    Array.from(row.children).forEach(async (col) => {
      const videoLinks = [...col.querySelectorAll('a')].filter(isVideoLink);
      const isVideoCell = videoLinks.length;
      const isImageCell = !!col.querySelector('picture');

      if (isVideoCell) {
        block.classList.add(`${blockName}--with-media`);
        row.classList.add(`${blockName}__row--with-media`);

        const embedBlock = await loadAsBlock('embed', col.outerHTML, { variantsClasses: ['no-banner'] });
        col.replaceWith(embedBlock);

        return;
      }

      if (isImageCell) {
        block.classList.add(`${blockName}--with-media`);
        row.classList.add(`${blockName}__row--with-media`);
        col.classList.add(`${blockName}__image-cell`);

        return;
      }

      const v2 = block.classList.contains(`${blockName}--with-media`);
      keyFactsColumns(col, v2);
    });
  });
}
