import { createElement, removeEmptyTags } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardsWraper = block.firstElementChild;
  cardsWraper.classList.add('v2-feature-carousel__cards-list');
  cardsWraper.append(...cardsWraper.firstElementChild.children);

  [...cardsWraper.querySelectorAll('p')].forEach((el) => {
    el.classList.add('v2-feature-carousel__card');
    const text = el.lastChild;
    const textwrapper = createElement('span', 'v2-feature-carousel__text');
    textwrapper.textContent = text.textContent;
    el.append(textwrapper);
    text.remove();
  });

  removeEmptyTags(block);
}
