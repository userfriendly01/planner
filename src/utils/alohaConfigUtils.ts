import {
  CctSharedCallRoutingDb, getCctSharedCallRoutingDbShell
} from "alohaRouting/AlohaRouting.Interfaces";
import { AlertBarProps } from "globals/interfaces";
import {
  ADGroupPermission, BrandNameMap, GraphQLErrors
} from "globals/interfaces";
import { env } from "globals";

export const initializedAlertBar: AlertBarProps = {
  open: false,
  msg: "",
  severityType: "info",
  duration: 6000
};

export const EXPORT_FILE_PREFIX: {
  DYNAMIC_FLOW: string;
  FLOW: string;
  ROUTING: string;
} ={
  DYNAMIC_FLOW: "dynamic-flow",
  FLOW: "call-flow",
  ROUTING: "routing-rules"
};

const convertArrayOfObjectsToCSV = (array:Array<CctSharedCallRoutingDb>, prefix: string): string => {
  let result: string;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  if(array.length ===0){
    return;
  }
  const firstRowModel: CctSharedCallRoutingDb = getCctSharedCallRoutingDbShell();
  let keys: string[] = Object.keys(firstRowModel);

  const contentStore : string[] =[];
  const jsonFormatKeys: string[] = ["occupancyCheck", "routingSteps", "options", "repeat"];
  const nullValueCheck = ["null", null, undefined];
  const flag = false;
  for( let i=0; i<keys.length; i++){
    contentStore.push(keys[i]);
  }
  if(flag){
    keys = contentStore;
  }
  result = "";
  const header = keys.map((key: string)=>key === "pkey" && prefix === EXPORT_FILE_PREFIX.FLOW? "dialedPhoneNumber": key);
  result += header.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach((item: CctSharedCallRoutingDb) => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) { result += columnDelimiter; }
      let itemValue = item[key as keyof (CctSharedCallRoutingDb)];
      itemValue = jsonFormatKeys.includes(key)?JSON.stringify(itemValue):itemValue;
      if(typeof(itemValue)!==  "number" && nullValueCheck.includes(itemValue as string)){
        itemValue = "";
      }
      else if(itemValue){
        itemValue = itemValue.toString().replaceAll(/"/g, "\"\"");
        if (itemValue.includes(",") || itemValue.includes("\"") || key === "pkey" || key === "officeNumbers") {
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

export const  downloadCSV = (prefix: string, array:Array<CctSharedCallRoutingDb>): JSX.Element => {
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

export const readWriteAccess = (permissions: ADGroupPermission[], role: string): boolean => {
  if (env.APP_ENV === "local") {
    return true;
  }

  for (const permission of permissions) {
    const hasRole = permission.roles.reduce(
      (prev, { name }) => prev || name === role,
      false
    );

    if (hasRole) {
      return true;
    }
  }

  return false;
};

export const BrandName:BrandNameMap = {
  "Liberty Mutual": "liberty",
  "Safeco": "safeco"
};