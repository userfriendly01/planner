import React, {
  useEffect, useMemo
} from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef
} from "@mui/x-data-grid";
import { StyledButton } from "components";
import {
  CctSharedCallFlowDb, FlowDropDownList, FlowMasterData
} from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import { reconstructTableColumnDef } from "./previewUtils";
import {
  FLOW_MASTER_DATA, flowType, languageOffer, userDestination
} from "utils";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<CctSharedCallFlowDb>;
    action: "delete" | "add" | "edit"
    onClose: () => void;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action
  } = props;

  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef]); },[action]);

  const fetchData = async() =>{
    const masterData: string = localStorage.getItem(FLOW_MASTER_DATA);
    if (masterData === undefined && masterData === null) {
      return;
    }
    const masterDataObject: FlowMasterData = JSON.parse(masterData);
    const dropDownValue: FlowDropDownList = {
      brand: masterDataObject.brand,
      channel: masterDataObject.channel,
      languageOffer: languageOffer,
      userDestination: userDestination,
      callFlowRoute: masterDataObject?.callFlowRoute,
      callerType: masterDataObject?.callerType,
      dataRequests: masterDataObject?.dataRequests,
      type: flowType
    };
  };

  useEffect(()=>{
    fetchData();
  });

  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>{action?.toUpperCase()} Flow - {rows.length} rows selected</ModalHeader>
      <ModalBody className="preview-grid-modal">
        <DataGrid
          rows={rows}
          columns={tableGridColumnDef}
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
          {action==="delete" &&
          <StyledButton sx={{ marginRight: "15px" }}>Delete</StyledButton>
          }
          {action === "add" &&
          <StyledButton sx={{ marginRight: "15px" }}>Save</StyledButton>
          }
          {action === "edit" &&
          <StyledButton sx={{ marginRight: "15px" }}>Update</StyledButton>
          }
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