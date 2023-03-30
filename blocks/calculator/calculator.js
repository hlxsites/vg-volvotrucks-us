const currentInputListData = [
  {idx: 1, label: 'Baseline Powertrain', type: 'select', value: [
    'truck 1',
    'truck 2',
    'truck 3',
    'truck 4',
  ]},
  {idx: 2, label: 'Price of Fuel', type: 'number', value: 5,},
  {idx: 3, label: 'Current MPG', type: 'number', value: 7,},
  {idx: 4, label: 'Miles/Truck/Year', type: 'number', value: 125000,},
  {idx: 5, label: 'Annual Fuel Price Increase', type: 'number', value: 1,},
  {idx: 6, label: 'Price of DEF', type: 'number', value: 3.95,},
  {idx: 7, label: 'DEF% Usage', type: 'number', value: 3.5,},
];
const newInputListData = [
  {idx: 1, label: 'Next-Gen D13TC Powertrain', type: 'select', value: [
    'truck 1',
    'truck 2',
    'truck 3',
    'truck 4',
  ]},
  {idx: 2, label: 'Number of New Trucks', type: 'number', value: 1,}
];

const resetForm = () => {
  console.log('click')
};

const createButton = (type) => {
  const button = document.createElement('button');
  button.classList.add(`${type}-button`);
  button.id = `${type}-button`;
  button.innerText = `${type} calculator`;
  button.style = 'text-transform: capitalize'

  button.onclick = () => resetForm();

  return button;
}

const getInputType = (e) => {
  if (e.type === 'select') {
    return `
      <label for="input-${e.idx}" class="label-input-${e.idx}">${e.label}</label>
      <select name="input-${e.idx}" class="input-${e.idx}">
        ${e.value.forEach(value => `<option value="${value}"></option>`)}
      </select>`
  } else {
    return `
      <label class="label-input-${e.idx}">${e.label}</label>
      <input type="${e.type}" class="input-${e.idx}" value="${e.value}"/>`
  };
};

const createInputs = (data, type) => {
  const truckSection = document.createElement('div');
  truckSection.classList.add(`${type}-truck-wrapper`);

  const truckTitle = document.createElement('h3');
  truckTitle.classList.add(`${type}-truck-title`);
  truckTitle.innerText = `${type} trucks`;
  truckTitle.style = 'text-transform: capitalize'

  const inputForm = document.createElement('form');
  inputForm.classList.add(`${type}-form`);
  inputForm.id = `${type}-form-id`;

  const inputList = document.createElement('ul');
  inputList.classList.add(`${type}-input-list`);

  data.forEach(input => {
    const listItem = document.createElement('li');
    listItem.classList.add(`${type}-input-${input.idx}`);
    listItem.innerHTML = getInputType(input);
    inputList.append(listItem);
  });
  inputForm.append(inputList);
  truckSection.append(truckTitle);
  truckSection.append(inputForm);

  return truckSection;
};

export default function decorate(block) {

  const currentInputsSection = createInputs(currentInputListData, 'current')  
  const newInputsSection = createInputs(newInputListData, 'new')  



  const resetButton = createButton('reset')

  block.innerText = ''

  block.append(currentInputsSection)
  block.append(newInputsSection)
  block.append(resetButton)


}