import * as XLSX from "xlsx";
const contentKeys = ["callIntent","callerType","callFlowRoute","greetingMessages","languageOffer","transferNumber"];
const contentArrayKeys =["dataRequests","officeNumbers"]
const mapValuesToObj=(jsonValues:any, type:string):any=>{
  if(type ==="callFlow"){
    let jsonFlowObj:any={
      content:{}
     };
     Object.keys(jsonValues).forEach(key=>{
        if (contentKeys.includes(key)){
          const value= jsonValues[key]||""
          jsonFlowObj.content[key]=value;
        }
        else if(contentArrayKeys.includes(key)){
          const value= jsonValues[key]||"";
          jsonFlowObj.content[key]=value?.split(",")
        }
        else{
          jsonFlowObj[key]=jsonValues[key]?jsonValues[key]:""
        }
      });
      return jsonFlowObj;
  }
  else{
    const occupancyCheck=jsonValues?.occupancyCheck||"[]";
    const routingSteps= jsonValues?.routingSteps ||"[]"
    const jsonRouteObj={ 
      ...jsonValues,
      occupancyCheck:JSON.parse(occupancyCheck),
      routingSteps: JSON.parse(routingSteps)
    }
    return jsonRouteObj;
  }
}
export const CsvReader = (e: any, setUploadedForm: any): void => {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    const fileName = e.target.files[0].name || "";
    reader.onload = e => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "array", FS: '|' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet,{raw: false});
      console.warn(json);
      const rowNum = "__rowNum__";
      const headerRows = 1;
      if(typeof json ==="object"){
        setUploadedForm(json.map((r:any) => {
          let jsonMap = r
          if(fileName.startsWith('call-flow')){
            jsonMap = mapValuesToObj(r,"callFlow");
          }
          else{
            jsonMap = mapValuesToObj(r,"callRouting");
          }
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