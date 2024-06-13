import React from "react";
import {
  GridCellParams, GridColDef
} from "@mui/x-data-grid";

import { RequiredPhoneNumberFormFields } from "../Form/Legacy.PhoneNumber.Form.FieldConfigs";

import {
  PhoneNumberModalType,
  PhoneNumberModalTypeEnum
} from "../DynamicCallFlow.PhoneNumber.Container.Modal.Controller";
import { ComponentControl } from "components/ComponentControl";
import { ReactGridApi } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";


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
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=> {
    if (Object.keys(fieldOptions).includes(item.field)) {
      return {
        ...item,
        editable: true,
        type: "singleSelect",
        valueOptions: fieldOptions[item.field as keyof FieldOptions],
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!fieldOptions[item.field as keyof FieldOptions].includes(params.value) &&
            RequiredPhoneNumberFormFields.includes(item.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      };
    }
    if (item.field === "officeNumbers") {
      return {
        ...item,
        editable: true,
        renderEditCell: params =>
          <ComponentControl
            control="multiTextField"
            label=""
            name={item.field}
            error={false}
            required={false}
            type="text"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              previewModalGridApiRef.current.setEditCellValue({
                id: params.row.id,
                field: item.field,
                value: event.target.value
              });
            }}
          />
      };
    }
    if(["predictiveCaller"].includes(item.field)){
      return {
        ...item,
        editable: true,
        renderEditCell: params =>
          <ComponentControl
            control="switch"
            label=""
            name={item.field}
            error={false}
            required={false}
            type="boolean"
            value={params.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              previewModalGridApiRef.current.setEditCellValue({
                id: params.row.id,
                field: item.field,
                value: event.target.value
              });
            }}
          />,
        cellClassName: (params: GridCellParams<any, string>)=> {
          if(!params.value && RequiredPhoneNumberFormFields.includes(item.field)){
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }

      };
    }
    return {
      ...item,
      editable: true,
      cellClassName: (params: GridCellParams<any, string>)=> {
        if(!params.value && RequiredPhoneNumberFormFields.includes(item.field)){
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
