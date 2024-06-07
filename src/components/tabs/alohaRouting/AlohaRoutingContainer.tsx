import React, { useEffect } from "react";
import { DataGridRouting } from "./DataGridRouting/DataGridRouting";
import {
  LAST_ROUTING_MASTER_DATA_CACHED_DATE, ROUTING_CACHE_MASTER_DATA
} from "utils/alohaRoutingUtils";
import { useAdminState } from "context/appContext";

const AlohaRoutingContainer = () => {
  const {
    userContext: {
      permissions,
      accessToken
    }
  } = useAdminState();

  useEffect(() => {
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

    updateCacheData();
  },[]);

  return (
    <DataGridRouting accessToken={accessToken} matchedGroups={permissions} />
  );
};

export default AlohaRoutingContainer;