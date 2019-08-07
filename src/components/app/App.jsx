import { CircularProgress } from "@material-ui/core";
import {
  Header,
  NavTabs
} from "components";
import {
  UserContext
} from "context";
import { apiPaths } from "globals";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import {
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

  const [workerData, setWorkerData] = useState({});

  useEffect(() => {
    const loadedData = {};
    myAxios.get(apiPaths.AUTH)
      .then(res => {
        loadedData.authorized = true;
        loadedData.pingIdentity = res.data;
        return res.data.sub;
      })
      .catch(err => {
        if(err.response && isErrorIn400s(err.response.status)) {
          loadedData.authorized = false;
        } else {
          console.error("An unknown error has occurred.", err);
          loadedData.authError = err;
        }
      })
      .then(id => {
        return myAxios.get(apiPaths.GET_WORKER_BY_ID(id));
      })
      .then(res => {
        setWorkerData({
          ... loadedData,
          ready: true,
          twilioWorker: {
            ... res.data,
            attributes: JSON.parse(res.data.attributes)
          }
        });
      })
      .catch(err => {
        setWorkerData({
          ... loadedData,
          getWorkerError: err
        });
      });
  }, []);

  console.log("Worker Data: ", workerData);

  if (workerData.authorized && workerData.ready) {
    return (
      <UserContext.Provider value={workerData}>
        <AppWrapper data-testid="app-wrapper">
          <Header />
          <NavTabs />
        </AppWrapper>
      </UserContext.Provider>
    );
  } else if (workerData.authorized === false) {
    return <div data-testid="unauthorized">{"You are not authorized to view this page"}</div>;
  } else if (workerData.authError || workerData.getWorkerError) {
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
