import {getPerformanceChart, buildAnimations} from './performance-chart.js';

const addAnimations = (hpSelector, chartContainer) => {
  const initialButton = hpSelector.querySelector('.rating-item');
  initialButton.dataset.active = true;

  const allButtons = hpSelector.querySelectorAll('.rating-list');

  const initialPower = hpSelector.querySelector('.power-item');
  initialPower.dataset.active = true;
  const powerParent = initialPower.closest('ul');

  const initialTorque = hpSelector.querySelector('.torque-item');
  initialTorque.dataset.active = true;
  const torqueParent = initialTorque.closest('ul');

  const initialChart = chartContainer.children[0];
  initialChart.dataset.active = true;
  const chartParent = initialChart.closest('.performance-chart-wrapper');

  allButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const buttonParent = button.closest('ul');
      const selectedNumber = e.target.innerText.slice(0, 3);

      const clickedButton = buttonParent.querySelector(`.title-${selectedNumber}`).closest('.rating-item');
      const activeButton = buttonParent.querySelector('[data-active]');

      const clickedPower = powerParent.querySelector(`.power-${selectedNumber}`).closest('.power-item');
      const activePower = powerParent.querySelector('[data-active]');

      const clickedTorque = torqueParent.querySelector(`.torque-${selectedNumber}`).closest('.torque-item');
      const activeTorque = torqueParent.querySelector('[data-active]');

      const clickedChart = chartParent.querySelector(`.chart-${selectedNumber}`);
      const activeChart = chartParent.querySelector('[data-active]');

      if (activeButton.innerText.slice(0,3) != selectedNumber) {
        
        // const animation = buildAnimations(selectedNumber)
        
        clickedChart.dataset.active = true;
        delete activeChart.dataset.active;
  
        clickedTorque.dataset.active = true;
        delete activeTorque.dataset.active;
  
        clickedPower.dataset.active = true;
        delete activePower.dataset.active;
  
        clickedButton.dataset.active = true;
        delete activeButton.dataset.active;
      };
    });
  });
};

const buildEngineSpecifications = (block) => {
  const children = [...block.children];
  const titleDiv = children.shift();

  const title = titleDiv.querySelector('h2');
  title.classList.add('engine-title');

  const ul = document.createElement('ul');
  ul.classList.add('item-list');

  children.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('item-wrapper');

    const sectionTitle = row.querySelector('h6');
    sectionTitle.classList.add('item-title');
    const content = row.querySelector('h5');
    content.classList.add('item-content');

    li.append(sectionTitle);
    li.append(content);
    ul.append(li);
  });

  block.textContent = '';

  block.append(title);
  block.append(ul);
};

const buildPerformanceSpecifications = (block) => {
  const children = [...block.children];
  const titleDiv = children.shift();

  const title = titleDiv.querySelector('h2');
  title.classList.add('performance-title');

  const hpSelector = document.createElement('div');
  hpSelector.classList.add('performance-selector-wrapper');

  const chartContainer = document.createElement('ul');
  chartContainer.classList.add('performance-chart-wrapper');

  const ratings = [];

  const engine455 = { ...[children[0], children[1]] , name: 455};
  const engine425 = { ...[children[2], children[3]] , name: 425 };
  const engine405 = { ...[children[4], children[5]] , name: 405 };

  const buildEngineData = (data) => {
    const getRatings = [...data[0].querySelectorAll('p')].map((e) => e.innerHTML);

    data.rating = getRatings;

    delete data[0];

    const PeakTitles = [...data[1].querySelectorAll('h6')].map((e) => e.innerHTML);
    const PeakValues = [...data[1].querySelectorAll('h5')].map((e) => e.innerHTML);

    data.peakHorsepower = [PeakTitles[0], PeakValues[0]];
    data.peakTorque = [PeakTitles[1], PeakValues[1]];

    const getValues = [...data[1].querySelectorAll('li')].map((e) => e.innerHTML);

    const rpm = [getValues[0], getValues[1]];
    const hp = [getValues[2], getValues[3]];
    const tq = [getValues[4], getValues[5]];
    const engine = data.name

    data.values = [rpm, hp, tq, engine];

    delete data[1];

    return data;
  };

  buildEngineData(engine455);
  buildEngineData(engine425);
  buildEngineData(engine405);

  const engines = [engine455, engine425, engine405];

  engines.forEach((engine) => {
    const engineNum = engine.rating[1].slice(0, 3);
    ratings.push(engineNum);

    const SVGengine = getPerformanceChart(engine.values);

    const chart = document.createElement('li');
    chart.classList.add('performance-chart');
    chart.classList.add(`chart-${engineNum}`);
    chart.innerHTML = SVGengine;

    chartContainer.append(chart);
  });

  const buildSelectors = (data, powerRating) => {
    const horsepower = document.createElement('div');
    horsepower.classList.add('engine-rating');
    horsepower.innerHTML = `
      <h6 class="rating-title">Engine Ratings</h6>
      <ul class="rating-list">
        <li class="rating-item">
          <h5 class="title-${powerRating[0]}">
            <a>${powerRating[0]} HP</a>
          </h5>
        </li>
        <li class="rating-item">
          <h5 class="title-${powerRating[1]}">
            <a>${powerRating[1]} HP</a>
          </h5>
        </li>
        <li class="rating-item">
          <h5 class="title-${powerRating[2]}">
            <a>${powerRating[2]} HP</a>
          </h5>
        </li>
      </ul>
    `;

    const powerAndTorque = document.createElement('div');
    powerAndTorque.classList.add('peak-rating');
    powerAndTorque.innerHTML = `
      <div>
        <h6 class="power-title">Peak power</h6>
        <ul class="power-list">
          <li class="power-item">
            <h5 class="power-${powerRating[0]}">${data[0].peakHorsepower[1]}</h5>
          </li>
          <li class="power-item">
            <h5 class="power-${powerRating[1]}">${data[1].peakHorsepower[1]}</h5>
          </li>
          <li class="power-item">
            <h5 class="power-${powerRating[2]}">${data[2].peakHorsepower[1]}</h5>
          </li>         
        </ul>
      </div>  
      <div>  
        <h6 class="torque-title">Peak torque</h6>
        <ul class="torque-list">
          <li class="torque-item">
            <h5 class="torque-${powerRating[0]}">${data[0].peakTorque[1]}</h5>
          </li>
          <li class="torque-item">
            <h5 class="torque-${powerRating[1]}">${data[1].peakTorque[1]}</h5>
          </li>
          <li class="torque-item">
            <h5 class="torque-${powerRating[2]}">${data[2].peakTorque[1]}</h5>
          </li>
        </ul>
      </div>
    `;
    hpSelector.append(horsepower);
    hpSelector.append(powerAndTorque);
  };

  buildSelectors(engines, ratings);
  addAnimations(hpSelector, chartContainer);

  block.textContent = '';

  block.append(title);
  block.append(hpSelector);
  block.append(chartContainer);
};

export default function decorate(block) {
  const typeDetector = [...block.classList];

  if (typeDetector.includes('engine')) {
    buildEngineSpecifications(block);
  } else if (typeDetector.includes('performance')) {
    buildPerformanceSpecifications(block);
  }

}
