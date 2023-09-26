# NO+OTP Browser Extension

* It adds an OTP authentication number to the first input of type password in the document and sends the form, so the user can authenticate with it.
* As an option, the user can add a password to the configuration, so the input will be filled with a combination of password + OTP.
* In the configuration the user can select to store the OTP in the clipboard or open a popup with different choices.
* The QR code can be read from the plugin's configuration page and it will fill the secret automatically.

## Live version
 - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/no-otp/)
 - [Chrome](https://chrome.google.com/webstore/detail/no%20otp/epfcbfnadaigbokbekcipecemoaiaeni)

This is a Web Extension app written in React.

- It adds an OTP authentication number to the first input of type password in the document and sends the form, so the user can authenticate with it.
- As an option, the user can add a password to the configuration, so the input will be filled with a combination of password + OTP.
- In the configuration the user can select to store the OTP in the clipboard.
- The QR code can be read from the plugin's configuration page and it will fill the secret automatically.

## Install the Plugin

If you prefer to install a local version of it from this repository:

 - Download the repo with `git clone git@github.com:gloaysa/no-otp.git`
 - Install the dependencies: `npm install`
 - Build it with `npm run build`
 - Then install it manually on your browser.

## Development
### Build in watch mode

```
npm run watch
```

### Load extension on your browser

Load `plugin` directory

## Test
`npx jest` or `npm run test`
