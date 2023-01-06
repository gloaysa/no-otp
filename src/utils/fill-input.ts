export const fillInput = async (password: string, otp: number) => {
	await browser.tabs.executeScript({
		code: `
				if (!document.querySelectorAll("input[type='password']")[0]) {
				alert('No he encontrado donde poner la contraseña ☹️');
				} else {
						document.querySelectorAll("input[type='password']")[0].value = '${password + otp}';
						document.querySelectorAll("input[type='password']")[0].closest('form').submit();
				}`,
	});
};
