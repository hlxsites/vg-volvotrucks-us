export default async function decorate(block) {
  const fullWidthClass = 'full-viewport';
  const isFullWidth = block.classList.contains(fullWidthClass);

  if (isFullWidth) {
    block.closest('.image-wrapper')?.classList.add(fullWidthClass);
  }
}
