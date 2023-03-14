// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// OneTrust Cookies Consent Notice start
loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
  type: 'text/javascript',
  charset: 'UTF-8',
  'data-domain-script': 'ec7e1b30-6b41-4e0f-ae45-623aa2563922',
});

window.OptanonWrapper = () => {
  const currentOnetrustActiveGroups = window.OnetrustActiveGroups;

  window.OneTrust.OnConsentChanged(() => {
    // reloading the page only when the active group has chaned
    if (currentOnetrustActiveGroups !== window.OnetrustActiveGroups) {
      window.location.reload();
    }
  });
};
// OneTrust Cookies Consent Notice end
