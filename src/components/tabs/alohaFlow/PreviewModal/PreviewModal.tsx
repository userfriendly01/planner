import React from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CctSharedCallFlowDb } from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";
import "./PreviewModal.css";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<CctSharedCallFlowDb>;
    onClose: () => void;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>Delete Multiple Flow</ModalHeader>
      <ModalBody className="preview-grid-modal">
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
      </ModalBody>
      <ModalFooter>
        <Button variant="contained" color="warning">Delete</Button>
        <Button variant="contained" color="info" onClick={()=>{ onClose(); }}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};