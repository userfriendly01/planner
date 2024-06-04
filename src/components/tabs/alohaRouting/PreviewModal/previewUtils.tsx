import React from "react";
import {
  ROUTING_CACHE_MASTER_DATA,
  dayOfWeek,
  routingFields,
  priority,
  tfnRoutingGroupAttr
} from "utils/routingUtils";
import { languageOffer } from "utils/flowUtils";
import {
  PreviewModalAction,
  RoutingDropDownList,
  RoutingMasterData
} from "../AlohaRouting.Interfaces";
import {
  GridCellParams,
  GridColDef
} from "@mui/x-data-grid";

import { ComponentControl } from "components/ComponentControl";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";
import { GridApiCommunity } from "@mui/x-data-grid/internals";

const reconstructTableColumnDef = (
  action: PreviewModalAction,
  columnDef: Array<GridColDef>,
  apiRef: React.MutableRefObject<GridApiCommunity>
): Array<GridColDef> =>{
  if(action==="edit" || action === "add")
  {
    return manageEditColumnDef(columnDef, apiRef);
  }
  else{
    return columnDef;
  }
};
const formFields: {[key:string]: Array<MultiFieldContainerFormProps>}={};
const multiFields = routingFields.filter(x => x.control === "multiField").map(x => {
  formFields[x.key]=x.formFields;
  return x.key;
});

const mandatoryField = routingFields.filter(x => x.required).map(x => {
  return x.key;
});

const TimeEvaluator = (event: any, keyType: string): string => {
  const timePicked = new Date(event.$d.toString());
  timePicked.setSeconds(0);
  if (keyType === "endTime") {
    timePicked.setSeconds(timePicked.getSeconds() - 1);
  }
  return timePicked.toLocaleString();
};

const manageEditColumnDef = (
  columnDef: Array<GridColDef>,
  apiRef: React.MutableRefObject<GridApiCommunity>
): Array<GridColDef> =>{
  const routingDropDownList:RoutingDropDownList = fetchData();
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    if(Object.keys(routingDropDownList).includes(item.field)){
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: routingDropDownList[item.field as keyof RoutingDropDownList],
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!routingDropDownList[item.field as keyof RoutingDropDownList].includes(params.value) &&
          mandatoryField.includes(item.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      };
    }
    if(multiFields.includes(item.field)){
      return {
        ...item,
        editable: true,
        renderEditCell: params => (
          <ComponentControl
            control="multiField"
            label=""
            name={item.field}
            formFields={formFields[item.field]}
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
        ),
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!params.value && mandatoryField.includes(item.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      };
    }
    if(["startTime", "endTime"].includes(item.field)){
      return {
        ...item,
        editable: true,
        renderEditCell: params => (
          <ComponentControl
            control="timePicker"
            label=""
            name={item.field}
            formFields={formFields[item.field]}
            error={false}
            required={false}
            type="text"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              apiRef.current.setEditCellValue({
                id: params.row.id,
                field: item.field,
                value: TimeEvaluator(event, item.field)
              });
            }}
          />
        ),
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
    priority: priority,
    tfnRoutingGroup: tfnRoutingGroupAttr
  };
  return dropDownValue;
};

export {
  reconstructTableColumnDef,
  formFields
};