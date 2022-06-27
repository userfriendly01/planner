# CICCT Softphone Admin UI Application

## Getting Started

These instructions will get you up and running on your local machine for development and testing purposes.

### Overview

Technologies used within this project:

* [node.js](https://nodejs.org/en/)
* [React](https://reactjs.org/)
* [Webpack](https://webpack.js.org/)
* [Express](https://expressjs.com/)
* [Jest](https://facebook.github.io/jest/)

Recommended IDEs:
* [Visual Studio Code] (https://code.visualstudio.com/download)
* [WebStorm](https://www.jetbrains.com/webstorm/download/) (Javascript, frontend)
* [Atom](https://atom.io/) (Javascript, frontend, other languages)
  *  Recommended packages to install for Atom:
    * atom-typescript
    * linter-sass-lint
    * linter-eslint
    * linter-tslint
    * linter-scss-lint
    * linter-css-lint

### Prerequisites

Install [node.js and npm](https://nodejs.org/en/download/) to run this project
The required versions needed are defined in package.json under ```engines```

### Install and start this application

Install package dependencies for this project
```
npm install
```

### Using the applications locally

##### You must access this application through the cicct-user-gateway over port 8082 locally

This application (cicct-softphone-admin-ui) must be accessed through the cicct-user-gateway and will need to communicate to cicct-softphone-service (also through the gateway) and cicct-callflow-api. See [here](https://github.com/lmigtech/cicct-callflow-api) on how to run cicct-callflow-api.

These applications will run on the following ports when started locally:
```
cicct-user-gateway        8082
cicct-softphone-admin-ui  8084
cicct-softphone-service   8080
cicct-callflow-api        8081
```

Make sure all three applications are running locally on the specified ports above

This app uses PING authentication in a deployed state when `NODE_ENV=production`. When running locally you should have `NODE_ENV=development` and the application will simply bypass the authentication middleware in the `cicct-softphone-service` application.

## Running the tests

Run unit tests with the following command

```
npm run test
```
