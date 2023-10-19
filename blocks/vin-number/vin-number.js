import { getTextLabel, createElement, getJsonFromUrl } from '../../scripts/common.js';

const VIN_URL = 'https://vinlookup-dev-euw-ase-01.azurewebsites.net/v1/api/vin/';
const API_KEY = '0e13506b59674706ad9bae72d94fc83c';

const docRange = document.createRange();

// list of things to be display for each recall
const valueDisplayList = [{
  key: 'recall_date',
},
{
  key: 'mfr_recall_number',
},
{
  key: 'nhtsa_recall_number',
},
{
  key: 'mfr_recall_status',
},
{
  key: 'recall_description',
  class: 'vin-number__detail-item--column',
},
{
  key: 'safety_risk_description',
  class: 'vin-number__detail-item--column',
}, {
  key: 'remedy_description',
  class: 'vin-number__detail-item--column',
}, {
  key: 'mfr_notes',
  class: 'vin-number__detail-item--column',
}];

// use this to map values from API
const recallStatus = {
  11: 'recall_incomplete',
  0: 'recall_complete',
  12: 'recall_incomplete_no_remedy',
};

function capitalize(text) {
  return text.toLowerCase().split('').map((char, index) => (index === 0 ? char.toUpperCase() : char)).join('');
}

function renderRecalls(recallsData) {
  const resultText = document.querySelector('.vin-number__results-text');
  resultText.innerText = getTextLabel('result text').replace(/\${count}/, recallsData.number_of_recalls).replace(/\${vin}/, recallsData.vin);

  if (recallsData.recalls_available) {
    const blockEl = document.querySelector('.vin-number__recalls-wrapper');
    const listWrapperFragment = docRange.createContextualFragment(`
      <div class="vin-number__recalls-heading-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.537 2.77441C12.4523 2.60503 12.2792 2.49804 12.0898 2.49805C11.9004 2.49805 11.7273 2.60506 11.6426 2.77445L2.14458 21.7711C2.06709 21.9261 2.07537 22.1102 2.16647 22.2576C2.25758 22.405 2.41851 22.4947 2.5918 22.4947H21.5897C21.7629 22.4947 21.9239 22.405 22.015 22.2576C22.1061 22.1102 22.1144 21.9261 22.0369 21.7711L12.537 2.77441ZM3.4008 21.4947L12.0898 4.11603L20.7806 21.4947H3.4008ZM12.9995 14.6796V15.7512C12.9995 15.8619 12.9046 15.9974 12.7538 15.9974L12.4304 15.9969C12.2549 15.9965 12.0583 15.9961 11.9556 15.9961H11.2484C11.0976 15.9961 11.0027 15.8606 11.0027 15.7499V14.6796L11.0027 8.24501C11.0027 8.13425 11.0976 7.99874 11.2484 7.99874H11.9556C12.0581 7.99874 12.2545 7.99834 12.4299 7.99798H12.43L12.4304 7.99798L12.7538 7.99744C12.9046 7.99744 12.9995 8.13295 12.9995 8.2437L12.9995 14.6796ZM12.9964 18.8443V19.7512C12.9964 19.8619 12.9015 19.9974 12.7507 19.9974L12.4273 19.9969C12.2517 19.9965 12.0551 19.9961 11.9524 19.9961H11.2452C11.0944 19.9961 10.9995 19.8606 10.9995 19.7499V18.8443V18.2437C10.9995 18.1329 11.0944 17.9974 11.2452 17.9974H11.9524C12.0551 17.9974 12.2517 17.997 12.4273 17.9967L12.7507 17.9961C12.9015 17.9961 12.9964 18.1316 12.9964 18.2424L12.9964 18.8443Z" fill="currentColor"/>
        </svg>
        <h4 class="vin-number__recalls-heading">${getTextLabel('recalls')}  &nbsp; &nbsp;</h4>
        <span> [${getTextLabel('published_info')}: ${recallsData.refresh_date} | ${getTextLabel('recall_oldest_info')}] </span>
      </div>
    `);

    // create each recall
    const list = createElement('ul', { classes: 'vin-number__list' });
    recallsData.recalls.forEach((recall) => {
      const liEl = createElement('li', {
        classes: 'vin-number__list-item',
      });

      // map the number from api to correct status
      recall.mfr_recall_status = recallStatus[recall.mfr_recall_status];

      const recallDetailsList = createElement('ul', { classes: 'vin-number__detail-list' });

      valueDisplayList.forEach((item) => {
        if (recall[item.key]) {
          const recallClass = item.key === 'mfr_recall_status' ? `vin-number__${recall.mfr_recall_status.replace(/_/g, '-').toLowerCase()}` : '';
          let itemValue = item.class ? capitalize(recall[item.key]) : recall[item.key];
          if (recallClass) {
            itemValue = getTextLabel(recall[item.key]);
          }

          const itemFragment = docRange.createContextualFragment(`<li class="vin-number__detail-item ${item.class ? item.class : ''}" >
            <h5 class="vin-number__detail-title subtitle-1"> ${getTextLabel(item.key)} </h5>
            <span class="vin-number__detail-value ${recallClass}">${itemValue}</span>
          </li>`);
          recallDetailsList.append(...itemFragment.children);
        }
      });
      liEl.append(recallDetailsList);
      list.append(liEl);
    });

    blockEl.append(listWrapperFragment);
    blockEl.appendChild(list);
  }
}

async function fetchRecalls(e) {
  e.preventDefault();
  if (e && e.target) {
    // disable submit while fetching data
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;

    const recalls = document.querySelector('.vin-number__recalls-wrapper');
    recalls.innerHTML = '';

    const resultText = document.querySelector('.vin-number__results-text');
    resultText.innerText = getTextLabel('loading recalls');

    const formData = new FormData(e.target);
    const vin = formData.get('vin');

    if (vin) {
      try {
        getJsonFromUrl(`${VIN_URL}${vin}?api_key=${API_KEY}&mode=company`)
          .then((response) => {
            if (response.error_code) {
              resultText.innerHTML = `${getTextLabel('no recalls')} ${vin}`;
            } else {
              response.recalls.sort((a, b) => (b.mfr_recall_status - a.mfr_recall_status)
                || (new Date(b.date) - new Date(a.date)));
              renderRecalls(response);
            }

            const vinInput = document.querySelector('.vin-number__input');
            vinInput.value = '';
            submitBtn.disabled = false;
          });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Recalls:', error);
      }
      return null;
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
        pattern="^[1,4][V,v,R,r][1,2,4,5,k,K][B-C,E-H,J-N,R-S,V-Y,b-c,e-h,j-n,r-s,v-y][A-Za-z0-9]{13}$"
      />
      <label for="vin_number" class="vin-number__label">${getTextLabel('vinlabel')}</label>
    </div>
    <button class="button primary vin-number__submit" type="submit" name="submit">${getTextLabel('submit')}</button>
  `);

  const vinResultsContainer = createElement('div', { classes: 'vin-number__results-container' });
  const innerContent = docRange.createContextualFragment(`
    <span class="vin-number__results-text"></span>
    <div class="vin-number__recalls-wrapper"></div>
  `);

  vinResultsContainer.append(innerContent);

  form.addEventListener('submit', fetchRecalls, false);
  form.append(...formChildren.children);
  block.append(form);
  block.append(vinResultsContainer);

  const vinInput = block.querySelector('.vin-number__input');

  vinInput.oninvalid = (e) => {
    e.target.setCustomValidity(getTextLabel('vinformat'));
  };

  vinInput.oninput = (e) => {
    e.target.setCustomValidity('');
  };
}
