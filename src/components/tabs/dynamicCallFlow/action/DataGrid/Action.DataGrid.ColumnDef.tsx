import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export const ActionDataGridColumnDef: Array<GridColDef> = [
  {
    headerName: "",
    field: "",
    sortable: true,
    width: 50,
    align: "left"
  },
  {
    headerName: "Action Id",
    field: "actionId",
    sortable: true,
    width: 300,
    align: "left"
  },
  {
    headerName: "Action Type",
    field: "actionType",
    sortable: true,
    width: 150,
    align: "left"
  },
  {
    headerName: "Call Flow Name",
    field: "callFlowName",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Next Action Id",
    field: "nextActionId",
    sortable: true,
    width: 300,
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
    headerName: "Speech",
    field: "speech",
    sortable: true,
    width: 300,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.speech || ""} >
        <div>{params.row.speech || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Menu Timeout",
    field: "timeout",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Finish On Key",
    field: "finishOnKey",
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
    headerName: "Menu Max Digits",
    field: "maxDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Options",
    field: "options",
    sortable: true,
    width: 300,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.options) || ""} >
        <div>{JSON.stringify(params.row.options) || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Menu Repeat",
    field: "repeat",
    sortable: true,
    width: 300,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.repeat) || ""} >
        <div>{JSON.stringify(params.row.repeat) || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Redirect URL",
    field: "url",
    sortable: true,
    width: 300,
    align: "left"
  }
];
Object.freeze(ActionDataGridColumnDef);

export default ActionDataGridColumnDef;
