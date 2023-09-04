import React, {
  useMemo, useState, useEffect
} from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import { StyledButton } from "components";
import {
  CctSharedCallFlowDb
} from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";
import "./PreviewModal.css";
import {
  Box
} from "@mui/material";
import { reconstructTableColumnDef } from "./PreviewUtil";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<CctSharedCallFlowDb>;
    action: "delete" | "add" | "edit"
    maxId?: number;
    onClose: () => void;
    onDelete?: (rows: Array<CctSharedCallFlowDb>) => void;
    onCreate?: (rows: Array<CctSharedCallFlowDb>) => void;
    onUpdate?: (rows: Array<CctSharedCallFlowDb>) => void;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action,maxId , onDelete, onCreate, onUpdate
  } = props;

  const apiRef = useGridApiRef();
  const [flowRows, setFlowRows] = useState<CctSharedCallFlowDb[]>([]);

  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef]); },[action]);

  useEffect(()=>{
    setFlowRows(rows);
  }, [rows]);

  const getUpdatedFlowDb = () =>{
    const newRows: Array<CctSharedCallFlowDb>=[...flowRows].map((row: CctSharedCallFlowDb)=>{
      const updatedFlow: CctSharedCallFlowDb = {};
      Object.keys(row).forEach((key: string)=>{
        updatedFlow[key as keyof CctSharedCallFlowDb] = apiRef.current.getCellValue(row.id, key);
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

  const handleOnDelete = async () => {
    try {
      await onDelete(flowRows);
    } catch(e) {
      console.error(e.message);
    }
  };

  const createNewRecord = () =>{
    setFlowRows((previousRows: CctSharedCallFlowDb[])=>(
      [
        ...previousRows,
        {
          id: previousRows.length>0? previousRows[previousRows.length -1 ].id +1 : maxId
        }
      ]
    ));
  };


  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>{action?.toUpperCase()} Flow - {flowRows.length} rows selected</ModalHeader>
      <ModalBody className="preview-grid-modal">
        {action === "add" &&
          <StyledButton sx={{ marginRight: "10px" }} onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
        }
        <DataGrid
          apiRef={apiRef}
          rows={flowRows}
          columns={tableGridColumnDef}
          editMode="row"
          getRowId={(row: CctSharedCallFlowDb)=>row.id}
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
  );
};

export {
  PreviewModal,
  PreviewModalProps
};