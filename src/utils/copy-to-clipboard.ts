export const copyToClipboard = async (str: string) => {
	if (chrome) {
		// Solution 1 - As of Jan 2023, service workers cannot directly interact with
		// the system clipboard using either `navigator.clipboard` or
		// `document.execCommand()`. To work around this, we'll create an offscreen
		// document and pass it the data we want to write to the clipboard.
		await chrome.offscreen.createDocument({
			url: 'offscreen.html',
			reasons: [chrome.offscreen.Reason.CLIPBOARD],
			justification: 'Write text to the clipboard.'
		});

		// Now that we have an offscreen document, we can dispatch the
		// message.
		await chrome.runtime.sendMessage({
			type: 'copy-data-to-clipboard',
			target: 'offscreen-doc',
			data: str
		});
	}
	if (document) {
		const el = document.createElement('input');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.display = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}
};
