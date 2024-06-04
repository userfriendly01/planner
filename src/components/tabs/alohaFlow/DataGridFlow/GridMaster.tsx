/* eslint-disable no-console, max-len,  no-return-assign */
import { LAST_FLOW_MASTER_DATA_CACHED_DATE } from "utils/flowUtils";
import { logger } from "utils/logger";
import {
  CctSharedCallFlowDb, FlowContent, FlowMasterData, FlowListMasterData
} from "../AlohaFlow.Interfaces";

const CACHE_MASTER_DATA = "FLOW_MASTER_DATA";
const masterDataItems = ["channel", "brand", "callerType", "callFlowTemplate", "callFlowRoute", "dataRequests", "pkey"];
const masterDataItemsFromContent = ["callFlowRoute", "callerType", "dataRequests"];
const masterDataItemsWithList = ["dataRequests"];
const filteredItems = [null, "null", "", undefined];

const clearGridMasterData = ():void => localStorage.removeItem(CACHE_MASTER_DATA);

const getValueFromKeyPath = (element:CctSharedCallFlowDb, key:string) => {
  if (element === null) {
    return null;
  } if (masterDataItemsFromContent.includes(key)) {
    return element.content ? element.content[key as keyof FlowContent] : element.content;
  }
  return element[key as keyof CctSharedCallFlowDb];
};

const constructMasterData = (data: CctSharedCallFlowDb[], masterData: FlowMasterData={}):FlowMasterData =>{
  data.forEach((elem: CctSharedCallFlowDb) => masterDataItems.forEach((key: string) => {
    const value: string|string[] = getValueFromKeyPath(elem, key) as string|string[];
    let isValueIsNull:boolean;
    if (!masterData[key as keyof FlowMasterData]) {
      masterData[key as keyof FlowMasterData] = [];
    }
    if(masterDataItemsWithList.includes(key) && value) {
      elem.content[key as keyof FlowListMasterData]?.forEach(item=>{
        if(!filteredItems.includes(item)){
          masterData[key as keyof FlowMasterData].push(item);
        }
      });
    }
    if(typeof(value) === "string" ){
      isValueIsNull = filteredItems.includes(value);
      if (!isValueIsNull) {
        masterData[key as keyof FlowMasterData].push(value);
      }
    }
  }));
  Object.keys(masterData).forEach(key => masterData[key as keyof FlowMasterData] = [...new Set(masterData[key as keyof FlowMasterData])].sort());
  return masterData;
};

const setMasterData = (masterData: FlowMasterData) =>{
  localStorage.setItem(CACHE_MASTER_DATA, JSON.stringify(masterData));
  localStorage.setItem(LAST_FLOW_MASTER_DATA_CACHED_DATE,new Date().toString());
};

const getGridMasterData = (data:CctSharedCallFlowDb[] = []):FlowMasterData  => {
  try {
    const masterDataStorage: string = localStorage.getItem(CACHE_MASTER_DATA);
    if (masterDataStorage && masterDataStorage!=="{}") {
      const cachedMasterData: FlowMasterData = JSON.parse(masterDataStorage);
      const masterData = constructMasterData(data,cachedMasterData);
      setMasterData(masterData);
      return masterData;
    } else {
      const masterData:FlowMasterData=constructMasterData(data);
      setMasterData(masterData);
      return masterData;

    }
  } catch (error) {
    logger.error("Error in parsing master data", { error }, false);
  }
  return {};
};

export {
  clearGridMasterData,
  getGridMasterData,
  getValueFromKeyPath
};
