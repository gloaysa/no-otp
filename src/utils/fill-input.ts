import { api } from '../api';

export const fillInput = async (text: string) => {
	console.log(text);
	await api.tabs.executeScript({
		code: `
				if (!document.querySelectorAll("input[type='password']")[0]) {
				alert('No he encontrado donde poner la contraseña ☹️');
				} else {
						document.querySelectorAll("input[type='password']")[0].value = '${text}';
						document.querySelectorAll("input[type='password']")[0].closest('form').submit();
				}`,
	});
};
