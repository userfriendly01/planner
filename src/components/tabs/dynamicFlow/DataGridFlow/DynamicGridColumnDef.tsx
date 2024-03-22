import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export const DynamicFlowGridColumnDef: GridColDef[] = [
  {
    headerName: "actionId",
    field: "actionId",
    sortable: true,
    width: 300,
    align: "left"
  },
  {
    headerName: "action type",
    field: "actionType",
    sortable: true,
    width: 150,
    align: "left"
  },
  {
    headerName: "callFlowName",
    field: "callFlowName",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "createTime",
    field: "createTime",
    sortable: true,
    width: 220,
    align: "left",
    valueGetter: params => `${new Date(params?.row?.createTime).toISOString() || ""}`
  },
  {
    headerName: "update time",
    field: "updateTime",
    sortable: true,
    width: 220,
    align: "left",
    valueGetter: params => `${new Date(params?.row?.updateTime).toISOString() || ""}`
  },
  {
    headerName: "speech",
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
    headerName: "timeout",
    field: "timeout",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "finishOnKey",
    field: "finishOnKey",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "minDigits",
    field: "minDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "maxDigits",
    field: "maxDigits",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "next action id",
    field: "nextActionId",
    sortable: true,
    width: 300,
    align: "left"
  },
  {
    headerName: "next action type",
    field: "nextActionType",
    sortable: true,
    width: 150,
    align: "left"
  },
  {
    headerName: "options",
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
    headerName: "repeat",
    field: "repeat",
    sortable: true,
    width: 300,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.repeat) || ""} >
        <div>{JSON.stringify(params.row.repeat) || ""}</div>
      </Tooltip>
    )
  }
];

export default DynamicFlowGridColumnDef;
