// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './aem.js';
import {
  isPerformanceAllowed,
  isTargetingAllowed,
  isSocialAllowed,
  extractObjectFromArray,
  COOKIE_CONFIGS,
} from './common.js';

// COOKIE ACCEPTANCE AND IDs default to false in case no ID is present
const { 
  FACEBOOK_PIXEL_ID = false,
  HOTJAR_ID = false,
  GTM_ID = false,
  DATA_DOMAIN_SCRIPT = false,
  ACC_ENG_TRACKING = false,
  TIKTOK_PIXEL_ID = false,
} = COOKIE_CONFIGS;

const parsedData = JSON.parse(ACC_ENG_TRACKING);
const splitData = extractObjectFromArray(parsedData);

const { piAId, piCId, piHostname } = splitData;

// Core Web Vitals RUM collection
sampleRUM('cwv');

if (isPerformanceAllowed()) {
  GTM_ID && loadGoogleTagManager();
  HOTJAR_ID && loadHotjar();
}

if (isTargetingAllowed()) {
  ACC_ENG_TRACKING && loadAccountEngagementTracking();
}

if (isSocialAllowed()) {
  FACEBOOK_PIXEL_ID && loadFacebookPixel();
  TIKTOK_PIXEL_ID && loadTiktokPixel();
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
  && !['localhost', 'hlx.page', 'hlx.live', 'aem.page', 'aem.live'].some((url) => window.location.host.includes(url))) {
  // when running on localhost in the block library host is empty but the path is srcdoc
  // on localhost/hlx.page/hlx.live the consent notice is displayed every time the page opens,
  // because the cookie is not persistent. To avoid this annoyance, disable unless on the
  // production page.
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    'data-domain-script': DATA_DOMAIN_SCRIPT,
  });

  window.OptanonWrapper = () => {
    const currentOnetrustActiveGroups = window.OnetrustActiveGroups;

    function isSameGroups(groups1, groups2) {
      const s1 = JSON.stringify(groups1.split(','));
      const s2 = JSON.stringify(groups2.split(','));

      return s1 === s2;
    }

    window.OneTrust.OnConsentChanged(() => {
      // reloading the page only when the active group has changed
      if (window.isSingleVideo === true) {
        return;
      }
      if (!isSameGroups(currentOnetrustActiveGroups, window.OnetrustActiveGroups) && window.isSingleVideo !== 'true') {
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
  }(window, document, 'script', 'dataLayer', GTM_ID));
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
  fbq('init', FACEBOOK_PIXEL_ID);
  fbq('track', 'PageView');
  /* eslint-disable */
}

// Hotjar Tracking Code for volvotrucks.us
async function loadHotjar() {
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:HOTJAR_ID,hjsv:6}; a=o.getElementsByTagName('head')[0];
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

// Account Engagement Tracking Code
async function loadAccountEngagementTracking() {
  const body = document.querySelector('body');
  const script = document.createElement('script');
  script.type = 'text/javascript';
  
  script.text = `piAId = '${piAId}'; piCId = '${piCId}'; piHostname = '${piHostname}'; (function() { function async_load(){ var s = document.createElement('script'); s.type = 'text/javascript'; s.src = ('https:' == document.location.protocol ? 'https://pi' : 'http://cdn') + '.pardot.com/pd.js'; var c = document.getElementsByTagName('script')[0]; c.parentNode.insertBefore(s, c); } if(window.attachEvent) { window.attachEvent('onload', async_load); } else { window.addEventListener('load', async_load, false); } })();`;

  body.append(script);
};

// TikTok Code
async function loadTiktokPixel() {
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;
    var ttq=w[t]=w[t]||[];
    ttq.methods=[
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
    ],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
    for(var i=0; i<ttq.methods.length; i++) ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance = function(t) {
      for(var e=ttq._i[t]||[],n=0; n<ttq.methods.length; n++) ttq.setAndDefer(e,ttq.methods[n]);
      return e
    }, ttq.load = function(e,n) {
      var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
      var o = document.createElement("script");
      o.type="text/javascript", o.async = !0, o.src = i+"?sdkid="+e+"&lib="+t;
      var a = document.getElementsByTagName("script")[0];
      a.parentNode.insertBefore(o,a)};
      ttq.load(TIKTOK_PIXEL_ID);
      ttq.page();

      // Identifying the user with hashed details
      ttq.identify({
        "email": "<hashed_email_address>", // string. The email of the customer if available. It must be hashed with SHA-256 on the client side.
        "phone_number": "<hashed_phone_number>", // string. The phone number of the customer if available. It must be hashed with SHA-256 on the client side.
        "external_id": "<hashed_external_id>" // string. A unique ID from the advertiser such as user or external cookie IDs. It must be hashed with SHA256 on the client side.
      });

      const trackingObject = {
        "value": "<content_value>", // number. Value of the order or items sold. Example: 100.
        "currency": "<content_currency>", // string. The 4217 currency code. Example: "USD".
        "contents": [
            {
                "content_id": "<content_identifier>", // string. ID of the product. Example: "1077218".
                "content_type": "<content_type>", // string. Either product or product_group.
                "content_name": "<content_name>" // string. The name of the page or product. Example: "shirt".
            }
        ]
      };

      // Tracking various user interactions
      ttq.track('SubmitForm', trackingObject);
      ttq.track('ClickButton', trackingObject);

      // Repeat similar structure for 'Download', 'CompletePayment', 'Contact', 'CompleteRegistration',
      // 'ViewContent', 'AddToCart', 'PlaceAnOrder', 'AddPaymentInfo', 'InitiateCheckout', 'Search', 
      // 'AddToWishlist', 'Subscribe', and 'Pageview' events with appropriate parameters and comments.
   }(window, document, 'ttq');
}
