/*  fetches existing Sharepoint documents as Markdown and stores them in a folder structure.
    I use this to research existing blocks for certain content.
 */

import fetch from 'node-fetch';
import fs from "fs";
import path from "path";

const DOMAIN = "https://main--vg-volvotrucks-us--hlxsites.hlx.page";

async function createFolder(url) {
  const folderPath = `./mirror${new URL(url).pathname.replace('/.*$', '')
    .replace('/index.md', '')}`;
  try {
    await fs.promises.mkdir(folderPath, {recursive: true});
  } catch (ignore) {
  }
  return folderPath;
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
  const response = await fetch(DOMAIN + "/query-index.json");
  const json = await response.json();
  return json.data.map(row => DOMAIN + row.path + "/")
    // remove duplicate slashes (usually at the end)
    .map(url => url.replaceAll("//", "/"));
}

async function loadUrl(url) {
  try {
    const response = await fetch(url, {redirect: 'error'});
    if (response.ok) {
      const folderPath = await createFolder(url);
      await response.body.pipe(fs.createWriteStream(`${folderPath}/${path.basename(url)}`));
      console.log('ok: ', url);
    } else {
      if (url.includes("/index.md") && response.status === 404) {
        // retry without "/index"
        return loadUrl(url.replace("/index.md", ".md"));
      } else {
        console.log('failed: ', url);
      }
    }
  }catch (e) {
    console.log('failed (maybe redirect): ', url);
  }
}

async function main() {
  const urls = [...await getUrls(), ...await getStatusUrls()];
  await Promise.all(urls.map(async (url) => {
    const adjustedUrl = mdUrl(url);
    await loadUrl(adjustedUrl);
  }));
}

main();
