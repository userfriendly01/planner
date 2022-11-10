import React from "react";
import { retrieveFlowData } from "services";
import { CctSharedCallFlowDb } from "./AlohaFlow.Interfaces";
import { useAdminState } from "../../../context"

const AlohaFlowContainer = (): JSX.Element => {
  const pingIdentityAud: string = useAdminState().userContext.pingIdentity.aud;
  const accessTokenKey: string = "PA." + pingIdentityAud;
  const accessToken: string = getCookieByName(accessTokenKey)
  const result: CctSharedCallFlowDb[] = retrieveFlowData(accessToken)
  return (
    <div>Aloha Call Flow Tab Under Construction</div>
  );
};

const getCookieByName = (name: string) => {
  const access_token: string = useAdminState().userContext.pingIdentity.access_token;
  const cookiesString: string = document.cookie;
  const cookiesList: string[] = cookiesString.split(";");
  const resultString: string[] = cookiesList.filter(item => item.split("=")[0] == name)
  return resultString[0].split("=")[1]
}

export default AlohaFlowContainer;