import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@lmig/lmds-react-modal";
import { Box } from "@mui/material";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { DataGrid } from "@mui/x-data-grid";
import "./PreviewModal.css";
import React from "react";
import { StyledButton } from "components";
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
      <ModalHeader>Delete Routes - {rows.length} rows selected</ModalHeader>
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
        <Box sx={{
          display: "flex",
          justifyContent: "center"
        }}>
          <StyledButton sx={{ marginRight: "15px" }}>Delete</StyledButton>
          <StyledButton onClick={()=>{ onClose(); }}>Cancel</StyledButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};