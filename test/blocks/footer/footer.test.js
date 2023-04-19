/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: '../../scripts/dummy.html' });

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const footerBlock = buildBlock('footer', [['Footer', '/test/blocks/footer/footer']]);
document.querySelector('footer').append(footerBlock);
decorateBlock(footerBlock);
await loadBlock(footerBlock);
await sleep();

describe('Footer block', () => {
  it('Displays footer content', async () => {
    const a = document.querySelector('footer a');
    expect(a).to.exist;
    expect(a.href).to.equal('http://localhost:2000/about-volvo/our-story/');

    expect(document.querySelector('footer .link-column').children[0].outerHTML)
      .to.equal('<h3 id="about-volvo"><strong>About Volvo</strong></h3>');
    expect(document.querySelector('footer .link-column').children[1].outerHTML).to.equal(
      `<ul class="link-column-content">
          <li><a href="/about-volvo/our-story/">About</a></li>
        </ul>`,
    );
  });
});
