import React from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { useAdminState } from "context/appContext";

const DynamicFlowContainer = (): JSX.Element => {
  const {
    userContext: {
      permissions,
      accessTokenGraph
    }
  } = useAdminState();

  return (
    <DataGridFlow accessToken={accessTokenGraph} matchedGroups={permissions} />
  );
};

export default DynamicFlowContainer;