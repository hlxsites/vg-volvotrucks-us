// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// OneTrust Cookies Consent Notice
if (window.location.host.includes('volvotrucks.us')) {
  // on localhost/hlx.page/hlx.live the consent notice is displayed every time the page opens,
  // because the cookie is not persistent. To avoid this annoyance, disable unless on the
  // production page.
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    'data-domain-script': 'ec7e1b30-6b41-4e0f-ae45-623aa2563922',
  });

  window.OptanonWrapper = () => {
  };
}
