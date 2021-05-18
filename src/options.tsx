import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import QrReader from 'react-qr-reader'

const Options = () => {
	const toptRegex =
		'otpauth:\\/\\/([ht]otp)\\/(?:[a-zA-Z0-9%]+:)?([^\\?]+)\\?secret=([0-9A-Za-z]+)(?:.*(?:<?counter=)([0-9]+))?'

	const [password, setPassword] = useState<string>('')
	const [secret, setSecret] = useState<string>('')
	const [status, setStatus] = useState<string>()
	const [displayQr, setDisplayQr] = useState<boolean>(undefined)

	const saveOptions = () => {
		// Saves options to chrome.storage.sync.
		chrome.storage.sync.set(
			{
				pass: password,
				secret: secret
			},
			() => {
				// Update status to let user know options were saved.
				setStatus('Options saved.')
				const id = setTimeout(() => {
					setStatus(undefined)
				}, 1000)
				return () => clearTimeout(id)
			}
		)
	}

	const handleScan = (data: string) => {
		const re = data?.match(toptRegex)
		if (re) {
			setSecret(re[3])
			setDisplayQr(false)
			console.log(re[3])
		}
	}
	const handleError = (err) => {
		console.error(err)
	}

	const displayQrReader = () => {
		if (displayQr) {
			return (
				<div className="column is-centered">
					<button className="button is-warning is-fullwidth" onClick={() => setDisplayQr(false)}>
						Cerrar lector
					</button>
					<QrReader delay={300} onError={handleError} onScan={handleScan} />
				</div>
			)
		}

		return (
			<div className="column is-centered">
				<button className="button is-info is-fullwidth" onClick={() => setDisplayQr(true)}>
					Obtener credenciales con código QR
				</button>
			</div>
		)
	}

	const displayNotification = () => {
		if (status) {
			return <div className="notification is-primary">{status}</div>
		}
	}

	return (
		<>
			<div className="container">
				{displayNotification()}
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
										<div className="control">
											<input
												className="input"
												type="password"
												id="secret"
												placeholder="SECRET"
												onChange={(event) => setSecret(event.target.value)}
												value={secret}
											/>
										</div>
									</div>

									<br />

									<p>
										De forma opcional, puedes ingresar aquí tu contraseña. Esta contraseña solo tienes que
										proporcionarla en el caso de que tengas un formato contraseña + otp a la hora de logarte. Es poco
										común, si no sabes de qué va esto, posiblemente no tengas que añadir nada en este campo.
									</p>

									<br />
									<div className="field is-centered">
										<div className="control">
											<input
												className="input"
												type="password"
												id="password"
												placeholder="PASSWORD (optional)"
												onChange={(event) => setPassword(event.target.value)}
												value={password}
											/>
										</div>
										<p className="help">
											Secret y contraseña quedarán guardadas en tu navegador, yo no almaceno ningún dato
										</p>
									</div>
									<div className="field is-centered">
										<button
											className="button is-info is-medium is-full-mobile"
											onClick={saveOptions}
											disabled={!secret}
										>
											Guardar
										</button>
									</div>

									<p>
										Para usarlo, ve a la página de iniciar sesión del servicio que te pide OTP y simplemente clica en el
										botón de la extensión, colocará la contraseña e iniciará sesión automáticamente.
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
						<span className="tag is-rounded">September, 2019</span>
					</div>
				</div>
			</footer>
		</>
	)
}

ReactDOM.render(
	<React.StrictMode>
		<Options />
	</React.StrictMode>,
	document.getElementById('root')
)
