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
  if (brTags.length > 0) [...brTags].forEach((br) => br.remove());
  // move picture tags inside the links
  imgContainers.forEach((el) => {
    el.className = 'image-container';
    const link = el.querySelector('a');
    const picture = el.querySelector('picture');
    const img = picture.querySelector('[type="image/jpeg"]');
    link.textContent = '';
    link.appendChild(picture);
    link.download = '';
    link.href = img.srcset;
    addClickToLink(link);
  });
  downloadDir.className = 'download-text';
}
