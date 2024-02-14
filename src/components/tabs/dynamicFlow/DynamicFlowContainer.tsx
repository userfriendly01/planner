import React from "react";
import { authWrapper } from "../../core/AzureAuth";
const DynamicFlowContainer = () => {
  return (
    <div>Dynamic Tab</div>
  );
};

export default authWrapper(DynamicFlowContainer);