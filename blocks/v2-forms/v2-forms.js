import { createElement } from '../../scripts/common.js';

// cache contains the form element that should be reused
const formCache = new Map();

const blockName = 'v2-forms';

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

      <div style="position:absolute; left:-9999px; top: -9999px;">
          <label for="pardot_extra_field">Comments</label>
          <input type="text" id="pardot_extra_field" name="pardot_extra_field" />
      </div>
    </form>
  `;

  if (formCache.get(formName)) {
    const cachedForm = formCache.get(formName);
    block.replaceWith(cachedForm);
    block.style.display = displayValue;
    return;
  }

  const formWrapper = createElement('div', { classes: `${blockName}__container` });
  formWrapper.innerHTML = form;
  block.replaceWith(formWrapper);
  formCache.set(formName, formWrapper);

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
