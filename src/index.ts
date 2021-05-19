import TOTP from './lib/TOTP';
import { copyToClipboard } from './utils/copy-to-clipboard';
import { fillInput } from './utils/fill-input';

// Uncomment this block to reset the secret for debugging purposes
/*
	chrome.storage.sync.set({
		pass: null,
		secret: null
	});
	*/

chrome.browserAction.onClicked.addListener(() => {
	let clipboard: boolean;
	let password: string;
	let totp: TOTP;

	chrome.storage.sync.get(
		['secret', 'pass', 'clipboard'],
		(key: { secret: string; pass: string; clipboard: boolean }) => {
			if (!key.secret) {
				chrome.runtime.openOptionsPage();
			}

			clipboard = key.clipboard;

			password = key.pass ? key.pass : '';

			if (!totp) {
				totp = new TOTP(key.secret);
			}

			if (clipboard) {
				return copyToClipboard(password + totp?.getOTP());
			}

			fillInput(password, totp?.getOTP());
		}
	);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.setting == 'popup') {
		chrome.browserAction.setPopup({ popup: '../popup.html' });
		sendResponse({ setting: 'popup enabled' });
	}

	if (request.setting == 'click') {
		chrome.browserAction.setPopup({ popup: '' });
		sendResponse({ setting: 'click enabled' });
	}
});
