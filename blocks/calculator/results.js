import charts from './charts.js';
// TODO delete this and replace with real values from the form
import mockChartValues from './mockChartValues.js';

const nth = (num) => {
  // a function just to add the correct suffix
  switch (num) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const getPercentageAndTable = (data) => {
  // creating the result component with the percentage value and the table
  const resultsSection = document.createElement('div');
  resultsSection.classList.add('calculator-result-wrapper');

  const title = document.createElement('h3');
  title.innerText = 'Results';
  title.classList.add('calculator-results-title');

  const percentageResult = document.createElement('div');
  percentageResult.innerHTML = `    
    <p class='percentage-label'>Fuel enconomy efficiency improvement</p>
    <p class='percentage-result'>${data.percentage}%</p>`;
  percentageResult.classList.add('percentage-wrapper');

  let table = `
    <tr>
      <th></th>
      <th>Per truck</th>
      <th>Total savings</th>
    </tr>
    ${data.savings.map((e, idx) => `
        <tr>
          <td>${idx + 1}${nth(idx + 1)} Year</td>
          <td>$${e[0]}</td>
          <td>$${e[1]}</td>
        </tr>`)}`;
  table = table.replaceAll(',', '');

  const savingsTable = document.createElement('table');
  savingsTable.innerHTML = table;
  savingsTable.classList.add('calculator-savings-table');

  resultsSection.append(title);
  resultsSection.append(percentageResult);
  resultsSection.append(savingsTable);

  return resultsSection;
};

// this variable was created in order to check that whenever it changes,
// a new table+chart is created
let updatedData = [];

const calculateChartData = (data) => {
  // TODO use the data parameter to calculate and return the result with the mock format

  console.log('Charts Data');
  console.log(data);

  const result = mockChartValues;
  return result;
};

const calculateTableData = (data) => {
  // TODO use the data parameter to calculate and return the result with the mock format

  console.log('Table Data');
  console.log(data);

  const mockResult = {
    percentage: 8,
    savings: [
      [6797, 6797],
      [6863, 13659],
      [6930, 20589],
      [6997, 27586],
      [7065, 34651],
    ],
  };
  const result = mockResult;
  return result;
};

const resetForm = (e) => {
  e.preventDefault();
  // this creates an object with the same format as the spreadsheet
  const data = {
    '1_baseline_powertrain': (e.srcElement.form[0].value),
    '2_price_of_fuel': (e.srcElement.form[1].value),
    '3_current_MPG': (e.srcElement.form[2].value),
    '4_miles/Truck/Year': (e.srcElement.form[3].value),
    '5_annual_fuel_price_increase': (e.srcElement.form[4].value),
    '6_price_of_DEF': (e.srcElement.form[5].value),
    '7_DEF%_usage': (e.srcElement.form[6].value),
    '8_next-gen_D13TC_powertrain': (e.srcElement.form[7].value),
    '9_number_of_new_trucks': (e.srcElement.form[8].value),
  };

  const chartData = calculateChartData(data);
  const tableData = calculateTableData(data);

  const builtCharts = charts(chartData);
  const builtTable = getPercentageAndTable(tableData);

  updatedData = [];
  updatedData = [builtCharts, builtTable];
};

const results = (data) => {
  // these 2 should make the data into the correct format
  const chartData = calculateChartData(data);
  const tableData = calculateTableData(data);

  const result = document.createElement('div');

  // now format is correct and values calculated, create the charts and table components
  const builtCharts = charts(chartData);
  const builtTable = getPercentageAndTable(tableData);

  // TODO this was a solution to change the component when the data changes
  // TODO It should delete the content of the result component before adding the new.
  updatedData.onchange = () => {
    result.append(updatedData[0]);
    result.append(updatedData[1]);
  };

  // this builds the components for the first time
  result.append(builtTable);
  result.append(builtCharts);

  return result;
};

export { results, resetForm };
