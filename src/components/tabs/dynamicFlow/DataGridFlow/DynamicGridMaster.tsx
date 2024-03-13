/* eslint-disable no-console, max-len,  no-return-assign */
import {
  LAST_FLOW_MASTER_DATA_CACHED_DATE, logger
} from "utils";

import {
  Announcement, DynamicAction, Menu, MenuOptions
} from "../DynamicFlow.Interfaces";

const CACHE_MASTER_DATA = "FLOW_MASTER_DATA";
const masterDataItems = ["pkey", "skey", "actionType", "callFlowName", "createTime", "updateTime", "all","speech","timeout","finishOnKey","minDigits","maxDigits","nextActionType","options"];

const filteredItems = [null, "null", "", undefined];

const clearGridMasterData = ():void => localStorage.removeItem(CACHE_MASTER_DATA);

const getValueFromKeyPath = (element:DynamicAction, key:string) => {
  if (element === null) {
    return null;
  }
  return element[key as keyof DynamicAction];
};
// Check with Team TODO
const constructMasterData = (data: DynamicAction[],masterData: any={}):any =>{
  data.forEach((elem: DynamicAction) => masterDataItems.forEach((key: string) => {
    const value: string|string[] = getValueFromKeyPath(elem, key) as string|string[];
    let isValueIsNull:boolean;
    if (!masterData[key as keyof any]) {
      masterData[key as keyof any] = [];
    }
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

const getDynamicGridMasterData = (data:DynamicAction[] = []):any  => {
  try {
    const masterData:any=constructMasterData(data);
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
