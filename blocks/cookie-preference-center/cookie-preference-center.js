export default function decorate(block) {
  const buttonContainer = document.createElement('p');
  buttonContainer.classList.add('button-container');

  const button = document.createElement('button');
  button.classList.add('button');
  button.classList.add('cta');
  button.setAttribute('onclick', 'OneTrust.ToggleInfoDisplay();');
  button.textContent = block.textContent;

  buttonContainer.append(button);

  block.textContent = '';
  block.append(buttonContainer);
}
