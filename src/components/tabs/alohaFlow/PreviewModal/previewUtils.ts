import { GridColDef } from "@mui/x-data-grid";
import { PreviewModalAction } from "../AlohaFlow.Interfaces";

const reconstructTableColumnDef = (action: PreviewModalAction, columnDef: Array<GridColDef>): Array<GridColDef> =>{
  if(action==="edit")
  { return manageEditColumnDef(columnDef);
  }
  else{
    return columnDef;
  }
};

const manageEditColumnDef = (columnDef: Array<GridColDef>): Array<GridColDef> =>{
  const updatedColDef: Array<GridColDef> = columnDef.map((item:GridColDef)=>{ return {
    ...item,
    editable: true
  }; });
  return updatedColDef;
};

export {
  reconstructTableColumnDef
};