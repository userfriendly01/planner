import React, { useMemo } from "react";
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
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import "./PreviewModal.css";
import { TableGridColumnDef } from "./TableGridColumnDef";
import { batchDelete } from "services";
import { AlertBarProps } from "utils/interfaces";
import { reconstructTableColumnDef } from "./previewUtils";

interface PreviewModalProps {
  accessToken: string;
  action: "delete" | "add" | "edit"
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onDelete?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onUpdate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  openEditModal: (flag: boolean, isSubmitted?: boolean, rows?: CctSharedCallRoutingDb[], message?: string, deleteRow?: boolean,isCloneRule?: boolean) => void;
  rows: Array<CctSharedCallRoutingDb>;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    accessToken,
    action,
    isOpen,
    onClose,
    onCreate,
    onDelete,
    onUpdate,
    rows
  } = props;
  const apiRef = useGridApiRef();
  const graphQLEndPoint: string = getGraphQLEndpoint();
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef]); },[action]);

  const handleOnDelete = async () => {
    const keysToDelete = rows.map(x => {
      return {
        pkey: x.pkey,
        skey: x.skey
      };
    }
    );
    const response = await batchDelete(keysToDelete, accessToken, graphQLEndPoint);

    if (response && !response.errors) {
      openEditModal(false, true, rows, `${rows.length} Routing Rules deleted!! `, true);
      return true;
    }
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
    </div>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};