import {
  CircularProgress,
  Modal
} from "@material-ui/core";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import { useAdminDispatch } from "context";
import {
  apiPaths,
  theme
} from "globals";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import {
  formatTaskRouterSkills,
  formatWorkerResponse,
  getUniqueManagerList,
  isErrorIn400s,
  myAxios
} from "utils";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  padding: 0.5rem 0;
`;

const ErrorPayload = styled.div`
  font-size: 0.9rem;
  padding: 0.5rem 0;
`;

const ErrorStatus = styled.div`
  font-size: 3.5rem;
  padding: 0.5rem 0;
`;

const ErrorWrapper = styled.div`
  padding: 10%;
`;

const Overlay = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;
const LoadingMessage = styled.div`
  font-size: 30px;
  padding-bottom: 32px;
`;

const success = "success";

const authenticate = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.AUTH)
  .then(res => {
    dispatch({
      type: "loadUserData",
      payload: {
        pingIdentity: res.data
      }
    });
    resolve(true);
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

const getProfiles = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILES)
  .then(res => {
    dispatch({
      type: "loadProfiles",
      payload: res.data
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch profiles from service",
      error
    });
  })
);

const getSkills = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_TASKROUTER_SKILLS)
  .then(res => {
    dispatch({
      type: "loadSkills",
      payload: formatTaskRouterSkills(res.data)
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch taskrouter skills from service",
      error
    });
  })
);

const getWorkers = async dispatch => {
  let pageToken = "";
  const workers = [];
  try {
    do {
      const response = await myAxios.post(apiPaths.GET_WORKERS, { pageToken });
      const currentPageOfWorkers = formatWorkerResponse(response.data.instances);
      dispatch(({
        type: "addWorkers",
        payload: currentPageOfWorkers
      }));
      currentPageOfWorkers.forEach(worker => workers.push(worker));
      if (response.data.nextPageUrl) {
        const url = new URL(response.data.nextPageUrl);
        pageToken = url.searchParams.get("PageToken");
      } else {
        pageToken = null;
      }
    } while (pageToken);

    const managerList = getUniqueManagerList(workers);
    console.log("workers:", workers); //
    dispatch({
      type: "loadManagers",
      payload: managerList
    });
  } catch (error) {
    throw ({
      msg: "Failed to fetch workers from service",
      error
    });
  }
};

const App = () => {

  const [loadResult, setLoadResult] = useState(null);
  const [authExpired, setAuthExpired] = useState(false);
  const [reloadButtonSelected, setReloadButtonSelected] = useState(false);
  const dispatch = useAdminDispatch();

  // const authExpiration = currentTime + 3600 * 1000; // one hour from now
  const authExpiration = Date.now() + 30 * 1000;

  const checkAuthExpiration = () => {
    const currentTime = Date.now();
    console.log("current time:", new Date(currentTime)); //
    console.log("authExpiration:", new Date(authExpiration)); //
    console.log("ms until expiration: ", authExpiration - currentTime); //
    if (authExpiration - currentTime <= 0) {
      setAuthExpired(true);
    } else {
      setTimeout(checkAuthExpiration, 5 * 1000);
    }
  };

  const reloadApp = () => {
    setAuthExpired(false);
    setReloadButtonSelected(true);
  };

  useEffect(() => {
    Promise.all([
      authenticate(dispatch),
      getProfiles(dispatch),
      getSkills(dispatch),
      getWorkers(dispatch)
    ])
      .then(() => {
        setLoadResult(success);
        checkAuthExpiration();
      })
      .catch(err => {
        console.error(err.msg, { error: err.error });
        setLoadResult(err);
      });
  }, [reloadButtonSelected]);

  if (loadResult) {
    if (loadResult === success) {
      return (
        <AppWrapper data-testid="app-wrapper">
          <Header/>
          <NavTabs/>
          <Modal disableBackdropClick={true}/*??*/ open={authExpired === true}>
            <NotificationModal reloadApp={reloadApp} />
          </Modal>
        </AppWrapper>
      );
    } else {
      return (
        <Overlay data-testid="error-overlay">
          <ErrorWrapper>
            <ErrorStatus>{loadResult.error.response.status}</ErrorStatus>
            <ErrorMessage>{loadResult.msg}</ErrorMessage>
            <ErrorPayload>{JSON.stringify(loadResult.error.response.data)}</ErrorPayload>
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
