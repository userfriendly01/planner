import { myAxios } from "utils";
import {
  authenticateUser,
  configureAxiosForPKCE
} from "@lmig/pkce-authentication-utilities";

configureAxiosForPKCE(myAxios);

const renderAuthInProgress = () => {
  console.warn("***Please wait while we authenticate you...");
};

const renderAuthFailed = () => {
  console.error("***Failed to Authenticate with Calabrio Service");
};

const isSuccessfulAuthentication = authenticateUser({
  clientId: "cc2d6284-c9c4-43fe-9164-4ee0cb8fac50",
  authUrl: "https://login.windows.net/08a83339-90e7-49bf-9075-957ccd561bf1/oauth2/v2.0/authorize",
  redirectUrl: "https://cicct-softphone-admin-ui-development.us-east-1.np.paas.lmig.com/azure/auth-callback",
  tokenUrl: "https://login.windows.net/08a83339-90e7-49bf-9075-957ccd561bf1/oauth2/v2.0/token",
  axios: myAxios,
  renderAuthInProgress: renderAuthInProgress,
  renderAuthFailed: renderAuthFailed
});

if (isSuccessfulAuthentication) {
  console.warn("***Succesfully Authenticated!!!...");
}