import * as XLSX from "xlsx";
import { routingFields } from "utils/alohaRoutingUtils";
import { AddPageFieldConfigProps as AddRoutingFieldConfigProps } from "alohaRouting/AlohaRouting.Interfaces";

type CSVFileType = "FLOW" | "ROUTING" | "DYNFLOW";

const mapValuesToObj=(jsonValues:any, type?:CSVFileType):any=>{
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
