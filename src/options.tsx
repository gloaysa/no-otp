import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import QrReader from 'react-qr-reader';

const Options = () => {
	const toptRegex =
		'otpauth:\\/\\/([ht]otp)\\/(?:[a-zA-Z0-9%]+:)?([^\\?]+)\\?secret=([0-9A-Za-z]+)(?:.*(?:<?counter=)([0-9]+))?';

	const [pass, setPass] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	const [clipboard, setClipboard] = useState<boolean>(false);
	const [popUp, setPopUp] = useState<boolean>(false);

	const [status, setStatus] = useState<string>('');
	const [displayQr, setDisplayQr] = useState<boolean>(undefined);

	const [secretShow, setSecretShow] = useState<boolean>(false);
	const [passShow, setPassShow] = useState<boolean>(false);

	useEffect(() => {
		chrome.storage.sync.get(
			['secret', 'pass', 'clipboard', 'popUp'],
			(key: { secret: string; pass: string; clipboard: boolean; popUp: boolean }) => {
				if (!secret) {
					setPass(key.pass ? key.pass : '');
					setSecret(key.secret ? key.secret : '');
					setClipboard(key.clipboard);
					setPopUp(key.popUp);
				}
			}
		);
	});

	const saveOptions = () => {
		// Saves options to chrome.storage.sync.
		chrome.storage.sync.set({ pass, secret, clipboard, popUp }, () => {
			let timeoutId;
			let message;

			if (popUp) {
				message = { setting: 'popup' };
			} else {
				message = { setting: 'click' };
			}

			chrome.runtime.sendMessage(message, () => {
				setStatus('Options saved.');
				timeoutId = setTimeout(() => {
					setStatus(undefined);
				}, 1000);
			});
			return () => clearTimeout(timeoutId);
		});
	};

	const handleScan = (data: string) => {
		const re = data?.match(toptRegex);
		if (re) {
			setSecret(re[3]);
			setDisplayQr(false);
		}
	};
	const handleError = (err) => {
		console.error(err);
	};

	const displayQrReader = () => {
		if (displayQr) {
			return (
				<div className="column is-centered">
					<button className="button is-warning is-fullwidth" onClick={() => setDisplayQr(false)}>
						Cerrar lector
					</button>
					<QrReader delay={300} onError={handleError} onScan={handleScan} />
				</div>
			);
		}

		return (
			<div className="column is-centered">
				<button className="button is-info is-fullwidth" onClick={() => setDisplayQr(true)}>
					Obtener credenciales con c??digo QR
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

				<p className="help">Secret y contrase??a quedar??n guardadas en tu navegador, yo no almaceno ning??n dato</p>
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
											De forma opcional, puedes ingresar aqu?? tu contrase??a. Esta contrase??a solo tienes que
											proporcionarla en el caso de que tengas un formato contrase??a + otp a la hora de logarte. Es poco
											com??n, si no sabes de qu?? va esto, posiblemente no tengas que a??adir nada en este campo.
										</p>
									</div>

									<br />

									<div className="field is-centered">
										<div className="control">
											<label className="checkbox">
												<input
													type="checkbox"
													onChange={(event) => setClipboard(event.target.checked)}
													checked={clipboard}
												/>{' '}
												Guardar en el portapapeles
											</label>
										</div>
										<p className="help">
											Si seleccionas esta opci??n, la OTP (m??s la contrase??a si la proporcionas) quedar?? en tu
											portapapeles al clicar en el plugin.
										</p>
									</div>

									<br />

									<div className="field is-centered">
										<div className="control">
											<label className="checkbox">
												<input type="checkbox" onChange={(event) => setPopUp(event.target.checked)} checked={popUp} />{' '}
												Muestra un popup al clicar la extensi??n
											</label>
										</div>
										<p className="help">
											Al marcar esta opci??n, se mostrar?? un popup al clicar en la extensi??n. Desde ah?? podr??s elegir si
											quieres que la OTP te rellene una contrase??a o que se guarde en el portapapeles.
										</p>
									</div>

									<br />

									{displayNotification()}

									<hr />

									<p>
										Para usarlo, ve a la p??gina de iniciar sesi??n del servicio que te pide OTP y simplemente clica en el
										bot??n de la extensi??n, colocar?? la contrase??a e iniciar?? sesi??n autom??ticamente.
										<br />
										Si has elegido que se guarde en el portapapeles, podr??s usar la extensi??n en cualquier p??gina, sin
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
						<span className="tag is-rounded">May, 2021</span>
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
