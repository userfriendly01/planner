import { CircularProgress } from "@material-ui/core";
import {
  Header,
  NavTabs
} from "components";
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
  // TODO: add Twilio worker info and pass all data via React Context, i.e.
  /* data
    {
      authorized: true/false
      error?: error object
      pingToken: ping stuff
      worker: worker
    }
  */
  const [data, setData] = useState({});

  useEffect(() => {
    myAxios.get(apiPaths.AUTH)
      .then(res => {
        setData({
          authorized: true,
          pingToken: res.data
        });
      })
      .catch(err => {
        if(err.response && isErrorIn400s(err.response.status)) {
          setData({
            authorized: false
          });
        } else {
          console.error("An unknown error has occurred.", err);
          setData({
            unknownError: err
          });
        }
      });
  }, []);

  if (data.authorized === true) {
    return (
      // TODO: wrap in context that provides pingToken and worker
      <AppWrapper data-testid="app-wrapper">
        <Header />
        <NavTabs />
      </AppWrapper>
    );
  } else if (data.authorized === false) {
    return <div data-testid="unauthorized">{"You are not authorized to view this page"}</div>;
  } else if (data.unknownError) {
    return <div data-testid="unknownError">{"An unknown error has occurred"}</div>;
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
