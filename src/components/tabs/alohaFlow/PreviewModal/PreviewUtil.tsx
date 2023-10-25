import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
  FlowDropDownList,
  FlowMasterData, PreviewModalAction
} from "../AlohaFlow.Interfaces";
import {
  FLOW_MASTER_DATA,
  flowType, languageOffer, tfnRoutingGroup, userDestination
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
  const flowDropDownList:FlowDropDownList = fetchData();
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    if(Object.keys(flowDropDownList).includes(item.field)){
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: flowDropDownList[item.field as keyof FlowDropDownList]
      };
    }
    return {
      ...item,
      editable: true
    };
  });
  return updatedColDef;
};

const fetchData = (): FlowDropDownList =>{
  const masterData: string = localStorage.getItem(FLOW_MASTER_DATA);
  if (masterData === undefined && masterData === null) {
    return;
  }
  const masterDataObject: FlowMasterData = JSON.parse(masterData);
  const dropDownValue: FlowDropDownList = {
    brand: masterDataObject.brand,
    channel: masterDataObject.channel,
    languageOffer,
    userDestination,
    callFlowRoute: masterDataObject?.callFlowRoute,
    callerType: masterDataObject?.callerType,
    dataRequests: masterDataObject?.dataRequests,
    tfnRoutingGroup,
    type: flowType
  };
  return dropDownValue;
};

export {
  reconstructTableColumnDef
};
