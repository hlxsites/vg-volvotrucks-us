// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const cookieSetting = decodeURIComponent(document.cookie.split(';').find((cookie) => cookie.trim().startsWith('OptanonConsent=')));
const isGtmAllowed = cookieSetting.includes('C0002:1');

if (isGtmAllowed) {
  loadGoogleTagManager();
}

// add more delayed functionality here
document.addEventListener('click', (e) => {
  if (e.target.matches('.semitrans')) {
    const trigger = e.target.parentElement.querySelector('.semitrans-trigger');
    if (trigger.ariaExpanded === 'true') {
      trigger.ariaExpanded = false;
      document.body.classList.remove('disable-scroll');
    }
  }
});

// OneTrust Cookies Consent Notice start for volvotrucks.us
if (!window.location.host.includes('hlx.page') && !window.location.host.includes('localhost') && !window.location.pathname.includes('srcdoc')) {
  // when running on localhost in the block library host is empty but the path is srcdoc
  // on localhost/hlx.page/hlx.live the consent notice is displayed every time the page opens,
  // because the cookie is not persistent. To avoid this annoyance, disable unless on the
  // production page.
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    'data-domain-script': 'e8ffed56-4bb1-43fd-9b41-bc4385267ec8',
  });

  window.OptanonWrapper = () => {
    const currentOnetrustActiveGroups = window.OnetrustActiveGroups;

    function isSameGroups(groups1, groups2) {
      const s1 = JSON.stringify(groups1.split(',').sort());
      const s2 = JSON.stringify(groups2.split(',').sort());

      return s1 === s2;
    }

    window.OneTrust.OnConsentChanged(() => {
      // reloading the page only when the active group has changed
      if (!isSameGroups(currentOnetrustActiveGroups, window.OnetrustActiveGroups)) {
        window.location.reload();
      }
    });
  };
}

// Google Analytics
async function loadGoogleTagManager() {
  // google tag manager
  // eslint-disable-next-line func-names
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); const f = d.getElementsByTagName(s)[0]; const j = d.createElement(s); const
      dl = l !== 'dataLayer' ? `&l=${l}` : ''; j.async = true; j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`; f.parentNode.insertBefore(j, f);
  }(window, document, 'script', 'dataLayer', 'GTM-KP9KZWR'));
}

// FaceBook Pixel
// eslint-disable-next-line no-unused-expressions
!(function (f, b, e, v, n, t, s) {
  // eslint-disable-next-line no-multi-assign,no-param-reassign
  if (f.fbq) return; n = f.fbq = function () {
    // eslint-disable-next-line no-unused-expressions
    n.callMethod
    // eslint-disable-next-line prefer-spread,prefer-rest-params
      ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  // eslint-disable-next-line no-underscore-dangle
  if (!f._fbq)f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
  // eslint-disable-next-line no-param-reassign
  n.queue = []; t = b.createElement(e); t.async = !0;
  // eslint-disable-next-line no-param-reassign,prefer-destructuring
  t.src = v; s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
}(
  window,
  document,
  'script',
  'https://connect.facebook.net/en_US/fbevents.js',
));
// eslint-disable-next-line no-undef
fbq('init', '620334125252675');
// eslint-disable-next-line no-undef
fbq('track', 'PageView');

// Initiate searchWidget ,  check for search div loaded
if (document.getElementById('div-widget-id') && !document.querySelector('.studio-widget-autosuggest-results')) {
  window.initiateSearchWidget();
}

// after search widget is loaded remove autocomplete
if (document.querySelector('.studio-widget-autosuggest-results')) {
  const searchWidget = document.querySelector('.studio-widget-search-input');
  searchWidget.setAttribute('autocomplete', 'off');
}
/* eslint-enable  func-names */
