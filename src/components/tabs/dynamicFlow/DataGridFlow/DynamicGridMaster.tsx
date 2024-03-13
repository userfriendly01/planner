/* eslint-disable no-console, max-len,  no-return-assign */
import {
  LAST_FLOW_MASTER_DATA_CACHED_DATE, logger
} from "utils";
import {
  CctSharedCallFlowDb, FlowContent, FlowMasterData, FlowListMasterData
} from "../AlohaFlow.Interfaces";
import { DynamicAction } from "../DynamicFlow.Interfaces";

const CACHE_MASTER_DATA = "FLOW_MASTER_DATA";
const masterDataItems = ["pkey", "skey", "actionType", "callFlowName", "createTime", "updateTime", "all","speech","timeout","finishOnKey","minDigits","maxDigits","nextActionType","options"];

const filteredItems = [null, "null", "", undefined];

const clearGridMasterData = ():void => localStorage.removeItem(CACHE_MASTER_DATA);

const getValueFromKeyPath = (element:CctSharedCallFlowDb, key:string) => {
  if (element === null) {
    return null;
  }
  return element[key as keyof CctSharedCallFlowDb];
};
// Check with Team TODO
const constructMasterData = (data: DynamicAction[]):any =>{
  data.forEach((elem: DynamicAction) => masterDataItems.forEach((key: string) => {
    const value: string|string[] = getValueFromKeyPath(elem, key) as string|string[];
    let isValueIsNull:boolean;
    if(typeof(value) === "string" ){
      isValueIsNull = filteredItems.includes(value);
      if (!isValueIsNull) {
        masterData[key as keyof DynamicAction].push(value);
      }
    }
  }));
  Object.keys(masterData).forEach(key => masterData[key as keyof DynamicAction] = [...new Set(masterData[key as keyof DynamicAction])].sort());
  return masterData;
};

const setMasterData = (masterData: FlowMasterData) =>{
  localStorage.setItem(CACHE_MASTER_DATA, JSON.stringify(masterData));
  localStorage.setItem(LAST_FLOW_MASTER_DATA_CACHED_DATE,new Date().toString());
};

const getDynamicGridMasterData = (data:DynamicAction[] = []):any  => {
  try {
    const masterData:FlowMasterData=constructMasterData(data);
    setMasterData(masterData);
    return masterData;
  } catch (error) {
    logger.error("Error in parsing master data", { error }, false);
  }
  return {};
};

export {
  getDynamicGridMasterData,
  clearGridMasterData
};
