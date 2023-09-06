// lightweight Express server that will serve index.html and associated resources

// Note that this file is NOT compiled by webpack. It will run as a standalone express server
// and serve static files of the code that IS compiled by webpack
const healthCheck = require("express-healthcheck");
const express = require("express");
const path = require("path");
const app = express();

const port = 8080;
const serveDir = path.resolve(__dirname, "dist");
const healthCheckEndpoint = "/health";

// Expose health endpoint
app.use(healthCheckEndpoint, healthCheck());
// Expose dir to serve serveDir as static
app.use(express.static(serveDir));

// Route to get env variables
app.get("/config/env", (_req, res) => {
  res.json({
    DATADOG_APPLICATION_ID: process.env.DATADOG_APPLICATION_ID || "youNeedToSetThisLocally",
    DATADOG_CLIENT_TOKEN: process.env.DATADOG_CLIENT_TOKEN || "youNeedToSetThisLocally",
    APP_ENV: process.env.APP_ENV || "local",
    TROUX_ID: process.env.TROUX_ID || "youNeedToSetThisLocally"
  }).status(200);
});

// Wildcard route to always serve index.html regardless of URL routes
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
// app.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "dist", "index.html")));

// express to listen on specified port and serve index.html
app.listen(port);

console.log(`Health endpoint set to: ${healthCheckEndpoint}`);
console.log(`App listening on port: ${port}`);
console.log(`Serving from: ${serveDir}`);
