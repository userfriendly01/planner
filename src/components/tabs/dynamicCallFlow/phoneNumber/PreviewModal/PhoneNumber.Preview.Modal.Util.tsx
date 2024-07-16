import React from "react";
import {
  GridCellParams, GridColDef
} from "@mui/x-data-grid";

import { ComponentControl } from "components/ComponentControl";
import {
  PhoneNumberModalType,
  PhoneNumberModalTypeEnum
} from "dynamicCallFlowPhoneNumber/DynamicCallFlow.PhoneNumber.Interfaces";
import { ReactGridApi } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";
import { FieldOptions } from "dynamicCallFlowCommon/Form/AbstractFormFieldOptionsManager";
import { RequiredPhoneNumberFormFields } from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.FieldConfigs";
import { OFFICE_NUMBERS, PREDICTIVE_CALLER } from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";


const reconstructTableColumnDef = (modalType: PhoneNumberModalType, columnDef: Array<GridColDef>, previewModalGridApiRef: ReactGridApi, fieldOptions: FieldOptions): Array<GridColDef> =>{
  if (modalType === PhoneNumberModalTypeEnum.BulkAdd || modalType === PhoneNumberModalTypeEnum.BulkEdit)
  {
    return manageEditColumnDef(columnDef, previewModalGridApiRef, fieldOptions);
  }
  else{
    return columnDef;
  }
};

const manageEditColumnDef = (columnDef: Array<GridColDef>, previewModalGridApiRef: ReactGridApi, fieldOptions: FieldOptions): Array<GridColDef> =>{
  const updatedColDef: Array<GridColDef> = columnDef.map((columnDef:GridColDef)=> {
    if (Object.keys(fieldOptions).includes(columnDef.field)) {
      return {
        ...columnDef,
        editable: true,
        type: "singleSelect",
        valueOptions: fieldOptions[columnDef.field as keyof FieldOptions],
        cellClassName: (params: GridCellParams<any, string>)=> {
          if (!fieldOptions[columnDef.field as keyof FieldOptions].includes(params.value) &&
            RequiredPhoneNumberFormFields.includes(columnDef.field)) {
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      };
    }

    if (columnDef.field === OFFICE_NUMBERS) {
      return {
        ...columnDef,
        editable: true,
        renderEditCell: params =>
          <ComponentControl
            control="multiTextField"
            label=""
            name={columnDef.field}
            error={false}
            required={false}
            type="text"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              previewModalGridApiRef.current.setEditCellValue({
                id: params.row.id,
                field: columnDef.field,
                value: event.target.value
              });
            }}
          />
      };
    }

    if ([PREDICTIVE_CALLER].includes(columnDef.field)){
      return {
        ...columnDef,
        editable: true,
        renderEditCell: params =>
          <ComponentControl
            control="switch"
            label=""
            name={columnDef.field}
            error={false}
            required={false}
            type="boolean"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              previewModalGridApiRef.current.setEditCellValue({
                id: params.row.id,
                field: columnDef.field,
                value: event.target.value
              });
            }}
          />,
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!params.value && RequiredPhoneNumberFormFields.includes(columnDef.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }

      };
    }
    return {
      ...columnDef,
      editable: true,
      cellClassName: (params: GridCellParams<any, string>)=> {
        if(!params.value && RequiredPhoneNumberFormFields.includes(columnDef.field)){
          return "MuiDataGrid-Custom-Cell-Format";
        }
        return "";
      }
    };
  });

  return updatedColDef;
};

export {
  reconstructTableColumnDef
};
