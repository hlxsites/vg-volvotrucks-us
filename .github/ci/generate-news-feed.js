import { Feed } from 'feed';
import fs from 'fs';

const endpoint = process.env.NEWS_ENDPOINT;
const feedInfoEndpoint = process.env.NEWS_FEED_INFO_ENDPOINT;
const targetDirectory = process.env.NEWS_TARGET_DIRECTORY;
const targetFile = `${process.env.NEWS_TARGET_DIRECTORY}/feed.xml`;
const limit = 1000;

async function main() {
  let allPosts;

  try {
    allPosts = await fetchBlogPosts();
  } catch (error) {
    console.error('Error fetching Blog posts');
  }

  if (allPosts) {
    console.log(`found ${allPosts.length} posts`);

    let feedMetadata;
  
    try {
      feedMetadata = await fetchBlogMetadata();
    } catch (error) {
      console.error('Error fetching Blog posts metadata');
    }

    if (feedMetadata) {
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
    
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
      }
      fs.writeFileSync(targetFile, feed.atom1());
      console.log('wrote file to ', targetFile);
    }
  }
}

async function fetchBlogPosts() {
  let offset = 0;
  const allPosts = [];

  while (true) {
    const api = new URL(endpoint);
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

async function fetchBlogMetadata() {
  const infoResponse = await fetch(feedInfoEndpoint);
  const feedInfoResult = await infoResponse.json();
  return feedInfoResult.data[0];
}

main()
  .catch((e) => console.error(e));
