export default async function decorate(block) {
  const lis = [...block.children].map((row) => {
    const li = document.createElement('li');
    const link = row.querySelector('a');
    if (link) {
      const clone = link.cloneNode(false);
      clone.append(...row.firstElementChild.childNodes);
      li.appendChild(clone);
      clone.querySelectorAll('a').forEach((a) => {
        a.after(...a.childNodes);
        a.remove();
      });
    } else {
      li.append(...row.firstElementChild.childNodes);
    }
    return li;
  });
  const ul = document.createElement('ul');
  ul.append(...lis);
  block.innerHTML = ul.outerHTML;
}
