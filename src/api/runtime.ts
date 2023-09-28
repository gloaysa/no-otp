/**
 * Get the extension ID, which is unique to each extension.
 * @returns The extension ID.
 */
function getExtensionId(): string | null {
	if (typeof browser !== 'undefined' && browser.runtime) {
		// Firefox WebExtensions API
		return browser.runtime.id;
	} else if (typeof chrome !== 'undefined' && chrome.runtime) {
		// Chrome Extension API
		return chrome.runtime.id;
	} else {
		console.error('Unsupported browser.');
		return null;
	}
}

/**
 * Get the background page of the extension.
 * @param callback - A callback function that receives the background page as an argument.
 */
function getBackgroundPage(callback: (backgroundPage: any) => void): void {
	if (typeof browser !== 'undefined' && browser.runtime) {
		// Firefox WebExtensions API
		browser.runtime.getBackgroundPage().then(callback);
	} else if (typeof chrome !== 'undefined' && chrome.runtime) {
		// Chrome Extension API
		chrome.runtime.getBackgroundPage(callback);
	} else {
		console.error('Unsupported browser.');
	}
}

/**
 * Open the options page of the extension, if defined in the manifest.
 */
function openOptionsPage(): void {
	if (typeof browser !== 'undefined' && browser.runtime) {
		// Firefox WebExtensions API
		browser.runtime.openOptionsPage();
	} else if (typeof chrome !== 'undefined' && chrome.runtime) {
		// Chrome Extension API
		chrome.runtime.openOptionsPage();
	} else {
		console.error('Unsupported browser.');
	}
}

/**
 * Send a message to the extension's background script.
 * @param message - The message to send.
 * @param callback - A callback function that will be called with the response (if any).
 */
function sendMessage(message: any, callback?: (response: any) => void): void {
	if (typeof browser !== 'undefined' && browser.runtime) {
		// Firefox WebExtensions API
		browser.runtime.sendMessage(message, callback);
	} else if (typeof chrome !== 'undefined' && chrome.runtime) {
		// Chrome Extension API
		chrome.runtime.sendMessage(message, callback);
	} else {
		console.error('Unsupported browser.');
	}
}

/**
 * Wrapper function to add a message event listener for the runtime.
 * @param listener - The callback function to be executed when a message is received.
 */
function onMessage(listener: (msg: any, sender: any) => void): void {
	if (typeof browser !== 'undefined' && browser.runtime) {
		// Firefox WebExtensions API
		browser.runtime.onMessage.addListener(listener);
	} else if (typeof chrome !== 'undefined' && chrome.runtime) {
		// Chrome Extension API
		chrome.runtime.onMessage.addListener(listener);
	} else {
		console.error('Unsupported browser.');
	}
}

export const runtime = {
	getExtensionId,
	getBackgroundPage,
	openOptionsPage,
	sendMessage,
	onMessage,
};
