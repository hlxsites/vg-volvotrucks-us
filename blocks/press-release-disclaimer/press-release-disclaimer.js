import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  const disclaimerPath = config.disclaimer || '/news-and-stories/press-releases';

  fetch(`${disclaimerPath}/disclaimer.plain.html`)
    .then((resp) => resp.text())
    .then((html) => {
      const container = document.createElement('div');
      container.className = 'disclaimer-container';
      container.innerHTML = html;
      container.children[0].className = 'disclaimer-wrapper';

      block.textContent = '';
      block.appendChild(container);
    });
}
