import { loadCSS } from '../../scripts/lib-franklin.js';

loadCSS('/common/modal/modal.css');

const HIDE_MODAL_CLASS = 'modal-hidden';

const createVideoIframe = (parent) => {
  const iframe = document.createElement('iframe');

  iframe.classList.add('modal-video');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', 'allowfullscreen');

  parent.appendChild(iframe);

  const changeIframUrl = (newUrl) => {
    iframe.setAttribute('src', newUrl);
  };

  return changeIframUrl;
};

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

  const updateVideo = createVideoIframe(modalContent);

  modalBackground.appendChild(modalContent);
  document.body.appendChild(modalBackground);

  function showModal(newUrl) {
    window.addEventListener('keydown', keyDownAction);

    if (newUrl) {
      updateVideo(newUrl);
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
