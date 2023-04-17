import templates from './templates.js';

export default async function decorate(block) {
  block.innerHTML = `
  <div class="search-input-wrapper">
    <div class="feedback-wrapper"><div id="sf-feedback"></div></div>
    <div id="searchInput"></div>
  </div>

  <div class="search-results-summary-options-wrapper">
    <div id="searchResultSummarySection"></div>
    <div id="searchOptionsSection"></div>
  </div>

  <div class="search-results-wrapper">
    <div class="facet-container-wrapper">
      <div id="searchFacetSection"></div>
    </div>
    <div class="result-container-wrapper">
      <div id="external-search-result-container"></div>
      <div id="searchResultsSection"></div>
      <div id="relatedSearchesSection"></div>
      <div id="paginationSection"></div>
    </div>
  </div>
  `;

  // JS copied from original page
  function getCookie(name) {
    // eslint-disable-next-line no-useless-escape
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  function setCookie(name, value, options = {}) {
    // eslint-disable-next-line no-param-reassign
    options = {
      path: '/',
      // add other defaults here if necessary
      ...options,
    };
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
    let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const optionKey in options) {
      updatedCookie += `; ${optionKey}`;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += `=${optionValue}`;
      }
    }
    document.cookie = updatedCookie;
  }
  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  // eslint-disable-next-line no-unused-vars
  function getOrSetCookie(name) {
    let cookieID = getCookie(name);
    if (cookieID == null) {
      cookieID = makeid(25);
      setCookie(name, cookieID, {
        secure: true,
        'max-age': 3600,
      });
    }
    return cookieID;
  }
  // end of JS copied from original page

  window.getOrSetCookie = getOrSetCookie;

  const styles = [
    'https://static.searchstax.com/studio-js/v3.8/css/studio-app.css',
  ];
  const scripts = [
    {
      inline: `
        var _msq = _msq || []; //declare object
        var analyticsBaseUrl = 'https://analytics-us.searchstax.com';
        (function () {
          var ms = document.createElement('script');
          ms.type = 'text/javascript';
          ms.src = 'https://static.searchstax.com/studio-js/v3/js/studio-analytics.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(ms, s);
        })();
      `,
    },

    {
      inline: `
        const session = getOrSetCookie('searchcookie');
        function format_date(value) {
          if (value != null) {
            if (typeof value == 'undefined') {
              return '';
            }
            date_value = Date.parse(value);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(value).toLocaleDateString(undefined, options);
          }
          return value;
        }
        const studioConfig = {
          connector: {
            url: 'https://ss705916-dy2uj8v7-us-east-1-aws.searchstax.com/solr/productionvolvotrucks-1157/emselect',
            authentication: 'YXBwMTE1Ny1hcGk6Vm9sdm90cnVja3NAMjAyMw==',
            apikey: '3Ixo3pslPZXcRt0PCJXaYSN1evQyD3tERt1RaAUaRNU',
            select_auth_token: 'None',
            suggester_auth_token: 'None',
            search_auth_type: 'basic',
            session,
            fields: { description: 'meta_description_t', title: '_name', url: 'result_url_creation_s' },
            suggester: 'https://ss705916-dy2uj8v7-us-east-1-aws.searchstax.com/solr/productionvolvotrucks-1157-suggester/emsuggest',
            searchAPIKey: '25c0942a02ba3b11f3b1182ed398c4442d85d115',
            language: 'en',
            fieldFormatters: { date: format_date },
            searchAdditionalArgs: 'hl.fragsize=200',
            hideUniqueKey: true,
          },
          searchResults: '#searchResultsSection',
          searchInput: '#searchInput',
          searchResultSummarySection: '#searchResultSummarySection',
          facetSection: '#searchFacetSection',
          searchOptionsSection: '#searchOptionsSection',
          relatedSearchesSection: '#relatedSearchesSection',
          paginationSection: '#paginationSection',
          customSearchTemplate: '#search-template',
          customSearchFeedbackTemplate: '#searchFeedback-template',
          customPagingTemplate: '#paging-template',
          customPaginationTemplate: '#paging-template',
          customSearchOptionSectionTemplate: '#searchOptionSection-template',
          customNoResultTemplate: '#noresult-template',
          customFacetTemplate: '#facet-template',
          hideBranding: false,
          isGridLayout: true,
          display: 'multi',
          facet_pagination: 3,
          customResultTemplate: '#result-template',
          customRelatedSearchesTemplate: '#customRelatedSearches-template',
          externalSearchResults: '#external-search-result-container',
          customExternalPromotionsTemplate: '#external-search-result-template',
          suggestAfterMinChars: 2,
        };
      `,
    },
    { link: 'https://static.searchstax.com/studio-js/v3.8/js/studio-app.js' },
    { link: 'https://static.searchstax.com/studio-js/v3.8/js/studio-vendors.js' },
    { link: 'https://static.searchstax.com/studio-js/v3.8/js/studio-analytics.js' },
    { link: 'https://static.searchstax.com/studio-js/v3.8/js/studio-feedback.js' },
  ];

  // adding stylesheets
  styles.forEach((styleSheetLink) => {
    const styleSheetEl = document.createElement('style');
    styleSheetEl.innerHTML = `@import url(${styleSheetLink});`;

    document.head.appendChild(styleSheetEl);
  });

  // adding templates
  const temps = document.createElement('div');
  temps.innerHTML = templates.join('');
  document.body.appendChild(temps);

  // loading scripts one by one to prevent inappropriate script execution order.
  // eslint-disable-next-line no-restricted-syntax
  for (const script of scripts) {
    const newScript = document.createElement('script');

    newScript.setAttribute('type', 'text/javascript');

    if (script.inline) {
      newScript.innerHTML = script.inline;
      script.async = false;
    } else {
      script.async = true;
      newScript.src = script.link;
    }
    document.body.append(newScript);
  }
}
