import {
  CircularProgress,
  Modal
} from "@mui/material";
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
  getAuthenticationProfiles,
  getPermissions,
  getStartups
} from "authentication";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  apiPaths,
  theme,
  timeouts
} from "globals";
import { getRoutes } from "globals/routes";
import React, {
  useEffect,
  useState
} from "react";
import { getAzureSPAClientId } from "utils";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  isErrorIn400s,
  myAxios,
  wait
} from "utils";

const success = "success";

const authenticateAndStartup = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.AUTH)
  .then(res => {
    const pingIdentity = res.data;
    const permissions = getPermissions(pingIdentity.groups);
    const startupFiles = getStartups(permissions);
    const startupPromises = startupFiles.map(startup => { return startup(dispatch); });
    Promise.all(startupPromises).then(res => {
      const authenticationProfiles = getAuthenticationProfiles(permissions, pingIdentity?.sub, res);
      dispatch({
        type: "loadUserData",
        payload: {
          pingIdentity,
          authenticationProfiles
        }
      });
      resolve(authenticationProfiles);
    }).catch(error => {
      const msg = "An error occurred on startup";
      reject({
        msg,
        error
      });
    });
  })
  .catch(error => {
    let msg = "An error occurred when trying to authenticate";
    if(error.response && isErrorIn400s(error.response.status)) {
      msg = "You are not authorized to view this page";
    }
    reject({
      msg,
      error
    });
  })
);

const App = () => {

  const [loadResult, setLoadResult] = useState({
    home: null,
    status: null
  });
  const [showModal, setShowModal] = useState(false);
  const state = useAdminState();
  const dispatch = useAdminDispatch();

  useEffect(() => {
    authenticateAndStartup(dispatch)
      .then((authenticationProfiles) => {
        console.log("Auth Profile at startup", authenticationProfiles)
        setLoadResult({
          home: authenticationProfiles[0].home,
          status: success
        });
      })
      .catch(err => {
        console.error(err.msg, { error: err.error });
        setLoadResult({
          status: err
        });
      });
  }, []);

  useEffect(() => {
    wait(() => setShowModal(true), timeouts.AUTH);
  }, []);

  if (loadResult.status) {
    if (loadResult.status === success) {
      const azureClientId = getAzureSPAClientId();
      console.log("Load Result", loadResult);
      return (
        <BrowserRouter>
          <ScrollToTop />
          <AppWrapper data-testid="app-wrapper">
            <Header/>
            <NavTabs/>
              <Routes>
                {getRoutes(state, loadResult.home, azureClientId).map(r => {
                  const Component = r.element || r.render;
                  return <Route path={r.path} element={<Component/>}/>
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