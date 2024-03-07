import React from "react";
import { authWrapper } from "../../core/AzureAuth";
import { AzureSPA } from "globals";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
const DynamicFlowContainer = (props:AzureSPA) => {
  const {
    accessToken,
    matchedGroups
  } = props;

  return (
    <DataGridFlow accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default authWrapper(DynamicFlowContainer);