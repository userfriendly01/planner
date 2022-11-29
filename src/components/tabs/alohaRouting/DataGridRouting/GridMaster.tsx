/* eslint-disable no-console, max-len,  no-return-assign */

import { ROUTING_CACHE_MASTER_DATA } from "utils";
import { CctSharedCallRoutingDb, RoutingMasterData } from "../AlohaRouting.Interfaces"

const masterDataItems: string[] = ['channel', 'brand', 'callerType', 'callerState', 'transferDestination', 'twilioSkill', 'callIntent', 'policyType'];

const clearGridMasterData = (): void => localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);

const getGridMasterData = (data: CctSharedCallRoutingDb[]): RoutingMasterData => {
  try {
    const localStorageMasterData: string = localStorage.getItem(ROUTING_CACHE_MASTER_DATA);
    if (localStorageMasterData) {
      return JSON.parse(localStorageMasterData) as RoutingMasterData;
    } else {
      let masterData: Record<string, any> = {};
      data.forEach((elem: Record<string, any>) => masterDataItems.forEach((key: string) => (masterData[key] ? masterData[key].push(elem[key]) : masterData[key] = [masterData[key]])));
      Object.keys(masterData).forEach((key: string) => masterData[key] = Array.from(new Set(masterData[key])).sort());
      localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(masterData));
      return masterData as RoutingMasterData;
    }
  } catch (err) {
    console.error('Error in parsing master data', err);
  }
  return {};
};

export {
  getGridMasterData,
  clearGridMasterData,
};
