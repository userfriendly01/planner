import { GridColDef, GridValueSetterParams } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { Chip, Switch } from "@mui/material";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { PhoneNumber, PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  CALL_FLOW_NAME,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE, CALL_FLOW_TYPE, CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  DATA_REQUESTS,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  NEXT_ACTION_ID, NEXT_ACTION_TYPE, OFFICE_NUMBERS,
  PHONE_NUMBER_TYPE, PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID, TFN_ROUTING_GROUP,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  WHISPER
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { FieldDataType } from "dynamicCallFlowCommon/Form/Form.Interfaces";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import {
  ACCOUNT_MANAGER, AFFINITY_VDN, CALL_DETAILS_1, CALL_DETAILS_2,
  TRANSFER_NUMBER,
  TYPE,
  USER_DESTINATION
} from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import { Phone } from "@mui/icons-material";

export const PhoneNumberPreviewModalColumnDef: GridColDef[] = [
  {
    headerName: "Dialed",
    field: "phoneNumber",
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPhoneNumber(params.row as PhoneNumberRecordType),
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>)=> {
      if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(row)) {
        return {
          ...row,
          phoneNumber: value
        } as PhoneNumber;
      } else {
        return {
          ...row,
          pkey: value
        } as CctSharedCallFlowDb;
      }
    }
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
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>)=> {
      PhoneNumberRecordUtil.setPropertyValue(row, CALL_FLOW_TEMPLATE, value);

      if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, CALL_FLOW_NAME, value);
      }
      return { ...row };
    },
    renderCell: (params: any) => (
      <Tooltip title={params.row.callFlowTemplate} >
        <div className="table-cell-truncate">{params.row.callFlowTemplate}</div>
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
    field: LANGUAGE_OFFER,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, LANGUAGE_OFFER) || "",
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setPropertyValue(row, LANGUAGE_OFFER, value);
      return { ...row };
    }
  },
  {
    headerName: "Data Requests",
    field: DATA_REQUESTS,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyArrayValue(params.row, DATA_REQUESTS)?.join() || "",
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setArrayPropertyValue(row, DATA_REQUESTS, value as string);
      return { ...row };
    }
  },
  {
    headerName: "Caller Type",
    field: CALLER_TYPE,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, CALLER_TYPE) || "",
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setPropertyValue(row, CALLER_TYPE, value);
      return { ...row };
    }
  },
  {
    headerName: "Transfer Destination",
    field: TRANSFER_DESTINATION,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, TRANSFER_DESTINATION) || "" :
        PhoneNumberRecordUtil.getPropertyValue(params.row, TRANSFER_NUMBER) || "";
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, TRANSFER_DESTINATION, value);
      } else {
        PhoneNumberRecordUtil.setPropertyValue(row, TRANSFER_NUMBER, value);
      }

      return { ...row };
    }
  },
  {
    headerName: "Route",
    field: CALL_FLOW_ROUTE,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_FLOW_ROUTE) || "",
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setPropertyValue(row, CALL_FLOW_ROUTE, value);
      return { ...row };
    }
  },
  {
    headerName: "Greeting",
    field: GREETING_MESSAGES,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, GREETING_MESSAGES) || "",
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setPropertyValue(row, GREETING_MESSAGES, value);
      return { ...row };
    },
    renderCell: (params: any) => (
      <Tooltip title={params.row.content?.greetingMessages || ""} >
        <div className="table-cell-trucate">{params.row.content?.greetingMessages || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Employee ID",
    field: EMPLOYEE_ID,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, EMPLOYEE_ID) || "" : undefined;
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, EMPLOYEE_ID, value);
      }
      return { ...row };
    }
  },
  {
    headerName: "User Destination",
    field: USER_DESTINATION,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, USER_DESTINATION) || "" : undefined;
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, USER_DESTINATION, value);
      }
      return { ...row };
    }
  },
  {
    headerName: "Phone Number Type",
    field: PHONE_NUMBER_TYPE,
    sortable: true,
    width: 80,
    align: "left",
    valueGetter: params => {
      const key = PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(params.row) ? PHONE_NUMBER_TYPE : TYPE;
      return PhoneNumberRecordUtil.getPropertyValue(params.row, key) || "";
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, PHONE_NUMBER_TYPE, value);
      } else {
        PhoneNumberRecordUtil.setPropertyValue(row, TYPE, value);
      }

      return { ...row };
    }
  },
  {
    headerName: "Account Manager",
    field: ACCOUNT_MANAGER,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, ACCOUNT_MANAGER) || "" : undefined;
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, ACCOUNT_MANAGER, value);
      }
      return { ...row };
    },
    renderCell: (params: any) => (
      <Tooltip title={params.row.accountManager || ""} >
        <div className="table-cell-trucate">{params.row.accountManager || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Affinity VDN",
    field: AFFINITY_VDN,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, AFFINITY_VDN) || "" : undefined;
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, AFFINITY_VDN, value);
      }
      return { ...row };
    },
  },
  {
    headerName: "Transfer Code",
    field: TRANSFER_CODE,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Internet Placement",
    field: INTERNET_PLACEMENT,
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
    field: CALL_DETAILS_1,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_DETAILS_1) || "" : undefined;
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, CALL_DETAILS_1, value);
      }
      return { ...row };
    },
    renderCell: (params: any) => (
      <Tooltip title={params.row.callDetails1 || ""} >
        <div className="table-cell-trucate">{params.row.callDetails1 || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Details2",
    field: CALL_DETAILS_2,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(params.row) ?
        PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_DETAILS_2) || "" : undefined;
    },
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
        PhoneNumberRecordUtil.setPropertyValue(row, CALL_DETAILS_2, value);
      }
      return { ...row };
    },
    renderCell: (params: any) => (
      <Tooltip title={params.row.callDetails2 || ""} >
        <div className="table-cell-trucate">{params.row.callDetails2 || ""}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Type Description",
    field: CALL_TYPE_DESCRIPTION,
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
    field: LINE_OF_BUSINESS,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Marketing Channel",
    field: MARKETING_CHANNEL,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Whisper",
    field: WHISPER,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Request ID",
    field: REQUEST_ID,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Range Indicator",
    field: RANGE_INDICATOR,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Call Intent",
    field: CALL_INTENT,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_INTENT) || "",
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setPropertyValue(row, CALL_INTENT, value);
      return { ...row };
    }
  },
  {
    headerName: "Office Numbers",
    field: OFFICE_NUMBERS,
    sortable: true,
    width: 220,
    align: "left",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, OFFICE_NUMBERS) || [],
    valueSetter: ({ row, value }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>) => {
      PhoneNumberRecordUtil.setPropertyValue(row, OFFICE_NUMBERS, value);
      return { ...row };
    },
    renderCell: params =>(
      <div>
        {
          PhoneNumberRecordUtil.getPropertyValue(params.row, OFFICE_NUMBERS) && PhoneNumberRecordUtil.getPropertyArrayValue(params.row, OFFICE_NUMBERS)?.map((item: string, index: number)=>(
            <Chip
              key={`officeNumbers-${PhoneNumberRecordUtil.getPhoneNumber(params.row)}-${index}`}
              tabIndex={-1}
              label={item}
            />
          ))}
      </div>
    )
  },
  {
    headerName: "TFN Routing Group",
    field: TFN_ROUTING_GROUP,
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={PhoneNumberRecordUtil.getPropertyValue(params.row, TFN_ROUTING_GROUP)} >
        <div className="table-cell-trucate">{PhoneNumberRecordUtil.getPropertyValue(params.row, TFN_ROUTING_GROUP)}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Predictive Caller",
    field: PREDICTIVE_CALLER,
    sortable: true,
    width: 110,
    align: "center",
    valueGetter: params => PhoneNumberRecordUtil.getPropertyValue(params.row, PREDICTIVE_CALLER) || false,
    renderCell: (params: any) =>(
      <Switch checked={PhoneNumberRecordUtil.getPropertyBooleanValue(params.row, PREDICTIVE_CALLER) || false} defaultChecked={false} color="warning" disabled size="medium" />)
  },
  {
    headerName: "Call Flow Name",
    field: CALL_FLOW_NAME,
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_FLOW_NAME)} >
        <div className="table-cell-trucate">{PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_FLOW_NAME)}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Call Flow Type",
    field: CALL_FLOW_TYPE,
    sortable: true,
    width: 110,
    align: "left",
    renderCell: (params: any) => (
      <Tooltip title={PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_FLOW_TYPE)} >
        <div className="table-cell-trucate">{PhoneNumberRecordUtil.getPropertyValue(params.row, CALL_FLOW_TYPE)}</div>
      </Tooltip>
    )
  },
  {
    headerName: "Next Action ID",
    field: NEXT_ACTION_ID,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Next Action Type",
    field: NEXT_ACTION_TYPE,
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default PhoneNumberPreviewModalColumnDef;
