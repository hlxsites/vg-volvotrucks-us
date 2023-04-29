import {expect, test} from '@playwright/test';

test('compare pages', async ({page}) => {

  await page.goto('https://main--wknd--hlxsites.hlx.page/');
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



  await page.goto('https://block-library-assets--wknd--hlxsites.hlx.page/');
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot("screenshot.png", {maxDiffPixels: 100});
  expect(await page.textContent('body')).toMatchSnapshot('body.txt');
});
