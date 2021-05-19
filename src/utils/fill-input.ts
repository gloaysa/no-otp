export const fillInput = (password: string, otp: number) => {
	chrome.tabs.query({ active: true }, (tabs) => {
		if (tabs[0]) {
			chrome.tabs.executeScript(tabs[0].id, {
				code: `
				if (!document.querySelectorAll("input[type='password']")[0]) {
				alert('No he encontrado donde poner la contraseña ☹️');
				} else {
						document.querySelectorAll("input[type='password']")[0].value = ${password + otp};
						document.querySelectorAll("input[type='password']")[0].closest('form').submit();
				}`,
			});
		}
	});
};
