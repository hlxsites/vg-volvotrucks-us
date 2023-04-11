function restyleBtnToLink(block) {
  const downloadHereBtn = block.querySelector('.download-text a');
  // it has to be restyled if in content document the text is splitted in 2 lines
  if (!downloadHereBtn || !downloadHereBtn.classList.contains('button')) return;
  const btnContainer = downloadHereBtn.parentElement;
  const textWrapper = block.querySelector('.download-text > div');
  const textElement = textWrapper.querySelector('p');
  const strong = document.createElement('strong');
  const link = document.createElement('a');
  strong.textContent = `${textElement.textContent} `;
  link.href = downloadHereBtn.href;
  link.title = downloadHereBtn.title;
  link.textContent = downloadHereBtn.textContent;
  strong.appendChild(link);
  textElement.remove();
  btnContainer.remove();
  textWrapper.appendChild(strong);
}

function addClickToLink(link) {
  link.onclick = (e) => {
    e.preventDefault();
    // force to download
    const a = document.createElement('a');
    a.href = link.href;
    a.download = link.download;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
}

export default function decorate(block) {
  const downloadDir = block.children[0];
  const imgContainers = [...block.children].slice(1);
  // remove all br tags
  const brTags = block.querySelectorAll('br');
  downloadDir.className = 'download-text';
  restyleBtnToLink(block);
  if (brTags.length > 0) [...brTags].forEach((br) => br.remove());
  // move picture tags inside the links
  imgContainers.forEach(async (el) => {
    el.className = 'image-container';
    const link = el.querySelector('a');
    const picture = el.querySelector('picture');
    const img = picture.querySelector('[type="image/jpeg"]');
    try {
      const isImgLinkBroken = await fetch(link.href, { mode: 'no-cors' });
      if (!isImgLinkBroken.ok) link.href = img.srcset;
    } catch (error) {
      link.href = img.srcset;
    }
    link.textContent = '';
    link.appendChild(picture);
    link.download = '';
    addClickToLink(link);
  });
}
