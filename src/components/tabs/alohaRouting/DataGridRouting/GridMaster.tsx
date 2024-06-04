/* eslint-disable no-console, max-len,  no-return-assign */

import {
  LAST_ROUTING_MASTER_DATA_CACHED_DATE,
  ROUTING_CACHE_MASTER_DATA
} from "utils/routingUtils";
import { logger } from "utils/logger";
import {
  CctSharedCallRoutingDb, RoutingMasterData
} from "../AlohaRouting.Interfaces";

const masterDataItems: string[] = ["channel", "brand", "callerType", "callerState", "transferDestination", "twilioSkill", "callIntent", "policyType"];

const clearGridMasterData = (): void => localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);

const constructMasterData = (data: CctSharedCallRoutingDb[], masterData: Record<string, any> = {}) =>{
  data.forEach((elem: Record<string, any>) => masterDataItems.forEach((key: string) => (masterData[key] ? masterData[key].push(elem[key]) : masterData[key] = [elem[key]])));
  Object.keys(masterData).forEach((key: string) => masterData[key] = Array.from(new Set(masterData[key])).sort());
  return masterData;
};

const setMasterData = (masterData: Record<string, any>) =>{
  localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(masterData));
  localStorage.setItem(LAST_ROUTING_MASTER_DATA_CACHED_DATE,new Date().toString());
};

const getGridMasterData = (data: CctSharedCallRoutingDb[]): RoutingMasterData => {
  try {
    const localStorageMasterData: string = localStorage.getItem(ROUTING_CACHE_MASTER_DATA);
    if (localStorageMasterData) {
      const cachedMasterData = JSON.parse(localStorageMasterData) as RoutingMasterData;
      const masterData = constructMasterData(data, cachedMasterData);
      setMasterData(masterData);
      return masterData;
    } else {
      const masterData: Record<string, any> = constructMasterData(data);
      setMasterData(masterData);
      return masterData as RoutingMasterData;
    }
  } catch (error) {
    logger.error("Error in parsing master data", { error }, false);
  }
  return {};
};

export {
  getGridMasterData,
  clearGridMasterData
};
