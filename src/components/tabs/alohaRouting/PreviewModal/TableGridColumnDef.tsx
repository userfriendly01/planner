import React from "react";
import {
  GridColDef, GridRenderCellParams
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import {
  AddPageFieldConfigProps,
  CctSharedCallRoutingDb, RoutingOccupancyCheck, RoutingStep
} from "../AlohaRouting.Interfaces";
import {
  getTagLabel, MultiFieldContainerFormProps
} from "../../../../components/core/SharedComponents/MultiFieldContainer";
import {
  routingFields
} from "../../../../utils";

const formatDateTime = (dateTime: string) => {
  if(dateTime.includes("AM") || dateTime.includes("PM")){
    const [time, modifier] = dateTime.split(" ");
    const timeSplit: string[] = time.split(":");
    return `${timeSplit[0]}:${timeSplit[1]} ${modifier}`;
  } else {
    return "";
  }
};
const getFormFields = (key: string): Array<MultiFieldContainerFormProps> =>{
  const filteredField: Array<AddPageFieldConfigProps> = routingFields.filter((field: AddPageFieldConfigProps)=>field.key === key);
  return filteredField[0].formFields || [];
};

export const TableGridColumnDef: GridColDef[] = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    width: 60,
    align: "left",
    editable: true
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
    ),
    editable: true
  },
  {
    headerName: "Caller State",
    field: "callerState",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
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
    ),
    editable: true
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
    ),
    editable: true
  },
  {
    headerName: "Channel",
    field: "channel",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Day Of Week",
    field: "dayOfWeek",
    sortable: true,
    align: "left",
    width: 80,
    editable: true
  },
  {
    headerName: "Transfer Dest.",
    field: "transferDestination",
    sortable: true,
    align: "left",
    editable: true
  },
  {
    headerName: "Twilio Skill",
    field: "twilioSkill",
    sortable: true,
    align: "left",
    editable: true
  },
  {
    headerName: "CRC Skill",
    field: "crcSkill",
    sortable: true,
    align: "left",
    editable: true
  },
  {
    headerName: "Pct. Of Callers",
    field: "percentOfCallers",
    sortable: true,
    align: "left",
    editable: true
  },
  {
    headerName: "Policy Type",
    field: "policyType",
    sortable: true,
    align: "left",
    editable: true
  },
  {
    headerName: "Start Time",
    field: "startTime",
    sortable: true,
    align: "left",
    valueGetter: (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (formatDateTime(params.row.startTime)),
    editable: true
  },
  {
    headerName: "End Time",
    field: "endTime",
    sortable: true,
    align: "left",
    valueGetter: (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (formatDateTime(params.row.endTime)),
    editable: true
  },

  {
    headerName: "Transfer Message",
    field: "transferMessage",
    sortable: false,
    minWidth: 200,
    flex: 1,
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.transferMessage || ""} >
        <div>{params.row.transferMessage || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Priority",
    field: "priority",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Occupancy Check",
    field: "occupancyCheck",
    sortable: true,
    minWidth: 300,
    flex: 1,
    align: "left",
    renderCell: (params: any) =>(
      <Grid container  rowSpacing={1}>
        {
          params.row.occupancyCheck?.map((item: RoutingOccupancyCheck)=>(
            <Grid item xs={6} key={`grid-occupancyCheck-${params.row.id}-${item.team}-${item.percentage}`} aria-multiline="true">
              <Chip
                key={`chip-occupancyCheck-${params.row.id}-${item.team}-${item.percentage}`}
                tabIndex={-1}
                label={getTagLabel(item,getFormFields("occupancyCheck"))}
              />
            </Grid>
          ))}
      </Grid>
    ),
    editable: true
  },
  {
    headerName: "Routing Steps",
    field: "routingSteps",
    sortable: false,
    minWidth: 300,
    flex: 1,
    align: "left",
    renderCell: (params: any) =>(
      <div>
        {
          params.row.routingSteps?.map((item: RoutingStep)=>(
            <Chip
              key={`routingSteps-${params.row.id}-${item.teams.join("")}-${item.time}`}
              tabIndex={-1}
              label={getTagLabel(item,getFormFields("routingSteps"))}
            />
          ))}
      </div>
    ),
    editable: true
  }
];

exports.TableGridColumnDef = TableGridColumnDef;