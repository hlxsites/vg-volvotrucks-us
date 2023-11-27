import { createElement, getTextLabel } from '../../scripts/common.js';
import { loadCSS } from '../../scripts/lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { createIframe, isLowResolutionVideoUrl } from '../../scripts/video-helper.js';

const styles$ = new Promise((r) => {
  loadCSS(`${window.hlx.codeBasePath}/common/modal/modal.css`, r);
});

const HIDE_MODAL_CLASS = 'modal-hidden';
let currentModalClasses = null;
let currentInvokeContext = null;

const createModalTopBar = (parentEl) => {
  const topBar = document.createRange().createContextualFragment(`
    <div class="modal-top-bar">
      <div class="modal-top-bar-content">
        <h2 class="modal-top-bar-heading" id="modal-heading"></h2>
        <button class="modal-close-button" aria-label=${getTextLabel('close')}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.97979 4.97979C5.17505 4.78453 5.49163 4.78453 5.6869 4.97979L16 15.2929L26.3131 4.97979C26.5084 4.78453 26.825 4.78453 27.0202 4.97979C27.2155 5.17505 27.2155 5.49163 27.0202 5.6869L16.7071 16L27.0202 26.3131C27.2155 26.5084 27.2155 26.825 27.0202 27.0202C26.825 27.2155 26.5084 27.2155 26.3131 27.0202L16 16.7071L5.6869 27.0202C5.49163 27.2155 5.17505 27.2155 4.97979 27.0202C4.78453 26.825 4.78453 26.5084 4.97979 26.3131L15.2929 16L4.97979 5.6869C4.78453 5.49163 4.78453 5.17505 4.97979 4.97979Z" fill="var(--color-icon, #000)"/>
          </svg>
        </button>
      </div>
    </div>
  `);

  parentEl.prepend(...topBar.children);
  // eslint-disable-next-line no-use-before-define
  parentEl.querySelector('.modal-close-button').addEventListener('click', () => hideModal());
  parentEl.querySelector('.modal-top-bar').addEventListener('click', (event) => event.stopPropagation());
};

const createModal = () => {
  const modalBackground = createElement('div', { classes: ['modal-background', HIDE_MODAL_CLASS] });
  modalBackground.setAttribute('role', 'dialog');

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

  const modalContent = createElement('div', { classes: ['modal-content'] });
  createModalTopBar(modalBackground);
  modalBackground.appendChild(modalContent);
  // preventing initial animation when added to DOM
  modalBackground.style = 'display: none';
  document.body.appendChild(modalBackground);

  // don't close modal when clicking on modal content
  modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  const clearModalContent = () => {
    modalContent.innerHTML = '';
    modalContent.className = 'modal-content';
    modalBackground.querySelector('.modal-top-bar-heading').textContent = '';
  };

  const handleNewContent = (newContent) => {
    clearModalContent();

    const firstSection = newContent[0];

    // checking if the first section contains one heading only
    if (
      firstSection.children.length === 1
      && firstSection.children[0].children.length === 1
      && /^H[1-6]$/.test(newContent[0].children[0].children[0].tagName)
    ) {
      const headingContent = firstSection.children[0].children[0].textContent;

      modalBackground.querySelector('.modal-top-bar-heading').textContent = headingContent;
      firstSection.style.display = 'none';
      modalBackground.setAttribute('aria-labelledby', 'modal-heading');
    } else {
      modalBackground.removeAttribute('aria-labelledby');
    }

    modalContent.classList.add('modal-content--wide');
    modalContent.append(...newContent);
  };

  async function showModal(newContent, {
    beforeBanner, beforeIframe, modalClasses = [], invokeContext,
  }) {
    currentInvokeContext = invokeContext;
    // disabling focus for header, footer and main elements when modal is open
    document.querySelectorAll('header, footer, main').forEach((el) => {
      el.setAttribute('inert', 'inert');
    });
    await styles$;
    modalBackground.style = '';
    modalBackground.classList.add(...modalClasses);
    currentModalClasses = modalClasses;
    window.addEventListener('keydown', keyDownAction);

    if (newContent && (typeof newContent !== 'string')) {
      handleNewContent(newContent);
    } else if (newContent) {
      let videoOrIframe = null;
      if (isLowResolutionVideoUrl(newContent)) {
        // We can't use the iframe for videos, because if the Content-Type
        // `application/octet-stream` is returned instead of `video/mp4`, the
        // file is downloaded instead of displayed. So we use the video element instead.
        videoOrIframe = document.createElement('video');
        videoOrIframe.setAttribute('src', newContent);
        videoOrIframe.setAttribute('controls', '');
        videoOrIframe.setAttribute('autoplay', '');
        videoOrIframe.classList.add('modal-video');
        modalContent.append(videoOrIframe);
      } else {
        videoOrIframe = createIframe(newContent, { parentEl: modalContent, classes: 'modal-video' });
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
    modalBackground.querySelector('.modal-top-bar .modal-close-button').focus();
    modalBackground.setAttribute('aria-hidden', 'false');

    // disable page scrolling
    document.body.classList.add('disable-scroll');
  }

  function hideModal() {
    // restoring focus for header, footer and main elements when modal is close
    document.querySelectorAll('header, footer, main').forEach((el) => {
      el.removeAttribute('inert');
    });
    if (currentInvokeContext) {
      currentInvokeContext.focus();
    }
    currentInvokeContext = null;
    modalBackground.classList.add(HIDE_MODAL_CLASS);
    modalContent.classList.remove('modal-content-fade-in');
    window.removeEventListener('keydown', keyDownAction);
    document.body.classList.remove('disable-scroll');
    modalContent.querySelector('iframe, video')?.remove();
    modalContent.querySelector('.modal-before-banner')?.remove();
    modalContent.querySelector('.modal-before-iframe')?.remove();
    modalBackground.setAttribute('aria-hidden', 'true');

    if (currentModalClasses.length) {
      modalBackground.classList.remove(currentModalClasses);
      currentModalClasses = null;
    }
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
