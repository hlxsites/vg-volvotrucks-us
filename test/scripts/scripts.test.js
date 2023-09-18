/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

/** @type {import('./types').Scripts} */
// eslint-disable-next-line no-unused-vars
let scripts;
/** @type {import('./types').LibFranklin} */
let lib;

document.body.innerHTML = await readFile({ path: './dummy.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('Core Helix features', () => {
  before(async () => {
    scripts = await import('../../scripts/scripts.js');
    lib = await import('../../scripts/lib-franklin.js');

    document.body.innerHTML = await readFile({ path: './body.html' });
  });

  it('Initializes window.hlx', async () => {
    // simulate code base path and turn on lighthouse
    document.head.appendChild(document.createElement('script')).src = '/foo/scripts/scripts.js';
    window.history.pushState({}, '', `${window.location.href}&lighthouse=on`);
    lib.setup();

    expect(window.hlx.codeBasePath).to.equal('/foo');
    expect(window.hlx.lighthouse).to.equal(true);

    // test error handling
    const url = sinon.stub(window, 'URL');

    // cleanup
    url.restore();
    window.hlx.codeBasePath = '';
    window.hlx.lighthouse = false;
    Array.from(document.querySelectorAll('script')).pop().remove();
  });
});

describe('checkOneTruckGroup', () => {
  it('should return true when the group is present with value 1', () => {
    // Simulate a cookie with the group 'group1' set to 1
    document.cookie = 'OptanonConsent=group1:1;';

    const result = scripts.checkOneTruckGroup('group1');
    expect(result).to.be.true;
  });

  it('should return false when the group is present with a value other than 1', () => {
    // Simulate a cookie with the group 'group2' set to 0 (or any value other than 1)
    document.cookie = 'OptanonConsent=group2:0;';

    const result = scripts.checkOneTruckGroup('group2');
    expect(result).to.be.false;
  });

  it('should return false when the group is not present in the cookie', () => {
    // Simulate an empty cookie
    document.cookie = '';

    const result = scripts.checkOneTruckGroup('group3');
    expect(result).to.be.false;
  });

  it('should handle URL encoding of the group name', () => {
    // Simulate a cookie with a URL-encoded group name
    document.cookie = 'OptanonConsent=group%204:1;';

    const result = scripts.checkOneTruckGroup('group 4');
    expect(result).to.be.true;
  });
});
