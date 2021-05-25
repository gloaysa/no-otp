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

## Setup

```
npm install
```

## Build

```
npm run build
```

## Build in watch mode

```
npm run watch
```

## Load extension to chrome

Load `dist` directory

## Test
`npx jest` or `npm run test`
