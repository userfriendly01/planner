import React from "react";
import {
  GridColDef, GridRenderCellParams
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import {
  AddPageFieldConfigProps,
  CctSharedCallRoutingDb, RoutingOccupancyCheck, RoutingStep
} from "../AlohaRouting.Interfaces";
import {
  getTagLabel, MultiFieldContainerFormProps
} from "components/core/SharedComponents/MultiFieldContainer";
import {
  routingFields
} from "utils";
const formatDateTime = (dateTime: string) => {
  if(dateTime.includes("AM") || dateTime.includes("PM")){
    const [time, modifier] = dateTime.split(" ");
    const timeSplit: string[] = time.split(":");
    return `${timeSplit[0]}:${timeSplit[1]} ${modifier}`;
  }
  else{
    return "";
  }

};

const getFormFields = (key: string): Array<MultiFieldContainerFormProps> =>{
  console.log("Key, routingFields", key, routingFields);
  const filteredField: Array<AddPageFieldConfigProps> = routingFields.filter((field: AddPageFieldConfigProps)=>field.key === key);
  console.log("Filtered field", filteredField);
  return filteredField[0].formFields;
};

export const RoutingGridColumnDef: GridColDef[] = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    width: 60,
    align: "left"
  },
  {
    headerName: "Brand",
    field: "brand",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.brand || ""} >
        <div>{params.row.brand || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Caller State",
    field: "callerState",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Caller Type",
    field: "callerType",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.callerType || ""} >
        <div>{params.row.callerType || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Caller Intent",
    field: "callIntent",
    sortable: true,
    width: 130,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.callIntent || ""} >
        <div>{params.row.callIntent || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Channel",
    field: "channel",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Day Of Week",
    field: "dayOfWeek",
    sortable: true,
    align: "left",
    width: 80
  },
  {
    headerName: "Transfer Dest.",
    field: "transferDestination",
    sortable: true,
    align: "left"
  },
  {
    headerName: "Twilio Skill",
    field: "twilioSkill",
    sortable: true,
    align: "left"
  },
  {
    headerName: "CRC Skill",
    field: "crcSkill",
    sortable: true,
    align: "left"
  },
  {
    headerName: "Pct. Of Callers",
    field: "percentOfCallers",
    sortable: true,
    align: "left"
  },
  {
    headerName: "Policy Type",
    field: "policyType",
    sortable: true,
    align: "left"
  },
  {
    headerName: "Start Time",
    field: "startTime",
    sortable: true,
    align: "left",
    valueGetter: (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (formatDateTime(params.row.startTime))
  },
  {
    headerName: "End Time",
    field: "endTime",
    sortable: true,
    align: "left",
    valueGetter: (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (formatDateTime(params.row.endTime))
  },

  {
    headerName: "Transfer Message",
    field: "transferMessage",
    sortable: false,
    width: 110,
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.transferMessage || ""} >
        <div>{params.row.transferMessage || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Priority",
    field: "priority",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Occupancy Check",
    field: "occupancyCheck",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>(
      <div>
        {
          params.row.occupancyCheck && params.row.occupancyCheck.map((item: RoutingOccupancyCheck, index: number)=>(
            <Chip
              key={`occupancyCheck-${params.row.id}-${index}`}
              tabIndex={-1}
              label={getTagLabel(item,getFormFields("occupancyCheck"))}
            />
          ))}
      </div>
    )
  },
  {
    headerName: "Routing Steps",
    field: "routingSteps",
    sortable: false,
    width: 110,
    align: "left",
    renderCell: (params: any) =>(
      <div>
        {
          params.row.routingSteps && params.row.routingSteps.map((item: RoutingStep, index: number)=>(
            <Chip
              key={`routingSteps-${params.row.id}-${index}`}
              tabIndex={-1}
              label={getTagLabel(item,getFormFields("routingSteps"))}
            />
          ))}
      </div>
    )
  }
];
