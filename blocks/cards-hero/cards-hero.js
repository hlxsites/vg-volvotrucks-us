export default function decorate(block) {
  block.querySelectorAll('ul > li').forEach((li) => {
    // Add wrapper around the content
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = li.innerHTML;
    li.innerHTML = '';
    li.append(contentContainer);

    // Remove link from text, add it to the image
    const link = li.querySelector('a');
    link.innerText = '';
    const image = li.querySelector('picture');
    link.append(image);

    // Move link outside wrapper
    li.append(link);

    const textItems = contentContainer.innerHTML
      .split('<br>').filter((text) => text.trim() !== '');

    contentContainer.innerHTML = `
      <h3>${textItems[0]}</h3>
      <p>${textItems.slice(1).join('</p><p>')}</p>
    `;
  });
}
