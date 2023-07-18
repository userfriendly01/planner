import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
export const TableGridColumnDef: GridColDef[] = [
  {
    headerName: "Dialed",
    field: "pkey",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Description",
    field: "dialedDescription",
    sortable: true,
    width: 150,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.dialedDescription} >
        <div className="table-cell-trucate">{params.row.dialedDescription}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Template",
    field: "callFlowTemplate",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.callFlowTemplate} >
        <div className="table-cell-trucate">{params.row.callFlowTemplate}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Channel",
    field: "channel",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Brand",
    field: "brand",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.brand} >
        <div className="table-cell-trucate">{params.row.brand}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Language Offer",
    field: "languageOffer",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.languageOffer || ""}`,
    editable: true
  },
  {
    headerName: "Data Requests",
    field: "dataRequests",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.dataRequests || ""}`,
    editable: true
  },
  {
    headerName: "Caller Type",
    field: "callerType",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callerType || ""}`,
    editable: true
  },
  {
    headerName: "Transfer Destination",
    field: "transferNumber",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.transferNumber || ""}`,
    editable: true
  },
  {
    headerName: "Route",
    field: "callFlowRoute",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callFlowRoute || ""}`,
    editable: true
  },
  {
    headerName: "Greeting",
    field: "greetingMessages",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.greetingMessages || ""}`,
    renderCell: (params: any) => (
      <Tooltip title={params.row.content?.greetingMessages || ""} >
        <div className="table-cell-trucate">{params.row.content?.greetingMessages || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Agent Id",
    field: "agentId",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Employee ID",
    field: "employeeId",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Create Time",
    field: "createTime",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "User Destination",
    field: "userDestination",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Type",
    field: "type",
    sortable: true,
    width: 80,
    align: "left",
    editable: true
  },
  {
    headerName: "Account Manager",
    field: "accountManager",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.accountManager || ""} >
        <div className="table-cell-trucate">{params.row.accountManager || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Affinity VDN",
    field: "affinityVDN",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Transfer Code",
    field: "transferCode",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Internet Placement",
    field: "internetPlacement",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.internetPlacement || ""} >
        <div className="table-cell-trucate">{params.row.internetPlacement || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Call Details1",
    field: "callDetails1",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.callDetails1 || ""} >
        <div className="table-cell-trucate">{params.row.callDetails1 || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Call Details2",
    field: "callDetails2",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.callDetails2 || ""} >
        <div className="table-cell-trucate">{params.row.callDetails2 || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Call Type Description",
    field: "callTypeDescription",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.callTypeDescription || ""} >
        <div className="table-cell-trucate">{params.row.callTypeDescription || ""}</div>
      </Tooltip>
    ),
    editable: true
  },
  {
    headerName: "Line Of Business",
    field: "lineOfBusiness",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Marketing Channel",
    field: "marketingChannel",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Whisper",
    field: "whisper",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Request ID",
    field: "requestID",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Range Indicator",
    field: "rangeIndicator",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Toll Free Number",
    field: "tollFreeNumber",
    sortable: true,
    width: 110,
    align: "left",
    editable: true
  },
  {
    headerName: "Call Intent",
    field: "callIntent",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callIntent || ""}`,
    editable: true
  }
];

export default TableGridColumnDef;
