export default async function decorate(block) {
  const controls = `<div class="controls">
        <i class="fa fa-caret-left" aria-label="left"></i>
        <i class="fa fa-caret-right" aria-label="right"></i>
    </div>`;
  const pictures = block.querySelectorAll('picture');

  block.innerHTML = controls;
  block.append(...pictures);

  pictures[0].classList.add('active');

  block.querySelectorAll('.controls .fa').forEach((control) => {
    control.addEventListener('click', () => {
      const active = block.querySelector('.active');
      active.classList.remove('active');
      let next;
      if (control.matches('.fa-caret-left')) {
        next = active.previousElementSibling;
        if (next.tagName !== 'PICTURE') {
          next = block.querySelector('picture:last-of-type');
        }
      } else {
        next = active.nextElementSibling;
        if (!next) {
          next = block.querySelector('picture:first-of-type');
        }
      }
      next.classList.add('active');
    });
  });
}
