import getPerformanceChart from './performance-chart.js';

const addAnimations = (hpSelector, chartContainer) => {
  const initialButton = hpSelector.querySelector('.rating-item');
  initialButton.dataset.active = true;

  const allButtons = hpSelector.querySelectorAll('.rating-list');

  const initialChart = chartContainer.children[0];
  initialChart.dataset.active = true;
  const chartParent = initialChart.closest('.performance-chart-list');

  allButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const buttonParent = button.closest('ul');
      const selectedNumber = e.target.innerText.slice(0, 3);

      const clickedButton = buttonParent.querySelector(`.title-${selectedNumber}`).closest('.rating-item');
      const activeButton = buttonParent.querySelector('[data-active]');

      const clickedChart = chartParent.querySelector(`.chart-${selectedNumber}`);
      const activeChart = chartParent.querySelector('[data-active]');

      if (activeButton.innerText.slice(0, 3) !== selectedNumber) {
        clickedChart.dataset.active = true;
        delete activeChart.dataset.active;

        clickedButton.dataset.active = true;
        delete activeButton.dataset.active;
      }
    });
  });
};

const getEngineChartData = async () => {
  const response = await fetch('./performance.json');
  const json = await response.json();
  return json.data;
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

const buildPerformanceSpecifications = (block, engineData) => {
  const children = [...block.children];
  const titleDiv = children.shift();

  const title = titleDiv.querySelector('h2');
  title.classList.add('performance-title');

  const hpSelector = document.createElement('div');
  hpSelector.classList.add('performance-selector-wrapper');

  const chartContainer = document.createElement('div');
  chartContainer.classList.add('performance-chart-wrapper');

  const chartListContainer = document.createElement('ul');
  chartListContainer.classList.add('performance-chart-list');

  const ratings = [];

  engineData.forEach((engine) => {
    const engineNum = engine.rating;
    ratings.push(engineNum);

    const SVGengine = getPerformanceChart(engine);

    const chart = document.createElement('li');
    chart.classList.add('performance-chart');
    chart.classList.add(`chart-${engineNum}`);
    chart.innerHTML = SVGengine;

    chartListContainer.append(chart);
  });

  const buildSelectors = (powerRating) => {
    const ratingSelector = document.createElement('div');
    ratingSelector.classList.add('engine-rating');

    const ratingTitle = document.createElement('h6');
    ratingTitle.classList.add('rating-title');
    ratingTitle.innerText = 'Engine Ratings';

    const hpList = document.createElement('ul');
    hpList.classList.add('rating-list');

    for (const rating of powerRating) {
      const item = document.createElement('li');
      item.classList.add('rating-item');

      item.innerHTML = `
        <h5 class="title-${rating}">
          <a>${rating} HP</a>
        </h5>`;

      hpList.appendChild(item);
    }

    ratingSelector.append(ratingTitle);
    ratingSelector.append(hpList);
    hpSelector.append(ratingSelector);
  };

  buildSelectors(ratings);
  addAnimations(hpSelector, chartListContainer);

  block.textContent = '';

  chartContainer.append(chartListContainer);
  block.append(title);
  block.append(hpSelector);
  block.append(chartContainer);
};

export default async function decorate(block) {
  const typeDetector = [...block.classList];

  if (typeDetector.includes('engine')) {
    buildEngineSpecifications(block);
  } else if (typeDetector.includes('performance')) {
    const engineData = await getEngineChartData();
    buildPerformanceSpecifications(block, engineData);
  }
}
