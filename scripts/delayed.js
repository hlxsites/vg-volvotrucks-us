// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

const COOKIES = {
  performance: 'C0002:1',
  social: 'C0005:1',
};

// Core Web Vitals RUM collection
sampleRUM('cwv');

const cookieSetting = decodeURIComponent(document.cookie.split(';')
  .find((cookie) => cookie.trim().startsWith('OptanonConsent=')));
const isPerformanceAllowed = cookieSetting.includes(COOKIES.performance);
const isSocialAllowed = cookieSetting.includes(COOKIES.social);

if (isPerformanceAllowed) {
  loadGoogleTagManager(); // facebook pixel is added by gtm too
  loadHotjar();
  if (!isSocialAllowed) {
    //remove facebook pixel aka fbevents.js
    const htmlElement = document.querySelector('html');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT' && node.src.includes('fbevents.js')) {
            node.remove();
            [...document.querySelectorAll('script[id]')]
              .filter((script) => script.innerHTML.includes('fbevents.js'))[0].remove();
            [...document.querySelectorAll('noscript')]
              .filter((script) => script.innerHTML.includes('facebook.com'))[0].remove();
            console.log('%cRemoved facebook pixel', 'color: #f00');
            observer.disconnect();
          }
        });
      });
    });

    observer.observe(htmlElement, { childList: true });
  }
} else if (isSocialAllowed) {
  loadFacebookPixel();
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
if (!window.location.pathname.includes('srcdoc')
  && !['localhost', 'hlx.page'].includes(window.location.host)) {
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

async function loadFacebookPixel() {
  // FaceBook Pixel
  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq)f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js',
  ));
  fbq('init', '620334125252675');
  fbq('track', 'PageView');
  /* eslint-disable */
}

// Hotjar Tracking Code for volvotrucks.us
async function loadHotjar() {
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:1139895,hjsv:6}; a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
}

// Initiate searchWidget ,  check for search div loaded
if (document.getElementById('div-widget-id') && !document.querySelector('.studio-widget-autosuggest-results')) {
  window.initiateSearchWidget();
}

// after search widget is loaded remove autocomplete
if (document.querySelector('.studio-widget-autosuggest-results')) {
  const searchWidget = document.querySelector('.studio-widget-search-input');
  searchWidget.setAttribute('autocomplete', 'off');
}
