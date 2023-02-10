import {
  GridColDef, GridRenderCellParams
} from "@mui/x-data-grid";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";

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

export const RoutingGridColumnDef: GridColDef[] = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    width: 60,
    align: "center"
  },
  {
    headerName: "Brand",
    field: "brand",
    sortable: true,
    width: 80,
    align: "center"
  },
  {
    headerName: "Caller State",
    field: "callerState",
    sortable: true,
    width: 110,
    align: "center"
  },
  {
    headerName: "Caller Type",
    field: "callerType",
    sortable: true,
    width: 110,
    align: "center"
  },
  {
    headerName: "Caller Intent",
    field: "callIntent",
    sortable: true,
    width: 110,
    align: "center"
  },
  {
    headerName: "Channel",
    field: "channel",
    sortable: true,
    width: 110,
    align: "center"
  },
  {
    headerName: "Day Of Week",
    field: "dayOfWeek",
    sortable: true,
    align: "center",
    width: 80
  },
  {
    headerName: "Transfer Dest.",
    field: "transferDestination",
    sortable: true,
    align: "center"
  },
  {
    headerName: "Twilio Skill",
    field: "twilioSkill",
    sortable: true,
    align: "center"
  },
  {
    headerName: "CRC Skill",
    field: "crcSkill",
    sortable: true,
    align: "center"
  },
  {
    headerName: "Pct. Of Callers",
    field: "percentOfCallers",
    sortable: true,
    align: "center"
  },
  {
    headerName: "Policy Type",
    field: "policyType",
    sortable: true,
    align: "center"
  },
  {
    headerName: "Start Time",
    field: "startTime",
    sortable: true,
    align: "center",
    valueGetter: (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (formatDateTime(params.row.startTime))
  },
  {
    headerName: "End Time",
    field: "endTime",
    sortable: true,
    align: "center"
  },

  {
    headerName: "Transfer Message",
    field: "transferMessage",
    sortable: false,
    width: 110
  },
  {
    headerName: "Priority",
    field: "priority",
    sortable: true,
    width: 110,
    align: "center"
  },
  {
    headerName: "Occupancy Check",
    field: "occupancyCheck",
    sortable: true,
    width: 110,
    align: "center"
  },
  {
    headerName: "Routing Steps",
    field: "routingSteps",
    sortable: false,
    width: 110,
    align: "center"
  }
];
