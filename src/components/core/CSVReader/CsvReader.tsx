import * as XLSX from "xlsx";
import { flowFields } from "../../tabs/alohaFlow/CustomActions/FlowFieldsConfig";
import { flowFields as dynamicFlowFields } from "../../tabs/dynamicFlow/CustomActions/FlowFieldsConfig";
import { routingFields } from "utils/routingUtils";
import { AddPageFieldConfigProps as AddRoutingFieldConfigProps } from "alohaRouting/AlohaRouting.Interfaces";
import { AddFlowFieldsConfigProps } from "alohaFlow/AlohaFlow.Interfaces";
import {
  ActionPreview,
  AddDynamicFlowFieldsConfigProps,
  DynamicAction
} from "../../tabs/dynamicFlow/DynamicFlow.Interfaces";

export type CSVFileType = "FLOW" | "ROUTING" | "DYNFLOW";

const mapValuesToObj=(jsonValues:any, type?:CSVFileType):any=>{
  if(type ==="FLOW"){
    let jsonFlowObj:any={
      content: {}
    };
    flowFields.map((value:AddFlowFieldsConfigProps)=>{
      const key = value.key;
      let jsonValue = jsonValues[key];
      if(key === "pkey")
      {
        jsonValue = jsonValues["dialedPhoneNumber"];
      }
      else if(key === "officeNumbers") {
        jsonValue = jsonValues[key]? jsonValues[key].split(",") : [];

      }
      else if(["predictiveCaller", "selfServiceIndicator"].includes(key)){
        jsonValue = Boolean(jsonValues[key]);
      }
      jsonFlowObj=value.valueSetter(jsonFlowObj,{ [key]: jsonValue });
    });
    return jsonFlowObj;
  }
  else if(type ==="DYNFLOW"){
    let jsonFlowObj:any={
    };
    dynamicFlowFields.map((value:AddDynamicFlowFieldsConfigProps)=>{
      const key = value.key;
      if(key === "pkey") {
        jsonFlowObj[key] = jsonValues["id"];
      } else if(value.key==="options" || value.key === "repeat"){
        const routeValue=jsonValues[value.key]||(value.key==="options"?"[]":"{}");
        jsonFlowObj = {
          ...jsonFlowObj,
          [value.key]: JSON.parse(routeValue)
        };
      } else {
        jsonFlowObj[key] = jsonValues[key];
      }
    });
    jsonFlowObj.skey = `${jsonValues["callFlowName"]}:ACTION:${jsonValues["actionType"]}`;
    jsonFlowObj.errors = validateActionRow(jsonFlowObj);
    jsonFlowObj.createTime = new Date().getTime();
    jsonFlowObj.updateTime = new Date().getTime();

    return jsonFlowObj as ActionPreview;
  }
  else {
    let jsonRouteObj={};
    routingFields.map((value:AddRoutingFieldConfigProps)=>{
      if(value.key==="occupancyCheck" || value.key === "routingSteps"){
        const routeValue=jsonValues[value.key]||"[]";
        jsonRouteObj = {
          ...jsonRouteObj,
          [value.key]: JSON.parse(routeValue)
        };
      }
      else{
        const routeValue=jsonValues[value.key]||"";
        jsonRouteObj = {
          ...jsonRouteObj,
          [value.key]: routeValue
        };
      }
    });
    return jsonRouteObj;
  }
};

export const validateActionRow = (action: DynamicAction): string => {
  const errors: Array<string> = [];

  checkRequiredFields(["actionId", "actionType", "callFlowName"], action)
    .forEach(x => errors.push(x));

  switch(action.actionType) {
    case "MENU":
      checkRequiredFields(["speech"], action)
        .forEach(x => errors.push(x));
      break;
    case "MENUOPTIONS":
      if(action.options.length === 0) {
        errors.push("* Field options is required.");
      }
      break;
    case "ANNOUNCEMENT":
      checkRequiredFields(["speech"], action)
        .forEach(x => errors.push(x));
      break;
    default:
      errors.push("* Field actionType must be one of MENU, MENUOPTIONS, ANNOUNCEMENT");
      break;
  }
  return errors.join("  ");

};

const checkRequiredFields = (requiredFields: string[], obj: any ): string[] => {
  const errors: Array<string> = [];

  requiredFields.forEach(x => {
    if(!obj[x]) {
      errors.push(`* Field ${x} is required.`);
    }
  });

  return errors;
};

export const CsvReader = (e: React.ChangeEvent<HTMLInputElement>, setUploadedForm: any, flowType?:CSVFileType): void => {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, {
        type: "array",
        FS: ","
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet,{ raw: false });
      console.warn("Before", json);
      const rowNum = "__rowNum__";
      const headerRows = 1;
      if(typeof json ==="object"){
        setUploadedForm(json.map((r:any) => {
          const jsonMap = mapValuesToObj(r,flowType);
          return {
            ...jsonMap,
            rowNumber: jsonMap[rowNum] + headerRows
          };
        }));
      }
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};
