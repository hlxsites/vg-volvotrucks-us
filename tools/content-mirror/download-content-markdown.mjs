/*  fetches existing Sharepoint documents as Markdown and stores them in a folder structure.
    I use this to research existing blocks for certain content.
 */

import fetch from 'node-fetch';
import fs from "fs";
import path from "path";

const DOMAIN = "https://main--vg-volvotrucks-us--hlxsites.hlx.page";

function getFolderPathAndFilename(url) {
  const prefix = `./hlxsite`;

  const pathname = new URL(url).pathname;
  // remove trailing slash
  const withoutTrailingSlash = pathname.replace(/\/$/, '');

  const folderName = withoutTrailingSlash.substring(0, withoutTrailingSlash.lastIndexOf('/'));
  const folderPath = `${prefix}${folderName}`;

  const filename = path.basename(withoutTrailingSlash);

  return [folderPath, filename];
}

async function createFolder(folderPath) {
  try {
    await fs.promises.mkdir(folderPath, {recursive: true});
  } catch (ignore) {
    console.log('failed to create folder: ', folderPath);
  }
}

function mdUrl(url) {
  if (url.endsWith('/')) {
    return `${url}index.md`;
  } else {
    return `${url}.md`;
  }
}

async function getStatusUrls() {
  const response = await fetch("https://main--vg-volvotrucks-us--hlxsites.hlx.page/drafts/import-status.json");
  const json = await response.json();
  return json.data.filter(row => !row.Status.includes("removed"))
    .map(row => row.Preview);
}


async function getUrls() {
  const response = await fetch("https://main--vg-volvotrucks-us--hlxsites.hlx.page/query-index.json");
  const json = await response.json();
  return json.data.map(row => DOMAIN + row.path + "/")
    // remove duplicate slashes (usually at the end)
    .map(url => url.replaceAll("//", "/"));
}

async function loadUrl(url) {
  try {
    const [folderPath, filename] = getFolderPathAndFilename(url);

    const response = await fetch(url, {redirect: 'error'});
    if (response.ok) {
      await createFolder(folderPath);
      await response.body.pipe(fs.createWriteStream(`${folderPath}/${filename}`));
      console.log('ok: ', url);
    } else {
      if (url.includes("/index.md") && response.status === 404) {
        // retry without "/index"
        return loadUrl(url.replace("/index.md", ".md"));
      } else {
        console.log('failed: ', url, response.status);
      }
    }
  } catch (e) {
    if (e.message.includes("uri requested responds with a redirect")) {
      console.log('failed (redirect): ', url);
      return;
    }
    console.log('failed: ', url, e.message);
  }
}

async function main() {
  const urls = [...await getUrls(), ...await getStatusUrls()]
  const unique = [...new Set(urls)];

  // unique.forEach(url => console.log(url));
  // return;

  await Promise.all(unique.map(async (url) => {
    await loadUrl(mdUrl(url));
  }));
}

main();
