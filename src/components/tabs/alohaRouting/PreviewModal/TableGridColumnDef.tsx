import React from "react";
import {
  GridColDef, GridRenderCellParams
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import {
  CctSharedCallRoutingDb, RoutingOccupancyCheck, RoutingStep
} from "../AlohaRouting.Interfaces";
import {
  getTagLabel
} from "../../../../components/core/SharedComponents/MultiFieldContainer";
import { formFields } from "./previewUtils";

const formatDateTime = (dateTime: string) => {
  if(dateTime.includes("AM") || dateTime.includes("PM")){
    const dateTimeList: string[] = dateTime.split(" ");
    if(dateTimeList.length === 3){
      const [date, time, modifier] = dateTime.split(" ");
      const timeSplit: string[] = time.split(":");
      return `${timeSplit[0]}:${timeSplit[1]}:${timeSplit[2] || "00"} ${modifier}`;
    }
    const [time, modifier] = dateTime.split(" ");
    const timeSplit: string[] = time.split(":");
    return `${timeSplit[0]}:${timeSplit[1]}:${timeSplit[2] || "00"} ${modifier}`;
  } else {
    return "";
  }
};

export const TableGridColumnDef: GridColDef[] = [
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
    valueGetter: (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (params.row.endTime && formatDateTime(params.row.endTime))
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
                label={getTagLabel(item,formFields["occupancyCheck"])}
              />
            </Grid>
          ))}
      </Grid>
    )
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
              label={getTagLabel(item,formFields["routingSteps"])}
            />
          ))}
      </div>
    )
  },
  {
    headerName: "Alternate Transfer Destination",
    field: "alternateTransferDestination",
    sortable: false,
    minWidth: 100,
    flex: 1,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.alternateTransferDestination || ""} >
        <div>{params.row?.alternateTransferDestination || ""}</div>
      </Tooltip>
    )
  }
];
