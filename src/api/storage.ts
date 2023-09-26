/**
 * Wrapper function to get items from storage.
 * @param keys - A string, array of strings, or object with keys to retrieve from storage.
 * @param callback - A callback function that receives the retrieved items.
 */
function getStorageItems(
	keys: string | string[] | Record<string, any>,
	callback: (result: Record<string, any>) => void
): void {
	if (typeof browser !== 'undefined' && browser.storage) {
		// Firefox WebExtensions API
		browser.storage.sync.get(keys).then(callback);
	} else if (typeof chrome !== 'undefined' && chrome.storage) {
		// Chrome Extension API
		chrome.storage.sync.get(keys, callback);
	} else {
		console.error('Unsupported browser.');
	}
}

/**
 * Wrapper function to set items in storage.
 * @param items - An object containing items to be stored.
 * @param callback - A callback function to be executed after the items have been stored.
 */
function setStorageItems(items: Record<string, any>, callback?: () => void): void {
	if (typeof browser !== 'undefined' && browser.storage) {
		// Firefox WebExtensions API
		browser.storage.sync.set(items).then(callback);
	} else if (typeof chrome !== 'undefined' && chrome.storage) {
		// Chrome Extension API
		chrome.storage.sync.set(items, callback);
	} else {
		console.error('Unsupported browser.');
	}
}

/**
 * Wrapper function to remove items from storage.
 * @param keys - A string or array of strings representing keys to remove from storage.
 * @param callback - A callback function to be executed after the items have been removed.
 */
function removeStorageItems(keys: string | string[], callback?: () => void): void {
	if (typeof browser !== 'undefined' && browser.storage) {
		// Firefox WebExtensions API
		browser.storage.sync.remove(keys).then(callback);
	} else if (typeof chrome !== 'undefined' && chrome.storage) {
		// Chrome Extension API
		chrome.storage.sync.remove(keys, callback);
	} else {
		console.error('Unsupported browser.');
	}
}

/**
 * Wrapper function to clear all items from storage.
 * @param callback - A callback function to be executed after storage is cleared.
 */
function clearStorage(callback?: () => void): void {
	if (typeof browser !== 'undefined' && browser.storage) {
		// Firefox WebExtensions API
		browser.storage.sync.clear().then(callback);
	} else if (typeof chrome !== 'undefined' && chrome.storage) {
		// Chrome Extension API
		chrome.storage.sync.clear(callback);
	} else {
		console.error('Unsupported browser.');
	}
}

export const storage = {
	getStorageItems,
	setStorageItems,
	removeStorageItems,
	clearStorage
}
