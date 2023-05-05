import {test, TestInfo} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';
import {writeFile, mkdir} from 'fs/promises';

function getScreenshotPath(testInfo: TestInfo, suffix) {
  const title = testInfo.title.replace(/[/]/g, '-');
  return `./screenshots/${(title.toLowerCase())}-${suffix}.png`;
}

for (const path of ["/", "/trucks/"]) {
  test(`${path}`, async ({page}, testInfo) => {

    const url1 = `https://${process.env.DOMAIN1}${path}`;
    await page.goto(url1);
    await page.waitForTimeout(2000);
    const beforeImage = await page.screenshot({
      path: getScreenshotPath(testInfo, 'main')
    });

    const url2 = `https://${process.env.DOMAIN2}${path}`;
    await page.goto(url2);
    await page.waitForTimeout(2000);
    const afterImage = await page.screenshot({
      path: getScreenshotPath(testInfo, 'branch')
    });

    const comparator = getComparator('image/png');
    const comparatorOptions = {
      // maxDiffPixels: ,
      maxDiffPixelRatio: 0.01,
      // threshold: 0.99,
    }
    const result = comparator(beforeImage, afterImage, comparatorOptions);
    if (result) {
      // store the diff image
      await writeFile(getScreenshotPath(testInfo, 'diff'), result.diff);
      testInfo.attachments.push({
        name: getScreenshotPath(testInfo, 'diff'),
        contentType: `image/png`,
        path: getScreenshotPath(testInfo, 'diff')
      });

      // print markdown summary to console
      if (result.errorMessage) {
        console.log(` - **${path}** ([main](${url1}) vs [branch](${url2}))<br>${result.errorMessage}`);
      }
    }
  })

}
