const colorArray = ['#919296', '#77B733'];

const totalWidthChart = 800;
const totalHeightChart = totalWidthChart * 0.6;

const buildReferences = (keys) => {
  const references = [];

  keys.forEach((e, idx) => {
    const factor = idx === 0 ? 0.3 : 0.7;
    const xPosition = keys.length === 1 ? totalWidthChart * 0.5 : totalWidthChart * factor;

    const ref = `
      <g data-z-index="1">
        <text
          x="${xPosition}"
          y="${10}"
          text-anchor="middle"
          data-z-index="2"
          class="chart-reference"
        >
          ${e}
        </text>

        <rect
          x="${xPosition}"
          y="${20}"
          width="12"
          height="12"
          fill="${keys.length === 1 ? colorArray[1] : colorArray[idx]}"
          data-z-index="3"
          >
        </rect>
      </g>`;
    references.push(ref);
  });
  return references;
};

const buildChartMPG = (data) => {
  const chartName = Object.keys(data);
  const valuesSets = Object.values(data);

  const chartKeys = Object.keys(valuesSets[0]);
  const chartValues = Object.values(valuesSets[0]);

  const conversionFactor = 60;

  const yAxisStart = 300;

  // BARS
  const barHeight1 = (chartValues[0] * conversionFactor).toFixed(0) - yAxisStart;
  const barHeight2 = (chartValues[1] * conversionFactor).toFixed(0) - yAxisStart;

  const barWidth = totalWidthChart / 4;

  const maxValue = Math.max(...chartValues);
  const minValue = Math.min(...chartValues);

  // LABELS
  const maxChart = Number((maxValue * 1.3).toFixed(1));
  const minChart = Number((minValue * 0.7).toFixed(1));
  const chartHeight = Number((maxChart - minChart).toFixed(0));

  const divisions = 6;
  const sectionHeight = Number((chartHeight / divisions).toFixed(1));

  const labelValues = [];

  for (let i = 0; i < divisions; i += 1) {
    const position = sectionHeight * i;
    labelValues.push(position);
  }

  const svg = `
    <svg
      style="transform: translate(10px, 0px)"
      xmlns="http://www.w3.org/2000/svg"
      width="${totalWidthChart}"
      height="${totalHeightChart}"
      viewBox="0 155 ${totalWidthChart} 10"
      aria-hidden="false"
      aria-label="Interactive chart"
      class="calculator-results-chart"
    >

    <!-- TITLE -->
    <g data-z-index="7" aria-hidden="true">
      <text
        x="${totalWidthChart * 0.5}"
        y="${-50}"
        text-anchor="middle"
        data-z-index="4"
        aria-hidden="true"
        class="chart-title"
      >
        ${chartName}
      </text>
    </g>

    <!-- REFERENCES -->
    <g data-z-index="7" aria-hidden="true">
      ${buildReferences(chartKeys)}
    </g>

    <!-- COLOR BARS AND VALUES-->
    <g data-z-index="7" aria-hidden="false" role="region" tabindex="-1" class="chart-bars">
      <rect
        x="${(totalWidthChart * 0.3) - (barWidth / 2)}"
        y="${yAxisStart - barHeight1}"
        width="${barWidth}"
        height="${barHeight1}"
        fill="${colorArray[0]}"
        class="bar">
      </rect>
      <rect
        x="${(totalWidthChart * 0.7) - (barWidth / 2)}"
        y="${yAxisStart - barHeight2}"
        width="${barWidth}"
        height="${barHeight2}"
        fill="${colorArray[1]}"
        class="bar">
      </rect>
      <text
        x="${totalWidthChart * 0.3}"
        text-anchor="middle"
        y="${(yAxisStart - (barHeight1 * 0.5) + 5)}"
        opacity="1"
        class="text"
      >
        ${chartValues[0]}
      </text>
      <text
        x="${totalWidthChart * 0.7}"
        text-anchor="middle"
        y="${(yAxisStart - (barHeight2 * 0.5) + 5)}"
        opacity="1"
        class="text"
      >
        ${chartValues[1]}
      </text>
    </g>

    <!-- LEFT VALUES AND LINES -->
    <g data-z-index="1" aria-hidden="true" class="side-labels">
  ${labelValues.map((e) => {
    const yValue = (minChart + e).toFixed(1);
    const yPosition = 300 - (e * conversionFactor);

    const lineAndValue = `
      <text
        x="${80}"
        text-anchor="end"
        y="${yPosition + 5}"
        class="text"
      >
        ${yValue}
      </text>
      <path
        data-z-index="1"
        fill="none"
        stroke="${colorArray[0]}"
        stroke-width="1"
        stroke-dasharray="none"
        class="line"
        d="M ${85} ${yPosition} L ${totalWidthChart - 50} ${yPosition}">
      </path>`;
    return lineAndValue;
  })}
    </g>

    <!-- SUBTITLE -->
    <g data-z-index="7" aria-hidden="true">
      <text
        x="${totalWidthChart * 0.5}"
        y="${350}"
        text-anchor="middle"
        data-z-index="4"
        aria-hidden="true"
        class="chart-subtitle"
      >
        MPG
      </text>
    </g>
  </svg>`;

  return svg;
};

export default buildChartMPG;
