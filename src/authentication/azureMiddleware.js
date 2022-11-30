import { myAxios } from "utils";
import {
  authenticateUser,
  configureAxiosForPKCE,
  IDP
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
  idp: IDP.AZURE,
  redirectUrl: "https://localhost:8443/auth-callback",
  axios: myAxios,
  renderAuthInProgress: renderAuthInProgress,
  renderAuthFailed: renderAuthFailed
});

if (isSuccessfulAuthentication) {
  console.warn("***Succesfully Authenticated!!!...");
}