import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	en: {
		translation: {
			popup: {
				clipboard: 'Copy to clipboard',
				fillPassword: 'Fill password',
				options: 'Options',
			},
			footer: {
				lastUpdate: 'last update',
				madeWith: 'made with',
				by: 'by',
			},
			general: {
				save: 'Save',
			},
			options: {
				settingsSaved: 'Settings saved',
				qr: {
					open: 'Get credentials with QR code',
					close: 'Close reader',
				},
				disclaimer: 'Secret and password will be stored in your browser; I do not store any data.',
				form: {
					secret: 'Secret (Obtained code)',
					password: 'Password (optional)',
					passwordExplanation: 'Optionally, you can enter your password here. You only need to provide this password if you have a password + OTP login format. It is uncommon; if you are not sure, you probably do not need to add anything in this field.',
					checkbox: {
						autoFill: 'Auto-fill input',
						autoFillExplanation: 'If you select this option, the OTP (plus the password if provided) will attempt to automatically fill in the password input. If you find that it does not work correctly, select one of the options below instead.',
						clipboard: 'Copy to clipboard',
						clipboardExplanation: 'If you select this option, the OTP (plus the password if provided) will be copied to your clipboard when you click on the plugin.',
						popUp: 'Show a popup when clicking on the extension',
						popUpExplanation: 'By checking this option, a popup will be displayed when clicking on the extension. From there, you can choose whether you want the OTP to fill in a password or be copied to the clipboard.',
					},
				},
				howTo: {
					p1: 'To use it, go to the login page of the service that requests OTP and simply click on the extension button; it will enter the password and log in automatically.',
					p2: 'If you have chosen to copy it to the clipboard, you can use the extension on any page without the need for a form to exist.',
				},
			},
		},

	},
	es: {
		translation: {
			popup: {
				clipboard: 'Copiar al portapapeles',
				fillPassword: 'Rellenar contraseña',
				options: 'Opciones',
			},
			footer: {
				lastUpdate: 'última actualización',
				madeWith: 'hecho con',
				by: 'por',
			},
			general: {
				save: 'Guardar',
			},
			options: {
				settingsSaved: 'Opciones guardadas',
				qr: {
					open: 'Obtener credenciales con código QR',
					close: 'Cerrar lector',
				},
				disclaimer: 'Secret y contraseña quedarán guardadas en tu navegador, yo no almaceno ningún dato',
				form: {
					secret: 'Secret (Código obtenido)',
					password: 'Contraseña (opcional)',
					passwordExplanation: 'De forma opcional, puedes ingresar aquí tu contraseña. Esta contraseña solo tienes que proporcionarla en el caso de que tengas un formato contraseña + otp a la hora de logarte. Es poco común, si no sabes de qué va esto, posiblemente no tengas que añadir nada en este campo.',
					checkbox: {
						autoFill: 'Rellenar input automáticamente',
						autoFillExplanation: 'Si seleccionas esta opción, la OTP (más la contraseña si la proporcionas) intentará rellenar el input de la contraseña automáticamente. Si ves que no funciona correctamente, selecciona una de las opciones de abajo en su lugar.',
						clipboard: 'Guardar en el portapapeles',
						clipboardExplanation: 'Si seleccionas esta opción, la OTP (más la contraseña si la proporcionas) quedará en tu portapapeles al clicar en el plugin.',
						popUp: 'Muestra un popup al clicar en la extensión',
						popUpExplanation: 'Al marcar esta opción, se mostrará un popup al clicar en la extensión. Desde ahí podrás elegir si quieres que la OTP te rellene una contraseña o que se guarde en el portapapeles.',
					},
				},
				howTo: {
					p1: 'Para usarlo, ve a la página de iniciar sesión del servicio que te pide OTP y simplemente clica en el botón de la extensión, colocará la contraseña e iniciará sesión automáticamente.',
					p2: 'Si has elegido que se guarde en el portapapeles, podrás usar la extensión en cualquier página, sin necesidad de que exista un formulario.',
				},
			},
		},
	},
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		fallbackLng: 'en',
		lng: navigator.language, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
		// you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
		// if you're using a language detector, do not define the lng option

		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
