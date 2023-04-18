const colorArray = ['#919296', '#77B733'];

// this sets the size of the svg and some measures are taken in relation to that
const totalWidthChart = 800;
const totalHeightChart = totalWidthChart * 0.6;

const buildReferences = (keys) => {
  // this function creates and returns the references to the chart.
  // Its a text with a small square for each reference there is
  const references = [];

  keys.forEach((e, idx) => {
    // these 2 variables position the references as long as there are only 1 or 2
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

const buildChartCumulativeSavings = (data) => {
  // this builds and returns the complete SVG

  // get the information sorted
  const chartName = Object.keys(data);
  const valuesSets = Object.values(data);

  // this conversion factor makes all the values from the chart related
  const conversionFactor = 0.006;
  const chartKeys = Object.keys(valuesSets[0]);
  const chartValues = valuesSets[0][chartKeys[0]];

  // this value is because the svg counts from the top so the initial "0" is actually position 300
  const yAxisStart = 300;
  const maxValue = Math.max(...chartValues);

  // SIDE LABELS - top and bottom value and an extra 30% so that the line does not go to the top
  const maxChart = Number((maxValue * 1.3).toFixed(0));
  const minChart = 0;
  const chartHeight = Number((maxChart - minChart).toFixed(0));

  // amount of lines on the chart
  const divisions = 6;
  const sectionHeight = Number((chartHeight / divisions).toFixed(1));

  // get the label heights to position them
  const labelValues = [];
  for (let i = 0; i < divisions; i += 1) {
    const position = sectionHeight * i;
    labelValues.push(position);
  }

  // main SVG element that gets returned. Every section has a comment indicating what it is
  const svg = `
    <svg
      style="transform: translate(10px, 0px)"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="${totalWidthChart}"
      height="${totalHeightChart}"
      viewBox="0 155 ${totalWidthChart} 10"
      aria-hidden="false"
      aria-label="Interactive chart"
      class="calculator-results-chart"
    >

    <!-- TITLE -->
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

    <!-- REFERENCES -->
    <g data-z-index="-1" aria-hidden="true">
      ${buildReferences(chartKeys)}
    </g>

    <!-- COLOR BARS AND VALUES-->
    <g data-z-index="4" aria-hidden="false" role="region" opacity="1">
    ${chartValues.map((e, idx) => {
    // the values get converted to be able to display them in the colored bars
    const barHeight = (e * conversionFactor).toFixed(0);

    const barWidth = totalWidthChart / 10;
    const section = (totalWidthChart - 100) / 5;

    return `
    <rect
      x="${95 + (section * idx)}"
      y="${yAxisStart - barHeight}"
      width="${barWidth}"
      height="${barHeight}"
      fill="${colorArray[1]}"
      data-z-index="4">
    </rect>

    <text
      x="${95 + (section * idx) + (barWidth / 2)}"
      y="${330}"
      text-anchor="middle"
      data-z-index="4"
      aria-hidden="true"
      class="year-label"
      >
        Year ${1 + idx}
      </text>`;
  })
}
  </g>

    <!-- LEFT VALUES AND LINES -->
    <g data-z-index="3" aria-hidden="true" class="side-labels">
      ${labelValues.map((e) => {
    // side labels and the lines are constructed with the same factor to position them
    const roundedNumber = (Math.round(e / 100)) * 100;
    const yValue = (minChart + roundedNumber).toFixed(0);
    const yPosition = 300 - (roundedNumber * conversionFactor);

    const lineAndValue = `
      <text
        x="${80}"
        text-anchor="end"
        y="${yPosition + 5}"
        class="text"
      >
        $${yValue}
      </text>
      <path
        fill="none"
        stroke="${colorArray[0]}"
        stroke-width="1"
        stroke-dasharray="none"
        data-z-index="-1"
        d="M ${85} ${yPosition} L ${totalWidthChart - 50} ${yPosition}"
        data-z-index="1"
        class="line"
        >
      </path>`;
    return lineAndValue;
  })
}
    </g>
  </svg>`;

  return svg;
};

export default buildChartCumulativeSavings;
