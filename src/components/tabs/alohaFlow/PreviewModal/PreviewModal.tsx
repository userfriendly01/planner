import React, {
  useMemo
} from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef, useGridApiRef, GridRowEditStopParams, MuiEvent, GridRowEditStopReasons
} from "@mui/x-data-grid";
import { StyledButton } from "components";
import {
  CctSharedCallFlowDb
} from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import { reconstructTableColumnDef } from "./previewUtils";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<CctSharedCallFlowDb>;
    action: "delete" | "add" | "edit"
    onClose: () => void;
    onDelete?: (rows: Array<CctSharedCallFlowDb>) => void;
    onCreate?: (rows: Array<CctSharedCallFlowDb>) => void;
    onUpdate?: (rows: Array<CctSharedCallFlowDb>) => void;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action, onDelete, onCreate, onUpdate
  } = props;

  const apiRef = useGridApiRef();

  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef]); },[action]);

  const getUpdatedFlowDb = () =>{
    const newRows: Array<CctSharedCallFlowDb>=[...rows].map((row: CctSharedCallFlowDb)=>{
      const updatedFlow: CctSharedCallFlowDb = {};
      Object.keys(row).forEach((key: string)=>{
        updatedFlow[key as keyof CctSharedCallFlowDb] = apiRef.current.getCellValue(row.pkey, key);
      });
      return updatedFlow;
    });
    return newRows;
  };

  const handleOnCreate = () =>{
    const newRows:Array<CctSharedCallFlowDb> = getUpdatedFlowDb();
    onCreate(newRows);
  };

  const handleOnUpdate = () =>{
    const newRows:Array<CctSharedCallFlowDb> = getUpdatedFlowDb();
    onUpdate(newRows);
  };


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
          apiRef={apiRef}
          rows={rows}
          columns={tableGridColumnDef}
          editMode="row"
          getRowId={(row: CctSharedCallFlowDb)=>row.pkey}
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
          <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ onDelete(rows); }}>Delete</StyledButton>
          }
          {action === "add" &&
          <StyledButton sx={{ marginRight: "15px" }} onClick={()=>handleOnCreate()}>Save</StyledButton>
          }
          {action === "edit" &&
          <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnUpdate(); }}>Update</StyledButton>
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