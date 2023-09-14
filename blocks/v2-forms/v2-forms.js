import { createElement } from '../../scripts/common.js';

// cache contains the form element that should be reused
const eloquaFormCache = new Map();

const addForm = async (block) => {
  const displayValue = block.style.display;
  block.style.display = 'none';

  const formName = block.firstElementChild.innerText.trim();
  const formAction = block.firstElementChild.nextElementSibling.innerText.trim();

  const formContent = await import(`./forms/${formName}.js`);

  const form = `
    <form
      method="post"
      name="request-quote"
      action="${formAction}"
    >${formContent.default}
    </form>
  `;

  if (eloquaFormCache.get(formName)) {
    const cachedForm = eloquaFormCache.get(formName);
    block.append(cachedForm);
    block.style.display = displayValue;
    return;
  }

  const formWrapper = createElement('div', { classes: 'eloqua-form-container' });
  formWrapper.innerHTML = form;
  block.innerHTML = '';
  block.append(formWrapper);
  eloquaFormCache.set(formName, formWrapper);

  block.style.display = displayValue;
};

export default async function decorate(block) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      addForm(block);
    }
  }, {
    rootMargin: '300px',
  });
  observer.observe(block);
}
