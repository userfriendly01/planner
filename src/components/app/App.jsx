import { CircularProgress } from "@material-ui/core";
import {
  Header,
  NavTabs
} from "components";
import { useStateValue } from "context";
import { apiPaths } from "globals";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import {
  formatWorkerResponse,
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
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useStateValue();

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
          setAuthorized(false);
          setError({
            authError: err
          });
        }
      });
    myAxios
      .get(apiPaths.GET_WORKERS)
      .then(res => {
        setWorkersLoaded(true);
        dispatch(({
          type: "loadWorkers",
          payload: formatWorkerResponse(res.data)
        }));
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
    return <div data-testid="unauthorized">{"You are not authorized to view this page"}</div>;
  } else if (error && error !== undefined) {
    return <div data-testid="unknownError">{"An error occured while logging in."}</div>;
  } else {
    return (
      <LoadingContainer>
        <LoadingMessage>{"Loading..."}</LoadingMessage>
        <CircularProgress size={60} />
      </LoadingContainer>
    );
  }
};

export default App;