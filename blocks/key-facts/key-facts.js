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
    if (icon) col.prepend(icon);
    const paragraphs = col.querySelectorAll('p');
    paragraphs.forEach((paragraph) => stripEmptyTags(col, paragraph));

    // find and split number/unit
    const value = col.querySelector('strong:only-child');
    if (value) {
      const parts = value.innerHTML.match('([0-9,.]+) (.*)');
      if (parts) {
        // eslint-disable-next-line prefer-destructuring
        value.innerText = parts[1];
        value.classList.add('number');
        const unit = document.createElement('strong');
        unit.classList.add('unit');
        // eslint-disable-next-line prefer-destructuring
        unit.innerText = parts[2];
        value.parentNode.append(unit);
      }
    }
    // add trailing line div if needed
    if (block.classList.contains('trailing-line')) {
      const div = document.createElement('div');
      div.classList.add('trailing-line');
      col.append(div);
    }
  });
}
