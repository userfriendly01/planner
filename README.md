# CICCT Softphone Admin UI Application

These instructions will get you up and running on your local machine for development and testing purposes.

## Getting Started
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
cicct-callflow-api        8081
```
#### Pointing to the local callflow api


#### Connecting to the Admin UI

Point your browser at:  http://localhost:8082/triton-admin

For additional details on running the Admin UI locally, please refer
to the [TIPS readme file](./documentation/TIPS.md)

#### Authentication

This app uses PING authentication in a deployed state when `NODE_ENV=production`.
When running locally you should have `NODE_ENV=development` and the application will simply bypass 
the authentication middleware in the `cicct-softphone-service` application.

## Running the tests

Run unit tests with the following command

```
npm run test
```

## Development Notes
### Icons
Keep icons under 8KB in size in order to ensure they're embedded in the runtime code by Webpack.
Larger images will break.


## Project Notes
### Flash Messages and Closed Messages
Flash Messages and Closed messages are inserted into the callflow tables. For this reason we are pulling the list of skills from the callflow table. However the relationship of skill to profile is defined in the contact-manager database. The callflow api is taking this into consideration.

The call to the flash message table returns the skills and the flash and closed messages
The call to Twilio includes the levels

Proposed refactor:
  Load all skills from Twilio into the state at the beginning, make individual API calls for closed and flash messages on the message sidebar