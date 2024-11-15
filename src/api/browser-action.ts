/**
 * Wrapper function to set the popup of the browser action.
 * @param popup - The URL of the HTML file to be used as a popup. An empty string clears the popup.
 * @returns A Promise that resolves when the popup is set.
 */
function setBrowserActionPopup(popup: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (typeof browser !== 'undefined' && browser.browserAction) {
			// Firefox WebExtensions API
			browser.browserAction.setPopup({ popup })
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		} else if (typeof chrome !== 'undefined' && chrome.action) {
			// Chrome Extension API
			chrome.action.setPopup({ popup }, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
				}
			});
		} else {
			reject(new Error('Unsupported browser.'));
		}
	});
}

/**
 * Wrapper function to set the title of the browser action.
 * @param title - The title text to set.
 * @returns A Promise that resolves when the title is set.
 */
function setBrowserActionTitle(title: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (typeof browser !== 'undefined' && browser.browserAction) {
			// Firefox WebExtensions API
			browser.browserAction.setTitle({ title })
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		} else if (typeof chrome !== 'undefined' && chrome.action) {
			// Chrome Extension API
			chrome.action.setTitle({ title }, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
				}
			});
		} else {
			reject(new Error('Unsupported browser.'));
		}
	});
}

/**
 * Wrapper function to add a click event listener for the browser action.
 * @param listener - The callback function to be executed when the browser action is clicked.
 */
function onClicked(listener: () => void): void {
	if (typeof browser !== 'undefined' && browser.browserAction) {
		// Firefox WebExtensions API
		browser.browserAction.onClicked.addListener(listener);
	} else if (typeof chrome !== 'undefined' && chrome.action) {
		// Chrome Extension API
		chrome.action.onClicked.addListener(listener);
	} else {
		console.error('Unsupported browser.');
	}
}

export const browserAction = {
	setBrowserActionPopup,
	setBrowserActionTitle,
	onClicked
}
