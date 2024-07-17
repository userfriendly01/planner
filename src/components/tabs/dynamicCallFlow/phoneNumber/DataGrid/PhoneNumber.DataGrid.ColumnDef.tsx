import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { Box, Chip, Switch } from "@mui/material";
import ModalOnHover from "components/ModalOnHover";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

export const PhoneNumberDataGridColumnDef: GridColDef[] = [
  {
    headerName: "Dialed",
    field: "pkey",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPkey(params.row as PhoneNumberRecordType)
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
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, LANGUAGE_OFFER) || ""
  },
  {
    headerName: "Data Requests",
    field: "dataRequests",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${PhoneNumberRecordUtil.getPropertyValue(params.row, DATA_REQUESTS) || ""}`
  },
  {
    headerName: "Caller Type",
    field: "callerType",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${PhoneNumberRecordUtil.getPropertyValue(params.row, CALLER_TYPE) || ""}`
  },
  {
    headerName: "Transfer Destination",
    field: "transferDestination",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${params.row.content?.transferDestination || ""}`
  },
  {
    headerName: "Route",
    field: "callFlowRoute",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_FLOW_ROUTE) || ""}`
  },
  {
    headerName: "Greeting",
    field: "greetingMessages",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${PhoneNumberRecordUtil.getPropertyValue(params.row, GREETING_MESSAGES) || ""}`,
    renderCell: (params: any) => (
      <Tooltip title={params.row.content?.greetingMessages || ""} >
        <div className="table-cell-trucate">{params.row.content?.greetingMessages || ""}</div>
      </Tooltip>
    )
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
    headerName: "Phone Number Type",
    field: "phoneNumberType",
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
    headerName: "Call Intent",
    field: "callIntent",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => `${PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_INTENT) || ""}`
  },
  {
    headerName: "Office Numbers",
    field: "officeNumbers",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => params.row.content?.officeNumbers || [],
    renderCell: (params: any) =>(
      params.row.content?.officeNumbers && params.row.content?.officeNumbers.length===1?(
        <Chip
          key={`officeNumbers-${params.row.pkey}-${0}`}
          tabIndex={-1}
          label={params.row.content?.officeNumbers[0]}
        />
      ):
        params.row.content?.officeNumbers && params.row.content?.officeNumbers.length!==0?(
          <ModalOnHover label="...">
            <Box sx={{ padding: "10px" }}>
              {
                params.row.content?.officeNumbers && params.row.content?.officeNumbers.map((item: string, index: number)=>(
                  <Chip
                    key={`officeNumbers-${PhoneNumberRecordUtil.getPkey(params.row)}-${index}`}
                    tabIndex={-1}
                    label={item}
                  />
                ))}
            </Box>
          </ModalOnHover>
        ): ""
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
    sortable: false,
    width: 110,
    align: "center",
    renderCell: (params: any) =>(
      <Box>
        <Switch checked={params.row?.predictiveCaller || false} defaultChecked={false} color="warning" disabled size="medium" />
      </Box>
    )
  },
  {
    headerName: "Call Flow Name",
    field: "callFlowName",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.callFlowName} >
        <div className="table-cell-trucate">{params.row.callFlowName}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Flow Type",
    field: "callFlowType",
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={params.row.callFlowType} >
        <div className="table-cell-trucate">{params.row.callFlowType}</div>
      </Tooltip>
    )
  },{
    headerName: "Next Action ID",
    field: "nextActionId",
    sortable: true,
    width: 110,
    align: "left"
  },{
    headerName: "Next Action Type",
    field: "nextActionType",
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default PhoneNumberDataGridColumnDef;
