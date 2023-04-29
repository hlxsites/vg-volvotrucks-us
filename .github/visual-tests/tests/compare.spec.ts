import {expect, test} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';

for (const path of ["/", "/trucks/"]) {
  test(`compare ${path}`, async ({page}, testInfo) => {

    await page.goto(`https://${process.env.DOMAIN1}${path}`);
    await page.waitForTimeout(2000);
    const beforeImage = await page.screenshot({
      path: `./${testInfo.title}-before.png`
    });

    await page.goto(`https://${process.env.DOMAIN2}/${path}`);
    await page.waitForTimeout(2000);
    const afterImage = await page.screenshot({
      path: `./${testInfo.title}-after.png`
    });

    const comparator = getComparator('image/png');
    expect(comparator(beforeImage, afterImage)).toBeNull();
  });

}
