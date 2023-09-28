import TOTP from './lib/TOTP';
import { copyToClipboard } from './utils/copy-to-clipboard';
import { fillInput } from './utils/fill-input';
import { api } from './api';
import { StorageItems } from './interfaces/storage-items.interface';
import { RuntimeMessage, RuntimeMessageId } from './interfaces/runtime-message.interface';

// Uncomment this block to reset the secret for debugging purposes
/*api.storage.setStorageItems({
	pass: null,
	secret: null,
});*/

api.storage.getStorageItems(['popUp'], ({ popUp }: StorageItems) => {
	if (popUp) {
		api.browserAction.setBrowserActionPopup('../popup.html');
	} else {
		api.browserAction.setBrowserActionPopup('');
	}
});

api.browserAction.onClicked(() => {
	let totp: TOTP;

	api.storage.getStorageItems(
		['secret', 'pass', 'clipboard'],
		({ secret, pass, clipboard }: StorageItems) => {
			if (!secret) {
				api.runtime.openOptionsPage();
				return;
			}

			if (!totp) {
				totp = new TOTP(secret);
			}

			const passWithOtp = (pass ?? '') + totp?.getOTP();

			if (clipboard) {
				copyToClipboard(passWithOtp);
				return;
			}

			fillInput(passWithOtp);
		}
	);
});

api.runtime.onMessage(function(request: RuntimeMessage, sender) {
	if (request.id === RuntimeMessageId.ModeSetting) {
		if (request.payload.setting == 'popup') {
			api.browserAction.setBrowserActionPopup('../popup.html');
		}

		if (request.payload.setting == 'click') {
			api.browserAction.setBrowserActionPopup('');
		}
	}

});

