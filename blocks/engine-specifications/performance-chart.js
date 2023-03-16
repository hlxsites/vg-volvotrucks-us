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

const buildAnimations = (engine) => {

  console.log(engine)

  const activeChart = document.querySelector('.performance-chart[data-active]')
  const activeHPpath = activeChart.querySelector('.line-path-HP')
  const activeTQpath = activeChart.querySelector('.line-path-TQ')
  

  // const letter = (idx === 0) ? 'M' : 'L';

  // const initialValues = `${letter} ${getRPMPosition(e)} ${225}`
  // const endingValues = `${letter} ${getRPMPosition(e)} ${(225 - (horsepower.values[(idx + 1)] * 0.45)).toFixed(1)}`

  // const middleValues = `${letter} ${getRPMPosition(e)} ${(225 - (horsepower.values[(idx + 1)] * 0.45) * 0.5).toFixed(1)}`
  // const oneQuarterValues = `${letter} ${getRPMPosition(e)} ${(225 - (horsepower.values[(idx + 1)] * 0.45) * 0.25).toFixed(1)}`
  // const threeQuarterValues = `${letter} ${getRPMPosition(e)} ${(225 - (horsepower.values[(idx + 1)] * 0.45) * 0.75).toFixed(1)}`


  return activepath
}

const getPerformanceChart = (data) => {
  const engineSpeedData = data[0];
  const horsepowerData = data[1];
  const torqueData = data[2];
  const engineName = data[3];

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
  stopsX.slice(0, 11).map((e, idx) => `
    <path fill="none" stroke="#e6e6e6" stroke-width="1" stroke-dasharray="none" data-z-index="1"
        d="M 68 ${(idx * 22.5) - 0.5} L 632 ${(idx * 22.5) - 0.5}" opacity="1">
    </path>`)
}

<!-- vertical lines -->
${
  RPM.values.map((e) => `
    <path fill="none" stroke="#e6e6e6" stroke-width="1" stroke-dasharray="none" data-z-index="1"
      d="M ${getRPMPosition(checkLineDisplay(e))} 0 L ${getRPMPosition(checkLineDisplay(e))} 225.5" opacity="1">
    </path>`)
}

<!-- Manually add 1100 line -->
${
  (RPM.values.includes(1100)) ? '' : `<path fill="none" stroke="#e6e6e6" stroke-width="1" stroke-dasharray="none" data-z-index="1" d="M ${getRPMPosition(checkLineDisplay(1100))} 0 L ${getRPMPosition(checkLineDisplay(1100))} 225.5" opacity="1"></path>`
}
      </g>

<!-- Reference titles -->
      <g>
        <text font-family=${fontFamily} fill=${RPM.color} x="317" y="280" style="font-size: ${RPM.fontSize}px; font-weight:400; cursor:default;" text-anchor="middle">
          ${RPM.content}
        </text>
      </g>

<!-- Color lines -->
      <!-- HORSEPOWER line -->
      <g data-z-index="3" aria-hidden="false">
        <path class="line-path-HP-${engineName}" fill="none"
          d="
${
  RPM.values.slice(0, 18).map((e, idx) => {
    const letter = (idx === 0) ? 'M' : 'L';
    return `
      ${letter} ${getRPMPosition(e)} ${225 - (horsepower.values[(idx + 1)] * 0.45 * 0.167)}
    `;
  })
  // RPM.values.slice(0, 18).map((e, idx) => {
  //   const letter = (idx === 0) ? 'M' : 'L';
  //   return `
  //     ${letter} ${getRPMPosition(e)} ${225}
  //   `;
  // })
}
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
        <path class="line-path-TQ-${engineName}" fill="none"
          d="
${
  // RPM.values.slice(0, 18).map((e, idx) => {
  //   const letter = (idx === 0) ? 'M' : 'L';
  //   return `
  //     ${letter} ${getRPMPosition(e)} ${225}
  //   `;
  // })
  RPM.values.slice(0, 18).map((e, idx) => {
    const letter = (idx === 0) ? 'M' : 'L';
    return `
      ${letter} ${getRPMPosition(e)} ${225 - (torque.values[(idx + 1)] * 0.45 * 0.167)}
    `;
  })
}
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
${
  RPM.values.map((e) => `
    <text font-family=${fontFamily} x=${getRPMPosition(e)} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
      ${checkLabelDisplay(e)}
    </text>`)
}     
<!-- Manually add 1100 label -->
${
  (RPM.values.includes(1100)) ? '' : `
    <text font-family=${fontFamily} x=${getRPMPosition(1100)} text-anchor="middle" style="color: rgb(102, 102, 102); cursor: default; font-size: 11px; font-weight: 600; fill: rgb(102, 102, 102);" y="244" opacity="1">
      ${checkLabelDisplay(1100)}
    </text>`
}
      </g>
    </svg>
  `;

  return svg;
};

export {getPerformanceChart, buildAnimations};
