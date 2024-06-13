const fs = require("fs");
const path = require("path");
const env = `window.env = {
  NODE_ENV: "${process.env.NODE_ENV}",
  APP_ENV: "${process.env.APP_ENV}",
  DATADOG_APPLICATION_ID: "${process.env.DATADOG_APPLICATION_ID}",
  DATADOG_CLIENT_TOKEN: "${process.env.DATADOG_CLIENT_TOKEN}",
  AZURE_CLIENT_ID: "${process.env.AZURE_CLIENT_ID}",
  AZURE_REDIRECT_URI: "${process.env.AZURE_REDIRECT_URI}",
  TROUX_ID: "${process.env.TROUX_ID}",
  GRAPH_API_URL: "${process.env.GRAPH_API_URL}",
  GRAPH_CLIENT_ID: "${process.env.GRAPH_CLIENT_ID}",
  SOFTPHONE_SERVICE_URL: "${process.env.SOFTPHONE_SERVICE_URL}",
};
`;

fs.writeFileSync(path.join(__dirname, "dist", "env.js"), env);
