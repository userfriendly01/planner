import { GridColDef } from "@mui/x-data-grid";
export const TableGridColumnDef: GridColDef[] = [
  {
    headerName: "id",
    field: "pkey",
    sortable: true,
    width: 110,
    align: "left"
  }
];

export default TableGridColumnDef;
