import { FlowDropDownList } from "alohaFlow/AlohaFlow.Interfaces";

export const flowDropDownList: FlowDropDownList = {
  "brand": [],
  "languageOffer": [],
  "channel": [],
  "userDestination": [],
  "callFlowName": [],
  "callFlowRoute": [],
  "callFlowType": [],
  "callerType": [],
  "dataRequests": [],
  "nextActionType": [],
  "tfnRoutingGroup": [],
  "phoneNumberType": []

};
export const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";
export const CALL_FLOW_PAGE_NO = "CALL_FLOW_PAGE_NO";
export const CALL_FLOW_PER_PAGE = "CALL_FLOW_PER_PAGE";
export const FLOW_MASTER_DATA = "FLOW_MASTER_DATA";
export const languageOffer = ["English", "Spanish"];
export const userDestination = ["Avaya", "Twilio"];
export const flowType = ["DID", "DRC", "LSC", "TFN"];
export const callFlowName = ["LSC", "AISG Main"];
export const callFlowType = ["DTMF", "Self Service"];
export const nextActionType = ["ANNOUNCEMENT", "MENU", "MENUOPTIONS"];
export const tfnRoutingGroup = ["Premier Partners", "TruStage", "TruStageNavy", "USAA", "High Touch Products", "Online Inbound", "Core",
  "LSCAgentSales", "LSCBookTransfer", "LSCDirectSales", "LSCHomeInsDotCom", "LSCPriorityAgent", "LSCPriorityCampaigns", "LSCUSAA"];
export const LAST_FLOW_MASTER_DATA_CACHED_DATE="LAST_FLOW_MASTER_DATA_CACHED_DATE";

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
