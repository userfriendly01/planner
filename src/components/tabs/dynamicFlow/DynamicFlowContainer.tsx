import React from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { useAdminState } from "context";

const DynamicFlowContainer = (): JSX.Element => {
  const {
    userContext: {
      permissions,
      accessToken
    }
  } = useAdminState();

  return (
    <DataGridFlow accessToken={accessToken} matchedGroups={permissions} />
  );
};

export default DynamicFlowContainer;