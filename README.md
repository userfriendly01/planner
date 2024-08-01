# CICCT Softphone Admin UI Application

These instructions will get you up and running on your local machine for development and testing purposes.

## Wiki
For a detailed explanation of running Triton Admin Locally go here: https://libertymutual.atlassian.net/wiki/spaces/UCCT/pages/270470435/Guide+to+Running+Triton+Admin+Locally

### Overview

Technologies used within this project:

* [node.js](https://nodejs.org/en/)
* [React](https://reactjs.org/)
* [Webpack](https://webpack.js.org/)
* [Express](https://expressjs.com/)
* [Jest](https://facebook.github.io/jest/)

Recommended IDEs:
* [Visual Studio Code](https://code.visualstudio.com/download)
* [WebStorm](https://www.jetbrains.com/webstorm/download/) (Javascript, frontend)

### Prerequisites

Install [node.js and npm](https://nodejs.org/en/download/) to run this project
The needed versions are defined in package.json under ```engines```

### Cloning this Repository
```
git clone https://github.com/lmigtech/cicct-softphone-admin-ui.git
```
### Installing Dependencies

```
npm install
```

### Creating the env.js file

You'll want to copy the `example.env.js` file into the `dist` folder as `env.js`. This file contents
should look something like this:

`dist/env.js`:
```js
window.env = {
  APP_ENV: "local",
  DATADOG_APPLICATION_ID: "<${secret.datadog.applicationId} in cloudforge>",
  DATADOG_CLIENT_TOKEN: "<${secret.datadog.clientToken} in cloudforge>",
  AZURE_CLIENT_ID: "<${secret.cicct-softphone-admin-ui.id} in cloudforge",
  AZURE_REDIRECT_URI: "http://localhost:8082/triton-admin",
  TROUX_ID: "<${forge.troux_application_uuid} in cloudforge>",
  GRAPH_CLIENT_ID: "5f9dbf83-0fb0-4c74-8efe-889cc745396c",
  GRAPH_API_ID: "tgufpgkyxvacrntvgb75iuo3pi",
  GRAPH_API_URL: "https://tgufpgkyxvacrntvgb75iuo3pi.appsync-api.us-east-1.amazonaws.com/graphql",
  SOFTPHONE_SERVICE_URL: "http://localhost:8080",
  ADMIN_CLIENT_ID: "a96ad235-cbca-4378-adaa-6d31367fb333",
  ADMIN_CLIENT_URL: "https://develop.cctapis.us-east-1.libertymutual.com/shared-admin-service",
  CALABRIO_SERVICE_CLIENT_ID: "2a1a2acf-a8db-4b18-b8c1-3efce37e02cb",
  CALABRIO_SERVICE_URL: "https://develop.cctapis.us-east-1.libertymutual.com/calabrio-service"
};
```

Get the secret values from CloudForge and replace the <> items above. Now you're ready to continue on your journey :)

### Running the Admin UI Locally
Running locally requires that you also have locally running instances of two other repositories:
* [cicct-user-gateway](https://github.com/lmigtech/cicct-user-gateway)
* [cicct-softphone-service](https://github.com/lmigtech/cicct-softphone-service)

Download, build, and run these services as described in their respective readme files, before starting
the Admin UI. 

#### Starting the Admin UI
```
npm start
```

You should now have 3 running applications, on these ports:
```
cicct-user-gateway        8082
cicct-softphone-admin-ui  8084
cicct-softphone-service   8080
```

#### Connecting to the Admin UI

Point your browser at:  http://localhost:8082/triton-admin

For additional details on running the Admin UI locally, please refer
to the [TIPS readme file](./documentation/TIPS.md)

#### Authentication

This app uses Azure authentication in a deployed state when `NODE_ENV=production`.
When running locally you should have `NODE_ENV=development` and the application will simply bypass 
the authentication middleware in the `cicct-softphone-service` application.

## Running the tests

Run unit tests with the following command

```
npm run test
```

## Development Notes

### ES Lint & TS Lint configurations

For importing files into this codebase, alias's are used for most of our folder paths.
  
If you are creating folder structures, add them to the 'paths' array in pathConfig and they will appropriately
update the jsconfig, tsconfig, webpack aliases & the jestConfig

For these changes to take effect, you can run a fresh install or manually run the command: npm run-script "generate-config"

### Bamboo Environment Variables
Environment Variables can be extracted from deployment/manifest-*.yml using the following legacy Bamboo deployment task command.

YAML and JSON Properties Loader:
```
deployment/manifest-${bamboo.forge.environment.key}-us-east-1.yml
```
Environment variables can be injected through a legacy Bamboo Pipeline with the following deployment task command.

Script:
```
sed -i.bak 's/${APP_ENV}/${bamboo.applications[0].env.APP_ENV}/' dist/admin-ui.js
rm dist/admin-ui.js.bak
```
This environment variable setup would be different if the project were using Bamboo Specs for pipeline configuration.

### Icons
Keep icons under 8KB in size in order to ensure they're embedded in the runtime code by Webpack.
Larger images will break.