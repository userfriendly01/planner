import React from "react";

import { UserAgentApplication } from "msal";
import { LoginError } from "./LoginError";
import { LoginInProgress } from "./LoginInProgress";

let authority;
let clientId;
let msalInstance: UserAgentApplication;
const allDone = "DONE";
const PERMISSIONS = {
  // Read access to flow config in all environments
  READ_GROUP_FLOW: "gpi-cct-config-flow-read",
  // Read access to routing config in all environments
  READ_GROUP_ROUTING: "gpi-cct-config-route-read",
  // Read-write access to flow config in NON-PRODUCTION environments
  READ_WRITE_GROUP_FLOW: "gpi-cct-config-flow-readwrite-np",
  // Read-write access to routing config in NON-PRODUCTION environments
  READ_WRITE_GROUP_ROUTING: "gpi-cct-config-route-readwrite-np",
  // Read-write access to flow config in PRODUCTION environments
  READ_WRITE_GROUP_FLOW_PROD: "gpi-cct-config-flow-readwrite-prod",
  // Read-write access to routing config in PRODUCTION environments
  READ_WRITE_GROUP_ROUTING_PROD: "gpi-cct-config-route-readwrite-prod"
};

interface MsalEnvironment {
  authority: string;
  clientId: string;
}
interface TokenRequest {
  scopes: string[];
}
interface CallbackComponent {
  setState: any;
}
interface GraphObject {
  displayName: string;
}
interface AuthProps {
  foo?: string;

}
interface AuthState {
  accessToken?: string;
  authenticated: boolean;
  errorMessage: string;
  hasError: boolean;
  matchedGroups?: string[];
  renewIframe: boolean;
}
function createUap(envObject: MsalEnvironment) {
  authority = envObject.authority;
  clientId = envObject.clientId;

  msalInstance = new UserAgentApplication({
    auth: {
      authority,
      clientId
    }
  });
}

export function authWrapper(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  WrappedComponent: any
): any {
  return class Auth extends React.Component<AuthProps, AuthState> {
    constructor(props: any) {
      super(props);
      //this.props = props;
      this.state = {
        authenticated: false,
        renewIframe: false,
        hasError: false,
        errorMessage: "null"
      };
    }

    acquireToken(tokenRequest: TokenRequest) {
      msalInstance.acquireTokenPopup(tokenRequest)
        .then(response => {
          console.info("acquireTokenSilent response");
          this.checkMembership(response.accessToken, this, [
            PERMISSIONS.READ_GROUP_FLOW,
            PERMISSIONS.READ_GROUP_ROUTING,
            PERMISSIONS.READ_WRITE_GROUP_FLOW,
            PERMISSIONS.READ_WRITE_GROUP_ROUTING
          ]);
        }).catch(err => {
          if(err.message.indexOf("login is already in progress")) {
            console.warn("login already in progress, waiting 2 seconds and trying again");
            setTimeout(() => {
              this.acquireToken(tokenRequest);
            }, 2000);
          } else {
          // eslint-disable-next-line no-console
            console.error(err.message);
          }
        });
    }

    getEnv() {
      return {
        authority: "https://login.microsoftonline.com/08a83339-90e7-49bf-9075-957ccd561bf1",
        clientId: "5d895d11-5151-4805-9d28-471c4020731f"
      };
    }

    componentDidMount() {
      createUap(this.getEnv());

      // action to perform on authentication
      msalInstance.handleRedirectCallback(() => { // on success
        console.info("handleRedirectCallback");
        this.getAccessToken();
        this.setState({
          authenticated: true
        });
      }, authErr => { // on fail
        this.setState({
          hasError: true,
          errorMessage: authErr.errorMessage
        });
      });

      // if we are inside renewal callback (hash contains access token), do nothing
      if (msalInstance.isCallback(window.location.hash)) {
        console.info("is a callback");
        this.setState({
          renewIframe: true
        });
        return;
      }

      // not logged in, perform full page redirect
      if (!msalInstance.getAccount()) {
        console.info("getAccount() was false");
        msalInstance.loginRedirect({});
      } else { // logged in, set authenticated state
        console.info("getAccount() was true");
        this.getAccessToken();
        this.setState({
          authenticated: true
        });
      }
    }

    getAccessToken() {
      console.info("getAccessToken");
      const tokenRequest = {
        scopes: [
          "user.read",
          "openid"
        ]
      };
      this.acquireToken(tokenRequest);
    }

    /**
     * A recursive function to get all the membership groups
     * @param {*} accessToken - accessToken to retrieve graph data for
     * @param {*} accumulator - holds results of recursive call
     * @param {*} graphEndpoint - url to call to retrieve groups
     * @returns an array of AD groups
     */
    // eslint-disable-next-line class-methods-use-this
    getMembershipValues(
      accessToken: string,
      accumulator: GraphObject[] = [],
      graphEndpoint = "https://graph.microsoft.com/v1.0/me/memberOf?$select=displayName"): GraphObject[] {
      console.info("getMembershipValues");
      if (graphEndpoint && graphEndpoint !== allDone) {
        const xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", graphEndpoint, false); // true for asynchronous
        xmlHttp.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xmlHttp.send();
        const graphData = JSON.parse(xmlHttp.responseText);
        const {
          "@odata.nextLink": nextLink, ...graphData2
        } = graphData;
        return this.getMembershipValues(
          accessToken,
          accumulator.concat(graphData2.value),
          nextLink || allDone
        );
      }

      return accumulator;
    }

    // eslint-disable-next-line class-methods-use-this
    checkMembership(accessToken: string,
      callback: CallbackComponent,
      membershipArray: string[]) {
      console.info("checkMembership");
      const graphData = this.getMembershipValues(accessToken);

      const matchedGroups = graphData
        .filter(group => membershipArray.includes(group.displayName))
        .map(group => group.displayName) || [];

      callback.setState({
        accessToken,
        matchedGroups
      });
    }

    render() {
      const {
        accessToken,
        authenticated,
        errorMessage,
        hasError,
        matchedGroups,
        renewIframe
      } = this.state;
      const { props } = this;

      if (renewIframe) {
        return <div>hidden renew iframe - not visible</div>;
      }

      if (authenticated) {
        return (
          <WrappedComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            accessToken={accessToken}
            matchedGroups={matchedGroups}
          />
        );
      }

      if (hasError) {
        return <LoginError message={errorMessage} />;
      }

      return <LoginInProgress />;
    }
  };
}
