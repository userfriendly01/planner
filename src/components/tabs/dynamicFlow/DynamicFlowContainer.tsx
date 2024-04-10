import React from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { useAccessToken } from "authentication";
import {
  LoginInProgress,
  LoginError
} from "components";

const DynamicFlowContainer = () => {
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
    <DataGridFlow accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default DynamicFlowContainer;