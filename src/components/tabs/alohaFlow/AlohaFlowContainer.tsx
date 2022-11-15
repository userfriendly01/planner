import React from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { useAdminState } from "../../../context";


const AlohaFlowContainer = () => {
  const pingIdentityAud: string = useAdminState().userContext.pingIdentity.aud;
  const accessTokenKey: string = "PA." + pingIdentityAud;
  const accessToken: string = getCookieByName(accessTokenKey);
  return (
    <DataGridFlow accessToken = {accessToken}></DataGridFlow>
  );
};

const getCookieByName = (name: string) => {
  const access_token: string = useAdminState().userContext.pingIdentity.access_token;
  const cookiesString: string = document.cookie;
  const cookiesList: string[] = cookiesString.split(";");
  const resultString: string[] = cookiesList.filter(item => item.split("=")[0] === name);
  return resultString[0].split("=")[1];
};

export default AlohaFlowContainer;