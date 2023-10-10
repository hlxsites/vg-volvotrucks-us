import { getTextLabel, createElement } from '../../scripts/common.js';

const VIN_URL = 'https://vinlookup-dev-euw-ase-01.azurewebsites.net/v1/api/vin/';
const API_KEY = '0e13506b59674706ad9bae72d94fc83';

async function fetchRecalls(e) {
  e.preventDefault();
  if (e && e.target) {
    const formData = new FormData(e.target);
    const vin = formData.get('vin');

    if (vin) {
      const recalls = await fetch(`${VIN_URL}${vin}?api_key=${API_KEY}&mode=company`);
      return recalls;
    }
  }
  return null;
}

export default async function decorate(block) {
  const form = createElement('form', {
    classes: ['vin-number__form'],
  });
  const formChildren = document.createRange().createContextualFragment(`
    <div class="vin-number__input-wrapper">
      <input
        type="text"
        name="vin"
        id="vin_number"
        autocomplete="off"
        placeholder=" "
        minlength="17"
        maxlength="17"
        required
        class="vin-number__input"
        pattern="^[1,4][V,v][1,2,4,5][K,N,R,W,k,n,r,w][A-Za-z0-9]{13}$"
      />
      <label for="vin_number" class="vin-number__label">${getTextLabel('vinlabel')}</label>
    </div>
    <button class="button primary vin-number__submit" type="submit" name="submit">${getTextLabel('submit')}</button>
  `);

  form.addEventListener('submit', fetchRecalls, false);
  form.append(...formChildren.children);
  block.append(form);

  const vinInput = block.querySelector('.vin-number__input');

  vinInput.oninvalid = (e) => {
    e.target.setCustomValidity(getTextLabel('vinformat'));
  };
}
