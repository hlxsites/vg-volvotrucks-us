/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

let subNavPath;

const createMetadata = (main, document) => {
  const meta = {};
  meta.Robots = 'noindex, nofollow';

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function createSubNav(main) {
  const subNav = main.querySelector('div.sub-navigation > div > ul.sub-links').cloneNode(true);
  if (subNav) {
    console.log('sub-nav found');
    const path = subNav.querySelector('li > a'); // we only need the first one
    subNavPath = `${path.href}sub-nav`;
    main.innerHTML = '';
    main.append(subNav);
  }
}

function makeSubNavPath(url, subnav) {
  const newUrl = new URL('sub-nav', url);
  newUrl.pathname = subnav;
  console.log(newUrl.toString());
  return newUrl;
}

export default {
  /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header > div.container',
      'div.refresh-header-mobile-container',
      'div.navbar',
      'footer',
      '#onetrust-pc-sdk',
      '#onetrust-consent-sdk',
      'body > img:nth-child(1)',
      'body > img:nth-child(2)',
      'body > img:nth-child(3)',
      'body > img[src="/tcpauth.ashx?"]',
      'body > img[src="/tcpauth.ashx?logout=1"]',
      'body > img[src="https://www.macktrucks.com/tcpauth.ashx?"]',
      'body > img[src="https://www.volvotrucks.us/tcpauth.ashx?"]',
      'div.modal',
    ]);

    createSubNav(main, document, url);
    // create the metadata block and append it to the main element
    createMetadata(main, document);

    return main;
  },

  /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {URL} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // eslint-disable-next-line no-param-reassign
    url = makeSubNavPath(url, subNavPath);
    return WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''));
  },
};
