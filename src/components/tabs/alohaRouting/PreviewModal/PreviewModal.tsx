import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@lmig/lmds-react-modal";
import { Button } from "@mui/material";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { DataGrid } from "@mui/x-data-grid";
import "PreviewModal.css";
import React from "react";
import { TableGridColumnDef } from "./TableGridColumnDef";

interface PreviewModalProps {
  isOpen: boolean;
  rows: Array<CctSharedCallRoutingDb>;
  onClose: () => void;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen,
    onClose,
    rows
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>Delete Multiple Routes</ModalHeader>
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