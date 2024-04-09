import { CircularProgress } from "@mui/material";
import {
  AppWrapper,
  ErrorMessage,
  ErrorPayload,
  ErrorStatus,
  ErrorWrapper,
  Overlay,
  LoadingMessage
} from "./App.Styles";
import ScrollToTop from "./ScrollToTop";
import {
  getFilteredPermissions,
  getWorkerProfileId
} from "authentication";
import {
  Header,
  NavTabs
} from "components";
import {
  useAdminDispatch, useAdminState
} from "context";
import { theme } from "globals";
import { getRoutes } from "globals/routes";
import React, {
  useEffect,
  useState
} from "react";
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {
  logger, wait
} from "utils";

const success = "success";
const loading = "loading";

const App = () => {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  const [loadResult, setLoadResult] = useState({
    home: null,
    status: null
  });
  const dispatch = useAdminDispatch();
  const state = useAdminState();

  // Helper to keep token refreshed
  const tokenManager = async () => {
    logger.log("*** MSAL: Getting new Token ***");

    try {
      const {
        accessToken,
        expiresOn
      } = await instance.acquireTokenPopup({
        account,
        scopes: ["User.Read"]
      });

      logger.log(`*** MSAL: Token acquired, will expire at ${expiresOn} ***`);

      dispatch(({
        type: "loadUserData",
        payload: {
          accessToken
        }
      }));

      wait(() => () => {
        logger.log("*** MSAL: Token is about to expire, getting new token ***");
        tokenManager();
      }, expiresOn.getTime() - new Date().getTime() - 1000);
    } catch (error) {
      logger.error("TOKEN_GET_FAILED", { error });
      setLoadResult({
        status: error
      });
    }
  };

  const startup = async () => {
    const permissions = getFilteredPermissions(account);

    if (!permissions.length) {
      logger.error("MISSING_AD_GROUPS", { nNumber: account.idTokenClaims.employeeid });
      setLoadResult({
        status: "You are missing required AD Groups to be able to access this application"
      });
    } else {
      try {
        dispatch(({
          type: "loadUserData",
          payload: {
            permissions
          }
        }));

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
          status: error
        });
      }
    }
  };

  useEffect(() => {
    if (state.userContext.accessToken && loadResult.status !== loading) {
      setLoadResult({
        status: loading
      });

      startup();
    }

  }, [state.userContext.accessToken]);

  useEffect(() => {
    tokenManager();
  }, []);


  useEffect(() => {
    const {
      workerContext: {
        workers
      },
      userContext
    } = state;

    const loadUserContext = () => {
      const nNumber = account.idTokenClaims.employeeid;
      const profileId = getWorkerProfileId(nNumber, workers);
      const isAdmin = account.idTokenClaims.roles.includes("Admin");

      dispatch(({
        type: "loadUserData",
        payload: {
          profileId,
          isAdmin,
          nNumber
        }
      }));
    };

    if (workers.length && userContext.isAdmin === undefined) {
      loadUserContext();
    }
  }, [state]);

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
          </AppWrapper>
        </BrowserRouter>
      );
    } else {
      return (
        <Overlay data-testid="error-overlay">
          <ErrorWrapper>
            <ErrorStatus>{loadResult.status.error.response.status}</ErrorStatus>
            <ErrorMessage>{loadResult.status.msg}</ErrorMessage>
            <ErrorPayload>{JSON.stringify(loadResult.status.error.response.data)}</ErrorPayload>
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