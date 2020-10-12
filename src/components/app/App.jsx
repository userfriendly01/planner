import { CircularProgress } from "@material-ui/core";
import {
  Header,
  NavTabs
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
    dispatch(({
      type: "loadUserData",
      payload: {
        pingIdentity: res.data
      }
    }));
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

const getWorkers = async dispatch => {
  let pageToken = "";
  let nextPageUrlExists;
  const workers = [];
  do {
    try {
      const res = await myAxios.post(apiPaths.GET_WORKERS, { pageToken });
      if (res.data.nextPageUrl) {
        nextPageUrlExists = true;
        const url = new URL(res.data.nextPageUrl);
        pageToken = url.searchParams.get("PageToken");
      } else {
        nextPageUrlExists = false;
      }
      const currentPageOfWorkers = formatWorkerResponse(res.data.instances);
      currentPageOfWorkers.forEach(worker => workers.push(worker));
      console.log("workers:", workers); //
    } catch (error) {
      console.error("Failed to fetch workers from service", { error });
    }
  } while (nextPageUrlExists === true);

  dispatch(({
    type: "loadWorkers",
    payload: workers
  }));
  const managerList = getUniqueManagerList(workers);
  dispatch({
    type: "loadManagers",
    payload: managerList
  });
};

/* const getWorkers = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_WORKERS, token)
  .then(res => {
    console.log("getWorkers response:", res);
    const workers = formatWorkerResponse(res.data.instances);
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
); */

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
          <Header/>
          <NavTabs/>
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