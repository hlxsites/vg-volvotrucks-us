/*
 * Fragment Block
 * Include content from one Helix page in another.
 * https://www.hlx.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadBlocks,
} from '../../scripts/lib-franklin.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
async function loadFragment(path) {
  if (path) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main, main);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  let path = link ? link.getAttribute('href') : block.textContent.trim();
  const language = block.baseURI.match(/\/(en|fr)-ca\//);
  // Add the language if missing from the provided path
  if (language && !path.match(/\/(en|fr)-ca\//)) {
    path = path.replace(/\/fragments\//, `${language[0]}fragments/`);
  }
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.closest('.section').classList.add(...fragmentSection.classList);
      block.closest('.fragment-wrapper').replaceWith(...fragmentSection.childNodes);
    }
  }
}
