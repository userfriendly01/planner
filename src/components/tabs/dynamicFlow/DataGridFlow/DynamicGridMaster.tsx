/* eslint-disable no-console, max-len,  no-return-assign */
import {
  logger
} from "utils/logger";

import {
  DynamicAction
} from "../DynamicFlow.Interfaces";

const masterDataItems = ["actionId", "actionType", "callFlowName", "createTime", "updateTime", "speech","timeout","finishOnKey","minDigits","maxDigits","nextActionType","nextActionId","options","repeat"];

const filteredItems = [null, "null", "", undefined];

const getValueFromKeyPath = (element:DynamicAction, key:string) => {
  if (element === null) {
    return null;
  }
  return element[key as keyof DynamicAction];
};
/**
 *  Below function reads db object and creates an array of key - values.
 * @param data
 * @param masterData
 */
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
  getDynamicGridMasterData
};
