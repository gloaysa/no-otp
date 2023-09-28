export const copyToClipboard = (str: string) => {
	const el = document.createElement('input');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.display = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};
