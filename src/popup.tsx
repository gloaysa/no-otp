import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import TOTP from './lib/TOTP';
import { copyToClipboard } from './utils/copy-to-clipboard';
import { fillInput } from './utils/fill-input';
import { api } from './api';
import './i18n/i18n';
import './popup.css';
import { useTranslation } from 'react-i18next';

const Popup = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');
	const [totp, setTotp] = useState(null);
	const [otp, setOtp] = useState(null);
	const [password, setPassword] = useState<string>();
	const [clipboard, setClipboard] = useState<boolean>();
	const { t } = useTranslation();

	useEffect(() => {
		// Listen for theme changes in the browser
		chrome.storage.sync.get(['theme'], (result) => {
			if (result.theme) {
				setTheme(result.theme);
			}
		});

		// Detect theme changes in Firefox
		if (typeof browser !== 'undefined' && browser.storage) {
			browser.storage.onChanged.addListener((changes) => {
				if (changes.theme) {
					setTheme(changes.theme.newValue);
				}
			});
		}
	}, []);

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	}

	const fillOtp = () => {
		setOtp(totp.otp);

		fillInput(password, totp?.getOTP());
	};

	const copyOtpToClipboard = () => {
		copyToClipboard(password + totp.otp);
	};

	const goToOptions = () => {
		chrome.runtime.openOptionsPage();
	};

	api.storage.getStorageItems(
		['secret', 'pass', 'clipboard'],
		(key: { secret: string; pass: string; clipboard: boolean }) => {
			if (!key.secret) {
				return goToOptions();
			}

			setClipboard(key.clipboard);

			setPassword(key.pass ? key.pass : '');

			if (!totp) {
				setTotp(new TOTP(key.secret));
			}

			setOtp(totp?.getOTP());
		},
	);

	return (
		<div className={`popup-container ${theme}`}>
			<div className='options'>
				<button className={`option ${theme}`} onClick={copyOtpToClipboard}>
					{t('popup.clipboard')}
				</button>

				<button className={`option ${theme}`} onClick={fillOtp}>
					{t('popup.fillPassword')}
				</button>

				<button className={`option ${theme}`} onClick={goToOptions}>
					{t('popup.options')}
				</button>
			</div>
		</div>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById('root'),
);
