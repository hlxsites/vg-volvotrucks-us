/*  fetches existing Sharepoint documents as Markdown and stores them in a folder structure.
    I use this to research existing blocks for certain content.
 */

import fetch from 'node-fetch';
import fs from "fs";
import path from "path";

async function createFolder(url) {
    const folderPath = `./mirror${new URL(url).pathname.replace('/.*$', '')}`;
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

async function getUrls() {
    const response = await fetch("https://main--vg-volvotrucks-us--hlxsites.hlx.page/drafts/import-status.json");
    const json = await response.json();
    return json.data.filter(row => !row.Status.includes("removed"))
        .map(row => row.Preview);
}

async function main() {
    const urls = await getUrls()
    await Promise.all(urls.map(async (url) => {
        const adjustedUrl = mdUrl(url);
        const response = await fetch(adjustedUrl);
        if (response.ok) {
            const folderPath = await createFolder(adjustedUrl);
            await response.body.pipe(fs.createWriteStream(`${folderPath}/${path.basename(adjustedUrl)}`));
            console.log('ok: ', adjustedUrl);
        } else {
            console.log('failed: ', adjustedUrl);
        }
    }));
}

main();
