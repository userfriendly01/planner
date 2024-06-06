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
} from "components/core/SharedComponents/MultiFieldContainer";
import {
  routingFields
} from "utils/alohaRoutingUtils";
import ModalOnHover from "components/ModalOnHover";
import { Box } from "@mui/material";
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
  const filteredField: Array<AddPageFieldConfigProps> = routingFields.filter((field: AddPageFieldConfigProps)=>field.key === key);
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
    minWidth: 220,
    flex: 1,
    align: "left",
    renderCell: (params: any) =>(
      params.row.occupancyCheck && params.row.occupancyCheck.length===1?(
        <Chip
          key={`occupancyCheck-${0}`}
          tabIndex={-1}
          label={getTagLabel(params.row.occupancyCheck[0],getFormFields("occupancyCheck"))}
        />
      ):
        params.row.occupancyCheck && params.row.occupancyCheck.length!==0?(
          <ModalOnHover label="...">
            <Box sx={{ padding: "10px" }}>
              {
                params.row.occupancyCheck && params.row.occupancyCheck.map((item: any, index: number)=>(
                  <Chip
                    key={`occupancyCheck-${index}`}
                    tabIndex={-1}
                    label={getTagLabel(item,getFormFields("occupancyCheck"))}
                  />
                ))}
            </Box>
          </ModalOnHover>
        ): ""
    )

  },
  {
    headerName: "Routing Steps",
    field: "routingSteps",
    sortable: false,
    minWidth: 220,
    flex: 1,
    align: "left",
    renderCell: (params: any) =>(
      params.row.routingSteps && params.row.routingSteps.length ===1?(
        <Chip
          key={`routingSteps-${0}`}
          tabIndex={-1}
          label={getTagLabel(params.row.routingSteps[0],getFormFields("routingSteps"))}
        />
      ):
        params.row.routingSteps && params.row.routingSteps.length !==0?(
          <ModalOnHover label="...">
            <Box sx={{ padding: "10px" }}>
              {
                params.row.routingSteps && params.row.routingSteps.map((item: any, index: number)=>(
                  <Chip
                    key={`routingSteps-${index}`}
                    tabIndex={-1}
                    label={getTagLabel(item,getFormFields("routingSteps"))}
                  />
                ))}
            </Box>
          </ModalOnHover>):""
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
  },
  {
    headerName: "TFN Routing Group",
    field: "tfnRoutingGroup",
    sortable: true,
    width: 130,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row?.tfnRoutingGroup || ""} >
        <div>{params.row?.tfnRoutingGroup || ""}</div>
      </Tooltip>
    )
  }
];
