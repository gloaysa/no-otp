export const copyToClipboard = (str: string) => {
	navigator.clipboard.writeText(str);
};
