import React from "react";
import {
  GridCellParams, GridColDef
} from "@mui/x-data-grid";
import {
  DynamicCallFlowPhoneNumberDropDownList,
  DynamicCallFlowPhoneNumberMasterData, PreviewModalAction
} from "../DynamicCallFlowPhoneNumber.Interfaces";
import {
  FLOW_MASTER_DATA,
  callFlowName,
  callFlowType,
  flowType,
  languageOffer,
  nextActionType,
  tfnRoutingGroup,
  userDestination
} from "utils";

import { RequiredPhoneNumberFormFields } from "../Field/PhoneNumberFieldsConfig";
import { ComponentControl } from "components";
import { GridApiCommunity } from "@mui/x-data-grid/internals";


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
  const flowDropDownList:DynamicCallFlowPhoneNumberDropDownList = fetchData();
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    if(Object.keys(flowDropDownList).includes(item.field)){
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: flowDropDownList[item.field as keyof DynamicCallFlowPhoneNumberDropDownList],
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!flowDropDownList[item.field as keyof DynamicCallFlowPhoneNumberDropDownList].includes(params.value) &&
            RequiredPhoneNumberFormFields.includes(item.field)){
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
    if(["predictiveCaller"].includes(item.field)){
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
          if(!params.value && RequiredPhoneNumberFormFields.includes(item.field)){
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
        if(!params.value && RequiredPhoneNumberFormFields.includes(item.field)){
          return "MuiDataGrid-Custom-Cell-Format";
        }
        return "";
      }
    };
  });
  return updatedColDef;
};

const fetchData = (): DynamicCallFlowPhoneNumberDropDownList =>{
  const masterData: string = localStorage.getItem(FLOW_MASTER_DATA);
  if (masterData === undefined && masterData === null) {
    return;
  }
  const masterDataObject: DynamicCallFlowPhoneNumberMasterData = JSON.parse(masterData);
  const dropDownValue: DynamicCallFlowPhoneNumberDropDownList = {
    brand: masterDataObject.brand,
    channel: masterDataObject.channel,
    languageOffer,
    userDestination,
    callFlowName: callFlowName,
    callFlowRoute: masterDataObject?.callFlowRoute,
    callFlowType: callFlowType,
    callerType: masterDataObject?.callerType,
    dataRequests: masterDataObject?.dataRequests,
    nextActionType: nextActionType,
    tfnRoutingGroup,
    phoneNumberType: flowType
  };
  return dropDownValue;
};

export {
  reconstructTableColumnDef
};
