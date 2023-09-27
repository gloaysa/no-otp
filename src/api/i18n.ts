function getUILanguage() {
	let userLanguage = '';

	if (typeof browser !== 'undefined' && browser.i18n) {
		// For Firefox or compatible browsers
		userLanguage = browser.i18n.getUILanguage();
	} else if (typeof chrome !== 'undefined' && chrome.i18n) {
		// For Chrome or compatible browsers
		userLanguage = chrome.i18n.getUILanguage();
	} else if (typeof navigator !== 'undefined' && navigator.language) {
		// Fallback to using navigator.language
		userLanguage = navigator.language;
	}

	return userLanguage;
}

export const i18n = {
	getUILanguage,
};
