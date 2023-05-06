import {Page, test} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';
import {unlink, writeFile} from 'fs/promises';

import testPaths from "../generated-test-paths.json";

function getScreenshotPath(testPath: string, suffix) {
  const title = testPath.replace(/[/]/g, '-');
  return `./screenshots/${(title.toLowerCase())}-${suffix}.png`;
}

async function loadAndScreenshot(page: Page, url: string, testPath: string, suffix: string) {
  await page.goto(url);
  await page.waitForTimeout(2000);
  return await page.screenshot({
    path: getScreenshotPath(testPath, suffix)
  });
}

for (const testPath of testPaths) {
  test(`${testPath}`, async ({page}, testInfo) => {
    const url1 = `https://${process.env.DOMAIN1}${testPath}`;
    const url2 = `https://${process.env.DOMAIN2}${testPath}`;

    const beforeImage = await loadAndScreenshot(page, url1, testPath, "main");
    const afterImage = await loadAndScreenshot(page, url2, testPath, "branch");

    const comparator = getComparator('image/png');
    const result = comparator(beforeImage, afterImage, {
      // maxDiffPixels: ,
      maxDiffPixelRatio: 0.01,
      // threshold: 0.99,
    });


    if (result && result.errorMessage) {
      // store the diff image
      await writeFile(getScreenshotPath(testPath, 'diff'), result.diff);

      // print markdown summary to console
      console.log(` - **${testPath}** ([main](${url1}) vs [branch](${url2}))<br>${result.errorMessage}`);
    } else {
      // if there is no difference, delete the images to save space in the artifact
      await unlink(getScreenshotPath(testPath, 'main'));
      await unlink(getScreenshotPath(testPath, 'branch'));
    }
  })

}
