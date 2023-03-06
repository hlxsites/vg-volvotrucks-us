import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  const { disclaimer } = config;
  const disclaimerPath = disclaimer || '/news-and-stories/press-releases';
  const resp = await fetch(`${disclaimerPath}/disclaimer.plain.html`);

  if (!resp.ok) return;
  const html = await resp.text();
  const container = document.createElement('div');
  container.className = 'disclaimer-container';
  container.innerHTML = html;
  container.children[0].className = 'disclaimer-wrapper';

  block.appendChild(container);
}
