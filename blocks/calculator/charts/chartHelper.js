export const calcValuesToPoints = (chartValues, heightInPoints, { bottomPadding } = {}) => {
  const maxValue = Math.max(...chartValues);
  const minValue = Math.min(...chartValues);
  // padding for top and bottom of the chart so the lowest value will not be equal the first y axis
  // and the last value will not 'touch' the chart top point
  // it is the 1/10 of the avg of the min and max values => (minValue + maxValue) / 2 * 0.1
  const paddingValue = (minValue + maxValue) * 0.05;
  const minChartValue = bottomPadding ? minValue - bottomPadding : minValue - paddingValue;
  const maxChartValue = maxValue + paddingValue;
  const chartHeightInPoints = heightInPoints;
  const valueSpread = maxChartValue - minChartValue;
  // conversionFactor helps to convert the chart value to the svg points
  // it's simple proportion:
  // chartHeightInPoints -> valueSpread
  // x                   -> (y - minChartValue)
  // to get the y value to poinsts just multiply the (y - minChartValue) by conversionFactory
  const conversionFactor = chartHeightInPoints / valueSpread;
  const valueToPoints = (value) => ((value - minChartValue) * conversionFactor).toFixed(0);

  return {
    valueToPoints,
    valueSpread,
    minChartValue,
    chartHeightInPoints,
    conversionFactor,
  };
};

export const buildReferences = (keys, width, colorArray) => {
  const references = [];

  keys.forEach((e, idx) => {
    const factor = idx === 0 ? 0.3 : 0.7;
    const xPosition = keys.length === 1 ? width * 0.5 : width * factor;

    const ref = `
      <g data-z-index="1">
        <text
          x="${xPosition}"
          y="${-30}"
          text-anchor="middle"
          data-z-index="2"
          class="chart-reference"
        >
          ${e}
        </text>

        <rect
          x="${xPosition}"
          y="${-20}"
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
