import { selectVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  const links = block.querySelectorAll('a');

  const selectedLink = selectVideoLink(links);

  block.innerHTML = '';
  block.appendChild(selectedLink);
}
