import { Feed } from 'feed';
import fs from 'fs';

async function createFeed() {
  let newsFeedConfigurations;

  async function getConfigs() {
    try {
      const NEWS_FEED_CONFIGS = await import('/generate-news-feed-config.js');
      newsFeedConfigurations = NEWS_FEED_CONFIGS;
    } catch (error) {
      console.error('Error importing or processing object:', error);
    }
  }
  await getConfigs()

  const {
    ENDPOINT,
    FEED_INFO_ENDPOINT,
    TARGET_DIRECTORY,
    LIMIT,
  } = newsFeedConfigurations;
  
  const TARGET_FILE = `${TARGET_DIRECTORY}/feed.xml`;
  const PARSED_LIMIT = Number(LIMIT)

  const allPosts = await fetchBlogPosts(ENDPOINT, PARSED_LIMIT);
  console.log(`found ${allPosts.length} posts`);

  const feedMetadata = await fetchBlogMetadata(FEED_INFO_ENDPOINT);

  const newestPost = allPosts
    .map((post) => new Date(post.publishDate * 1000))
    .reduce((maxDate, date) => (date > maxDate ? date : maxDate), new Date(0));

  const feed = new Feed({
    title: feedMetadata.title,
    description: feedMetadata.description,
    id: feedMetadata.link,
    link: feedMetadata.link,
    updated: newestPost,
    generator: 'AEM News feed generator (GitHub action)',
    language: feedMetadata.lang,
  });

  allPosts.forEach((post) => {
    const link = feedMetadata["site-root"] + post.path;
    feed.addItem({
      title: post.title,
      id: link,
      link,
      content: post.description,
      date: new Date(post.publishDate * 1000),
      published: new Date(post.publishDate * 1000),
    });
  });

  if (!fs.existsSync(TARGET_DIRECTORY)) {
    fs.mkdirSync(TARGET_DIRECTORY);
  }
  fs.writeFileSync(TARGET_FILE, feed.atom1());
  console.log('wrote file to ', TARGET_FILE);
}

async function fetchBlogPosts(endpoint, limit) {
  let offset = 0;
  const allPosts = [];

  while (true) {
    const api = new URL(endpointUrl);

    api.searchParams.append('offset', JSON.stringify(offset));
    api.searchParams.append('limit', limit);

    const result = await getJsonFromUrl(api);

    if (result) {
      allPosts.push(...result.data);
  
      if (result.offset + result.limit < result.total) {
        // there are more pages
        offset = result.offset + result.limit;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return allPosts;
}

/**
 * Returns the Blog Metadata
 * 
 * @async
 * @param {string} endpointUrl blog metadata endpoint
 * @returns {FeedMetadata} The first feed configuration
 * @todo This in the future should return all of the configurations for all markets/feeds
*/
async function fetchBlogMetadata(infoEndpoint) {
  const infoResponse = await fetch(infoEndpoint);
  const feedInfoResult = await infoResponse.json();
  return feedInfoResult.data[0];
}

/**
 * Returns a list of properties listed in the block
 * @param {string} route get the Json data from the route
 * @returns {Object} the json data object
*/
async function getJsonFromUrl(route) {
  try {
    const response = await fetch(route);
    if (!response.ok) return null;
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('getJsonFromUrl:', { error });
  }
  return null;
};

createFeed()
