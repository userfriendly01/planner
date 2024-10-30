import {
  ACTION_ID,
  ACTION_TYPE,
  CALL_FLOW_NAME,
  CAPTURE_TIMEOUT,
  ENDPOINT,
  FINISH_ON_KEY,
  MAX_DIGITS,
  MIN_DIGITS,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  OPTIONS,
  OUTCOMES,
  PARAMETER,
  REPEAT,
  SPEECH,
  TIMEOUT,
  VALID_LENGTHS
} from "dynamicCallFlowAction/Form/ActionFields";

import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import Tooltip from "@mui/material/Tooltip";

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
    field: ACTION_ID,
    sortable: true,
    width: 300,
    align: "left"
  },
  {
    headerName: "Action Type",
    field: ACTION_TYPE,
    sortable: true,
    width: 150,
    align: "left"
  },
  {
    headerName: "Call Flow Name",
    field: CALL_FLOW_NAME,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Next Action Id",
    field: NEXT_ACTION_ID,
    sortable: true,
    width: 300,
    align: "left"
  },
  {
    headerName: "Next Action Type",
    field: NEXT_ACTION_TYPE,
    sortable: true,
    width: 150,
    align: "left"
  },
  {
    headerName: "Speech",
    field: SPEECH,
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
    field: TIMEOUT,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Finish On Key",
    field: FINISH_ON_KEY,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Min Digits",
    field: MIN_DIGITS,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Menu Max Digits",
    field: MAX_DIGITS,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Capture Endpoint",
    field: ENDPOINT,
    sortable: true,
    width: 220,
    align: "left"
  },
  {
    headerName: "Capture Parameter",
    field: PARAMETER,
    sortable: true,
    width: 170,
    align: "left"
  },
  {
    headerName: "Capture Valid Lengths",
    field: VALID_LENGTHS,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Capture Timeout",
    field: CAPTURE_TIMEOUT,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Capture Outcomes",
    field: OUTCOMES,
    sortable: true,
    width: 300,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.outcomes) || ""} >
        <div>{JSON.stringify(params.row.outcomes) || ""}</div>
      </Tooltip>
    )
  },
  
  {
    headerName: "Menu Options",
    field: OPTIONS,
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
    field: REPEAT,
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
