console.log('content script root');

browser.runtime.onMessage.addListener((msg, sender) => {
	console.log('content script', sender);

	if (msg.user) {
		const input: HTMLInputElement = document.querySelectorAll("input[type='password']")[0] as HTMLInputElement;

		if (!input) {
			return alert('No he encontrado donde poner la contraseña ☹️');
		}

		input.value = msg.user.password + msg.user.otp;
		const form = input.closest('form');
		form.submit();
	}
});
