// eslint-disable-next-line import/no-cycle
import {
  createElement,
  decorateIcons,
  getTextLabel,
} from '../../scripts/common.js';
import { loadCSS } from '../../scripts/aem.js';
import {
  AEM_ASSETS,
  createIframe,
  createVideo,
  handleVideoMessage,
  isAEMVideoUrl,
  isLowResolutionVideoUrl,
  VideoEventManager,
} from '../../scripts/video-helper.js';

const { videoIdRegex } = AEM_ASSETS;
const videoEventManager = new VideoEventManager();

class VideoComponent {
  constructor(videoId) {
    this.videoId = videoId;
    this.blockName = 'modal';

    videoEventManager.register(
      this.videoId,
      this.blockName,
      (event) => handleVideoMessage(event, this.videoId, this.blockName),
    );
  }

  unregister() {
    videoEventManager.unregister(this.videoId, this.blockName);
  }
}

const HIDE_MODAL_CLASS = 'modal-hidden';
let currentModalClasses = null;
let currentInvokeContext = null;

const createModalTopBar = (parentEl) => {
  const topBar = document.createRange().createContextualFragment(`
    <div class="modal-top-bar">
      <div class="modal-top-bar-content">
        <h2 class="modal-top-bar-heading" id="modal-heading"></h2>
        <button type="button" class="modal-close-button" aria-label=${getTextLabel('close')}>
          <span class="icon icon-close" aria-hidden="true" />
        </button>
      </div>
    </div>
  `);

  decorateIcons(topBar);
  parentEl.prepend(...topBar.children);
  // eslint-disable-next-line no-use-before-define
  parentEl.querySelector('.modal-close-button').addEventListener('click', () => hideModal());
  parentEl.querySelector('.modal-top-bar').addEventListener('click', (event) => event.stopPropagation());
};

const createModal = () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  const modalBackground = createElement('div', { classes: ['modal-background', HIDE_MODAL_CLASS] });
  modalBackground.setAttribute('role', 'dialog');

  modalBackground.addEventListener('click', () => {
    if (!document.documentElement.classList.contains('redesign-v2')) {
      // eslint-disable-next-line no-use-before-define
      hideModal();
    }
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
    modalContent.scrollTo(0, 0);

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
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    currentInvokeContext = invokeContext;
    // disabling focus for header, footer and main elements when modal is open
    document.querySelectorAll('header, footer, main').forEach((el) => {
      el.setAttribute('inert', 'inert');
    });
    await loadCSS(`${window.hlx.codeBasePath}/common/modal/modal.css`);
    modalBackground.style = '';
    modalBackground.classList.add(...modalClasses);
    currentModalClasses = modalClasses;
    window.addEventListener('keydown', keyDownAction);

    if (newContent && (typeof newContent !== 'string')) {
      handleNewContent(newContent);
    } else if (newContent) {
      clearModalContent();
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
        modalBackground.classList.add('modal--video');
        modalContent.append(videoOrIframe);
      } else if (isAEMVideoUrl) {
        let videoId;
        const match = newContent.match(videoIdRegex);
        if (match) {
          [videoId] = match;
        }

        // eslint-disable-next-line no-unused-vars
        const modalVideoComponent = new VideoComponent(videoId);
        videoOrIframe = createVideo(newContent, 'modal-video', {
          autoplay: 'any',
          disablePictureInPicture: true,
          loop: false,
          muted: false,
          playsinline: true,
          title: 'video',
          language: document.documentElement.lang,
        }, false, videoId);
        modalBackground.classList.add('modal--video');
        modalContent.append(videoOrIframe);
      } else {
        videoOrIframe = createIframe(newContent, { parentEl: modalContent, classes: 'modal-video' });
        modalBackground.classList.add('modal--video');
      }

      if (beforeBanner) {
        const bannerWrapper = document.createElement('div');
        bannerWrapper.classList.add('modal-before-banner');
        bannerWrapper.addEventListener('click', (event) => event.stopPropagation());
        bannerWrapper.appendChild(beforeBanner);

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
    document.body.classList.add('disable-body-scroll');
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const { body } = document;
    document.documentElement.style.scrollBehavior = 'auto';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
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
    modalContent.scrollTo(0, 0);
    modalBackground.classList.add(HIDE_MODAL_CLASS);
    modalBackground.classList.remove('modal--video');
    modalContent.classList.remove('modal-content-fade-in');
    window.removeEventListener('keydown', keyDownAction);
    document.body.classList.remove('disable-body-scroll');
    const { body } = document;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    document.documentElement.style.scrollBehavior = '';
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
