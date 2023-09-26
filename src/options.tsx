import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { QrReader } from 'react-qr-reader';
import { api } from './api';

const Options = () => {
	const toptRegex =
		'otpauth:\\/\\/([ht]otp)\\/(?:[a-zA-Z0-9%]+:)?([^\\?]+)\\?secret=([0-9A-Za-z]+)(?:.*(?:<?counter=)([0-9]+))?';

	const [pass, setPass] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	const [clipboard, setClipboard] = useState<boolean>(false);
	const [popUp, setPopUp] = useState<boolean>(false);
	const [fillInput, setFillInput] = useState<boolean>(!popUp && !clipboard);

	const [status, setStatus] = useState<string>('');
	const [displayQr, setDisplayQr] = useState<boolean>(false);

	const [secretShow, setSecretShow] = useState<boolean>(false);
	const [passShow, setPassShow] = useState<boolean>(false);

	useEffect(() => {
		const storage = api.storage.getStorageItems(
			['secret', 'pass', 'clipboard', 'popUp'],
			(key: { secret: string; pass: string; clipboard: boolean; popUp: boolean }) => {
				if (!secret) {
					setPass(key.pass ? key.pass : '');
					setSecret(key.secret ? key.secret : '');
					setClipboard(key.clipboard);
					setPopUp(key.popUp);
					setFillInput(!key.clipboard && !key.popUp);
				}
			}
		);
		setFillInput(!popUp && !clipboard);
	});

	const saveOptions = () => {
		api.storage.setStorageItems({ pass, secret, clipboard, popUp }, () => {
			let timeoutId: NodeJS.Timeout;
			let message: { setting: string };

			if (popUp) {
				message = { setting: 'popup' };
			} else {
				message = { setting: 'click' };
			}

			api.runtime.sendMessage(message, () => {
				setStatus('Options saved.');
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
		setClipboard(true);
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
						Cerrar lector
					</button>
					<QrReader onResult={handleQrResult} constraints={{ autoGainControl: false }} />
				</div>
			);
		}

		return (
			<div className="column is-centered">
				<button className="button is-info is-fullwidth" onClick={() => setDisplayQr(true)}>
					Obtener credenciales con código QR
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
					Guardar
				</button>

				<p className="help">Secret y contraseña quedarán guardadas en tu navegador, yo no almaceno ningún dato</p>
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
										<label className="label">Secret</label>
										<div className="control has-icons-right">
											<input
												className="input"
												type={secretShow ? 'text' : 'password'}
												id="secret"
												placeholder="SECRET"
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
										<label className="label">Password</label>
										<div className="control has-icons-right">
											<input
												className="input"
												type={passShow ? 'text' : 'password'}
												id="password"
												placeholder="PASSWORD (optional)"
												onChange={(event) => setPass(event.target.value)}
												value={pass}
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
											De forma opcional, puedes ingresar aquí tu contraseña. Esta contraseña solo tienes que
											proporcionarla en el caso de que tengas un formato contraseña + otp a la hora de logarte. Es poco
											común, si no sabes de qué va esto, posiblemente no tengas que añadir nada en este campo.
										</p>
									</div>

									<br />

									<div className="field is-centered">
										<div className="control">
											<label className="checkbox">
												<input
													type="checkbox"
													onChange={(event) => handleSetFillInput(event.target.checked)}
													checked={fillInput}
												/>{' '}
												Rellenar input automáticamente
											</label>
										</div>
										<p className="help">
											Si seleccionas esta opción, la OTP (más la contraseña si la proporcionas) intentará rellenar el
											input de la contraseña automáticamente. Si ves que no funciona correctamente, selecciona una de
											las opciones de abajo en su lugar.
										</p>
									</div>

									<div className="field is-centered">
										<div className="control">
											<label className="checkbox">
												<input
													type="checkbox"
													onChange={(event) => handleSetClipboard(event.target.checked)}
													checked={clipboard}
												/>{' '}
												Guardar en el portapapeles
											</label>
										</div>
										<p className="help">
											Si seleccionas esta opción, la OTP (más la contraseña si la proporcionas) quedará en tu
											portapapeles al clicar en el plugin.
										</p>
									</div>

									<br />

									<div className="field is-centered">
										<div className="control">
											<label className="checkbox">
												<input
													type="checkbox"
													onChange={(event) => handleSetPopUp(event.target.checked)}
													checked={popUp}
												/>{' '}
												Muestra un popup al clicar la extensión
											</label>
										</div>
										<p className="help">
											Al marcar esta opción, se mostrará un popup al clicar en la extensión. Desde ahí podrás elegir si
											quieres que la OTP te rellene una contraseña o que se guarde en el portapapeles.
										</p>
									</div>

									<br />

									{displayNotification()}

									<hr />

									<p>
										Para usarlo, ve a la página de iniciar sesión del servicio que te pide OTP y simplemente clica en el
										botón de la extensión, colocará la contraseña e iniciará sesión automáticamente.
										<br />
										Si has elegido que se guarde en el portapapeles, podrás usar la extensión en cualquier página, sin
										necesidad de que exista un formulario.
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
						<strong>NO+OTP</strong> - made with <span className="has-text-danger">&hearts;</span> by{' '}
						<a href="https://loaysa.com">Guillermo Loaysa</a>
					</p>
					<div className="tags has-addons level-item">
						<span className="tag is-rounded is-info">last update</span>
						<span className="tag is-rounded">Sept, 2023</span>
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
