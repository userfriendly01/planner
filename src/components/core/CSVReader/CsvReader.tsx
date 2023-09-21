import * as XLSX from "xlsx";
import { flowFields } from "../../tabs/alohaFlow/CustomActions/FlowFieldsConfig";
import { routingFields } from "utils";
import { AddPageFieldConfigProps as AddRoutingFieldConfigProps } from "components";
import { AddFlowFieldsConfigProps } from "components";

export type CSVFileType = "FLOW" | "ROUTING";

const mapValuesToObj=(jsonValues:any, type?:CSVFileType):any=>{
  console.log("jsonValues:", jsonValues);
  if(type ==="FLOW"){
    let jsonFlowObj:any={
      content: {}
    };
    flowFields.map((value:AddFlowFieldsConfigProps)=>{
      let key = value.key;
      if(key === "pkey")
      {
        key = "dialedPhoneNumber";
      }
      jsonFlowObj=value.valueSetter(jsonFlowObj,{ [key]: jsonValues[key] });
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
        console.log("routeValue: ", routeValue);
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
      console.log("typeof json: ", typeof json);
      if(typeof json ==="object"){
        setUploadedForm(json.map((r:any) => {
          const jsonMap = mapValuesToObj(r,flowType);
          console.log("jsonMap: ", jsonMap);
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