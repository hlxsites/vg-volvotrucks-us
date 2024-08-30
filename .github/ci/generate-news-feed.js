import { Feed } from 'feed';
import fs from 'fs';
import { NEWS_FEED_CONFIGS } from '../../scripts/common.js';

const {
  ENDPOINT,
  FEED_INFO_ENDPOINT,
  TARGET_DIRECTORY,
  LIMIT,
} = NEWS_FEED_CONFIGS;

const TARGET_FILE = `${TARGET_DIRECTORY}/feed.xml`;
const PARSED_LIMIT = Number(LIMIT)

async function main() {
  const allPosts = await fetchBlogPosts();
  console.log(`found ${allPosts.length} posts`);

  const feedMetadata = await fetchBlogMetadata();

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

async function fetchBlogPosts() {
  let offset = 0;
  const allPosts = [];

  while (true) {
    const api = new URL(ENDPOINT);
    api.searchParams.append('offset', JSON.stringify(offset));
    api.searchParams.append('limit', PARSED_LIMIT);
    const response = await fetch(api, {});
    const result = await response.json();

    allPosts.push(...result.data);

    if (result.offset + result.PARSED_LIMIT < result.total) {
      // there are more pages
      offset = result.offset + result.PARSED_LIMIT;
    } else {
      break;
    }
  }
  return allPosts;
}

async function fetchBlogMetadata() {
  const infoResponse = await fetch(FEED_INFO_ENDPOINT);
  const feedInfoResult = await infoResponse.json();
  return feedInfoResult.data[0];
}

main()
  .catch((e) => console.error(e));
