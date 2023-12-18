import {
  loadBlock, sampleRUM,
} from '../../scripts/lib-franklin.js';
import { getTextLabel, createElement } from '../../scripts/common.js';

const blockName = 'v2-newsletter';

//* init response handling *
const successTitle = getTextLabel('Success newsletter title');
const successText = getTextLabel('Success newsletter text');

async function submissionSuccess() {
  sampleRUM('form:submit');
  const form = document.querySelector('form[data-submitting=true]');
  form.setAttribute('data-submitting', 'false');
  const title = document.querySelector(`.${blockName}__title`);
  const message = document.createElement('p');
  message.textContent = successText;
  title.textContent = successTitle;
  form.replaceWith(message);
}

const errorTitle = getTextLabel('Error submission title');
const errorText = getTextLabel('Error submission text');

async function submissionFailure() {
  const form = document.querySelector('form[data-submitting=true]');
  form.setAttribute('data-submitting', 'false');
  const title = document.querySelector(`.${blockName}__title`);
  const message = document.createElement('p');
  message.textContent = errorText;
  title.textContent = errorTitle;
  form.replaceWith(message);
}
//* end response handling *

window.logResult = function logResult(json) {
  if (json.result === 'success') {
    submissionSuccess();
  } else if (json.result === 'error') {
    submissionFailure();
  }
};

export default async function decorate(block) {
  const formLink = block.firstElementChild.innerText.trim();
  const html = block.firstElementChild.nextElementSibling.firstElementChild.innerHTML;

  const container = createElement('div', { classes: `${blockName}__container` });

  const textContainer = createElement('div', { classes: `${blockName}__text` });
  textContainer.innerHTML = html;

  const headings = textContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
  [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

  const formContainer = createElement('div', { classes: `${blockName}__form-container` });
  const form = document.createRange().createContextualFragment(`
    <div class="v2-forms block" data-block-name="v2-forms" data-block-status="">
      <div>
        <div>subscribe</div>
      </div>
      <div>
        <div>${formLink}</div>
      </div>
    </div>`);

  formContainer.append(...form.children);
  container.appendChild(textContainer);
  container.appendChild(formContainer);

  block.replaceWith(container);

  await loadBlock(formContainer.firstElementChild);
}

// Same form in page is not working.
