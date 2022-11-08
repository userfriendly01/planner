import React from "react";
import { retrieveFlowData } from "services";
import { CctSharedCallFlowDb } from "./AlohaFlow.Interfaces";

const AlohaFlowContainer = (): JSX.Element => {
  const accessToken: string = getCookieByName("PA.ciciccttritondev1")
  const result: CctSharedCallFlowDb[] = retrieveFlowData(accessToken)
  console.log("Result:", result);
  return (
    <div>Aloha Call Flow Tab Under Construction</div>
  );
};

const getCookieByName = (name: string) => {
  const cookiesString: string = document.cookie;
  const cookiesList: string[] = cookiesString.split(";");
  const resultString: string[] = cookiesList.filter(item => item.split("=")[0] == name)
  return resultString[0].split("=")[1]
}

export default AlohaFlowContainer;