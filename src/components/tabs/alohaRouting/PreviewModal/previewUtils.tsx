import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
  RoutingDropDownList,
  RoutingMasterData, PreviewModalAction
} from "../AlohaRouting.Interfaces";
import {
  ROUTING_CACHE_MASTER_DATA,
  dayOfWeek,
  flowType, languageOffer, userDestination
} from "utils";

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
  const flowDropDownList:RoutingDropDownList = fetchData();
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    if(Object.keys(flowDropDownList).includes(item.field)){
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: RoutingDropDownList[item.field as keyof RoutingDropDownList]
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
    priority: priority
  };
  return dropDownValue;
};

export {
  reconstructTableColumnDef
};