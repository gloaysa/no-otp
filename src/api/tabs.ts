import { ExtensionTypes, Tabs } from 'webextension-polyfill';
import InjectDetails = ExtensionTypes.InjectDetails;
import UpdateProperties = chrome.tabs.UpdateProperties;
import Tab = Tabs.Tab;

/**
 * Namespace for working with browser tabs.
 */
export const tabs = {
	/**
	 * Creates a new tab with the specified URL.
	 * @param url - The URL to open in the new tab.
	 * @returns A Promise that resolves to the tab object of the newly created tab.
	 */
	create(url: string): Promise<Tab | chrome.tabs.Tab> {
		if (typeof browser !== 'undefined' && browser.tabs) {
			// Firefox WebExtensions API
			return browser.tabs.create({ url });
		} else if (typeof chrome !== 'undefined' && chrome.tabs) {
			// Chrome Extension API
			return new Promise((resolve) => {
				chrome.tabs.create({ url }, (tab) => {
					resolve(tab);
				});
			});
		} else {
			console.error('Unsupported browser.');
			return Promise.reject('Unsupported browser.');
		}
	},

	/**
	 * Updates a tab with new properties.
	 * @param tabId - The ID of the tab to update.
	 * @param properties - The properties to update.
	 * @returns A Promise that resolves when the tab has been updated.
	 */
	update(tabId: number, properties: UpdateProperties): Promise<Tab | void> {
		if (typeof browser !== 'undefined' && browser.tabs) {
			// Firefox WebExtensions API
			return browser.tabs.update(tabId, properties);
		} else if (typeof chrome !== 'undefined' && chrome.tabs) {
			// Chrome Extension API
			return new Promise((resolve) => {
				chrome.tabs.update(tabId, properties, () => {
					resolve();
				});
			});
		} else {
			console.error('Unsupported browser.');
			return Promise.reject('Unsupported browser.');
		}
	},

	/**
	 * Closes a tab with the specified ID.
	 * @param tabId - The ID of the tab to close.
	 * @returns A Promise that resolves when the tab has been closed.
	 */
	remove(tabId: number): Promise<void> {
		if (typeof browser !== 'undefined' && browser.tabs) {
			// Firefox WebExtensions API
			return browser.tabs.remove(tabId);
		} else if (typeof chrome !== 'undefined' && chrome.tabs) {
			// Chrome Extension API
			return new Promise((resolve) => {
				chrome.tabs.remove(tabId, () => {
					resolve();
				});
			});
		} else {
			console.error('Unsupported browser.');
			return Promise.reject('Unsupported browser.');
		}
	},

	/**
	 * Executes a script in the specified tab.
	 * @param details - Details of the script execution.
	 * @returns A Promise that resolves with the result of the script execution.
	 */
	executeScript(details: InjectDetails): Promise<any[]> {
		if (typeof browser !== 'undefined' && browser.tabs) {
			// Firefox WebExtensions API
			return browser.tabs.executeScript(details);
		} else if (typeof chrome !== 'undefined' && chrome.tabs) {
			// Chrome Extension API
			return new Promise((resolve) => {
				chrome.tabs.executeScript(details, (result) => {
					resolve(result);
				});
			});
		} else {
			console.error('Unsupported browser.');
			return Promise.reject('Unsupported browser.');
		}
	},
};
