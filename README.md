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

Run this application locally
1. Open cicct-user-gateway > application-local.yml
2. Change softphone-admin-ui url to `http://localhost:8080`
3. Change softphone-service url to anything other than 8080
4. Start user gateway with `mvn spring-boot:run`
5. Build admin-ui with `npm run-script build`
6. Run admin-ui server with `node server.js`

## Running the tests

Run unit tests with the following command

```
npm run test
```
