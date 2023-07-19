import React from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import { DataGrid } from "@mui/x-data-grid";
import { StyledButton } from "components";
import { CctSharedCallFlowDb } from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";
import "./PreviewModal.css";
import { Box } from "@mui/material";

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
      <ModalHeader>Delete Flow - {rows.length} rows selected</ModalHeader>
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