import TOOLS_VALUES from './tools-config.js';

const { SIDEKICK_LIBRARY_EXTENDS } = TOOLS_VALUES;

const library = document.createElement('sidekick-library');
library.config = {
  base: '/block-library/library.json',
  extends: SIDEKICK_LIBRARY_EXTENDS,
  plugins: {
    blocks: {
      viewPorts: [
        {
          width: '375px',
          label: 'Phone',
          icon: 'device-phone',
        },
        {
          width: '744px',
          label: 'Tablet',
          icon: 'device-tablet',
        },
        {
          width: '1200px',
          label: 'Desktop 1200',
          icon: 'device-desktop',
        },
        {
          width: '1440px',
          label: 'Desktop 1440',
          icon: 'device-desktop',
          default: true,
        },
      ],
    },
  },
};

document.body.prepend(library);
