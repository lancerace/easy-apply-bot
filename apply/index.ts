import { Page } from 'puppeteer';

import selectors from '../selectors';
import fillFields from '../apply-form/fillFields';
import waitForNoError from '../apply-form/waitForNoError';
import clickNextButton from '../apply-form/clickNextButton';

const noop = () => { };
const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
async function clickEasyApplyButton(page: Page): Promise<void> {
  await page.waitForSelector(selectors.easyApplyButtonEnabled, { timeout: 10000 });
  await wait(2000);
  
  // Use page.evaluate to ensure we're clicking the correct button
  await page.evaluate((selector) => {
    const buttons = Array.from(document.querySelectorAll(selector));
    const easyApplyButton = buttons.find(button => 
      button.textContent && button.textContent.trim().toLowerCase().includes('easy apply')
    );
    if (easyApplyButton) {
      (easyApplyButton as HTMLElement).click();
    } else {
      throw new Error('Easy Apply button not found');
    }
  }, selectors.easyApplyButtonEnabled);
}

export interface ApplicationFormData {
  phone: string;
  cvPath: string;
  homeCity: string;
  coverLetterPath: string;
  yearsOfExperience: { [key: string]: number };
  languageProficiency: { [key: string]: string };
  requiresVisaSponsorship: boolean;
  booleans: { [key: string]: boolean };
  textFields: { [key: string]: string };
  multipleChoiceFields: { [key: string]: string };
}

interface Params {
  page: Page;
  link: string;
  formData: ApplicationFormData;
  shouldSubmit: boolean;
}

async function apply({ page, link, formData, shouldSubmit }: Params): Promise<void> {
  await page.goto(link, { waitUntil: 'load', timeout: 60000 });
  await wait(2000);
  
  try {
    console.log("in the process of clicking easy button",page)
    await clickEasyApplyButton(page);
    console.log("clicked easy apply button")
  } catch {
    console.log(`Easy apply button not found in posting: ${link}`);
    return;
  }

  let maxPages = 5;
  await wait(2000);
  while (maxPages--) {
    await fillFields(page, formData).catch(noop);
console.log("filled field")
    await clickNextButton(page).catch(noop);
console.log("click next button")
    await waitForNoError(page).catch(noop);
  }
  await wait(2000);
  const submitButton = await page.$(selectors.submitApplication);

  if (!submitButton) {
    throw new Error('Submit button not found');
  }
console.log("should submit?", shouldSubmit)
  if (shouldSubmit) {
    console.log("click submit button")
    await submitButton.click();
  }
}

export default apply;
