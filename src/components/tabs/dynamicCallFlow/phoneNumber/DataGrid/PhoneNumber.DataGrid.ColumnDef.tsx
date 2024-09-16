import {
  GridColDef, GridRenderCellParams, GridValueGetterParams, GridValueSetterParams
} from "@mui/x-data-grid";
import React from "react";
import {
  Box, Chip, Switch, Tooltip
} from "@mui/material";
import ModalOnHover from "components/ModalOnHover";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  BRAND,
  CALL_FLOW_NAME,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
  CALL_INTENT, CALL_TYPE_DESCRIPTION,
  CALLER_TYPE, CHANNEL,
  DATA_REQUESTS,
  DIALED_DESCRIPTION, EMPLOYEE_ID,
  GREETING_MESSAGES, INTERNET_PLACEMENT,
  LANGUAGE_OFFER, LINE_OF_BUSINESS, MARKETING_CHANNEL,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  OFFICE_NUMBERS, PHONE_NUMBER,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER, RANGE_INDICATOR, REQUEST_ID, TFN_ROUTING_GROUP, TRANSFER_CODE,
  TRANSFER_DESTINATION, WHISPER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN, CALL_DETAILS_1,
  CALL_DETAILS_2,
  TRANSFER_NUMBER,
  TYPE,
  USER_DESTINATION
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";

/**
 * Returns a Tooltop with a title
 * @param { String } title
 * @returns { JSX.Element }
 */
const GridColTooltip = (title: string): JSX.Element => (
  <Tooltip title={title} >
    <div className="table-cell-truncate">{title}</div>
  </Tooltip>
);

export const PhoneNumberDataGridColumnDef: GridColDef[] = [
  {
    headerName: "Dialed",
    field: PHONE_NUMBER,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord),
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, string>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPhoneNumber(phoneNumberRecord, value);
      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Description",
    field: DIALED_DESCRIPTION,
    sortable: true,
    width: 150,
    align: "left",
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(phoneNumberRecord.dialedDescription)
  },
  {
    headerName: "Template",
    field: CALL_FLOW_TEMPLATE,
    sortable: true,
    width: 110,
    align: "left",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType=> {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_FLOW_TEMPLATE, value);
      return { ...phoneNumberRecord };
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(phoneNumberRecord.callFlowTemplate)
  },
  {
    headerName: "Channel",
    field: CHANNEL,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Brand",
    field: BRAND,
    sortable: true,
    width: 110,
    align: "left",
    renderCell: ( { row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(phoneNumberRecord.brand)
  },
  {
    headerName: "Language Offer",
    field: LANGUAGE_OFFER,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, LANGUAGE_OFFER) || "",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, LANGUAGE_OFFER, value);
      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Data Requests",
    field: DATA_REQUESTS,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyArrayValueAsString(phoneNumberRecord, DATA_REQUESTS),
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, string>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setArrayPropertyValue(phoneNumberRecord, DATA_REQUESTS, value);
      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Caller Type",
    field: CALLER_TYPE,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALLER_TYPE) || "",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALLER_TYPE, value);
      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Transfer Destination/Number",
    field: TRANSFER_DESTINATION,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      return PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord) ?
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, TRANSFER_DESTINATION) || "" :
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, TRANSFER_NUMBER) || "";
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord)) {
        PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, TRANSFER_DESTINATION, value);
      } else {
        PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, TRANSFER_NUMBER, value);
      }

      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Route",
    field: CALL_FLOW_ROUTE,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_FLOW_ROUTE) || "",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_FLOW_ROUTE, value);
      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Greeting",
    field: GREETING_MESSAGES,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, GREETING_MESSAGES) || "",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, GREETING_MESSAGES, value);
      return { ...phoneNumberRecord };
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, GREETING_MESSAGES) as string || "")
  },
  {
    headerName: "Employee ID",
    field: EMPLOYEE_ID,
    sortable: true,
    width: 110,
    align: "left"
  },
  {
    headerName: "Phone Number Type",
    field: PHONE_NUMBER_TYPE,
    sortable: true,
    width: 80,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      const key = PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord) ? PHONE_NUMBER_TYPE : TYPE;
      return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key) || "";
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      const key = PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord) ? PHONE_NUMBER_TYPE : TYPE;
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, key, value);

      return { ...phoneNumberRecord };
    }
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
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(phoneNumberRecord.internetPlacement || "")
  },
  {
    headerName: "Call Type Description",
    field: CALL_TYPE_DESCRIPTION,
    sortable: true,
    width: 110,
    align: "left",
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(phoneNumberRecord.callTypeDescription || "")
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
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_INTENT) || "",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_INTENT, value);
      return { ...phoneNumberRecord };
    }
  },
  {
    headerName: "Office Numbers",
    field: OFFICE_NUMBERS,
    sortable: true,
    width: 220,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, OFFICE_NUMBERS) || [],
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, OFFICE_NUMBERS, value);
      return { ...phoneNumberRecord };
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => (
      PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS) && PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS).length===1?(
        <Chip
          key={`officeNumbers-${PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord)}-${0}`}
          tabIndex={-1}
          label={PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS)[0]}
        />
      ):
        PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS) && PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS).length!==0?(
          <ModalOnHover label="...">
            <Box sx={{ padding: "10px" }}>
              {
                PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS) && PhoneNumberRecordUtil.getPropertyArrayValue(phoneNumberRecord, OFFICE_NUMBERS).map((item: string, index: number)=>(
                  <Chip
                    key={`officeNumbers-${PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord)}-${index}`}
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
    field: TFN_ROUTING_GROUP,
    sortable: true,
    width: 110,
    align: "left",
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, TFN_ROUTING_GROUP) as string)
  },
  {
    headerName: "Predictive Caller",
    field: PREDICTIVE_CALLER,
    sortable: true,
    width: 110,
    align: "center",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, PREDICTIVE_CALLER) || false,
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => (
      <Box>
        <Switch checked={PhoneNumberRecordUtil.getPropertyBooleanValue(phoneNumberRecord, PREDICTIVE_CALLER) || false} defaultChecked={false} color="warning" disabled size="medium" />
      </Box>
    )
  },
  { // Dynamic Phone Number Type Only
    headerName: "*Call Flow Name",
    field: CALL_FLOW_NAME,
    sortable: true,
    width: 110,
    align: "left",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_FLOW_NAME, value);
      return { ...phoneNumberRecord };
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_FLOW_NAME) as string)
  },
  { // Dynamic Phone Number Type Only
    headerName: "*Call Flow Type",
    field: CALL_FLOW_TYPE,
    sortable: true,
    width: 110,
    align: "left",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_FLOW_TYPE, value);
      return { ...phoneNumberRecord };
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_FLOW_TYPE) as string)
  },
  { // Dynamic Phone Number Type Only
    headerName: "*Next Action ID",
    field: NEXT_ACTION_ID,
    sortable: true,
    width: 110,
    align: "left",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, NEXT_ACTION_ID, value);
      return { ...phoneNumberRecord };
    }
  },
  { // Dynamic Phone Number Type Only
    headerName: "*Next Action Type",
    field: NEXT_ACTION_TYPE,
    sortable: true,
    width: 110,
    align: "left",
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, NEXT_ACTION_TYPE, value);
      return { ...phoneNumberRecord };
    }
  },
  { // Legacy Phone Number Type Only
    headerName: "**Account Manager",
    field: ACCOUNT_MANAGER,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord) ?
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, ACCOUNT_MANAGER) || "" : undefined;
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
        PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, ACCOUNT_MANAGER, value);
        return { ...phoneNumberRecord };
      }

      return phoneNumberRecord;
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, ACCOUNT_MANAGER) as string || "")
  },
  { // Legacy Phone Number Type Only
    headerName: "**User Destination",
    field: USER_DESTINATION,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord) ?
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, USER_DESTINATION) || "" : undefined;
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
        PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, USER_DESTINATION, value);
      }
      return { ...phoneNumberRecord };
    }
  },
  { // Legacy Phone Number Type Only
    headerName: "**Affinity VDN",
    field: AFFINITY_VDN,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord) ?
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, AFFINITY_VDN) || "" : undefined;
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
        PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, AFFINITY_VDN, value);
        return { ...phoneNumberRecord };
      }

      return phoneNumberRecord;
    }
  },
  { // Legacy Phone Number Type Only
    headerName: "**Call Details1",
    field: CALL_DETAILS_1,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord) ?
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_DETAILS_1) || "" : undefined;
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_DETAILS_1, value);
      return { ...phoneNumberRecord };
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_DETAILS_1) as string || "")
  },
  { // Legacy Phone Number Type Only
    headerName: "**Call Details2",
    field: CALL_DETAILS_2,
    sortable: true,
    width: 110,
    align: "left",
    valueGetter: ({ row: phoneNumberRecord }: GridValueGetterParams<PhoneNumberRecordType, FieldDataType>): FieldDataType => {
      return PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord) ?
        PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_DETAILS_2) || "" : undefined;
    },
    valueSetter: ({
      row: phoneNumberRecord, value
    }: GridValueSetterParams<PhoneNumberRecordType, FieldDataType>): PhoneNumberRecordType => {
      if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
        PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, CALL_DETAILS_2, value);
        return { ...phoneNumberRecord };
      }
      return phoneNumberRecord;
    },
    renderCell: ({ row: phoneNumberRecord }: GridRenderCellParams<PhoneNumberRecordType, FieldDataType>) => GridColTooltip(PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, CALL_DETAILS_2) as string || "")
  }
];

export default PhoneNumberDataGridColumnDef;
