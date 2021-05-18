chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.user) {
		const input: HTMLInputElement = document.querySelectorAll("input[type='password']")[0] as HTMLInputElement

		if (input) {
			input.setAttribute('type', 'text')

			input.value = msg.user.password + msg.user.otp
			const form = input.closest('form')
			form.submit();
		}

		sendResponse(input?.value)
	}
})
