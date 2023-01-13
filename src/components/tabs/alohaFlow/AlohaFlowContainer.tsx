import React from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { authWrapper } from "../../core/AzureAuth";
import { AzureSPA } from "globals";


const AlohaFlowContainer = (props:AzureSPA) => {
  const {
    accessToken,
    matchedGroups
  } = props;

  return (
    <DataGridFlow accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};


export default authWrapper(AlohaFlowContainer);