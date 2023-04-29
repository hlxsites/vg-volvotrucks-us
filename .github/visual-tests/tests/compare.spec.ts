import {expect, test} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';
import { writeFile } from 'fs/promises';

for (const path of ["/", "/trucks/"]) {
  test(`compare ${path}`, async ({page}, testInfo) => {

    await page.goto(`https://${process.env.DOMAIN1}${path}`);
    await page.waitForTimeout(2000);
    const beforeImage = await page.screenshot({
      path: `./${testInfo.title}-before.png`
    });

    await page.goto(`https://${process.env.DOMAIN2}${path}`);
    await page.waitForTimeout(2000);
    const afterImage = await page.screenshot({
      path: `./${testInfo.title}-after.png`
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
      await writeFile(`./${testInfo.title}-diff.png`, result.diff);
      testInfo.attachments.push({ name: `${testInfo.title}-diff.png`, contentType: `image/png`, path: `./${testInfo.title}-diff.png` });
      console.log(`diff: ${path}: [diff](${testInfo.title}-diff.png)`);
      expect(result.errorMessage, `diff: ${path}`).toBeNull();
    }
  });

}
