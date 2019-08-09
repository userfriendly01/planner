import { CircularProgress } from "@material-ui/core";
import {
  Header,
  NavTabs
} from "components";
import {
  ProfilesContext,
  UserContext,
  WorkersContext
} from "context";
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

  const [authData, setAuthData] = useState({});
  const [profiles, setProfiles] = useState({
    profiles: []
  });
  const [workers, setWorkers] = useState({
    workers: []
  });

  useEffect(() => {
    myAxios.get(apiPaths.AUTH)
      .then(res => {
        setAuthData({
          authorized: true,
          pingIdentity: res.data
        });
      })
      .catch(err => {
        if(err.response && isErrorIn400s(err.response.status)) {
          setAuthData({
            authorized: false
          });
        } else {
          console.error("An unknown error has occurred.", err);
          setAuthData({
            authError: err
          });
        }
      });
    myAxios
      .get(apiPaths.GET_WORKERS)
      .then(res => {
        setWorkers({
          workers: formatWorkerResponse(res.data)
        });
      })
      .catch(err => {
        console.error("An unknown error has occurred.", err);
        setWorkers({
          error: err
        });
      });
    myAxios.get(apiPaths.GET_PROFILES)
      .then(res => {
        setProfiles({
          profiles: res.data
        });
      })
      .catch(err => {
        console.error("An unknown error has occurred.", err);
        setProfiles({
          error: err
        });
      });
  }, []);

  if (authData.authorized && workers.length !== 0) {
    return (
      <UserContext.Provider value={authData}>
        <WorkersContext.Provider value={workers}>
          <ProfilesContext.Provider value={profiles}>
            <AppWrapper data-testid="app-wrapper">
              <Header />
              <NavTabs />
            </AppWrapper>
          </ProfilesContext.Provider>
        </WorkersContext.Provider>
      </UserContext.Provider>
    );
  } else if (authData.authorized === false) {
    return <div data-testid="unauthorized">{"You are not authorized to view this page"}</div>;
  } else if (authData.authError) {
    return <div data-testid="unknownError">{"An error occured while logging in."}</div>;
  } else {
    return (
      <LoadingContainer>
        <LoadingMessage>{"Connecting..."}</LoadingMessage>
        <CircularProgress size={60} />
      </LoadingContainer>
    );
  }
};

export default App;
