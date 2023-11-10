import { removeEmptyTags, unwrapDivs } from '../../scripts/common.js';

export default function decorate(block) {
  const blockName = 'v2-quote';
  const blockquotes = [...block.querySelectorAll('blockquote')];
  const pSiblingsOfBlockquote = block.querySelectorAll('blockquote + p');

  unwrapDivs(block);

  blockquotes.forEach((bq) => {
    const em = bq.querySelector('em');

    // remove em tags
    if (em) {
      em.outerHTML = em.innerHTML;
    }

    bq.classList.add(`${blockName}__quote-text`);
  });

  pSiblingsOfBlockquote.forEach((p) => {
    p.classList.add(`${blockName}__quote-source`);
  });

  removeEmptyTags(block);
}
