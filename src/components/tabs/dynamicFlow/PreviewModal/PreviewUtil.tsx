import React from "react";
import {
  GridCellParams, GridColDef
} from "@mui/x-data-grid";
import {
  FlowDropDownList,
  FlowMasterData, PreviewModalAction
} from "../DynamicFlow.Interfaces";
import {
  FLOW_MASTER_DATA,
  flowType, languageOffer, tfnRoutingGroup, userDestination
} from "utils";

import { flowFields } from "../CustomActions/FlowFieldsConfig";
import { ComponentControl } from "components";
import { GridApiCommunity } from "@mui/x-data-grid/internals";


const mandatoryField = flowFields.filter(x => x.required).map(x => {
  return x.key;
});

const reconstructTableColumnDef = (action: PreviewModalAction, columnDef: Array<GridColDef>,apiRef: React.MutableRefObject<GridApiCommunity>): Array<GridColDef> =>{
  if(action==="edit" || action === "add")
  {
    return manageEditColumnDef(columnDef,apiRef);
  }
  else{
    return columnDef;
  }
};

const manageEditColumnDef = (columnDef: Array<GridColDef>, apiRef: React.MutableRefObject<GridApiCommunity>): Array<GridColDef> =>{
  const flowDropDownList:FlowDropDownList = fetchData();
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    if(Object.keys(flowDropDownList).includes(item.field)){
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: flowDropDownList[item.field as keyof FlowDropDownList],
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!flowDropDownList[item.field as keyof FlowDropDownList].includes(params.value) &&
          mandatoryField.includes(item.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      };
    }
    if(item.field === "officeNumbers"){
      return {
        ...item,
        editable: true,
        renderEditCell: params =>
          <ComponentControl
            control="multiTextField"
            label=""
            name={item.field}
            error={false}
            required={false}
            type="text"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              apiRef.current.setEditCellValue({
                id: params.row.id,
                field: item.field,
                value: event.target.value
              });
            }}
          />
      };
    }
    if(["predictiveCaller", "selfServiceIndicator"].includes(item.field)){
      return {
        ...item,
        editable: true,
        renderEditCell: params =>
          <ComponentControl
            control="switch"
            label=""
            name={item.field}
            error={false}
            required={false}
            type="boolean"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              apiRef.current.setEditCellValue({
                id: params.row.id,
                field: item.field,
                value: event.target.value
              });
            }}
          />,
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!params.value && mandatoryField.includes(item.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }

      };
    }
    return {
      ...item,
      editable: true,
      cellClassName: (params: GridCellParams<any, string>)=> {
        if(!params.value && mandatoryField.includes(item.field)){
          return "MuiDataGrid-Custom-Cell-Format";
        }
        return "";
      }
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
