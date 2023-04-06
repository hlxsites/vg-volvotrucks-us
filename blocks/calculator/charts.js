import buildChartMPG from './charts/buildChartMPG.js';
import buildChartYearSavings from './charts/buildChartYearSavings.js';
import buildChartFuelUsage from './charts/buildChartFuelUsage.js';
import buildChartCumulativeSavings from './charts/buildChartCumulativeSavings.js';

const charts = (data) => {
  // TODO data is what the chart is using to build the SVGs.
  // TODO Now its hardcoded but it should come from the calculation done in results
  console.warn('building chart');
  console.warn(data);

  // this gives the data a usable format
  const categories = Object.values(data);

  const chartsSection = document.createElement('div');
  chartsSection.classList.add('calculator-charts-wrapper');

  const chartSelectors = document.createElement('div');
  chartSelectors.classList.add('charts-selectors');

  // create the selector and give the first one the data-active attribute
  categories.forEach((e, idx) => {
    const anchor = document.createElement('a');
    anchor.classList.add('selector');
    anchor.id = idx;
    anchor.innerText = Object.keys(e);
    idx === 0 && (anchor.dataset.active = true);

    chartSelectors.append(anchor);
  });

  const chartsList = document.createElement('ul');
  chartsList.classList.add('charts-wrapper');

  // Build all the charts separately and give the first one the data-active atribute
  data.forEach((e, idx) => {
    const chart = document.createElement('li');
    chart.id = idx;
    chart.classList.add('chart');
    idx === 0 && (chart.dataset.active = true);

    if (idx === 0) {
      chart.innerHTML = buildChartMPG(e);
    } else if (idx === 1) {
      chart.innerHTML = buildChartYearSavings(e);
    } else if (idx === 2) {
      chart.innerHTML = buildChartFuelUsage(e);
    } else if (idx === 3) {
      chart.innerHTML = buildChartCumulativeSavings(e);
    }
    chartsList.append(chart);
  });
  chartsSection.append(chartSelectors);
  chartsSection.append(chartsList);

  return chartsSection;
};

export default charts;
