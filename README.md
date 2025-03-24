# FluidNC Web Installer

[![Last commit](https://img.shields.io/github/last-commit/breiler/fluid-installer.svg?maxAge=1800)](https://github.com/breiler/fluid-installer) [![Crowdin](https://badges.crowdin.net/fluid-installer/localized.svg)](https://crowdin.com/project/fluid-installer)

The FluidNC Web Installer is a web based tool to install and configure the firmware.

![FluidNC Web Installer](https://github.com/breiler/fluid-installer/raw/master/pictures/screenshot.png "UGS Splash Image")


## Building

Build a distribution using the following commands:

```
npm install
npm run build
```

## Developing
Start a development server using the following commands then open your browser to http://localhost:1234/

```
# Remove build cache
rm -r .parcel-cache

npm install
npm start
```

## Localization
You can help translating the application by creating an account on https://crowdin.com/project/fluid-installer and start translating. If there is a language missing make a request and I will add it!
