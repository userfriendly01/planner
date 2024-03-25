import React, { ReactElement } from "react";
import {
  MsalAuthenticationResult, MsalAuthenticationTemplate
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { LoginError } from "./LoginError";
import { LoginInProgress } from "./LoginInProgress";

interface Props {
  children: ReactElement
}

export const AuthWrapper = ({ children }: Props): ReactElement => {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={{ scopes: ["User.Read"]}}
      errorComponent={(props: MsalAuthenticationResult) => <LoginError message={props.error.errorMessage} />}
      loadingComponent={LoginInProgress}
    >
      {children}
    </MsalAuthenticationTemplate>
  );
};
