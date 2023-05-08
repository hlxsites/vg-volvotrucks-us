import {Page, test} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';
import {unlink, writeFile} from 'fs/promises';


function getScreenshotPath(testPath: string, suffix) {
  const title = testPath.replace(/[/]/g, '-');
  return `./screenshots/${(title.toLowerCase())}-${suffix}.png`;
}

async function loadAndScreenshot(page: Page, url: string, testPath: string, suffix: string) {
  await page.goto(url);
  // TODO: wait for the page to be ready instead of just waiting
  await page.waitForTimeout(2000);
  return await page.screenshot({
    path: getScreenshotPath(testPath, suffix),
    fullPage: true
  });
}


for (let testPath of process.env.TEST_PATHS.split(/\s+/g)) {
  testPath = testPath.trim();
  if(!testPath) continue;

  test(`${testPath}`, async ({page}, testInfo) => {
    const urlMain = `https://${process.env.DOMAIN_MAIN}${testPath}`;
    const urlBranch = `https://${process.env.DOMAIN_BRANCH}${testPath}`;

    const beforeImage = await loadAndScreenshot(page, urlMain, testPath, "main");
    const afterImage = await loadAndScreenshot(page, urlBranch, testPath, "branch");

    const comparator = getComparator('image/png');
    const result = comparator(beforeImage, afterImage, {
      maxDiffPixelRatio: 0.01,
    });

    if (result && result.errorMessage) {
      await writeFile(getScreenshotPath(testPath, 'diff'), result.diff);

      // print markdown summary to console
      const markdownSummary = ` - **${testPath}** ([main](${urlMain}) vs [branch](${urlBranch}))<br>${result.errorMessage}`;
      console.log(markdownSummary);
      testInfo.attachments.push({
        name: getScreenshotPath(testPath, 'diff'),
        contentType: `image/png`,
        path: getScreenshotPath(testPath, 'diff')
      });
      throw new Error(markdownSummary);
    } else {
      // if there is no difference, delete the images to save space in the artifact
      await unlink(getScreenshotPath(testPath, 'main'));
      await unlink(getScreenshotPath(testPath, 'branch'));
    }
  })

}
