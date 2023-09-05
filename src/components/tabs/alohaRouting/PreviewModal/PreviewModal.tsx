import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@lmig/lmds-react-modal";
import {
  StyledButton
} from "components";
import { Box } from "@mui/material";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { TableGridColumnDef } from "./TableGridColumnDef";

import { reconstructTableColumnDef } from "./previewUtils";
import "./PreviewModal.css";
import { logger } from "utils";

interface PreviewModalProps {
  action: "delete" | "add" | "edit"
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onDelete?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onUpdate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  rows: Array<CctSharedCallRoutingDb>;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    action,
    isOpen,
    onClose,
    onCreate,
    onDelete,
    onUpdate,
    rows
  } = props;
  const apiRef = useGridApiRef();
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef], apiRef); },[action]);

  const getUpdatedRoutingDb = () =>{
    const newRows: Array<CctSharedCallRoutingDb>=[...rows].map((row: CctSharedCallRoutingDb)=>{
      const updated: CctSharedCallRoutingDb = {} as unknown as CctSharedCallRoutingDb;
      Object.keys(row).forEach((key: string)=>{
        updated[key as keyof CctSharedCallRoutingDb] = apiRef.current.getCellValue(row.id, key);
      });
      return updated;
    });
    return newRows;
  };

  const handleOnCreate = () =>{
    const newRows:Array<CctSharedCallRoutingDb> = getUpdatedRoutingDb();
    onCreate(newRows);
  };

  const handleOnUpdate = () =>{
    const newRows:Array<CctSharedCallRoutingDb> = getUpdatedRoutingDb();
    onUpdate(newRows);
  };
  const handleOnDelete = async () => {
    try {
      await onDelete(rows);
      onClose();
    } catch(error) {
      logger.error("PreviewModal.onDelete failed", { error }, false);
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
        <ModalHeader>{action?.toUpperCase()} Routing - {rows.length} rows selected</ModalHeader>
        <ModalBody className="preview-grid-modal">
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            getRowId={(row: CctSharedCallRoutingDb)=>row.id}
            columns={tableGridColumnDef}
            editMode="row"
            isCellEditable={() => action !== "delete"}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgb(255,226,128)"
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
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnDelete(); }}>Delete</StyledButton>
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
    </div>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};