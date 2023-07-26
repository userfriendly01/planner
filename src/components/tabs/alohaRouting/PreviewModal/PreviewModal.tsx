import {
  CustomToast,
  StyledButton
} from "components";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@lmig/lmds-react-modal";
import {
  getGraphQLEndpoint,
  initializedAlertBar
} from "utils";
import { Box } from "@mui/material";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { DataGrid } from "@mui/x-data-grid";
import "./PreviewModal.css";
import React from "react";
import { TableGridColumnDef } from "./TableGridColumnDef";
import { batchDelete } from "services";
import { AlertBarProps } from "utils/interfaces";
import { useState } from "react";
interface PreviewModalProps {
  isOpen: boolean;
  rows: Array<CctSharedCallRoutingDb>;
  onClose: () => void;
  openEditModal: (flag: boolean, isSubmitted?: boolean, rows?: CctSharedCallRoutingDb[], message?: string, deleteRow?: boolean,isCloneRule?: boolean) => void;
  accessToken: string;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    accessToken,
    isOpen,
    onClose,
    openEditModal,
    rows
  } = props;
  const graphQLEndPoint: string = getGraphQLEndpoint();
  const [alertBar, setAlertBar] = useState(initializedAlertBar);

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: flag
    }));
  };
  const handleOnDelete = async () => {
    const keysToDelete = rows.map(x => {
      return {
        pkey: x.pkey,
        skey: x.skey
      };
    }
    );
    const response = await batchDelete(keysToDelete, accessToken, graphQLEndPoint);

    if (response || !response.errors) {
      openEditModal(false, true, rows, `${rows.length} Routing Rules deleted!! `, true);
      return true;
    }
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: true,
      severityType: "error",
      msg: "Failed to delete Routing rules"
    }));
  };

  return (
    <div>
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
            <StyledButton onClick={()=>{ handleOnDelete(); }} sx={{ marginRight: "15px" }}>Delete</StyledButton>
            <StyledButton onClick={()=>{ onClose(); }}>Cancel</StyledButton>
          </Box>
        </ModalFooter>
      </Modal>
      <CustomToast
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
      />
    </div>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};