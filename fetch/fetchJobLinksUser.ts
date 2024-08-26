import { ElementHandle, Page } from 'puppeteer';
import LanguageDetect from 'languagedetect';

import buildUrl from '../utils/buildUrl';
import wait from '../utils/wait';
import selectors from '../selectors';

const MAX_PAGE_SIZE = 2;
const languageDetector = new LanguageDetect();

async function getJobSearchMetadata({ page, location, keywords }: { page: Page, location: string, keywords: string }) {
  await page.goto('https://linkedin.com/jobs', { waitUntil: "load" });

  await page.type(selectors.keywordInput, keywords);
  await page.waitForSelector(selectors.locationInput, { visible: true });
  await page.$eval(selectors.locationInput, (el, location) => {
    const input = el as HTMLInputElement;
    input.value = '';
    input.value = location;
  }, location);
  await page.type(selectors.locationInput, ' ');
  await page.$eval('button.jobs-search-box__submit-button', (el) => (el as HTMLElement).click());
  await page.waitForFunction(() => new URLSearchParams(document.location.search).has('geoId'));

  const geoId = await page.evaluate(() => new URLSearchParams(document.location.search).get('geoId'));

  const numJobsHandle = await page.waitForSelector(selectors.searchResultListText, { timeout: 30000 }) as ElementHandle<HTMLElement>;
  const numAvailableJobs = await numJobsHandle.evaluate((el) => parseInt((el as HTMLElement).innerText.replace(/,/g, ''), 10));

  return {
    geoId,
    numAvailableJobs
  };
}

interface PARAMS {
  page: Page,
  location: string,
  keywords: string,
  workplace: { remote: boolean, onSite: boolean, hybrid: boolean },
  jobTitle: string,
  jobDescription: string,
  jobDescriptionLanguages: string[]
}

/**
 * Fetches job links as a user (logged in)
 */
async function* fetchJobLinksUser({ page, location, keywords, workplace, jobTitle, jobDescription, jobDescriptionLanguages }: PARAMS): AsyncGenerator<[string, string, string]> {
  let numSeenJobs = 0;
  let numMatchingJobs = 0;

  const workTypeFilter = [workplace.onSite, workplace.remote, workplace.hybrid]
    .map((selected, index) => selected ? index + 1 : null)
    .filter(Boolean)
    .join(',');

  const { geoId, numAvailableJobs } = await getJobSearchMetadata({ page, location, keywords });

  const searchParams = {
    keywords,
    location,
    start: numSeenJobs.toString(),
    f_WT: workTypeFilter,
    f_AL: 'true',
    ...(geoId && { geoId }),
  };

  const url = buildUrl('https://www.linkedin.com/jobs/search', searchParams);
  const jobTitleRegExp = new RegExp(jobTitle, 'i');
  const jobDescriptionRegExp = new RegExp(jobDescription, 'i');

  while (numSeenJobs < numAvailableJobs) {
    searchParams.start = numSeenJobs.toString();
    url.search = new URLSearchParams(searchParams).toString();

    await page.goto(url.toString(), { waitUntil: "load" });

    const jobListings = await page.$$(selectors.searchResultListItem);
    if (jobListings.length === 0) {
      console.log('No job listings found. Exiting loop.');
      break;
    }

    for (let i = 0; i < Math.min(jobListings.length, MAX_PAGE_SIZE); i++) {
      try {
        const [link, title] = await jobListings[i].$eval(selectors.searchResultListItemLink, (el) => {
          const linkEl = el as HTMLLinkElement;
          linkEl.click();
          return [linkEl.href.trim(), linkEl.innerText.trim()];
        });

        await page.waitForSelector(selectors.jobDescription, { timeout: 10000 });
        const jobDescriptionText = await page.$eval(selectors.jobDescription, (el) => (el as HTMLElement).innerText.trim());
        const companyName = await jobListings[i].$eval(selectors.searchResultListItemCompanyName, (el) => (el as HTMLElement).innerText.trim());

        const canApply = !!(await page.$(selectors.easyApplyButtonEnabled));
        const detectedLanguage = languageDetector.detect(jobDescriptionText, 1)[0][0];
        const matchesLanguage = jobDescriptionLanguages.includes('any') || jobDescriptionLanguages.includes(detectedLanguage);

        if (canApply && jobTitleRegExp.test(title) && jobDescriptionRegExp.test(jobDescriptionText) && matchesLanguage) {
          numMatchingJobs++;
          yield [link, title, companyName];
        }
      } catch (error) {
        console.error('Error processing job listing:', error);
      }
    }

    numSeenJobs += jobListings.length;
    await wait(2000);
  }

  console.log(`Total jobs seen: ${numSeenJobs}, Total matching jobs: ${numMatchingJobs}`);
}

export default fetchJobLinksUser;
