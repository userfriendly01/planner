import * as XLSX from "xlsx";
import { flowFields } from "../../tabs/alohaFlow/CustomActions/FlowFieldsConfig";
import { routingFields } from "utils";
import { AddPageFieldConfigProps as AddRoutingFieldConfigProps } from "components";
import { AddFlowFieldsConfigProps } from "components";

export type CSVFileType = "FLOW" | "ROUTING";

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
  else{
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
export const CsvReader = (e: React.ChangeEvent<HTMLInputElement>, setUploadedForm: any, flowType?:CSVFileType): void => {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, {
        type: "array",
        FS: "|"
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet,{ raw: false });
      console.warn(json);
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