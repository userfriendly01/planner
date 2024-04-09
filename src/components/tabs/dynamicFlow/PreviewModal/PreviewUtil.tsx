import React from "react";
import {
  GridCellParams, GridColDef
} from "@mui/x-data-grid";

import { flowFields } from "../CustomActions/FlowFieldsConfig";
import { GridApiCommunity } from "@mui/x-data-grid/internals";


const mandatoryField = flowFields.filter(x => x.required).map(x => {
  return x.key;
});

const reconstructTableColumnDef = (columnDef: Array<GridColDef>,apiRef: React.MutableRefObject<GridApiCommunity>): Array<GridColDef> =>{
  return manageEditColumnDef(columnDef,apiRef);
};
const manageEditColumnDef = (columnDef: Array<GridColDef>, apiRef: React.MutableRefObject<GridApiCommunity>): Array<GridColDef> =>{
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{
    return {
      ...item,
      editable: true,
      cellClassName: (params: GridCellParams<any, string>)=> {
        if(!params.value && mandatoryField.includes(item.field)){
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
