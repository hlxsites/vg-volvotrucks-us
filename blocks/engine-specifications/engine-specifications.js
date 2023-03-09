import getPerformanceChart from './performance-chart.js';

const addEventListeners = () => {
  console.log('hola');
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

  const hpselector = document.createElement('div');
  hpselector.classList.add('performance-selector-wrapper');

  const chartContainer = document.createElement('div');
  chartContainer.classList.add('performance-chart-wrapper');

  const ratings = [];

  const engine455 = { ...[children[0], children[1]] };
  const engine425 = { ...[children[2], children[3]] };
  const engine405 = { ...[children[4], children[5]] };

  const buildEngineData = (data) => {
    const getRatings = [...data[0].querySelectorAll('p')].map((e) => e.innerHTML);

    data.rating = getRatings;

    delete data[0];

    const PeakTitles = [...data[1].querySelectorAll('h6')].map((e) => e.innerHTML);
    const PeakValues = [...data[1].querySelectorAll('h5')].map((e) => e.innerHTML);

    data.peakHorsepower = [PeakTitles[0], PeakValues[0]];
    data.peakTorque = [PeakTitles[1], PeakValues[1]];

    const getValues = [...data[1].querySelectorAll('li')].map((e) => e.innerHTML);

    const RPM = [getValues[0], getValues[1]];
    const HP = [getValues[2], getValues[3]];
    const Torque = [getValues[4], getValues[5]];

    data.values = [RPM, HP, Torque];

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

    const div = document.createElement('div');
    div.classList.add('performance-chart');
    div.classList.add(`${engineNum}-engine`);
    div.innerHTML = SVGengine;

    chartContainer.append(div);
  });

  const buildSelectors = (data, powerRating) => {
    const div = document.createElement('div');
    div.classList.add('engine-rating');
    div.innerHTML = `
      <h6 class="rating-title">Engine Ratings</h6>
      <ul class="rating-list">
        <li class="rating-item">
          <h5 class="title-${powerRating[0]}">
            <a>${powerRating[0]}</a>
          </h5>
        </li>
        <li class="rating-item">
          <h5 class="title-${powerRating[1]}">
            <a>${powerRating[1]}</a>
          </h5>
        </li>
        <li class="rating-item">
          <h5 class="title-${powerRating[2]}">
            <a>${powerRating[2]}</a>
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
    hpselector.append(div);
    hpselector.append(powerAndTorque);
  };

  buildSelectors(engines, ratings);

  const startingChart = chartContainer.children[0]
  startingChart.dataset.active = true
  // startingChart.classList.add('active')
  console.log(startingChart)

  block.textContent = '';

  block.append(title);
  block.append(hpselector);
  block.append(chartContainer);
};

export default function decorate(block) {
  const typeDetector = [...block.classList];

  if (typeDetector.includes('engine')) {
    buildEngineSpecifications(block);
  } else if (typeDetector.includes('performance')) {
    buildPerformanceSpecifications(block);
    addEventListeners();
  }
}
