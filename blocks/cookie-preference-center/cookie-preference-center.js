export default function decorate(block) {
  const button = document.createElement('a');
  button.classList.add('cta');
  button.setAttribute('onclick', 'OneTrust.ToggleInfoDisplay();');
  button.textContent = block.textContent;

  block.textContent = '';
  block.append(button);
}
