import {
  CctSharedCallFlowDb, CctSharedCallRoutingDb, FlowContent
} from "components";
import { useAdminState } from "context";
import { AlertBarProps } from "./interfaces";
/**
 *  This function return graphQL endpoint based on running environment  
 * @returns string: GraphQL Endpoint
 */
export const getGraphQLEndpoint = (): string => {
  const env: string = useAdminState().userContext.pingIdentity.environment;
  return {
    "development": "https://molg2ylkqrhtpniyfncvue57ha.appsync-api.us-east-1.amazonaws.com/graphql",
    "test": "https://molg2ylkqrhtpniyfncvue57ha.appsync-api.us-east-1.amazonaws.com/graphql",
    "prod": "TBD"
  }[env];
};

/**
 *  This function return Azure SPA client ID on running environment  
 * @returns string: GraphQL client ID
 */
export const getAzureSPAClientId = (): string => {
  const env: string = useAdminState().userContext.pingIdentity.environment;
  return {
    "development": "74b1f79e-23b7-4ed7-abba-3c6cb147fcd4",
    "test": "5d895d11-5151-4805-9d28-471c4020731f",
    "prod": ""
  }[env];
};

export const initializedAlertBar: AlertBarProps = {
  open: false,
  msg: "",
  severityType: ""
};

export const EXPORT_FILE_PREFIX: {
  ROUTING: string;
  FLOW: string;
} ={
  ROUTING: "routing-rules",
  FLOW: "call-flow"
};

const convertArrayOfObjectsToCSV = (array:Array<CctSharedCallFlowDb |CctSharedCallRoutingDb>): string => {
  let result: string;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  if(array.length ===0){
    return;
  }
  let keys: string[] = Object.keys(array[0]);
  const contentStore : string[] =[];
  let contentKeys: string[] = [];
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
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach((item:CctSharedCallFlowDb & CctSharedCallRoutingDb) => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) { result += columnDelimiter; }
      let itemValue = item[key as keyof (CctSharedCallFlowDb | CctSharedCallRoutingDb)];
      if(contentKeys.includes(key)){
        let contentItemVal:string|string[];
        if(item.content){
          contentItemVal = item.content[key as keyof FlowContent];
          itemValue = contentItemVal?contentItemVal.toString():null;
        }
      }
      if(itemValue){
        itemValue = itemValue.toString();
        itemValue = itemValue.replace(","," ");
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
  let csv: string = convertArrayOfObjectsToCSV(array);
  if (csv === null || csv===undefined) { return; }
  const filename = `${prefix}-${Date.now()}.csv`;
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  link.href = encodeURI(csv);
  link.download = filename;
  link.click();
};