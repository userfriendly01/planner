import { FlowDropDownList } from "components/tabs/alohaFlow/AlohaFlow.Interfaces";

export const flowDropDownList: FlowDropDownList = {
  "brand": [],
  "languageOffer": [],
  "channel": [],
  "userDestination": [],
  "callFlowRoute": [],
  "callerType": [],
  "dataRequests": [],
  "type": []
};
export const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";
export const CALL_FLOW_PAGE_NO = "CALL_FLOW_PAGE_NO";
export const CALL_FLOW_PER_PAGE = "CALL_FLOW_PER_PAGE";
export const FLOW_MASTER_DATA = "FLOW_MASTER_DATA";
export const languageOffer = ["English", "Spanish"];
export const userDestination = ["Avaya", "Twilio"];
export const flowType = ["DID", "DRC", "LSC", "TFN"];

export const getAdvanceFilter = (storageKeyName: string): { [key: string]: undefined; } => {
  let advanceFilter: { [key: string]: undefined; };
  try {
    const cachedFilter = localStorage.getItem(storageKeyName);
    advanceFilter = JSON.parse(cachedFilter) || {};
    Object.keys(advanceFilter).forEach(key => {
      if (advanceFilter[key] === "" || advanceFilter[key] === null) {
        delete advanceFilter[key];
      }
    });
  } catch (e) {
    advanceFilter = {};
  }
  return advanceFilter;
};

export const checkGreetingMessageRegExp = (value: string): boolean => {
  const reg = new RegExp("^[a-zA-Z0-9,@:=<>./\\-\\'\" ñáéíóú]+$");
  return value && !reg.test(value);
};