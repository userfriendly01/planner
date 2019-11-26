import { CircularProgress } from "@material-ui/core";
import {
  AddMessage,
  Header,
  NavTabs
} from "components";
import { useAdminDispatch } from "context";
import { apiPaths } from "globals";
import React, {
  useEffect,
  useState
} from "react";
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
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
  padding: 10%
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
    dispatch(({
      type: "loadUserData",
      payload: {
        pingIdentity: res.data
      }
    }));
    resolve(true);
  })
  .catch(error=> {
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
    dispatch(({
      type: "loadProfiles",
      payload: res.data
    }));
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
    dispatch(({
      type: "loadSkills",
      payload: formatTaskRouterSkills(res.data)
    }));
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch taskrouter skills from service",
      error
    });
  })
);

const getWorkers = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_WORKERS)
  .then(res => {
    const workers = formatWorkerResponse(res.data);
    dispatch(({
      type: "loadWorkers",
      payload: workers
    }));
    const managerList = getUniqueManagerList(workers);
    dispatch({
      type: "loadManagers",
      payload: managerList
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch workers from service",
      error
    });
  })
);

const App = () => {

  const [loadResult, setLoadResult] = useState(null);
  const dispatch = useAdminDispatch();

  useEffect(() => {
    Promise.all([
      authenticate(dispatch),
      getProfiles(dispatch),
      getSkills(dispatch),
      getWorkers(dispatch)
    ])
      .then(() => setLoadResult(success))
      .catch(err => {
        console.error(err.msg, { error: err.error });
        setLoadResult(err);
      });
  }, []);

  if (loadResult) {
    if (loadResult === success) {
      return (
        <AppWrapper data-testid="app-wrapper">
          <Router>
            <Header/>
            <Switch>
              <Route exact path="/" component={NavTabs}>
                {/* <NavTabs/> */}
              </Route>
              <Route path="/flashmessage" component={AddMessage}>
                {/* <AddMessage/> */}
              </Route>
            </Switch>
          </Router>
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
        <CircularProgress size={60} />
      </Overlay>
    );
  }
};

export default App;