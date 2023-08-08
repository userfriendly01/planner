import React from "react";
import {
  ROUTING_CACHE_MASTER_DATA,
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

const multiFields = routingFields.filter(x => x.control === "multiField").map(x => x.key);

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
        editable: false,
        renderCell: params => (
          <ComponentControl
            control="multiField"
            label=""
            name={item.field}
            formFields={getFormFields(item.field)}
            error={false}
            required={false}
            type="text"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              console.info("onChange", event);
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