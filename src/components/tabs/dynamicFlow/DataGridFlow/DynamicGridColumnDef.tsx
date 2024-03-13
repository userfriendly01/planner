import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import {
  Box, Chip, Switch
} from "@mui/material";
import { ModalOnHover } from "components";
export const DynamicFlowGridColumnDef: GridColDef[] = [
  {
    headerName: "actionId",
    field: "actionId",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "action type",
    field: "actionType",
    sortable: true,
    width: 110,
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
    width: 110,
    align: "left"
  },
  {
    headerName: "update time",
    field: "updateTime",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.languageOffer || ""}`
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
  },
  {
    headerName: "finishOnKey",
    field: "finishOnKey",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callFlowRoute || ""}`
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
  }
];

export default DynamicFlowGridColumnDef;
