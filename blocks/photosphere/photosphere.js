export default async function decorate(block) {
  const imageLink = block.querySelector('img')?.getAttribute('src');
  const [address, params] = imageLink.split('?');
  const paramsWithoutWidth = params.split('&').filter((param) => !param.startsWith('width=')).join('&');
  const finalImageLink = `${address}?${paramsWithoutWidth}`;
  const styles = ['https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5.1.4/index.min.css'];
  const scripts = [
    'https://cdn.jsdelivr.net/npm/three/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5.1.4/index.min.js',
  ];

  block.innerHTML = '';

  const initPhotosphere = () => {
    // eslint-disable-next-line no-undef, no-unused-vars
    const viewer = new PhotoSphereViewer.Viewer({
      container: '.photosphere.block',
      panorama: finalImageLink,
      caption: '',
      loadingImg: '',
      touchmoveTwoFingers: true,
      mousewheelCtrlKey: true,
      fisheye: true,
      moveSpeed: 1.1,
      navbar: false,
      defaultZoomLvl: 50,
    });
  };

  // adding photosphere styles
  styles.forEach((styleSheet) => {
    const styleElement = document.createElement('link');

    styleElement.setAttribute('href', styleSheet);
    styleElement.setAttribute('rel', 'stylesheet');
    document.head.append(styleElement);
  });

  // adding photosphere scripts
  // eslint-disable-next-line no-restricted-syntax
  for (const script of scripts) {
    let waitForLoad = Promise.resolve();
    const scriptElement = document.createElement('script');

    waitForLoad = new Promise((resolve) => {
      scriptElement.addEventListener('load', resolve);
    });

    scriptElement.setAttribute('src', script);
    document.body.append(scriptElement);

    // eslint-disable-next-line no-await-in-loop
    await waitForLoad;
  }

  initPhotosphere();
}
