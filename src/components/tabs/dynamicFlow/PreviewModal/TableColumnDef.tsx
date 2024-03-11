import { Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
export const TableGridColumnDef: GridColDef[] = [
  {
    headerName: "id",
    field: "pkey",
    sortable: true,
    width: 220,
    align: "left"
  },{
    headerName: "Errors",
    field: "errors",
    sortable: true,
    width: 50,
    align: "left",
    valueGetter: params => `${params.row?.actionType || ""}`,
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.errors || ""} className="validation-error" >
        <div>{params.row.errors?"...":""}</div>
      </Tooltip>
    )
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
    width: 150,
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
    width: 220,
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
    width: 330,
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
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={JSON.stringify(params.row.repeat) || ""} >
        <div>{JSON.stringify(params.row.repeat) || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "speech",
    field: "speech",
    sortable: true,
    width: 330,
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
