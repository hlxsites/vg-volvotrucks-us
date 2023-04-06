import { results, resetForm } from './results.js';

const getinitialData = async () => {
  // get data from spreadsheet in json format
  const response = await fetch('./calculator.json');
  const json = await response.json();
  return json.data;
};

const addAnimations = (component) => {
  // add the functionality to the charts / selectors
  const wrapper = component.querySelector('.calculator-charts-wrapper');
  const selectors = wrapper.querySelectorAll('.selector');

  selectors.forEach((button) => {
    button.addEventListener('click', (e) => {
      const parent = button.closest('.calculator-charts-wrapper');
      const inactiveButton = parent.querySelector('[data-active]');
      delete inactiveButton.dataset.active;

      const selectedId = e.target.id;
      button.dataset.active = true;

      const chartParent = parent.querySelector('ul');
      const inactiveChart = chartParent.querySelector('[data-active]');
      delete inactiveChart.dataset.active;

      const selectedChart = chartParent.querySelectorAll('.chart');
      selectedChart[selectedId].dataset.active = true;
    });
  });
};

const formatData = (data) => {
  // get the values from the json
  const values = data.pop();
  const dataEntries = [];

  let counter = 1;
  for (const [key, value] of Object.entries(values)) {
    dataEntries.push({
      idx: counter,
      label: key,
      value,
      type: 'number',
    });
    counter += 1;
  }

  // get the last element of the excel as the disclaimer that goes on the middle
  const disclaimer = dataEntries.length === 10 ? dataEntries.pop().value : '';
  const divider = 7;

  // divides into 2 sections, 'current' and 'new'
  const firstSection = dataEntries.slice(0, divider - 1);
  const lastSection = dataEntries.slice(divider, dataEntries.length);

  const splitValues = (completeString) => {
    // turn the string into an array
    return completeString[0].value.split(',');
  };

  firstSection[0].value = splitValues(firstSection);
  lastSection[0].value = splitValues(lastSection);

  firstSection[0].type = 'select';
  lastSection[0].type = 'select';

  return [firstSection, lastSection, disclaimer];
};

const createButton = (type) => {
  // create the reset button
  const button = document.createElement('button');
  button.classList.add(`calculator-${type}-button`);
  button.id = `calculator-${type}-button`;
  button.innerText = `${type} calculator`;
  button.setAttribute('type', 'submit');

  return button;
};

const getInputType = (e) => {
  // identify and return if the input is a number input or a select
  const inputLabel = e.label.slice(2).replaceAll('_', ' ');
  if (e.type === 'select') {
    return `
      <label for="input-${e.idx}" class="label-input-${e.idx}">${inputLabel}</label>
      <select name="input-${e.idx}" class="input-${e.idx}">
        ${e.value.map((value, idx) => `<option class="option-${idx}" value="${value}">${value}</option>`)}
      </select>`;
  }
  return `
    <label class="label-input-${e.idx}">${inputLabel}</label>
    <input type="${e.type}" class="input-${e.idx}" value="${e.value}"/>`;
};

const createInputs = (data, type) => {
  // build the list of inputs with their corresponding title
  const truckSection = document.createElement('div');
  truckSection.classList.add('calculator-inputs-section');

  const truckTitle = document.createElement('h3');
  truckTitle.classList.add('calculator-inputs-title');
  truckTitle.innerText = `${type} trucks`;

  const inputList = document.createElement('ul');
  inputList.classList.add('calculator-input-list');

  data.forEach((input) => {
    const listItem = document.createElement('li');
    listItem.classList.add('calculator-item');
    listItem.innerHTML = getInputType(input);
    inputList.append(listItem);
  });

  truckSection.append(truckTitle);
  truckSection.append(inputList);

  return truckSection;
};

export default async function decorate(block) {
  // the final disclaimer comes from the index.doc file in order to make it editable
  const finalDisclaimer = (block.innerText);

  // this data acts a placeholder and is also the one used to make the first calculations
  const rawData = await getinitialData();
  const initialData = formatData(rawData);

  const middleDisclaimerText = document.createElement('p');
  middleDisclaimerText.classList.add('disclaimer');
  middleDisclaimerText.classList.add('calculator-inputs-disclaimer');
  middleDisclaimerText.innerText = initialData[2];

  const currentInputsSection = createInputs(initialData[0], 'current');
  const newInputsSection = createInputs(initialData[1], 'new');

  const resetButton = createButton('reset');

  const allInputs = document.createElement('form');
  allInputs.classList.add('calculator-inputs-form');
  allInputs.id = 'calculator';
  // TODO this calls the function that should make the math calculation
  allInputs.onclick = (e) => resetForm(e);

  const finalDisclaimerText = document.createElement('p');
  finalDisclaimerText.classList.add('disclaimer');
  finalDisclaimerText.classList.add('results-disclaimer');
  finalDisclaimerText.innerText = finalDisclaimer;

  // empties the block
  block.innerText = '';

  const selectorsAndCharts = results(initialData);
  addAnimations(selectorsAndCharts);

  allInputs.append(currentInputsSection);
  allInputs.append(middleDisclaimerText);
  allInputs.append(newInputsSection);
  allInputs.append(resetButton);

  block.append(allInputs);
  block.append(selectorsAndCharts);

  block.append(finalDisclaimerText);
}
