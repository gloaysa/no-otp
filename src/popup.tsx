import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import TOTP from './lib/TOTP';
import { copyToClipboard } from './utils/copy-to-clipboard';
import { fillInput } from './utils/fill-input';
import { api } from './api';

const Popup = () => {
	const [totp, setTotp] = useState(null);
	const [otp, setOtp] = useState(null);
	const [password, setPassword] = useState<string>();
	const [clipboard, setClipboard] = useState<boolean>();

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
		}
	);

	return (
		<div style={{ display: 'flex' }}>
			<button onClick={copyOtpToClipboard} style={{ marginRight: '5px' }}>
				Copiar al portapapeles
			</button>

			<button onClick={fillOtp} style={{ marginRight: '5px' }}>
				Rellenar contraseña
			</button>

			<button onClick={goToOptions} style={{ marginRight: '5px' }}>
				Opciones
			</button>
		</div>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById('root')
);
