import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import {
  Chip, Switch
} from "@mui/material";
export const TableGridColumnDef: GridColDef[] = [
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
    renderCell: (params: any) => (
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
    renderCell: (params: any) => (
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
    renderCell: (params: any) => (
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
    valueGetter: params => `${params.row.content?.languageOffer || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        languageOffer: params.value
      }
    })
  },
  {
    headerName: "Data Requests",
    field: "dataRequests",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.dataRequests || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        dataRequests: params.value
      }
    })
  },
  {
    headerName: "Caller Type",
    field: "callerType",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callerType || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        callerType: params.value
      }
    })
  },
  {
    headerName: "Transfer Destination",
    field: "transferNumber",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.transferNumber || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        transferNumber: params.value
      }
    })
  },
  {
    headerName: "Route",
    field: "callFlowRoute",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callFlowRoute || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        callFlowRoute: params.value
      }
    })
  },
  {
    headerName: "Greeting",
    field: "greetingMessages",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.greetingMessages || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        greetingMessages: params.value
      }
    }),
    renderCell: (params: any) => (
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
    headerName: "Type",
    field: "type",
    sortable: true,
    width: 80,
    align: "left"
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
    renderCell: (params: any) => (
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
    renderCell: (params: any) => (
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
    renderCell: (params: any) => (
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
    renderCell: (params: any) => (
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
    headerName: "Toll Free Number",
    field: "tollFreeNumber",
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Call Intent",
    field: "callIntent",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.callIntent || ""}`,
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        callIntent: params.value
      }
    })
  },
  {
    headerName: "Office Numbers",
    field: "officeNumbers",
    sortable: true,
    width: 220,
    align: "left",
    valueGetter: params => params.row.content?.officeNumbers || [],
    valueSetter: params => ({
      ...params.row,
      content: {
        ...params.row.content || {},
        officeNumbers: params.value || []
      }
    }),
    renderCell: (params: any) =>(
      <div>
        {
          params.row.content?.officeNumbers && params.row.content?.officeNumbers.map((item: string, index: number)=>(
            <Chip
              key={`officeNumbers-${params.row.pkey}-${index}`}
              tabIndex={-1}
              label={item}
            />
          ))}
      </div>
    )
  },
  {
    headerName: "TFN Routing Group",
    field: "tfnRoutingGroup",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.tfnRoutingGroup} >
        <div className="table-cell-trucate">{params.row.tfnRoutingGroup}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Predictive Caller",
    field: "predictiveCaller",
    sortable: true,
    width: 110,
    align: "center",
    valueGetter: params => params.row?.predictiveCaller || false,
    renderCell: (params: any) =>(
      <Switch checked={params.row?.predictiveCaller || false} defaultChecked={false} color="warning" disabled size="medium" />)
  }
];

export default TableGridColumnDef;
