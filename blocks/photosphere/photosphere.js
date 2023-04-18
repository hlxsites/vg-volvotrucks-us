import { loadCSS, loadScript } from '../../scripts/lib-franklin.js';

// based on: https://developers.google.com/speed/webp/faq
async function isWebpSupported() {
  const testImages = [
    // lossy
    'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    // lossless
    'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  ];
  const lossyImg = new Image();
  const lossLessImg = new Image();
  const promises = [];

  [lossyImg, lossLessImg].forEach((img, index) => {
    const promise = new Promise((resolve) => {
      img.onload = () => {
        const result = (img.width > 0) && (img.height > 0);
        resolve(result);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = `data:image/webp;base64,${testImages[index]}`;
    });

    promises.push(promise);
  });

  return Promise.all(promises).then((values) => values.every((val) => val));
}

async function renderBlock(block) {
  const styles = ['https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5.1.4/index.min.css'];
  const scripts = [
    'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5.1.4/index.min.js',
  ];
  const canUseWebp = isWebpSupported();
  let imageLink = '';

  if (canUseWebp) {
    const webpImageEl = block.querySelector('picture source[type="image/webp"]');
    imageLink = webpImageEl?.srcset;
  }
  if (!imageLink) {
    imageLink = block.querySelector('img')?.src;
  }

  const [address, params] = imageLink.split('?');
  const paramsWithoutWidth = params.split('&').filter((param) => !param.startsWith('width=')).join('&');
  const finalImageLink = `${address}?${paramsWithoutWidth}`;

  block.innerHTML = '';

  const initPhotosphere = () => {
    // eslint-disable-next-line no-undef, no-unused-vars
    const viewer = new PhotoSphereViewer.Viewer({
      container: '.photosphere.block',
      panorama: finalImageLink,
      touchmoveTwoFingers: true,
      mousewheelCtrlKey: true,
      fisheye: true,
      moveSpeed: 1.1,
      navbar: false,
      defaultZoomLvl: 50,
      useXmpData: false,
    });
  };

  // adding photosphere styles
  styles.forEach((styleSheet) => {
    loadCSS(styleSheet);
  });

  // adding photosphere scripts
  // eslint-disable-next-line no-restricted-syntax
  for (const script of scripts) {
    // eslint-disable-next-line no-await-in-loop
    await loadScript(script, { type: 'text/javascript', charset: 'UTF-8' });
  }

  initPhotosphere();
}

export default async function decorate(block) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      renderBlock(block);
    }
  }, {
    rootMargin: '300px',
  });
  observer.observe(block);
}
