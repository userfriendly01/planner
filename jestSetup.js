require("@testing-library/jest-dom/extend-expect");

window.env = {
  AZURE_CLIENT_ID: "AZURE_CLIENT_ID",
  AZURE_REDIRECT_URI: "AZURE_REDIRECT_URI",
  DATADOG_APPLICATION_ID: "DATADOG_APPLICATION_ID",
  DATADOG_CLIENT_TOKEN: "DATADOG_CLIENT_TOKEN",
  GRAPH_API_URL: "http://localhost:3000",
  APP_ENV: "APP_ENV",
  TROUX_ID: "TROUX_ID",
  SOFTPHONE_SERVICE_URL: "http://localhost:8080",
  CALABRIO_SERVICE_URL: "https://calabrio-service.com"
};

jest.mock("@azure/msal-react", () => ({
  useMsal: jest.fn()
}));

beforeAll(() => {
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

// Mock Data Dog globally so it doesn't try to start
jest.mock("@datadog/browser-rum", () => ({
  datadogRum: {
    init: jest.fn(),
    setGlobalContextProperty: jest.fn()
  }
}));

jest.mock("@datadog/browser-logs", () => ({
  datadogLogs: {
    init: jest.fn(),
    setLoggerGlobalContext: jest.fn(),
    logger: {
      log: jest.fn()
    }
  }
}));

jest.mock("utils/logger", () => ({
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));