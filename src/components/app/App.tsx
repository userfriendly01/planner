import { Modal } from "@mui/material";
import { getWorkerProfileId } from "authentication/authUtils";
import { getFilteredPermissions } from "authentication/authenticationProfiles";
import {
  AppWrapper,
  ErrorMessage,
  ErrorPayload,
  ErrorStatus,
  ErrorWrapper
} from "components/app/App.Styles";
import ScrollToTop from "components/ScrollToTop";

import Header from "components/Header";
import NavTabs from "components/NavTabs";
import NotificationModal from "components/NotificationModal";
import { PageLoadSpinner } from "components/PageLoadSpinner";
import { Overlay } from "components/PageLoadSpinner.Styles";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import { env } from "globals/index";
import { getRoutes } from "globals/routes";
import React, {
  useEffect,
  useState
} from "react";
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { logger } from "utils/logger";
import { wait } from "utils";

const success = "success";
const loading = "loading";

const App = () => {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  const [loadResult, setLoadResult] = useState<any>({
    home: null,
    status: null
  });
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAdminDispatch();
  const state = useAdminState();

  useEffect(() => {
    const startup = async () => {
      const permissions = getFilteredPermissions(account);

      if (!permissions.length) {
        logger.error("MISSING_AD_GROUPS", { nNumber: account.idTokenClaims.employeeid });
        setLoadResult({
          status: {
            errorMessage: "You are missing required AD Groups to be able to access this application",
            errorCode: "UNAUTHORIZED"
          }
        });
      } else {
        try {
          const nNumber = account.idTokenClaims.employeeid as string;
          const profileId = await getWorkerProfileId(nNumber);
          const isAdmin = account.idTokenClaims.roles.includes("Admin");
          dispatch({
            type: "loadUserData",
            payload: {
              permissions,
              profileId,
              isAdmin,
              nNumber
            }
          });

          await Promise.all(
            permissions.map(({ startup }) => startup.function(dispatch))
          );

          setLoadResult({
            home: permissions[0].authenticationProfile.home,
            status: success
          });
        } catch (error) {
          logger.error("DATA_GET_FAILED", { error });
          setLoadResult({
            status: {
              errorMessage: error.response?.msg || error.msg,
              errorPayload: JSON.stringify(error.response?.data || error.error),
              errorCode: error.response?.status || 500
            }
          });
        }
      }
    };

    if (state.userContext.accessToken && loadResult.status === null) {
      setLoadResult({
        status: loading
      });

      startup();
    }
  }, [state.userContext.accessToken]);

  useEffect(() => {
    // Helper to get token
    const tokenManager = async () => {
      logger.log("*** MSAL: Getting new Token ***");

      try {
        const {
          accessToken,
          expiresOn
        } = await instance.loginPopup({
          account,
          scopes: ["User.Read"],
          extraScopesToConsent: [
            // Add additional scopes that are needed here
            `${env.GRAPH_CLIENT_ID}/uiaccess`
          ]
        });

        logger.log(`*** MSAL: Token acquired, will expire at ${expiresOn} ***`);

        // Place any additional token requests here:
        const { accessToken: accessTokenGraph } = await instance.acquireTokenSilent({
          account,
          scopes: [`${env.GRAPH_CLIENT_ID}/.default`]
        });


        dispatch({
          type: "loadUserData",
          payload: {
            accessToken,
            accessTokenGraph
          }
        });

        // TODO: Once we have subscriptions set up
        // we'll want to constantly refresh the token several times
        // then prompt the user to refresh or come up with a better way of refreshing
        // the data
        wait(() => {
          setShowModal(true);
        }, expiresOn.getTime() - Date.now());
      } catch (error) {
        logger.error("TOKEN_GET_FAILED", { error });
        setLoadResult({
          status: {
            errorMessage: "Failed to get a token from Azure, try refreshing the page",
            errorCode: error.errorCode,
            errorPayload: error.errorMessage
          }
        });
      }
    };

    tokenManager();
  }, []);

  if (loadResult.status && loadResult.status !== loading) {
    if (loadResult.status === success) {
      return (
        <BrowserRouter>
          <ScrollToTop />
          <AppWrapper data-testid="app-wrapper">
            <Header />
            <NavTabs />
            <Routes>
              <Route path="/triton-admin" element={<loadResult.home />} />
              {getRoutes().map(r => {
                return <Route key={r.path} path={r.path} element={<r.Component />} />;
              })}
            </Routes>
            <Modal onClose={() => { return; }} open={showModal === true}>
              <>
                <NotificationModal
                  buttonText={"Reload"}
                  handleClick={() => window.location.reload()}
                  text={"Your session has expired. Please reload the page."}
                />
              </>
            </Modal>
          </AppWrapper>
        </BrowserRouter>
      );
    } else {
      return (
        <Overlay data-testid="error-overlay">
          <ErrorWrapper>
            <ErrorStatus>{loadResult.status.errorCode}</ErrorStatus>
            <ErrorMessage>{loadResult.status.errorMessage}</ErrorMessage>
            {loadResult.status.errorPayload && (
              <ErrorPayload>
                {loadResult.status.errorPayload}
              </ErrorPayload>
            )}
          </ErrorWrapper>
        </Overlay>
      );
    }
  } else {
    return (
      <PageLoadSpinner />
    );
  }
};

export default App;