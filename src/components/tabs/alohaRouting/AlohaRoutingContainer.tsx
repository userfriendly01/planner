import React, { useEffect } from "react";
import { DataGridRouting } from "./DataGridRouting";
import { authWrapper } from "../../core/AzureAuth";
import { AzureSPA } from "globals";
import {
  LAST_ROUTING_MASTER_DATA_CACHED_DATE, ROUTING_CACHE_MASTER_DATA
} from "utils";

const AlohaRoutingContainer = (props: AzureSPA) => {
  const {
    accessToken,
    matchedGroups
  } = props;

  useEffect(()=>{
    updateCacheData();
  },[]);

  const updateCacheData = () =>{
    const lastFlowMasterDataSet = localStorage.getItem(LAST_ROUTING_MASTER_DATA_CACHED_DATE);
    if(lastFlowMasterDataSet){
      const currentDate = new Date();
      const lastSetDate = new Date(lastFlowMasterDataSet);
      const difference: number = currentDate.getTime() - lastSetDate.getTime();
      const differenceInDays = difference / (1000*60*60*24);
      if(differenceInDays>1){
        localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
      }
    }
    else{
      localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
    }
  };

  return (
    <DataGridRouting accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default authWrapper(AlohaRoutingContainer);