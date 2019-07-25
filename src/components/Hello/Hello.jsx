import axios from "axios";
import React, {
  useState,
  useEffect
} from "react";
import { isErrorIn400s } from "src/utils";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";

const myAxios = axios.create({ withCredentials: true });

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

const Hello = () => {
  const [authorized, setAuthorized] = useState(null);
  const [nNumber, setNNumber] = useState(null);
  const getNNumber = str => str.slice(-8);

  useEffect(() => {
    myAxios.get("http://localhost:8085/admin-login")
      .then(res => {
        setAuthorized(res.data ? "yes" : "no");
        setNNumber(getNNumber(res.data));
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

  if (authorized === "yes") {
    return <div>
      Welcome, {nNumber}
      <br></br>
      This page is under construction. Click <span><a href="https://www.triton.lmig.com">here</a></span> to return to Triton
    </div>;
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

export default Hello;
