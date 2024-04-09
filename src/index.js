import {
  App, SharedGraphAPIProvider
} from "components";
import {
  StateProvider,
  FormStateProvider
} from "context";
import {
  authConfig,
  theme
} from "globals";
import React from "react";
import { ThemeProvider } from "styled-components";
import { createRoot } from "react-dom/client";
import {
  EventType,
  PublicClientApplication
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { initDataDogRum } from "utils/logger";

// Initialize RUM before startup
initDataDogRum();

// ********* SPA Configuration for Azure *********
export const msalInstance = new PublicClientApplication(authConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
msalInstance.enableAccountStorageEvents();
msalInstance.addEventCallback(event => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      event.payload.account
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <MsalProvider instance={msalInstance}>
    <StateProvider>
      <FormStateProvider>
        <ThemeProvider theme={theme}>
          <SharedGraphAPIProvider>
            <App />
          </SharedGraphAPIProvider>
        </ThemeProvider>
      </FormStateProvider>
    </StateProvider>
  </MsalProvider>
);