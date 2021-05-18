import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import TOTP from './lib/TOTP'

const Popup = () => {
	const [totp, setTotp] = useState(null)
	const [otp, setOtp] = useState(null)
	const [password, setPassword] = useState<string>()

	useEffect(() => {

		// Uncomment this block to reset the secret for debugging purposes
		/*
		chrome.storage.sync.set({
			pass: null,
			secret: null
		});
		*/

		chrome.storage.sync.get(['secret', 'pass'], (key: { secret: string; pass: string }) => {
			if (!key.secret) {
				return chrome.runtime.openOptionsPage()
			}

			setPassword(key.pass ? key.pass : '')
			if (!totp) {
				setTotp(new TOTP(key.secret))
			}

			setOtp(totp?.getOTP())
		})
	}, [totp])

	const updateOtp = () => {
		setOtp(totp.otp)

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0]
			if (tab.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						user: { otp, password }
					},
					(msg) => {
						console.log('user message:', msg)
					}
				)
			}
		})
	}

	return (
		<>
			<ul style={{ minWidth: '700px' }}>
				<li>Current Pass: {password}</li>
				<li>Current OTP: {otp}</li>
			</ul>
			<button onClick={updateOtp} style={{ marginRight: '5px' }}>
				Update OTP
			</button>
		</>
	)
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById('root')
)
