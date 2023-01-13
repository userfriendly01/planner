import React from "react";
import { DataGridRouting } from "./DataGridRouting";
import { authWrapper } from "../../core/AzureAuth";
import { AzureSPA } from "globals";

const AlohaRoutingContainer = (props: AzureSPA) => {
  const {
    accessToken,
    matchedGroups
  } = props;

  return (
    <DataGridRouting accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default authWrapper(AlohaRoutingContainer);