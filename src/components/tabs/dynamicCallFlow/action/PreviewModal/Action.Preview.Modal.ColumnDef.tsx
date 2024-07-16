import { Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";

export const TableGridColumnDef: GridColDef[] = [
  {
    headerName: "Action ID",
    field: "actionId",
    sortable: true,
    width: 220,
    align: "left"
  },
  {
    headerName: "Action Type",
    field: "actionType",
    sortable: true,
    width: 150,
    align: "left",
  },
  {
    headerName: "Call Flow Name",
    field: "callFlowName",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Next Action",
    field: "nextActionId",
    sortable: true,
    width: 220,
    align: "left"
  },
  {
    headerName: "Next Action Type",
    field: "nextActionType",
    sortable: true,
    width: 150,
    align: "left"
  },
  {
    headerName: "Menu Allow Barge-in",
    field: "allowBargeIn",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Finish on Key",
    field: "finishOnKey",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Max Digits",
    field: "maxDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Min Digits",
    field: "minDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Options",
    field: "options",
    sortable: true,
    width: 330,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.options) || ""} >
        <div>{JSON.stringify(params.row.options) || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Repeat",
    field: "repeat",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.repeat) || ""} >
        <div>{JSON.stringify(params.row.repeat) || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Speech",
    field: "speech",
    sortable: true,
    width: 330,
    align: "left"
  },
  {
    headerName: "Timeout",
    field: "timeout",
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default TableGridColumnDef;
