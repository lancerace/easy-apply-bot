export default {
  //easyApplyButtonEnabled: "button.jobs-apply-button:enabled",
  //easyApplyButtonEnabled: "div.jobs-s-apply > div.jobs-apply-button--top-card > button.jobs-apply-button",
  easyApplyButtonEnabled: "button.jobs-apply-button",
  // Job search form
  keywordInput: 'input[id*="jobs-search-box-keyword-id"]',
  locationInput: 'input[id*="jobs-search-box-location-id"]',

  // Easy apply form
  checkbox: ".jobs-easy-apply-modal input[type='checkbox']",
  fieldset: ".jobs-easy-apply-modal fieldset",
  select: ".jobs-easy-apply-modal select",
  nextButton: ".jobs-easy-apply-modal footer button[aria-label*='next'], footer button[aria-label*='Review']",
  //submitApplication: ".jobs-easy-apply-modal footer button[aria-label*='Submit']",
  submitApplication: "button[aria-label*='Submit application']",
  enabledSubmitOrNextButton: ".jobs-easy-apply-modal footer button[aria-label*='Submit']:enabled, .jobs-easy-apply-modal  footer button[aria-label*='next']:enabled, .jobs-easy-apply-modal  footer button[aria-label*='Review']:enabled",
  textInput: ".jobs-easy-apply-modal input[type='text'], .jobs-easy-apply-modal textarea",
  homeCity: ".jobs-easy-apply-modal input[id*='easyApplyFormElement'][id*='city-HOME-CITY']",
  phone: ".jobs-easy-apply-modal input[id*='easyApplyFormElement'][id*='phoneNumber']",
  documentUpload: ".jobs-easy-apply-modal div[class*='jobs-document-upload']",
  documentUploadLabel: "label[class*='jobs-document-upload']",
  documentUploadInput: "input[type='file'][id*='jobs-document-upload']",
  radioInput: "input[type='radio']",
  option: "option",
  followCompanyCheckbox: 'input[type="checkbox"]#follow-company-checkbox',

  // Login
  captcha: "#captcha-internal",
  emailInput: "#username",
  passwordInput: "#password",
  loginSubmit: "button[class*='btn__primary--large from__button--floating']",
  skipButton: "button[text()='Skip']",

  // fetch user
  searchResultList: ".jobs-search-results-list",
  searchResultListText: "small.jobs-search-results-list__text",
  searchResultListItem: ".jobs-search-results-list li.jobs-search-results__list-item",
  searchResultListItemLink: "a.job-card-list__title",
  searchResultListItemCompanyName: "div.job-card-container__company-name, a.job-card-container__company-name",
  jobDescription: "div.jobs-description-content > div.jobs-description-content__text > div.mt4 > span",
  appliedToJobFeedback: ".artdeco-inline-feedback",

  // fetch guest
  jobCount: ".results-context-header__job-count",
  showMoreButton: ".infinite-scroller__show-more-button:enabled",
  searchResultListItemGuest: ".jobs-search__results-list li",
  searchResultListItemTitleGuest: ".base-search-card__title",
  searchResultListItemSubtitleGuest: ".base-search-card__subtitle",
  searchResultListItemLocationGuest: ".job-search-card__location",
}
