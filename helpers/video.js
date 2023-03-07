import { showModal } from '../common/modal/modal.js';

function isVideoLink(link) {
  return link.getAttribute('href').includes('youtube.com/embed/')
    && link.closest('.block.embed') === null;
}

function addVideoShowHandler(link) {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    showModal(link.getAttribute('href'));
  });
}

function wrapImageWithVideoLink(videoLink, image) {
  videoLink.innerText = '';
  videoLink.appendChild(image);
  videoLink.classList.add('link-with-video');
  videoLink.classList.remove('button', 'primary');

  // play icon
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('video-icon-wrapper');
  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-play', 'video-icon');
  iconWrapper.appendChild(icon);
  videoLink.appendChild(iconWrapper);
}

export default {
  isVideoLink,
  addVideoShowHandler,
  wrapImageWithVideoLink,
};
