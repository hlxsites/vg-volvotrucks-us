import { createElement, removeEmptyTags } from '../../scripts/scripts.js';

const blockname = 'v2-feature-carousel';

export default function decorate(block) {
  const cardsWraper = block.firstElementChild;
  cardsWraper.classList.add(`${blockname}__cards-list`);
  cardsWraper.append(...cardsWraper.firstElementChild.children);

  [...cardsWraper.querySelectorAll('p')].forEach((el) => {
    el.classList.add(`${blockname}__card`);
    const text = el.lastChild;
    const textwrapper = createElement('span', `${blockname}__text`);
    textwrapper.textContent = text.textContent;
    el.append(textwrapper);
    text.remove();
  });

  removeEmptyTags(block);
}
