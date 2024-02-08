import React, { useEffect } from "react";
import DataGridFlow from "./DataGridFlow/DataGridFlow";
import { authWrapper } from "../../core/AzureAuth";
import { AzureSPA } from "globals";
import {
  FLOW_MASTER_DATA, LAST_FLOW_MASTER_DATA_CACHED_DATE
} from "utils";

const DynamicFlowContainer = (props:AzureSPA) => {
  const {
    accessToken,
    matchedGroups
  } = props;
  useEffect(()=>{
    updateCacheData();
  },[]);

  const updateCacheData = () =>{
    const lastFlowMasterDataSet = localStorage.getItem(LAST_FLOW_MASTER_DATA_CACHED_DATE);
    if(lastFlowMasterDataSet){
      const currentDate = new Date();
      const lastSetDate = new Date(lastFlowMasterDataSet);
      const difference: number = currentDate.getTime() - lastSetDate.getTime();
      const differenceInDays = difference / (1000*60*60*24);
      if(differenceInDays>1){
        localStorage.removeItem(FLOW_MASTER_DATA);
      }
    }
    else{
      localStorage.removeItem(FLOW_MASTER_DATA);
    }
  };
  return (
    <DataGridFlow accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default authWrapper(DynamicFlowContainer);