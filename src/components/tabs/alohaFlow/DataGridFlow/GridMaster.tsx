/* eslint-disable no-console, max-len,  no-return-assign */
import {
  CctSharedCallFlowDb, FlowContent, FlowMasterData
} from "../AlohaFlow.Interfaces";

const CACHE_MASTER_DATA = "FLOW_MASTER_DATA";
const masterDataItems = ["channel", "brand", "callerType", "callFlowTemplate", "callFlowRoute", "pkey"];
const masterDataItemsFromContent = ["callFlowRoute", "callerType"];
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

const getGridMasterData = (data:CctSharedCallFlowDb[] = []):FlowMasterData  => {
  let masterData:FlowMasterData={};
  try {
    const masterDataStorage: string = localStorage.getItem(CACHE_MASTER_DATA);
    if (masterDataStorage && masterDataStorage!=="{}") {
      masterData = JSON.parse(masterDataStorage);
    } else {
      data.forEach((elem: CctSharedCallFlowDb) => masterDataItems.forEach((key: string) => {
        const value: string = getValueFromKeyPath(elem, key) as string;
        const isValueIsNull:boolean = filteredItems.includes(value);
        if (!masterData[key as keyof FlowMasterData]) {
          masterData[key as keyof FlowMasterData] = [];
        }
        if (!isValueIsNull) {
          masterData[key as keyof FlowMasterData].push(value);
        }
      }));
      Object.keys(masterData).forEach(key => masterData[key as keyof FlowMasterData] = [...new Set(masterData[key as keyof FlowMasterData])].sort());
      localStorage.setItem(CACHE_MASTER_DATA, JSON.stringify(masterData));
    }
  } catch (err) {
    console.error("Error in parsing master data", err);
  }
  return masterData;
};

export {
  getGridMasterData,
  clearGridMasterData
};
