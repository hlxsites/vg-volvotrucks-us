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
 * @type {FeedConfig[]}
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
]

const limit = 1000;

/**
 * @param feed {FeedConfig}
 * @return {Promise<void>}
 */
async function createFeed(feedItem) {
  let allPosts;

  try {
    allPosts = await fetchBlogPosts(feedItem.postsSource);
  } catch (error) {
    console.error('Error fetching Blog posts');
  }

  if (allPosts) {
    console.log(`found ${allPosts.length} posts`);

    let feedMetadata;
  
    try {
      feedMetadata = await fetchBlogMetadata(feedItem.feedSource);
    } catch (error) {
      console.error('Error fetching Blog posts metadata');
    }

    if (feedMetadata) {
      const targetFile = `${feedItem.targetDirectory}/${feedItem.targetFileName}`;
      const newestPost = allPosts
        .map((post) => new Date(post.publishDate * 1000))
        .reduce((maxDate, date) => (date > maxDate ? date : maxDate), new Date(0));
      const feedConfig = {
        title: feedMetadata.title,
        description: feedMetadata.description,
        id: feedMetadata.link,
        link: feedMetadata.link,
        updated: newestPost,
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
        fs.mkdirSync(feedItem.targetDirectory);
      }
      fs.writeFileSync(targetFile, feed.atom1());
      console.log('wrote file to ', targetFile);
    }
  }
}

async function fetchBlogPosts(endpointUrl) {
  let offset = 0;
  const allPosts = [];

  while (true) {
    const api = new URL(endpointUrl);
    api.searchParams.append('offset', JSON.stringify(offset));
    api.searchParams.append('limit', limit);
    const response = await fetch(api, {});
    const result = await response.json();

    allPosts.push(...result.data);

    if (result.offset + result.limit < result.total) {
      // there are more pages
      offset = result.offset + result.limit;
    } else {
      break;
    }
  }
  return allPosts;
}

async function fetchBlogMetadata(endpointUrl) {
  const infoResponse = await fetch(endpointUrl);
  const feedInfoResult = await infoResponse.json();
  return feedInfoResult.data[0];
}

for (const feedItem of feedList) {
  createFeed(feedItem)
    .catch((e) => console.error(e));

}
