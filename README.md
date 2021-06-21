# NO+OTP Chrome Extension

This is a Chrome Extension app written in React.

- It adds an OTP authentication number to the first input of type password in the document and sends the form, so the user can authenticate with it.
- As an option, the user can add a password to the configuration, so the input will be filled with a combination of password + OTP.
- In the configuration the user can select to store the OTP in the clipboard.
- The QR code can be read from the plugin's configuration page and it will fill the secret automatically.

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Install the Plugin

You can install this plugin [here](https://chrome.google.com/webstore/detail/no%20otp/epfcbfnadaigbokbekcipecemoaiaeni)

If you prefer to install a local version of it from this repository:

 - Download the repo with `git clone git@github.com:gloaysa/no-otp.git`
 - Install the dependencies: `npm install`
 - Build it with `npm run build`
 - Then go to chrome://extensions/ and activate the developer mode (if not active) at the right top corner.
 - Click on Load Unpacked and load the `dist` folder.

## Build in watch mode

```
npm run watch
```

## Test
`npx jest` or `npm run test`
