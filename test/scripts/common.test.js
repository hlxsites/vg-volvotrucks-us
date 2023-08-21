/* eslint-disable no-unused-expressions */
/* global describe before it afterEach */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

/** @type {import('./types').Scripts} */
let commonScript;
/** @type {import('./types').LibFranklin} */
// eslint-disable-next-line no-unused-vars
let lib;

document.body.innerHTML = await readFile({ path: './dummy.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('createElement', () => {
  before(async () => {
    commonScript = await import('../../scripts/common.js');
    lib = await import('../../scripts/lib-franklin.js');

    document.body.innerHTML = await readFile({ path: './body.html' });
  });

  it('should create an element with specified tag name', () => {
    const elem = commonScript.createElement('span');
    expect(elem.tagName).to.equal('SPAN');
  });

  it('should add classes to the created element', () => {
    const elem = commonScript.createElement('div', { classes: ['class1', 'class2'] });
    expect(elem.classList.contains('class1')).to.be.true;
    expect(elem.classList.contains('class2')).to.be.true;
  });

  it('should not add classes if classes option is not provided', () => {
    const elem = commonScript.createElement('div');
    expect(elem.classList.length).to.equal(0);
  });

  it('should remove class attribute if classes array is empty', () => {
    const elem = commonScript.createElement('p', { classes: [] });
    expect(elem.getAttribute('class')).to.be.null;
  });

  it('should set attributes on the created element', () => {
    const elem = commonScript.createElement('a', { props: { href: 'https://example.com', target: '_blank' } });
    expect(elem.getAttribute('href')).to.equal('https://example.com');
    expect(elem.getAttribute('target')).to.equal('_blank');
  });

  it('should handle empty props object', () => {
    const elem = commonScript.createElement('span', { props: {} });
    expect(elem.hasAttributes()).to.be.false;
  });

  it('should handle boolean attribute values', () => {
    const elem = commonScript.createElement('input', { props: { checked: true } });
    expect(Boolean(elem.getAttribute('checked'))).to.be.true;
  });

  it('should handle both string and array of classes', () => {
    const elem = commonScript.createElement('div', { classes: 'class-string' });
    expect(elem.classList.contains('class-string')).to.be.true;
  });
});

describe('addFavIcon', () => {
  afterEach(() => {
    // Clear the head after each test
    document.head.innerHTML = '';
  });

  it('should add a new favicon link to the head', () => {
    const newFavIconHref = 'new-favicon.svg';
    commonScript.addFavIcon(newFavIconHref);

    const link = document.querySelector('head link[rel="icon"]');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(newFavIconHref);
  });

  it('should replace existing favicon link with a new one', () => {
    const existingFavIconHref = 'existing-favicon.ico';
    const newFavIconHref = 'new-favicon.svg';

    const existingLink = commonScript.createElement('link', {
      props: { rel: 'icon', type: 'image/x-icon', href: existingFavIconHref },
    });
    document.head.appendChild(existingLink);

    commonScript.addFavIcon(newFavIconHref);

    const link = document.querySelector('head link[rel="icon"]');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(newFavIconHref);
  });
});
