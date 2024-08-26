import { Page } from 'puppeteer';

async function waitForNoError(page: Page): Promise<void> {
  await page.waitForFunction(() => !document.querySelector("div[id*='error'] div[class*='error']"), { timeout: 30000 });
}

export default waitForNoError;
