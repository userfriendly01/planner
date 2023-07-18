import React from "react";
import { Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { RoutingGridColumnDef } from "../DataGridRouting/GridColumnDef";

interface PreviewModalProps {
    open: boolean;
    rows: Array<CctSharedCallRoutingDb>
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    open, rows
  } = props;
  return (
    <Modal
      open={open}
      sx={{
        opacity: 1
      }}
    >
      <DataGrid
        rows={rows}
        columns={RoutingGridColumnDef}
        editMode="row"
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600
          }
        }}
      />
    </Modal>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};