import { loadCSS } from '../../scripts/lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { createIframe, isLowResolutionVideoUrl } from '../../scripts/video-helper.js';

const styles$ = new Promise((r) => {
  loadCSS(`${window.hlx.codeBasePath}/common/modal/modal.css`, r);
});

const HIDE_MODAL_CLASS = 'modal-hidden';

const createModal = () => {
  const modalBackground = document.createElement('div');

  modalBackground.classList.add('modal-background', HIDE_MODAL_CLASS);
  modalBackground.addEventListener('click', () => {
    // eslint-disable-next-line no-use-before-define
    hideModal();
  });

  const keyDownAction = (event) => {
    if (event.key === 'Escape') {
      // eslint-disable-next-line no-use-before-define
      hideModal();
    }
  };

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalBackground.appendChild(modalContent);
  // preventing initial animation when added to DOM
  modalBackground.style = 'display: none';
  document.body.appendChild(modalBackground);

  // don't close modal when clicking on modal content
  modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  async function showModal(newUrl, beforeBanner, beforeIframe) {
    await styles$;
    modalBackground.style = '';
    window.addEventListener('keydown', keyDownAction);

    if (newUrl) {
      let videoOrIframe = null;
      if (isLowResolutionVideoUrl(newUrl)) {
        // We can't use the iframe for videos, because if the Content-Type
        // `application/octet-stream` is returned instead of `video/mp4`, the
        // file is downloaded instead of displayed. So we use the video element instead.
        videoOrIframe = document.createElement('video');
        videoOrIframe.setAttribute('src', newUrl);
        videoOrIframe.setAttribute('controls', '');
        videoOrIframe.setAttribute('autoplay', '');
        videoOrIframe.classList.add('modal-video');
        modalContent.append(videoOrIframe);
      } else {
        videoOrIframe = createIframe(newUrl, { parentEl: modalContent, classes: 'modal-video' });
      }

      if (beforeBanner) {
        const bannerWrapper = document.createElement('div');
        bannerWrapper.classList.add('modal-before-banner');
        bannerWrapper.addEventListener('click', (event) => event.stopPropagation());
        bannerWrapper.appendChild(beforeBanner);
        const closeButton = document.createElement('button');
        closeButton.classList.add('modal-close-button');
        closeButton.innerHTML = '<i class="fa fa-close"></i>';
        bannerWrapper.appendChild(closeButton);
        // eslint-disable-next-line no-use-before-define
        closeButton.addEventListener('click', () => hideModal());

        videoOrIframe.before(bannerWrapper);
      }

      if (beforeIframe) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('modal-before-iframe');
        wrapper.appendChild(beforeIframe);
        videoOrIframe.before(wrapper);
      }
    }

    modalContent.classList.add('modal-content-fade-in');
    modalBackground.classList.remove(HIDE_MODAL_CLASS);

    // disable page scrolling
    document.body.classList.add('disable-scroll');
  }

  function hideModal() {
    modalBackground.classList.add(HIDE_MODAL_CLASS);
    modalContent.classList.remove('modal-content-fade-in');
    window.removeEventListener('keydown', keyDownAction);
    document.body.classList.remove('disable-scroll');
    modalContent.querySelector('iframe, video').remove();
    modalContent.querySelector('.modal-before-banner')?.remove();
    modalContent.querySelector('.modal-before-iframe')?.remove();
  }

  return {
    showModal,
    hideModal,
  };
};

const { showModal, hideModal } = createModal();

export {
  showModal,
  hideModal,
};
