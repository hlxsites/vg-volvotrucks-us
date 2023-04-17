function openOriginal() {
  const url = new URL(window.location.href);
  url.hostname = 'www.volvotrucks.us';
  url.port = 80;
  window.open(url.href, '_blank');
}

const sk = document.querySelector('helix-sidekick');
sk.addEventListener('custom:open-original', openOriginal);
