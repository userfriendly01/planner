import React from "react";
import ActionDataGrid from "./DataGrid/ActionDataGrid";
import { useAccessToken } from "authentication";
import {
  LoginInProgress,
  LoginError
} from "components";

const DynamicCallFlowActionContainer = (): JSX.Element => {
  const {
    accessToken,
    matchedGroups,
    isLoading,
    error
  } = useAccessToken();

  if (isLoading) {
    return <LoginInProgress />;
  }

  if (error) {
    return <LoginError message={error} />;
  }

  return (
    <ActionDataGrid accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default DynamicCallFlowActionContainer;