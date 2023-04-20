import {
  results,
  resetForm,
  updatedData,
  addAnimations,
  resetData,
} from './results.js';

const calculatorPath = './calculator.json';
const percentagesPath = './percentages.json';

const getInitialData = async (path = calculatorPath) => {
  // get data from spreadsheet in json format
  const response = await fetch(path);
  const json = await response.json();
  return json.data;
};

const formatData = (data) => {
  // get the values from the json
  const values = data.pop();
  const dataEntries = Object.entries(values).map(([key, value], i) => ({
    idx: i + 1,
    label: key,
    value,
    type: 'number',
  }));

  // get the last element of the excel as the disclaimer that goes on the middle
  const disclaimer = dataEntries.length === 10 ? dataEntries.pop().value : '';
  const divider = 7;

  const [
    ,
    priceFuel,
    currentMPG,
    milesTruckYear,
    priceIncrease,
    defPrice,
    defUsage,,
    trucksNum,
  ] = dataEntries;
  const formData = {
    '1_baseline_powertrain': (0),
    '2_price_of_fuel': (priceFuel.value),
    '3_current_MPG': (currentMPG.value),
    '4_miles/Truck/Year': (milesTruckYear.value),
    '5_annual_fuel_price_increase': (priceIncrease.value),
    '6_price_of_DEF': (defPrice.value),
    '7_DEF%_usage': (defUsage.value),
    '8_next-gen_D13TC_powertrain': (0),
    '9_number_of_new_trucks': (trucksNum.value),
  };

  // divides into 2 sections, 'current' and 'new'
  const firstSection = dataEntries.slice(0, divider);
  const lastSection = dataEntries.slice(divider, dataEntries.length);

  // turn the string into an array
  const splitValues = (completeString) => completeString[0].value.split(',');

  firstSection[0].value = splitValues(firstSection);
  lastSection[0].value = splitValues(lastSection);

  firstSection[0].type = 'select';
  lastSection[0].type = 'select';

  return [firstSection, lastSection, formData, disclaimer];
};

const buildPercentages = (rawPercentages) => {
  const tempData = {};
  rawPercentages.forEach((row) => {
    tempData[row.sumproduct] = row.result;
  });
  return tempData;
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
  let step = '';
  if ([2, 3, 5, 6].some((num) => num === e.idx)) {
    step = 'step="0.01"';
  }
  if (e.type === 'select') {
    return `
      <label for="input-${e.idx}" class="label-input-${e.idx}">${inputLabel}</label>
      <select name="input-${e.idx}" id="input-${e.idx}">
        ${e.value.map((value, idx) => `<option data-value="${idx + 1}" value="${value}">${value}</option>`)}
      </select>`;
  }
  return `
    <label class="label-input-${e.idx}" for="input-${e.idx}">${inputLabel}</label>
    <input type="${e.type}" id="input-${e.idx}" value="${e.value}" ${step}/>`;
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
  const rawData = await getInitialData();
  const initialData = formatData(rawData);
  const [,, formData, dataText] = initialData;
  const rawPercentages = await getInitialData(percentagesPath);
  const percentages = buildPercentages(rawPercentages);
  resetData.push(formData);

  const middleDisclaimerText = document.createElement('p');
  middleDisclaimerText.classList.add('disclaimer');
  middleDisclaimerText.classList.add('calculator-inputs-disclaimer');
  middleDisclaimerText.innerText = dataText;

  const currentInputsSection = createInputs(initialData[0], 'current');
  const newInputsSection = createInputs(initialData[1], 'new');

  const resetButton = createButton('reset');
  resetButton.onclick = (e) => resetForm(e);

  const allInputs = document.createElement('form');
  allInputs.classList.add('calculator-inputs-form');
  allInputs.id = 'calculator';
  allInputs.oninput = (e) => resetForm(e);

  const finalDisclaimerText = document.createElement('p');
  finalDisclaimerText.classList.add('disclaimer');
  finalDisclaimerText.classList.add('results-disclaimer');
  finalDisclaimerText.innerText = finalDisclaimer;

  // empties the block
  block.innerText = '';

  const selectorsAndCharts = results(formData, percentages);
  addAnimations(selectorsAndCharts);

  allInputs.append(currentInputsSection);
  allInputs.append(middleDisclaimerText);
  allInputs.append(newInputsSection);
  allInputs.append(resetButton);

  block.append(allInputs);
  block.append(selectorsAndCharts);

  block.append(finalDisclaimerText);
  updatedData.push(selectorsAndCharts);
}
