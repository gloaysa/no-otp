import TOTP from './lib/TOTP';
import { copyToClipboard } from './utils/copy-to-clipboard';
import { fillInput } from './utils/fill-input';

// Uncomment this block to reset the secret for debugging purposes
/*
	browser.storage.sync.set({
		pass: null,
		secret: null
	});
	*/

browser.browserAction.onClicked.addListener(() => {
	let clipboard: boolean;
	let password: string;
	let totp: TOTP;

	browser.storage.sync.get(['secret', 'pass', 'clipboard'])
		.then((key: { secret: string; pass: string; clipboard: boolean }) => {
			if (!key.secret) {
				browser.runtime.openOptionsPage();
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
		});
});

browser.runtime.onMessage.addListener(function (request, sender) {
	if (request.setting == 'popup') {
		browser.browserAction.setPopup({ popup: '../popup.html' });
	}

	if (request.setting == 'click') {
		browser.browserAction.setPopup({ popup: '' });
	}
});
