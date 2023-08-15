/* eslint-env jest */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

/** @type {import('./types').Scripts} */
let videoHelper;
/** @type {import('./types').LibFranklin} */
let commonScript;

document.body.innerHTML = await readFile({ path: './dummy.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('isLowResolutionVideoUrl', () => {
  before(async () => {
    videoHelper = await import('../../scripts/video-helper.js');
    commonScript = await import('../../scripts/common.js');

    document.body.innerHTML = await readFile({ path: './body.html' });
  });

  it('should return false for empty URLs', () => {
    const result = videoHelper.isLowResolutionVideoUrl('');
    expect(result).to.be.false;
  });

  it('should return true for low resolution video URLs', () => {
    const result = videoHelper.isLowResolutionVideoUrl('https://example.com/video_low.mp4?param=value');
    expect(result).to.be.true;
  });

  it('should return false for non-MP4 URLs', () => {
    const result = videoHelper.isLowResolutionVideoUrl('https://example.com/video.mov');
    expect(result).to.be.false;
  });
});

describe('isVideoLink', () => {
  let link;

  before(() => {
    link = commonScript.createElement('a', { props: { href: '' } });
  });

  it('should return false for null link', () => {
    const result = videoHelper.isVideoLink(link);
    expect(result).to.be.false;
  });

  it('should return true for YouTube embed link', () => {
    link.setAttribute('href', 'https://www.youtube.com/embed/videoID');
    const result = videoHelper.isVideoLink(link);
    expect(result).to.be.true;
  });

  it('should return true for low resolution video link', () => {
    link.setAttribute('href', 'https://example.com/video_low.mp4?param=value');
    const result = videoHelper.isVideoLink(link);
    expect(result).to.be.true;
  });

  it('should return false for non-video link', () => {
    link.setAttribute('href', 'https://example.com/page.html');

    const result = videoHelper.isVideoLink(link);
    expect(result).to.be.false;
  });

  it('should return false for video link within .block.embed', () => {
    link.setAttribute('href', 'https://example.com/video.mp4');
    const block = commonScript.createElement('div', { classes: ['block', 'embed'] });
    block.appendChild(link);

    const result = videoHelper.isVideoLink(link);
    expect(result).to.be.false;
  });
});
