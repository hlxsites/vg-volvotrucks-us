import {expect, test, TestInfo} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';
import {writeFile} from 'fs/promises';

function getScreenshotPath(testInfo: TestInfo, suffix) {
  const title = testInfo.title.replace(/[/]/g, '-');
  return `./screenshots/${suffix}/${(title.toLowerCase())}.png`;
}

for (const path of ["/", "/trucks/"]) {
  test(`${path}`, async ({page}, testInfo) => {

    await page.goto(`https://${process.env.DOMAIN1}${path}`);
    await page.waitForTimeout(2000);
    const beforeImage = await page.screenshot({
      path: getScreenshotPath(testInfo, 'main')
    });

    await page.goto(`https://${process.env.DOMAIN2}${path}`);
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
    if(result) {
      // store the diff image
      await writeFile(getScreenshotPath(testInfo, 'diff'), result.diff);
      testInfo.attachments.push({ name: getScreenshotPath(testInfo, 'diff'), contentType: `image/png`, path: getScreenshotPath(testInfo, 'diff') });
      console.log(`diff: ${path}: [diff](${getScreenshotPath(testInfo, 'diff')})`);
      expect(result.errorMessage, `diff: ${path}`).toBeNull();
    }
  });

}
