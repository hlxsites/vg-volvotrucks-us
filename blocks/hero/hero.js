export default function decorate(block) {
  // Hero block is rendered by script.js buildHeroBlock.
  // The buildHeroBlock takes the first div and check if it contains all needed
  // elements (pictures, h1, ...) and then render the auto hero block.
  // In case when extra classes (variants) are needed the auto block can't be used,
  // so the block needs to be added manually.
  // The auto block will grab all the content of the manually added block,
  // so the empty block should be removed.
  if (block.innerText.trim() === '') {
    block.remove();
  }
}
