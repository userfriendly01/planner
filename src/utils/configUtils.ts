import {
  CctSharedCallFlowDb, CctSharedCallRoutingDb
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
  const keys: string[] = Object.keys(array[0]);
  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach((item:CctSharedCallFlowDb | CctSharedCallRoutingDb) => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) { result += columnDelimiter; }
      result += item[key as keyof (CctSharedCallFlowDb | CctSharedCallRoutingDb)];
      ctr += 1;
    });
    result += lineDelimiter;
  });
  return result;
};

export const  downloadCSV = (prefix: string, array: Array<CctSharedCallFlowDb | CctSharedCallRoutingDb>): JSX.Element => {
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