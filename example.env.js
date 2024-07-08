window.env = {
  APP_ENV: "local",
  DATADOG_APPLICATION_ID: "<${secret.datadog.applicationId} in cloudforge>",
  DATADOG_CLIENT_TOKEN: "<${secret.datadog.clientToken} in cloudforge>",
  AZURE_CLIENT_ID: "<${secret.cicct-softphone-admin-ui.id} in cloudforge>",
  AZURE_REDIRECT_URI: "http://localhost:8082/triton-admin",
  TROUX_ID: "<${forge.troux_application_uuid} in cloudforge>",
  GRAPH_CLIENT_ID: "5f9dbf83-0fb0-4c74-8efe-889cc745396c",
  GRAPH_API_ID: "tgufpgkyxvacrntvgb75iuo3pi",
  SOFTPHONE_SERVICE_URL: "https://cicct-softphone-service-development.us-east-1.np.paas.lmig.com",
  ADMIN_CLIENT_URL: "https://6mtmnu5sge.execute-api.us-east-1.amazonaws.com/api",
  ADMIN_CLIENT_ID: "a96ad235-cbca-4378-adaa-6d31367fb333"
};
