// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

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
