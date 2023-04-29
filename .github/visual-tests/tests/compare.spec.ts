import {expect, test} from '@playwright/test';

for (const path of ["/", "/trucks/"]) {
  test(`compare ${path}`, async ({page}) => {

    await page.goto(`https://${process.env.DOMAIN1}${path}`);
    await page.waitForTimeout(2000);

    try {
      await expect(page).toHaveScreenshot("screenshot.png");
    } catch (error) {
      console.log("ignoring", error.message);
    }

    try {
      expect(await page.textContent('body')).toMatchSnapshot('body.txt');
    } catch (error) {
      console.log("ignoring", error.message);
    }
// TODO: instead create two screenshots and then compare. If they are different, then fail the test.

    await page.goto(`https://${process.env.DOMAIN2}/${path}`);
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot("screenshot.png", {maxDiffPixels: 100});
    expect(await page.textContent('body')).toMatchSnapshot('body.txt');
  });

}
