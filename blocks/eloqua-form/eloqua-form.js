export default async function decorate(block) {
  const formName = block.innerText.trim();
  const data = await fetch(`${window.hlx.codeBasePath}/blocks/eloqua-form/forms/${formName}.html`);
  const text = await data.text();

  block.innerHTML = text;

  const styles = block.querySelectorAll('style');

  styles.forEach((styleSheet) => {
    document.head.appendChild(styleSheet);
  });

  // loading scripts one by one to prevent inappropriate script execution order.
  // eslint-disable-next-line no-restricted-syntax
  for (const script of [...block.querySelectorAll('script')]) {
    let waitForLoad = Promise.resolve();
    // the script element added by innerHTML is NOT executed
    // the workaround is to create the new script tag, copy attibutes and content
    const newScript = document.createElement('script');

    newScript.setAttribute('type', 'text/javascript');
    // coping all script attribute to the new one
    [...script.attributes].forEach((attr) => {
      const attrValue = script.getAttribute(attr.name);
      newScript.setAttribute(attr.name, attrValue);

      if (attr.name === 'src') {
        waitForLoad = new Promise((resolve) => {
          newScript.addEventListener('load', resolve);
        });
      }
    });
    newScript.innerHTML = script.innerHTML;
    script.remove();
    document.body.append(newScript);

    // eslint-disable-next-line no-await-in-loop
    await waitForLoad;
  }

  block.querySelectorAll('.form-element-layout').forEach((el) => {
    // displaying label content as input placeholder
    const input = el.querySelector('input[type="text"], select');
    const label = el.querySelector('label');

    if (input && label) {
      input.setAttribute('placeholder', label.innerText);
      label.remove();
    }
  });

  // adding class to the select parent element, so the select's arrow could be displayed.
  block.querySelectorAll('select').forEach((el) => {
    el.parentElement.classList.add('eloqua-select-wrapper');
  });
}
