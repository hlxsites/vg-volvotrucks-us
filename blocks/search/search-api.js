import { SEARCH_URLS } from '../../scripts/common.js';

const { SEARCH_URL_DEV, SEARCH_URL_PROD } = SEARCH_URLS;
const isProd = !window.location.host.includes('hlx.page') && !window.location.host.includes('localhost');
const SEARCH_LINK = !isProd ? SEARCH_URL_DEV : SEARCH_URL_PROD;

export async function fetchData(queryObj) {
  const response = await fetch(
    SEARCH_LINK,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': queryObj.length,
      },
      body: JSON.stringify(queryObj),
    },
  );

  return response.json();
}

export const searchQuery = (hasFilters) => `
query Volvosearch($tenant: String!, $q: String, $offset: Int, $limit: Int, $language: VolvoLocaleEnum!,
$facets: [VolvoFacet], $sort: [VolvoSortOptionsEnum]${hasFilters ? ', $filters: [VolvoFilterItem]' : ''}) {
  volvosearch(tenant: $tenant, q: $q, offset: $offset, limit: $limit, language: $language,
  facets: $facets, sort: $sort${hasFilters ? ', filters: $filters' : ''}) {
    count
    items {
      uuid
      score
      metadata {
        title
        description
        url
        lastModified
      }
    }
    facets {
      field
      items {
        value
        count
      }
    }
  }
}
`;

export const autosuggestQuery = () => `
query Volvosuggest($term: String!, $tenant: String!, $locale: VolvoLocaleEnum!, $sizeSuggestions: Int) {
  volvosuggest(term: $term, tenant: $tenant, locale: $locale, sizeSuggestions: $sizeSuggestions) {
    terms
  }
}`;
