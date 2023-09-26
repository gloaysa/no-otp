import TOTP from './lib/TOTP';
import { copyToClipboard } from './utils/copy-to-clipboard';
import { fillInput } from './utils/fill-input';
import { api } from './api';

// Uncomment this block to reset the secret for debugging purposes
/*api.storage.setStorageItems({
	pass: null,
	secret: null,
});*/

api.storage.getStorageItems(['popUp'], (key: { popUp: boolean }) => {
	if (key.popUp) {
		api.browserAction.setBrowserActionPopup('../popup.html');
	} else {
		api.browserAction.setBrowserActionPopup('');
	}
});

api.browserAction.onClicked(() => {
	let clipboard: boolean;
	let password: string;
	let totp: TOTP;

	api.storage.getStorageItems(
		['secret', 'pass', 'clipboard'],
		(key: { secret: string; pass: string; clipboard: boolean }) => {
			if (!key.secret) {
				api.runtime.openOptionsPage();
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

api.runtime.onMessage(function (request, sender) {
	if (request.setting == 'popup') {
		api.browserAction.setBrowserActionPopup('../popup.html');
	}

	if (request.setting == 'click') {
		api.browserAction.setBrowserActionPopup('');
	}
});

api.runtime.onMessage((msg, sender) => {
	return new Promise((resolve) => {
		if (msg.user) {
			const input: HTMLInputElement = document.querySelectorAll("input[type='password']")[0] as HTMLInputElement;

			if (!input) {
				alert('No he encontrado donde poner la contraseña ☹️');
				resolve('No input element found');
			} else {
				input.value = msg.user.password + msg.user.otp;
				const form = input.closest('form');
				form.submit();

				resolve(input?.value);
			}
		} else {
			resolve(null);
		}
	});
});
