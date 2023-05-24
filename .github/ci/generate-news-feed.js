import { Feed } from 'feed';
import fs from 'fs';

const endpoint = process.argv[2];
const feedInfoEndpoint = process.argv[3];
const targetDirectory = process.argv[4];
const targetFile = `${targetDirectory}/feed.xml`;
const limit = 1000;

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
    updated: newestPost.toLocaleDateString('en-CA'),
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
      date: new Date(post.publishDate * 1000).toLocaleDateString('en-CA'),
      published: new Date(post.publishDate * 1000).toLocaleDateString('en-CA'),
    });
  });

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
  }
  fs.writeFileSync(targetFile, feed.atom1());
  console.log('wrote file to ', targetFile);
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
