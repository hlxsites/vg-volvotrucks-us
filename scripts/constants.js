import { getConstants } from "./common.js";

const { searchUrls, cookieValues } = await getConstants();

const formatValues = (values) => {
  let obj = {};
  values.forEach(({name, value}) => obj[name] = value);
  return obj;
}

// This data comes from the sharepoint 'constants.xlsx' file
export const COOKIE_CONFIGS = formatValues(cookieValues.data);
export const SEARCH_URLS = formatValues(searchUrls.data);