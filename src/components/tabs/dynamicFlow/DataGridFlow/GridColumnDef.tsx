import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export const DynamicGridColumnDef: GridColDef[] = [
  {
    align: "left",
    field: "pkey",
    headerName: "pkey",
    sortable: true,
    width: 110
  },
  {
    align: "left",
    field: "skey",
    headerName: "skey",
    sortable: true,
    width: 150
  },
  {
    align: "left",
    field: "data",
    headerName: "other",
    renderCell: () => (
      <Tooltip title={"TBD"} >
        <div className="table-cell-trucate">Replace Tooltip with jsontotable conversion</div>
      </Tooltip>
    ),
    sortable: false,
    width: 500
  }
];

export default DynamicGridColumnDef;
