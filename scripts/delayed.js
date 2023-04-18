// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

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

// OneTrust Cookies Consent Notice
if (!window.location.host.includes('hlx.page') && !window.location.host.includes('localhost')) {
  // on localhost/hlx.page/hlx.live the consent notice is displayed every time the page opens,
  // because the cookie is not persistent. To avoid this annoyance, disable unless on the
  // production page.
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
}
// Google Analytics
const gaId0 = 'AW-10868358315';
const gaId1 = 'G-4HJG91WCZF';
window.dataLayer = window.dataLayer || [];

function gtag(...args) {
  window.dataLayer.push(args);
}

gtag('js', new Date());
gtag('config', `${gaId0}`);
gtag('config', `${gaId1}`);

loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaId0}`, {
  type: 'text/javascript',
  charset: 'UTF-8',
  async: true,
});

(function (i, s, o, g, r, a, m) {
  // eslint-disable-next-line no-unused-expressions
  i.GoogleAnalyticsObject = r; i[r] = i[r] || function () {
    // eslint-disable-next-line prefer-rest-params
    (i[r].q = i[r].q || []).push(arguments);
    // eslint-disable-next-line no-sequences,no-param-reassign,no-unused-expressions
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
  // eslint-disable-next-line no-param-reassign,prefer-destructuring
  m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
}(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'));
// eslint-disable-next-line no-undef
ga('create', 'UA-3897070-38', 'auto');
// eslint-disable-next-line no-undef
ga('send', 'pageview');

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
