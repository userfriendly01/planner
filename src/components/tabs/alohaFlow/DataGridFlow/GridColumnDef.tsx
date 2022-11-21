import { GridColDef } from "@mui/x-data-grid";

export const FlowGridColumnDef: GridColDef[] = [
  {
    headerName: "Dialed",
    field: "pkey",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Description",
    field: "dialedDescription",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Template",
    field: "callFlowTemplate",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Channel",
    field: "channel",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Brand",
    field: "brand",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Language Offer",
    field: "languageOffer",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params=>`${params.row.content?.languageOffer || ""}`
  },
  {
    headerName: "Data Requests",
    field: "dataRequests",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params=>`${params.row.content?.dataRequests || ""}`
  },
  {
    headerName: "Caller Type",
    field: "callerType",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params=>`${params.row.content?.callerType || ""}`
  },
  {
    headerName: "Transfer#",
    field: "transferNumber",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params=>`${params.row.content?.transferNumber || ""}`
  },
  {
    headerName: "Route",
    field: "callFlowRoute",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params=>`${params.row.content?.callFlowRoute || ""}`
  },
  {
    headerName: "Greeting",
    field: "greetingMessages",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params=>`${params.row.content?.greetingMessages || ""}`
  },
  {
    headerName: "Agent Id",
    field: "agentId",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Employee ID",
    field: "employeeId",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Create Time",
    field: "createTime",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "User Destination",
    field: "userDestination",
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default FlowGridColumnDef;
