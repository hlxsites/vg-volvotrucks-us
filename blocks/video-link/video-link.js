import { selectVideoLink } from '../../scripts/scripts.js';

export default function decorate(block) {
  const links = block.querySelectorAll('a');
  const selectedLink = selectVideoLink(links);
  const icon = document.createElement('i');

  icon.classList.add('fa', 'fa-play-circle-o');
  selectedLink.prepend(icon);
  block.innerHTML = '';
  block.appendChild(selectedLink);
}
