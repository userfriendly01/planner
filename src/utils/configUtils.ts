import {
  CctSharedCallFlowDb, CctSharedCallRoutingDb, FlowContent
} from "components";
import { AlertBarProps } from "./interfaces";
import {
  BrandNameMap, GraphQLErrors, env
} from "globals";

export const initializedAlertBar: AlertBarProps = {
  open: false,
  msg: "",
  severityType: "info",
  duration: 6000
};

export const EXPORT_FILE_PREFIX: {
  DYN: string;
  FLOW: string;
  ROUTING: string;
} ={
  DYN: "dynamic-flow",
  FLOW: "call-flow",
  ROUTING: "routing-rules"
};

const convertArrayOfObjectsToCSV = (array:Array<CctSharedCallFlowDb |CctSharedCallRoutingDb>, prefix: string): string => {
  let result: string;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  if(array.length ===0){
    return;
  }
  let keys: string[] = Object.keys(array[0]);
  const contentStore : string[] =[];
  let contentKeys: string[] = [];
  const jsonFormatKeys: string[] = ["occupancyCheck", "routingSteps"];
  const nullValueCheck = ["null", null, undefined];
  let flag = false;
  for( let i=0; i<keys.length; i++){
    if(keys[i] === "content"){
      const arrayStore:CctSharedCallFlowDb = array[0];
      contentKeys= Object.keys(arrayStore.content);
      contentKeys.forEach(key=>{
        contentStore.push(key);
      });
      flag = true;
    }
    else{
      contentStore.push(keys[i]);
    }
  }
  if(flag){
    keys = contentStore;
  }
  result = "";
  const header = keys.map((key: string)=>key === "pkey" && prefix === EXPORT_FILE_PREFIX.FLOW? "dialedPhoneNumber": key);
  result += header.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach((item:CctSharedCallFlowDb & CctSharedCallRoutingDb) => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) { result += columnDelimiter; }
      let itemValue = item[key as keyof (CctSharedCallFlowDb | CctSharedCallRoutingDb)];
      itemValue = jsonFormatKeys.includes(key)?JSON.stringify(itemValue):itemValue;
      if(contentKeys.includes(key)){
        let contentItemVal:string|string[];
        if(item.content){
          contentItemVal = item.content[key as keyof FlowContent];
          itemValue = contentItemVal?contentItemVal.toString():"";
        }
      }
      if(typeof(itemValue)!==  "number" && nullValueCheck.includes(itemValue)){
        itemValue = "";
      }
      else if(itemValue){
        itemValue = itemValue.toString().replaceAll(/"/g, "\"\"");
        if (itemValue.includes(",") || itemValue.includes("\"")) {
          itemValue = `"${itemValue}"`;
        }
      }
      result += itemValue;
      ctr += 1;
    });
    result += lineDelimiter;
  });
  return result;
};

export const  downloadCSV = (prefix: string, array:Array<CctSharedCallFlowDb |CctSharedCallRoutingDb>): JSX.Element => {
  const link: HTMLAnchorElement = document.createElement("a");
  let csv: string = convertArrayOfObjectsToCSV(array, prefix);
  if (csv === null || csv===undefined) { return; }
  const filename = `${prefix}-${Date.now()}.csv`;
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  link.href = encodeURI(csv)
    .replace(/#/g, "%23")
    .replace(/=/g,"%3D");
  link.download = filename;
  link.click();
};

export const ErrorDuplicateRecord = "Record already exists.";
export const cleanErrorMessage = (graphQLErrors: GraphQLErrors[]): string => {
  if (graphQLErrors[0]?.errorType === "DynamoDB:ConditionalCheckFailedException") {
    return ErrorDuplicateRecord;
  }
  return graphQLErrors[0].message;
};

/**
 * 
 * @param {Array<any>} matchedGroups - The matched groups provided by Azure Oauth response
 * @param {String} alohaTabType - currently aloha-flow or aloha-route
 * @returns {Boolean} true if the permission is not found/matched.
 */
export const readWriteAccess=(matchedGroups: any[], alohaTabType: string): boolean => {
  if (env.APP_ENV === "local") {
    return false;
  }

  let flag = true;
  matchedGroups?.forEach((item: any) => {
    if(item.startup.name === alohaTabType && item.permissionLevel === "write"){
      item.environments.forEach((envVar: string)=>{
        if(envVar === env.APP_ENV){
          flag = false;
        }
      });
    } });
  return flag;
};

export const BrandName:BrandNameMap={
  "Liberty Mutual": "liberty",
  "Safeco": "safeco"
};