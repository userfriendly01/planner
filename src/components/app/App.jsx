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
  const [authorized, setAuthorized] = useState(null);
  const [pingToken, setPingToken] = useState(null);

  useEffect(() => {
    // myAxios.get("http://localhost:8080/admin-login")
    myAxios.get(apiPaths.AUTH)
      .then(res => {
        setAuthorized(res.data ? "yes" : "no");
        setPingToken(res.data);
      })
      .catch(err => {
        if(err.response && isErrorIn400s(err.response.status)) {
          setAuthorized("no");
        } else {
          console.error("An unknown error has occurred.", err);
          setAuthorized("unknown");
        }
      });
  }, []);

  if (authorized === "yes" && pingToken) {
    console.log(pingToken);
    return (
      <AppWrapper>
        <Header />
        <NavTabs />
      </AppWrapper>
    );
  } else if (authorized === "yes" && !pingToken) {
    return <div>An unknown error occurred</div>;
  } else if (authorized === "no") {
    return <div>You&#39;re not authorized to view this page</div>;
  } else if (authorized === "unknown") {
    return <div>An unknown error occurred</div>;
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
