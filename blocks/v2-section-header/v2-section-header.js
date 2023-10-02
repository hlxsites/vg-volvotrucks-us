import { adjustPretitle, unwrapDivs } from '../../scripts/common.js';

export default function decorate(block) {
  const blockName = 'v2-section-header';
  const content = block.querySelector(':scope > div > div');
  adjustPretitle(content);

  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
  [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

  const buttons = content.querySelectorAll('.button-container > a');
  [...buttons].forEach((button) => {
    button.classList.remove('primary');
    button.classList.add('tertiary');
  });

  // Unwrap <div> tags
  unwrapDivs(block);
}
