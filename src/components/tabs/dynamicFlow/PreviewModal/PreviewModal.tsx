import React, {
  useMemo, useState, useEffect
} from "react";
import {
  CsvReader, StyledButton
} from "components";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import {
  ActionPreview,
  MenuOption
} from "../DynamicFlow.Interfaces";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import  TableGridColumnDef  from "./TableColumnDef";
import { logger } from "utils";
import { reconstructTableColumnDef } from "./PreviewUtil";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<ActionPreview>;
    action: "delete" | "add";
    onClose: () => void;
    onCreate?: (rows: Array<ActionPreview>) => void;
    onDelete?: (rows: Array<ActionPreview>) => void;
    loading?: boolean;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action , onDelete,onCreate, loading
  } = props;

  const apiRef =  useGridApiRef();
  const [flowRows, setFlowRows] = useState<any[]>([]);
  const [ uploadedForm, setUploadedForm ] = React.useState<any>([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef([...TableGridColumnDef], apiRef);
  },[action]);

  useEffect(()=>{
    setFlowRows(rows);
  }, [rows]);

  useEffect(()=>{
    if(uploadedForm.length>0){
      const modifiedRow = uploadedForm.map((row:any, index: number)=>({
        ...row
      }));
      setFlowRows(modifiedRow);
    }
  }, [uploadedForm]);

  const getUpdatedFlowDb = () =>{
    const newRows: Array<ActionPreview>=[...flowRows].map((row: ActionPreview)=>{
      const updatedFlow: ActionPreview = {
        id: 0,
        errors: "",
        actionId: "",
        actionType: "ANNOUNCEMENT",
        callFlowName: "",
        createTime: "",
        updateTime: "",
        speech: "",
        allowBargeIn: true,
        finishOnKey: "",
        minDigits: 0,
        maxDigits: 0,
        timeout: 0,
        repeat: {
          nextActionType: "ANNOUNCEMENT"
        },
        nextActionType: "ANNOUNCEMENT",
        nextActionId: "",
        options: [] as unknown as MenuOption[]
      };
      Object.keys(row).forEach((key: string)=>{
        updatedFlow[key as keyof ActionPreview] = apiRef.current.getCellValue(row.actionId, key);
      });
      return updatedFlow;
    });
    return newRows;
  };

  const handleOnCreate = async () =>{
    const newRows:Array<ActionPreview> = getUpdatedFlowDb();

    try {
      await onCreate(newRows);
    } catch(error) {
      logger.error("Flow: Preview Modal onDelete call failed", { error }, false);
    }
  };
  const handleOnDelete = async () => {
    try {
      await onDelete(flowRows);
    } catch(error) {
      logger.error("Flow: Preview Modal onDelete call failed", { error }, false);
    }
  };
  const createNewRecord = () =>{
    setFlowRows((previousRows: ActionPreview[])=>(
      [
        ...previousRows,
        {
          id: 0,
          errors: "",
          actionId: "",
          actionType: "ANNOUNCEMENT",
          callFlowName: "",
          createTime: "",
          updateTime: "",
          speech: "",
          allowBargeIn: true,
          finishOnKey: "",
          minDigits: 0,
          maxDigits: 0,
          timeout: 0,
          repeat: {
            nextActionType: "ANNOUNCEMENT"
          },
          nextActionType: "ANNOUNCEMENT",
          nextActionId: "",
          options: [] as unknown as MenuOption[]
        }
      ]
    ));
  };

  const handleOnChange=(event:any)=>{
    CsvReader(event, setUploadedForm, "DYNFLOW");
  };

  const handleOnClose =()=>{
    setFlowRows([]);
    onClose();
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
        {action==="delete" &&
        <StyledButton sx={{
          marginRight: "10px",
          marginBottom: "10px"
        }} onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
        }
        {action==="delete" &&
        <StyledButton sx={{
          marginRight: "10px",
          marginBottom: "10px"
        }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleOnChange}
          /> </StyledButton>
        }
        <DataGrid
          apiRef={apiRef}
          rows={flowRows}
          columns={tableGridColumnDef}
          editMode="row"
          getRowId={(row: ActionPreview)=>row.actionId}
          loading = {loading}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgb(255,226,128)"
            },
            "& .MuiDataGrid-Custom-Cell-Format": {
              backgroundColor: "#ff6060"
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
          <StyledButton onClick={()=>{ handleOnClose(); }}>Cancel</StyledButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};
