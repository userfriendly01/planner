import { GridColDef } from "@mui/x-data-grid";

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
    width: 80,
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
    align: "center"
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
];
