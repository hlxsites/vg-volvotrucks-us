/* eslint-env jest */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

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


describe('selectVideoLink', () => {
  // Sample links for testing
  let youtubeLink, mp4Link, otherLink;

  before(() => {
    youtubeLink = commonScript.createElement('a', { props: { href: 'https://www.youtube.com/embed/example-video' } });
    mp4Link = commonScript.createElement('a', { props: { href: 'https://example.com/example-video.mp4' } });
    otherLink = commonScript.createElement('a', { props: { href: 'https://example.com/other-link' } });
    document.cookie = 'OptanonConsent=C0005:1';
  });

  it('should return YouTube link when preferredType is not "local" and YouTube link is available', () => {
    const links = [youtubeLink, mp4Link];
    const result = videoHelper.selectVideoLink(links, 'external');
    expect(result).to.equal(youtubeLink);
  });

  it('should return local media link when preferredType is "local" and local media link is available', () => {
    const links = [youtubeLink, mp4Link];
    const result = videoHelper.selectVideoLink(links, 'local');
    expect(result).to.equal(mp4Link);
  });

  it('should return undefined when preferredType is "local" but no local media link is available', () => {
    const links = [youtubeLink, otherLink];
    const result = videoHelper.selectVideoLink(links, 'local');
    expect(result).to.be.undefined;
  });

  it('should return local media link when preferredType is not "local" and YouTube link is not available', () => {
    const links = [mp4Link, otherLink];
    const result = videoHelper.selectVideoLink(links, 'external');
    expect(result).to.equal(mp4Link);
  });

  it('should return undefined when no links are available', () => {
    const links = [];
    const result = videoHelper.selectVideoLink(links, 'external');
    expect(result).to.be.undefined;
  });
});

describe('addVideoShowHandler', () => {
  let linkElement;

  before(() => {
    linkElement = commonScript.createElement('div', { classes: 'test-link' });
    linkElement.addEventListener = sinon.spy();
  });


  beforeEach(() => {
    sinon.resetHistory(); // Reset spies and fakes before each test
  });

  it('should add "text-link-with-video" class to the link', () => {
    videoHelper.addVideoShowHandler(linkElement);
    expect(linkElement.classList.contains('text-link-with-video')).to.be.true;
  });

  it('should add a click event listener to the link', () => {
    videoHelper.addVideoShowHandler(linkElement);
    expect(linkElement.addEventListener.calledOnce).to.be.true;
    expect(linkElement.addEventListener.getCall(0).args[0]).to.equal('click');
  });
});

describe('isSoundcloudLink', () => {
  it('should return true for a valid SoundCloud link', () => {
    const linkElement = commonScript.createElement('a', { props: { href: 'https://soundcloud.com/player/track' }});
    document.body.appendChild(linkElement);

    const result = videoHelper.isSoundcloudLink(linkElement);
    expect(result).to.be.true;
  });

  it('should return false if the link is inside a block with class "embed"', () => {
    const linkElement = commonScript.createElement('a', { props: { href: 'https://soundcloud.com/player/track' }});    
    const embedBlock = commonScript.createElement('div', { classes: ['block', 'embed'] });
    embedBlock.appendChild(linkElement);
    
    document.body.appendChild(embedBlock);

    const result = videoHelper.isSoundcloudLink(linkElement);
    expect(result).to.be.false;
  });

  it('should return false for an invalid SoundCloud link', () => {
    const linkElement = commonScript.createElement('a', { props: { href: 'https://example.com' }});
    document.body.appendChild(linkElement);

    const result = videoHelper.isSoundcloudLink(linkElement);
    expect(result).to.be.false;
  });
});

describe('wrapImageWithVideoLink', () => {

  let videoLink, image;

  before(() => {
    videoLink = document.createElement('a');
    image = document.createElement('img');
  });

  it('should set video link inner text to empty', () => {
    videoHelper.wrapImageWithVideoLink(videoLink, image);

    expect(videoLink.innerText).to.equal('');
    expect(videoLink.childNodes[0]).to.equal(image);
  });

  it('should add the "link-with-video" class to the video link', () => {
    videoHelper.wrapImageWithVideoLink(videoLink, image);

    expect(videoLink.classList.contains('link-with-video')).to.be.true;
  });

  it('should remove certain classes from the video link', () => {
    videoLink.classList.add('button', 'primary', 'text-link-with-video');
    videoHelper.wrapImageWithVideoLink(videoLink, image);

    expect(videoLink.classList.contains('button')).to.be.false;
    expect(videoLink.classList.contains('primary')).to.be.false;
    expect(videoLink.classList.contains('text-link-with-video')).to.be.false;
  });
});