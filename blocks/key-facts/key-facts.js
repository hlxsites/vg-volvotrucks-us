function stripEmptyTags(main, child) {
  if (child !== main && child.innerHTML.trim() === '') {
    const parent = child.parentNode;
    child.remove();
    stripEmptyTags(main, parent);
  }
}

export default function decorate(block) {
  const facts = [...block.firstElementChild.children];
  facts.forEach((col) => {
    col.classList.add('key-fact');
    const icon = col.querySelector('i');
    col.prepend(icon);
    const paragraphs = col.querySelectorAll('p');
    paragraphs.forEach((paragraph) => stripEmptyTags(col, paragraph));
  });
}
