const valueHorsepower = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
const valuesTorque = [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000];
const chartMeasures = [640, 300];
const stopsX = [
  68, 103.25, 138.5, 173.75, 209,
  244.25, 279.5, 314.75, 350, 385.25,
  420.5, 455.75, 491, 526.25, 561.5,
  596.75, 632, 667.25, 702.5, 737.75, 773];
const fontFamily = 'var(--ff-volvo-novum)';

const arrangeData = (values) => {
  const valuesArray = values.split(',');
  return valuesArray;
};

const getPerformanceChart = (data) => {
  const engineSpeedData = data[0];
  const horsepowerData = data[1];
  const torqueData = data[2];

  const RPM = {
    content: engineSpeedData[0],
    fontSize: 16,
    color: '#808285',
    values: arrangeData(engineSpeedData[1]),
    valuesToDisplay: [500, 700, 900, 1100, 1300, 1500, 1700, 1900],
  };
  const horsepower = {
    content: horsepowerData[0],
    fontSize: 16,
    color: '#78B833',
    values: arrangeData(horsepowerData[1]),
  };
  const torque = {
    content: torqueData[0],
    fontSize: 16,
    color: '#808285',
    values: arrangeData(torqueData[1]),
  };

  const getRPMPosition = (number) => {
    const result = parseFloat(((number - 500) * 0.363871) + 68).toFixed(2);
    return result;
  };

  const checkLineDisplay = (number) => {
    const parsedNumber = parseFloat(number);
    return RPM.valuesToDisplay.includes(parsedNumber) ? parsedNumber : 1100;
  };

  const checkLabelDisplay = (number) => {
    const parsedNumber = parseFloat(number);
    return RPM.valuesToDisplay.includes(parsedNumber) ? parsedNumber : '';
  };

  const svg = `
    <svg version="1.1" style="font-family:${fontFamily}x;" 
      xmlns="http://www.w3.org/2000/svg" width="${chartMeasures[0]}" height="${chartMeasures[1]}" 
      viewBox="0 -5 700 290" aria-hidden="false" aria-label="Interactive chart">

      <g data-z-index="1" aria-hidden="true">
    
      <!-- horizontal lines -->
${
  stopsX.map((e, idx) => {
    if (e<420) {
      return `<path fill="none" stroke="#e6e6e6" stroke-width="1" stroke-dasharray="none" data-z-index="1"
          d="M 68 ${(idx*22.5)-0.5} L ${stopsX[16]} ${(idx*22.5)-0.5}" opacity="1">
      </path>`
    }
  })
}
        <!-- vertical lines -->
${
  RPM.values.map((e) => {
    return `
      <path fill="none" stroke="#e6e6e6" stroke-width="1" stroke-dasharray="none" data-z-index="1"
        d="M ${getRPMPosition(checkLineDisplay(e))} 0 L ${getRPMPosition(checkLineDisplay(e))} 225.5" opacity="1">
      </path>`
  })
}

        <!-- Manually add 1100 line -->
${
  (RPM.values.includes(1100)) ? '' : `<path fill="none" stroke="#e6e6e6" stroke-width="1" stroke-dasharray="none" data-z-index="1" d="M ${getRPMPosition(checkLineDisplay(1100))} 0 L ${getRPMPosition(checkLineDisplay(1100))} 225.5" opacity="1"></path>`
}
      </g>

      <!-- Reference titles -->
      <g>
        <text font-family=${fontFamily} fill=${horsepower.color} x="16" y="128.5" transform="rotate(270,16,128.5)" style="font-size: ${horsepower.fontSize}px; font-weight:400;cursor:default;" text-anchor="middle">
          ${horsepower.content}
        </text>
        <text font-family=${fontFamily} fill=${torque.color} x="610" y="70" transform="rotate(90,624,128.5)" style="font-size: ${torque.fontSize}px; font-weight:400;cursor:default;" text-anchor="middle">
          ${torque.content}
        </text>
        <text font-family=${fontFamily} fill=${RPM.color} x="317" y="280" style="font-size: ${RPM.fontSize}px; font-weight:400; cursor:default;" text-anchor="middle">
          ${RPM.content}
        </text>
      </g>

      <!-- Color lines -->

      <!-- HORSEPOWER line -->
      <g data-z-index="3" aria-hidden="false">
        < data-z-index="0.1" opacity="1" transform="translateX(0)" aria-hidden="true">
        <path fill="none"
          d="
            M ${getRPMPosition(RPM.values[0])} ${225 - (horsepower.values[0] * 0.45)}
            L ${getRPMPosition(RPM.values[1])} ${225 - (horsepower.values[1] * 0.45)}
            L ${getRPMPosition(RPM.values[2])} ${225 - (horsepower.values[2] * 0.45)}
            L ${getRPMPosition(RPM.values[3])} ${225 - (horsepower.values[3] * 0.45)}
            L ${getRPMPosition(RPM.values[4])} ${225 - (horsepower.values[4] * 0.45)}
            L ${getRPMPosition(RPM.values[5])} ${225 - (horsepower.values[5] * 0.45)}
            L ${getRPMPosition(RPM.values[6])} ${225 - (horsepower.values[6] * 0.45)}
            L ${getRPMPosition(RPM.values[7])} ${225 - (horsepower.values[7] * 0.45)}
            L ${getRPMPosition(RPM.values[8])} ${225 - (horsepower.values[8] * 0.45)}
            L ${getRPMPosition(RPM.values[9])} ${225 - (horsepower.values[9] * 0.45)}
            L ${getRPMPosition(RPM.values[10])} ${225 - (horsepower.values[10] * 0.45)}
            L ${getRPMPosition(RPM.values[11])} ${225 - (horsepower.values[11] * 0.45)}
            L ${getRPMPosition(RPM.values[12])} ${225 - (horsepower.values[12] * 0.45)}
            L ${getRPMPosition(RPM.values[13])} ${225 - (horsepower.values[13] * 0.45)}
            L ${getRPMPosition(RPM.values[14])} ${225 - (horsepower.values[14] * 0.45)}
            L ${getRPMPosition(RPM.values[15])} ${225 - (horsepower.values[15] * 0.45)}
            L ${getRPMPosition(RPM.values[16])} ${225 - (horsepower.values[16] * 0.45)}
            L ${getRPMPosition(RPM.values[17])} ${225 - (horsepower.values[17] * 0.45)}
            L ${getRPMPosition(RPM.values[18])} ${225 - (horsepower.values[18] * 0.45)}
            "
          data-z-index="1" 
          stroke=${horsepower.color} 
          stroke-width="2" 
          stroke-linejoin="round" 
          stroke-linecap="round">
        </path>
      </g>  
      
      <!-- TORQUE line -->
      <g data-z-index="3" aria-hidden="false">
        < data-z-index="0.1" opacity="1" transform="translateX(0)" aria-hidden="true">
        <path fill="none"
          d="
            M ${getRPMPosition(RPM.values[0])} ${225 - (torque.values[0] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[1])} ${225 - (torque.values[1] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[2])} ${225 - (torque.values[2] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[3])} ${225 - (torque.values[3] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[4])} ${225 - (torque.values[4] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[5])} ${225 - (torque.values[5] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[6])} ${225 - (torque.values[6] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[7])} ${225 - (torque.values[7] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[8])} ${225 - (torque.values[8] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[9])} ${225 - (torque.values[9] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[10])} ${225 - (torque.values[10] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[11])} ${225 - (torque.values[11] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[12])} ${225 - (torque.values[12] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[13])} ${225 - (torque.values[13] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[14])} ${225 - (torque.values[14] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[15])} ${225 - (torque.values[15] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[16])} ${225 - (torque.values[16] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[17])} ${225 - (torque.values[17] * 0.45 * 0.167)}
            L ${getRPMPosition(RPM.values[18])} ${225 - (torque.values[18] * 0.45 * 0.167)}
            "
          data-z-index="1" 
          stroke=${torque.color} 
          stroke-width="2" 
          stroke-linejoin="round" 
          stroke-linecap="round">
        </path>
      </g>

    <!-- Blue rectangle -->
    <path d="M 300 0 L 300 225" transform="translate(0,0)" stroke="#265fa6" stroke-width="134" opacity="0.2"></path>
  
    <!-- horizontal values - RPM -->
    
    <g data-z-index="7" aria-hidden="true">
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[0])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[0])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[1])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[1])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[2])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[2])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[3])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[3])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[4])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[4])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[5])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[5])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[6])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[6])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[7])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[7])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[8])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[8])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[9])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[9])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[10])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[10])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[11])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[11])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[12])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[12])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[13])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[13])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[14])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[14])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[15])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[15])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[16])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[16])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[17])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[17])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[18])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[18])}
      </text>
      <text font-family=${fontFamily} x=${getRPMPosition(RPM.values[19])} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
        ${checkLabelDisplay(RPM.values[19])}
      </text>

    
      <!-- Manually add 1100 label -->
${(RPM.values.includes(1100)) ? '' : `
  <text font-family=${fontFamily} x=${getRPMPosition(1100)} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
    ${checkLabelDisplay(1100)}
  </text>`
}
      </g>
    
      <!-- vertical values - Horsepower -->
      <g data-z-index="7" aria-hidden="true">
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="230" opacity="1">
          ${valueHorsepower[0]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="207.5" opacity="1">
          ${valueHorsepower[1]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="185" opacity="1">
          ${valueHorsepower[2]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="162.5" opacity="1">
          ${valueHorsepower[3]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="140" opacity="1">
          ${valueHorsepower[4]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="118" opacity="1">
          ${valueHorsepower[5]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="96" opacity="1">
          ${valueHorsepower[6]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="73.5" opacity="1">
          ${valueHorsepower[7]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="51" opacity="1">
          ${valueHorsepower[8]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="29" opacity="1">
          ${valueHorsepower[9]}
        </text>
        <text font-family=${fontFamily} x="60" text-anchor="end" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="7" opacity="1">
          ${valueHorsepower[10]}
        </text>
      </g>
    
      <!-- vertical values - Torque -->
      <g data-z-index="7" aria-hidden="true">
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="230" opacity="1">
          ${valuesTorque[0]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="207.5" opacity="1">
          ${valuesTorque[1]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="185" opacity="1">
          ${valuesTorque[2]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="162.5" opacity="1">
          ${valuesTorque[3]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="140" opacity="1">
          ${valuesTorque[4]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="118" opacity="1">
          ${valuesTorque[5]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="96" opacity="1">
          ${valuesTorque[6]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="73.5" opacity="1">
          ${valuesTorque[7]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="51" opacity="1">
          ${valuesTorque[8]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="29" opacity="1">
          ${valuesTorque[9]}
        </text>
        <text font-family=${fontFamily} x="640" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);" y="7" opacity="1">
          ${valuesTorque[10]}
        </text>
      </g>
    </svg>
  `;

  return svg;
};

export default getPerformanceChart;
