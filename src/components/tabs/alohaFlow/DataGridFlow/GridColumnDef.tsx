import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
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
    width: 150,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.dialedDescription} >
        <div className="table-cell-trucate">{params.row.dialedDescription}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Template",
    field: "callFlowTemplate",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.callFlowTemplate} >
        <div className="table-cell-trucate">{params.row.callFlowTemplate}</div>
      </Tooltip>
    )
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
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.brand} >
        <div className="table-cell-trucate">{params.row.brand}</div>
      </Tooltip>
    )
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
    valueGetter: params=>`${params.row.content?.greetingMessages || ""}`,
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.content?.greetingMessages || ""} >
        <div className="table-cell-trucate">{params.row.content?.greetingMessages || ""}</div>
      </Tooltip>
    )
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
  },
  {
    headerName: "Account Manager",
    field: "accountManager",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.accountManager || ""} >
        <div className="table-cell-trucate">{params.row.accountManager || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Affinity VDN",
    field: "affinityVDN",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Transfer Code",
    field: "transferCode",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Internet Placement",
    field: "internetPlacement",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.internetPlacement || ""} >
        <div className="table-cell-trucate">{params.row.internetPlacement || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Details1",
    field: "callDetails1",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.callDetails1 || ""} >
        <div className="table-cell-trucate">{params.row.callDetails1 || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Details2",
    field: "callDetails2",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.callDetails2 || ""} >
        <div className="table-cell-trucate">{params.row.callDetails2 || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Type Description",
    field: "callTypeDescription",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) =>  (
      <Tooltip title={params.row.callTypeDescription || ""} >
        <div className="table-cell-trucate">{params.row.callTypeDescription || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Line Of Business",
    field: "lineOfBusiness",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Marketing Channel",
    field: "marketingChannel",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Whisper",
    field: "whisper",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Request ID",
    field: "requestID",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Range Indicator",
    field: "rangeIndicator",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Call Intent",
    field: "callIntent",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Identification Steps",
    field: "identificationSteps",
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default FlowGridColumnDef;
