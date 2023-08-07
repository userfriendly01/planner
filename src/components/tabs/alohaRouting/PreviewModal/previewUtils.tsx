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

import { ComponentControl } from "components";

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
    if(["occupancyCheck", "routingSteps"].includes(item.field)){
      return {
        ...item,
        editable: true,
        renderCell: params => (
          <ComponentControl
            control="multiField"
            label={item.headerName}
            name={item.field}
            formFields={getFormFields(item.field)}
            error={false}
            required={false}
            type="text"
            value={params.value}
            onChange={()=>{ console.log(); }}
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

const getFormFields = (field: string) =>{
  return {
    "routingSteps": [
      {
        label: "Teams",
        name: "teams",
        type: "multiValueText",
        helperText: "Please use Enter to add team"
      },
      {
        label: "Time",
        name: "time",
        type: "number",
        helperText: "min: 1,  max: 100"
      }
    ],
    "occupancyCheck": [
      {
        label: "Team",
        name: "team",
        type: "text"
      },
      {
        label: "Percentage (%)",
        name: "percentage",
        type: "number",
        helperText: "min: 1,  max: 100"
      }
    ]
  }[field];
};

export {
  reconstructTableColumnDef
};