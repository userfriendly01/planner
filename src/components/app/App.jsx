import { CircularProgress } from "@material-ui/core";
import {
  Header,
  NavTabs
} from "components";
import { useAdminDispatch } from "context";
import { apiPaths } from "globals";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import {
  formatWorkerResponse,
  getUniqueManagerList,
  isErrorIn400s,
  myAxios
} from "utils";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
`;
const LoadingMessage = styled.div`
  font-size: 24px;
  padding-bottom: 32px;
`;

const App = () => {

  const [authorized, setAuthorized] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [workersLoaded, setWorkersLoaded] = useState(false);
  const dispatch = useAdminDispatch();

  useEffect(() => {
    myAxios.get(apiPaths.AUTH)
      .then(res => {
        setAuthorized(true);
        dispatch(({
          type: "loadUserData",
          payload: {
            pingIdentity: res.data
          }
        }));
      })
      .catch(err => {
        if(err.response && isErrorIn400s(err.response.status)) {
          setAuthorized(false);
        } else {
          console.error("An unknown error has occurred.", err);
          setError({
            error: err
          });
        }
      });
    myAxios
      .get(apiPaths.GET_WORKERS)
      .then(res => {
        setWorkersLoaded(true);
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
      })
      .catch(err => {
        console.error("An unknown error has occurred.", err);
        setError({
          error: err
        });
      });
    myAxios.get(apiPaths.GET_PROFILES)
      .then(res => {
        dispatch(({
          type: "loadProfiles",
          payload: res.data
        }));
      })
      .catch(err => {
        console.error("An unknown error has occurred.", err);
        setError({
          error: err
        });
      });
  }, []);

  if (authorized && workersLoaded) {
    return (
      <AppWrapper data-testid="app-wrapper">
        <Header />
        <NavTabs />
      </AppWrapper>
    );
  } else if (!authorized && authorized !== undefined) {
    return <div data-testid="unauthorized">You are not authorized to view this page</div>;
  } else if (error && error !== undefined) {
    return <div data-testid="unknownError">{"An error occurred while logging in."}</div>;
  } else {
    return (
      <LoadingContainer>
        <LoadingMessage>Loading...</LoadingMessage>
        <CircularProgress size={60} />
      </LoadingContainer>
    );
  }
};

export default App;