import React from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { useAdminState } from "context/appContext";

const DynamicFlowContainer = (): JSX.Element => {
  const {
    userContext: {
      tokens: {
        sharedGraph
      },
      permissions
    }
  } = useAdminState();

  return (
    <DataGridFlow accessToken={sharedGraph} matchedGroups={permissions} />
  );
};

export default DynamicFlowContainer;