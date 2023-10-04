import {
  CctSharedCallFlowDb, CctSharedCallRoutingDb, FlowContent
} from "components";
import { useAdminState } from "context";
import { AlertBarProps } from "./interfaces";
import { GraphQLErrors } from "globals";

/**
 *  This function return graphQL endpoint based on running environment  
 * @returns string: GraphQL Endpoint
 */
export const getGraphQLEndpoint = (): string => {
  const env: string = useAdminState().userContext.pingIdentity.environment;
  return {
    "development": "https://flyyckd74fauthoxf5fj23ko6m.appsync-api.us-east-1.amazonaws.com/graphql",
    "test": "https://molg2ylkqrhtpniyfncvue57ha.appsync-api.us-east-1.amazonaws.com/graphql",
    "production": "https://23gxrcju6rfgvlzp6onvg2az5q.appsync-api.us-east-1.amazonaws.com/graphql"
  }[env];
};

/**
 *  This function return Azure SPA client ID on running environment  
 * @returns string: GraphQL client ID
 */
export const getAzureSPAClientId = (env: string): string => {
  return {
    "development": "cc2d6284-c9c4-43fe-9164-4ee0cb8fac50",
    "test": "0605f6ba-a953-4a8e-a663-12cc240e50ed",
    "production": "5e927376-81c5-498e-bc92-372aded461de"
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

const convertArrayOfObjectsToCSV = (array:Array<CctSharedCallFlowDb |CctSharedCallRoutingDb>, prefix: string): string => {
  let result: string;
  const columnDelimiter = "|";
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
        itemValue = itemValue.toString();
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
