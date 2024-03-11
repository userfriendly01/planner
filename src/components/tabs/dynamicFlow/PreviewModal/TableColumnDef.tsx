import { GridColDef } from "@mui/x-data-grid";
export const TableGridColumnDef: GridColDef[] = [
  {
    headerName: "id",
    field: "pkey",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "skey",
    field: "skey",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "action type",
    field: "actionType",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row?.actionType || ""}`,
    valueSetter: params => ({
      ...params.row,
      actionType: params.value
    })
  },
  {
    headerName: "allow barge-in",
    field: "allowBargeIn",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "call flow name",
    field: "callFlowName",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "finish on key",
    field: "finishOnKey",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "max digits",
    field: "maxDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "min digits",
    field: "minDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "next action",
    field: "nextActionId",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "next action type",
    field: "nextActionType",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "options",
    field: "options",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "repeat",
    field: "repeat",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "speech",
    field: "speech",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "timeout",
    field: "timeout",
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default TableGridColumnDef;
