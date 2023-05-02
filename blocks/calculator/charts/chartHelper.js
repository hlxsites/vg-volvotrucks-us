export const calcValuesToPoints = (chartValues, heightInPoints, { bottomPadding } = {}) => {
  const maxValue = Math.max(...chartValues);
  const minValue = Math.min(...chartValues);
  // padding for top and bottom of the chart, so the lowest value will not be equal the first y axis
  // and the last value will not 'touch' the chart top edge
  // by default it is the 1/10 of the avg
  // of the min and max values => (minValue + maxValue) / 2 * 0.1 => (minValue + maxValue) * 0.05
  const paddingValue = (minValue + maxValue) * 0.05;
  const bottomEdgeValue = bottomPadding ? minValue - bottomPadding : minValue - paddingValue;
  const topEdgeValue = maxValue + paddingValue;
  const chartValueRange = topEdgeValue - bottomEdgeValue;
  // conversionFactor helps to convert the chart value to the svg points
  // it's simple proportion:
  // heightInPoints -> valueSpread
  // x                   -> (y - bottomEdgeValue)
  // to get the y value to points just multiply the (y - bottomEdgeValue) by conversionFactory
  const conversionFactor = heightInPoints / chartValueRange;
  const valueToPoints = (value) => ((value - bottomEdgeValue) * conversionFactor).toFixed(0);

  return {
    valueToPoints,
    chartValueRange,
    bottomEdgeValue,
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
