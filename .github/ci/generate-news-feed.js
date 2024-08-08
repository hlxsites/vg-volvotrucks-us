import { Feed } from 'feed';
import fs from 'fs';

/**
 * @typedef {Object} FeedConfig
 * @property {string} link
 * @property {string} siteRoot
 * @property {string} targetFile
 * @property {string} source
 * @property {string} language
 */

/**
 * @typedef {Object} FeedMetadata
 * @property {string} title
 * @property {string} 'site-root'
 * @property {string} link
 * @property {string} language
 * @property {string} description
 */

/**
 * @typedef {Object} Post
 * @property {string} path
 * @property {string} image
 * @property {string} description
 * @property {string} lastModified
 * @property {string} publishDate
 * @property {string} tags
 * @property {string} content
 * @property {string} publishDate
 */

/**
 * @type {FeedConfig[]}
 * @todo Get these from a SharePoint configuration, maybe the feedSource sheet
 */
const feedList = [
  {
    targetDirectory: '../../news-and-stories/press-releases',
    targetFileName: 'feed.xml',
    feedSource: 'https://www.volvotrucks.us/news-and-stories/press-releases/feed-info.json',
    postsSource: 'https://www.volvotrucks.us/press-releases.json',
    siteRoot: 'https://www.volvotrucks.us',
    language:	'en-US',
  },
];

const limit = 1000;

/**
 * @param feed {FeedConfig}
 * @return {Promise<void>}
 */
async function createFeed(feedItem) {
  const allPosts = await fetchBlogPosts(feedItem.postsSource);

  if (allPosts) {
    console.log(`Found ${allPosts.length} posts`);

    const feedMetadata = await fetchBlogMetadata(feedItem.feedSource);

    if (feedMetadata) {
      const targetFile = `${feedItem.targetDirectory}/${feedItem.targetFileName}`;
      const newestPost = allPosts.sort((a, b) => b.publishDate - a.publishDate)[0];
      const newestPostDate = newestPost ? new Date(newestPost.publishDate * 1000) : new Date();
      const feedConfig = {
        title: feedMetadata.title,
        description: feedMetadata.description,
        id: feedMetadata.link,
        link: feedMetadata.link,
        updated: newestPostDate,
        language: feedItem.language,
      };
      const feed = new Feed(feedConfig);

      allPosts.forEach((post) => {
        const link = feedMetadata["site-root"] + post.path;
        const feedItemConfig = {
          title: post.title,
          id: link,
          link,
          content: post.description,
          date: new Date(post.publishDate * 1000),
          published: new Date(post.publishDate * 1000),
        };

        feed.addItem(feedItemConfig);
      });

      if (!fs.existsSync(feedItem.targetDirectory)) {
        console.log('Target directory created');
        fs.mkdirSync(feedItem.targetDirectory);
      }
      fs.writeFileSync(targetFile, feed.atom1());
      console.log('Wrote file to ', targetFile);
    }
  }
}

/**
 * Returns a list of properties listed in the block
 * 
 * @async
 * @param {string} endpointUrl blog metadata endpoint
 * @returns {Array<Post>} the json data object
*/
async function fetchBlogPosts(endpointUrl) {
  let offset = 0;
  const allPosts = [];

  console.log('endpointUrl: ', endpointUrl);
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
*/https://www.volvotrucks.us/press-releases.json
async function fetchBlogMetadata(endpointUrl) {
  const feedInfoResult = await getJsonFromUrl(endpointUrl);

  if (!feedInfoResult) {
    return null;
  }

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

const Init = () => {
  for (const feedItem of feedList) {
    createFeed(feedItem)
      .catch((e) => console.error(e));
  }
}

Init();
