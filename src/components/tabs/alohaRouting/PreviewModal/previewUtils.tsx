import React from "react";
import {
  ROUTING_CACHE_MASTER_DATA,
  convertTime24to12,
  dayOfWeek,
  languageOffer,
  routingFields
} from "utils";
import {
  PreviewModalAction,
  RoutingDropDownList,
  RoutingMasterData
} from "../AlohaRouting.Interfaces";
import {
  GridColDef
} from "@mui/x-data-grid";

import { ComponentControl } from "components";
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

const TimeEvaluator = (event: any, keyType: string): string => {
  console.log("Event :", event);
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
        valueOptions: routingDropDownList[item.field as keyof RoutingDropDownList]
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
        )
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
        )
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
  reconstructTableColumnDef,
  formFields
};