import {
  CircularProgress, Modal
} from "@mui/material";
import {
  AppWrapper,
  ErrorMessage,
  ErrorPayload,
  ErrorStatus,
  ErrorWrapper,
  Overlay,
  LoadingMessage
} from "components/app/App.Styles";
import ScrollToTop from "components/ScrollToTop";
import { getWorkerProfileId } from "authentication/authUtils";
import { getFilteredPermissions } from "authentication/authenticationProfiles";
import Header from "components/Header";
import NavTabs from "components/NavTabs";
import NotificationModal from "components/NotificationModal";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import { theme } from "globals/theme";
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

    if (Object.keys(state.userContext.tokens).length && loadResult.status === null) {
      setLoadResult({
        status: loading
      });

      startup();
    }
  }, [state.userContext.tokens]);

  useEffect(() => {
    // Helper to get token
    const tokenManager = async () => {
      logger.log("*** MSAL: Getting new Token ***");

      try {
        const msGraph = await instance.loginPopup({
          account,
          scopes: ["User.Read.All"],
          extraScopesToConsent: [
            // Add additional scopes that are needed here
            `${env.GRAPH_CLIENT_ID}/uiaccess`,
            `${env.ADMIN_CLIENT_ID}/uiAccess`
          ]
        });

        logger.log(`*** MSAL: Token acquired, will expire at ${msGraph.expiresOn} ***`);

        // Place any additional token requests here:
        const sharedGraph = await instance.acquireTokenSilent({
          account,
          scopes: [`${env.GRAPH_CLIENT_ID}/uiaccess`]
        });
        const adminService = await instance.acquireTokenSilent({
          account,
          scopes: [`${env.ADMIN_CLIENT_ID}/uiAccess`]
        });

        dispatch({
          type: "loadUserData",
          payload: {
            tokens: {
              msGraph: msGraph.accessToken,
              sharedGraph: sharedGraph.accessToken,
              adminService: adminService.accessToken,
            }
          }
        });

        // TODO: Once we have subscriptions set up
        // we'll want to constantly refresh the token several times
        // then prompt the user to refresh or come up with a better way of refreshing
        // the data
        wait(() => {
          setShowModal(true);
        }, msGraph.expiresOn.getTime() - Date.now());
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
      <Overlay>
        <LoadingMessage>Loading...</LoadingMessage>
        <CircularProgress size={theme.circularProgressSize} />
      </Overlay>
    );
  }
};

export default App;
