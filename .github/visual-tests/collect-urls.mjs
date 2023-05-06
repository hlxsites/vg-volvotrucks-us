import { writeFileSync } from 'fs';

// This script is used to collect all the URLs that we want to test.
// It will fetch the URLs from the index and write them to a file.

// check if the environment variables are set
if (!process.env.DOMAIN1 || !process.env.TEST_PATHS || !process.env.TEST_PATHS_INDEXES) {
  console.error('Please set the environment variables DOMAIN1, TEST_PATHS and TEST_PATHS_INDEXES');
  process.exit(1);
}

const paths = process.env.TEST_PATHS.split(' ').map((path) => path.trim());

console.log(process.env.TEST_PATHS_INDEXES);
for (const index of process.env.TEST_PATHS_INDEXES.split(' ')) {
  if(!index.trim().length) continue;

  const indexUrl = `https://${process.env.DOMAIN1}${index}`;
  console.log(`fetching from ${indexUrl}`);
  const response = await fetch(indexUrl)
  const json = await response.json();
  paths.push(...json.data.map((item) => {
    const url = new URL(item.path);
    return url.pathname
  }));
}

writeFileSync('./generated-test-paths.json', JSON.stringify(paths, null, 2));
