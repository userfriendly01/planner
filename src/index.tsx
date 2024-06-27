import App from "components/app/App";
import { SharedGraphAPIProvider } from "components/core/Auth/SharedGraphAPIProvider";
import {
  StateProvider,
  FormStateProvider,
  SkillStateProvider
} from "context/appContext";
import { authConfig } from "globals";
import { theme } from "globals/theme";
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
const msalInstance = new PublicClientApplication(authConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
msalInstance.enableAccountStorageEvents();
msalInstance.addEventCallback((event: any) => {
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
        <SkillStateProvider>
          <ThemeProvider theme={theme}>
            <SharedGraphAPIProvider>
              <App />
            </SharedGraphAPIProvider>
          </ThemeProvider>
        </SkillStateProvider>
      </FormStateProvider>
    </StateProvider>
  </MsalProvider>
);