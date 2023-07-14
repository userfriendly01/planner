import React from "react";
import { Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CctSharedCallFlowDb } from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";

interface PreviewModalProps {
    open: boolean;
    rows: Array<CctSharedCallFlowDb>
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
        columns={TableGridColumnDef}
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