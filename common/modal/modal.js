import { loadCSS } from '../../scripts/lib-franklin.js';

loadCSS('/common/modal/modal.css');

const HIDE_MODAL_CLASS = 'modal-hidden';

const createVideoIframe = (parent, url) => {
  // iframe must be recreated every time otherwise the new history record would be created
  const iframe = document.createElement('iframe');

  iframe.classList.add('modal-video');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', 'allowfullscreen');
  iframe.setAttribute('src', url);

  parent.appendChild(iframe);

  return iframe;
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
  modalBackground.appendChild(modalContent);
  document.body.appendChild(modalBackground);

  function showModal(newUrl, beforeBanner) {
    window.addEventListener('keydown', keyDownAction);

    if (newUrl) {
      const iframe = createVideoIframe(modalContent, newUrl);

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

        iframe.parentElement.insertBefore(bannerWrapper, iframe);
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
    modalContent.querySelector('iframe').remove();
    modalContent.querySelector('.modal-before-banner')?.remove();
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
