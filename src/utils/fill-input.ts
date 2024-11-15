import { api } from '../api';

export const fillInput = async (text: string) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length > 0 && tabs[0].id) {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: (password) => {
					// Injected function that fills in the password field
					const passwordInput: HTMLInputElement = document.querySelector("input[type='password']");
					if (!passwordInput) {
						alert('No password field found ☹️');
					} else {
						passwordInput.value = password;
						const form = passwordInput.closest('form');
						if (form) {
							form.submit();
						}
					}
				},
				args: [text], // Pass the password text to the injected function
			});
		}
	});
};
