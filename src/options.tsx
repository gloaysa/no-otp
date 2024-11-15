import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { QrReader } from 'react-qr-reader';
import { api } from './api';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';
import { StorageItems } from './interfaces/storage-items.interface';
import { RuntimeMessage, RuntimeMessageId } from './interfaces/runtime-message.interface';

const Options = () => {
	const toptRegex =
		'otpauth:\\/\\/([ht]otp)\\/(?:[a-zA-Z0-9%]+:)?([^\\?]+)\\?secret=([0-9A-Za-z]+)(?:.*(?:<?counter=)([0-9]+))?';

	const [pass, setPass] = useState<StorageItems['pass']>('');
	const [secret, setSecret] = useState<StorageItems['secret']>('');
	const [clipboard, setClipboard] = useState<StorageItems['clipboard']>(false);
	const [popUp, setPopUp] = useState<StorageItems['popUp']>(false);
	const [fillInput, setFillInput] = useState<StorageItems['fillInput']>(!popUp && !clipboard);

	const [status, setStatus] = useState<string>('');
	const [displayQr, setDisplayQr] = useState<boolean>(false);

	const [secretShow, setSecretShow] = useState<boolean>(false);
	const [passShow, setPassShow] = useState<boolean>(false);

	const { t } = useTranslation();

	useEffect(() => {
		api.storage.getStorageItems(
			['secret', 'pass', 'clipboard', 'popUp'],
			(key: StorageItems) => {
				if (!secret) {
					setPass(key.pass ? key.pass : '');
					setSecret(key.secret ? key.secret : '');
					setClipboard(!!key.clipboard);
					setPopUp(!!key.popUp);
					setFillInput(!key.clipboard && !key.popUp);
				}
			}
		);
		setFillInput(!popUp && !clipboard);
	}, []);

	useEffect(() => {
		// ensure that if no checkbox is selected, we select the default one
		setFillInput(!clipboard && !popUp);
	}, [clipboard, popUp]);

	const saveOptions = () => {
		const options: StorageItems = { pass, secret, clipboard, popUp, fillInput };
		api.storage.setStorageItems(options, () => {
			let timeoutId: NodeJS.Timeout;
			let message: RuntimeMessage;

			if (popUp) {
				message = { id: RuntimeMessageId.ModeSetting, payload: { setting: 'popup' } };
			} else {
				message = { id: RuntimeMessageId.ModeSetting, payload: { setting: 'click' } };
			}

			api.runtime.sendMessage(message, () => {
				setStatus(t('options.settingsSaved'));
				timeoutId = setTimeout(() => {
					setStatus(undefined);
				}, 1000);
			});
			return () => clearTimeout(timeoutId);
		});
	};

	const handleQrResult = (result: { getText: () => string }, error: Error) => {
		if (result) {
			const data = result.getText();
			const re = data?.match(toptRegex);
			if (re) {
				setSecret(re[3]);
				setDisplayQr(false);
			}
		}
		if (error) {
			// console.error(err);
		}
	};

	const handleSetPopUp = (value: boolean) => {
		if (value) {
			setClipboard(false);
			setFillInput(false);
		}
		setPopUp(value);
	};

	const handleSetClipboard = (value: boolean) => {
		if (value) {
			setPopUp(false);
			setFillInput(false);
		}
		setClipboard(value);
	};

	const handleSetFillInput = (value: boolean) => {
		if (value) {
			setPopUp(false);
			setClipboard(false);
		}
		setFillInput(true);
	};

	const displayQrReader = () => {
		if (displayQr) {
			return (
				<div className="column is-centered">
					<button className="button is-warning is-fullwidth" onClick={() => setDisplayQr(false)}>
						{t('options.qr.close')}
					</button>
					<QrReader onResult={handleQrResult} constraints={{ autoGainControl: false }} />
				</div>
			);
		}

		return (
			<div className="column is-centered">
				<button className="button is-info is-fullwidth" onClick={() => setDisplayQr(true)}>
					{t('options.qr.open')}
				</button>
			</div>
		);
	};

	const displayNotification = () => {
		if (status) {
			return <div className="notification is-primary">{status}</div>;
		}
		return (
			<div className="field is-centered">
				<button className="button is-info is-medium is-fullwidth" onClick={saveOptions} disabled={!secret}>
					{t('general.save')}
				</button>

				<p className='help'>{t('options.disclaimer')}</p>
			</div>
		);
	};

	return (
		<>
			<div className="container">
				<section className="articles">
					<div className="columns is-mobile">
						<div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
							{/* START ARTICLE */}
							<div className="card article">
								<div className="card-content">
									<div className="columns is-mobile is-centered is-vcentered">
										<div className="column is-narrow">
											<img src="../images/unlock-50.png" alt="NOMASOTP" />
										</div>
										<div className="column is-narrow">
											<span className="title">NO+OTP</span>
										</div>
									</div>

									<div className="content article-body">
										<div className="has-text-centered">{displayQrReader()}</div>
									</div>

									<div className="field is-centered">
										<label className='label'>{t('options.form.secret')}</label>
										<div className="control has-icons-right">
											<input
												className="input"
												type={secretShow ? 'text' : 'password'}
												id="secret"
												placeholder={t('options.form.secret')}
												onChange={(event) => setSecret(event.target.value)}
												value={secret}
											/>
											<span
												className="icon is-small is-right"
												onClick={() => setSecretShow(!secretShow)}
												style={{ cursor: 'pointer', pointerEvents: 'all' }}
											>
												<i className={`fas ${secretShow ? 'fa-eye' : 'fa-eye-slash'}`} />
											</span>
										</div>
									</div>

									<br />

									<div className="field is-centered">
										<label className='label'>{t('options.form.password')}</label>
										<div className="control has-icons-right">
											<input
												className="input"
												type={passShow ? 'text' : 'password'}
												id="password"
												placeholder={t('options.form.password')}
												onChange={(event) => setPass(event.target.value)}
												value={pass}
												disabled={!secret}
											/>
											<span
												className="icon is-small is-right"
												onClick={() => setPassShow(!passShow)}
												style={{ cursor: 'pointer', pointerEvents: 'all' }}
											>
												<i className={`fas ${passShow ? 'fa-eye' : 'fa-eye-slash'}`} />
											</span>
										</div>
										<p className="help">
											{t('options.form.passwordExplanation')}
										</p>
									</div>

									<br />

									<div className="field is-centered">
										<div className="control">
											<label className='radio'>
												<input
													type='radio'
													onChange={(event) => handleSetFillInput(event.target.checked)}
													checked={fillInput}
													disabled={!secret}
												/>{' '}
												{t('options.form.checkbox.autoFill')}
											</label>
										</div>
										<p className="help">
											{t('options.form.checkbox.autoFillExplanation')}
										</p>
									</div>

									<div className="field is-centered">
										<div className="control">
											<label className='radio'>
												<input
													type='radio'
													onChange={(event) => handleSetClipboard(event.target.checked)}
													checked={clipboard}
													disabled={!secret}
												/>{' '}
												{t('options.form.checkbox.clipboard')}
											</label>
										</div>
										<p className="help">
											{t('options.form.checkbox.clipboardExplanation')}
										</p>
									</div>

									<div className="field is-centered">
										<div className="control">
											<label className='radio'>
												<input
													type='radio'
													onChange={(event) => handleSetPopUp(event.target.checked)}
													checked={popUp}
													disabled={!secret}
												/>{' '}
												{t('options.form.checkbox.popUp')}
											</label>
										</div>
										<p className="help">
											{t('options.form.checkbox.popUpExplanation')}
										</p>
									</div>

									<br />

									{displayNotification()}

									<hr />

									<p className='content'>
										{t('options.howTo.p1')}
									</p>
									<p className='content'>
										{t('options.howTo.p2')}
									</p>

									<br />

									<div className="columns is-mobile is-centered">
										<div className="column is-half">
											<div className="image is-centered">
												<img src="https://media.giphy.com/media/3KC2jD2QcBOSc/giphy.gif" alt="party" />
											</div>
										</div>
									</div>
								</div>
							</div>
							{/* END ARTICLE --> */}
						</div>
						{/* END COLUMN --> */}
					</div>
				</section>
				{/* END ARTICLE FEED */}
			</div>

			<footer className="footer">
				<div className="content has-text-centered">
					<p>
						<strong>NO+OTP</strong> - {t('footer.madeWith')} <span
						className='has-text-danger'>&hearts;</span> {t('footer.by')}{' '}
						<a href="https://loaysa.com">Guillermo Loaysa</a>
					</p>
					<div className="tags has-addons level-item">
						<span className='tag is-rounded is-info'>{t('footer.lastUpdate')}</span>
						<span className='tag is-rounded'>11 - 2024</span>
					</div>
				</div>
			</footer>
		</>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<Options />
	</React.StrictMode>,
	document.getElementById('root')
);
