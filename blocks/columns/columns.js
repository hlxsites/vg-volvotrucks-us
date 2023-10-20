export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Add target blank for nhtsa contact section link to open in new tab
  if (block.classList.contains('nhtsa')) {
    [...block.querySelectorAll('a')].forEach((link) => {
      if (!link.target) {
        link.target = '_blank';
      }
    });
  }
}
