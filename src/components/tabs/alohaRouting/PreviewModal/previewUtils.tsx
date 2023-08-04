import {
  ROUTING_CACHE_MASTER_DATA,
  dayOfWeek,
  languageOffer
} from "utils";
import {
  PreviewModalAction,
  RoutingDropDownList,
  RoutingMasterData
} from "../AlohaRouting.Interfaces";
import {
  GridColDef
} from "@mui/x-data-grid";

const reconstructTableColumnDef = (action: PreviewModalAction, columnDef: Array<GridColDef>): Array<GridColDef> =>{
  if(action==="edit" || action === "add")
  {
    return manageEditColumnDef(columnDef);
  }
  else{
    return columnDef;
  }
};

const manageEditColumnDef = (columnDef: Array<GridColDef>): Array<GridColDef> =>{
  const routingDropDownList:RoutingDropDownList = fetchData();
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    if(Object.keys(routingDropDownList).includes(item.field)){
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: routingDropDownList[item.field as keyof RoutingDropDownList]
      };
    }
    return {
      ...item,
      editable: true
    };
  });
  return updatedColDef;
};

const fetchData = (): RoutingDropDownList =>{
  const masterData: string = localStorage.getItem(ROUTING_CACHE_MASTER_DATA);
  if (masterData === undefined && masterData === null) {
    return;
  }
  const masterDataObject: RoutingMasterData = JSON.parse(masterData);
  const dropDownValue: RoutingDropDownList = {
    brand: masterDataObject.brand,
    channel: masterDataObject.channel,
    dayOfWeek: dayOfWeek,
    language: languageOffer,
    policyType: masterDataObject?.policyType,
    priority: masterDataObject.priority
  };
  return dropDownValue;
};

export {
  reconstructTableColumnDef
};