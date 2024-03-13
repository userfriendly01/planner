import {
  CsvReader, StyledButton
} from "components";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import {
  DynamicAction,
  MenuOption
} from "../DynamicFlow.Interfaces";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import React, {
  useMemo, useState, useEffect
} from "react";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import  TableGridColumnDef  from "./TableColumnDef";
import { reconstructTableColumnDef } from "./PreviewUtil";

  interface PreviewModalProps {
      isOpen: boolean;
      rows: Array<DynamicAction>;
      action: "add";
      onClose: () => void;
      onCreate?: (rows: Array<DynamicAction>) => void;
      loading?: boolean;
  }

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action , onCreate, loading
  } = props;

  const apiRef =  useGridApiRef();
  const [flowRows, setFlowRows] = useState<DynamicAction[]>([]);
  const [ uploadedForm, setUploadedForm ] = React.useState([]);
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
    const newRows: Array<DynamicAction>=[...flowRows].map((row: DynamicAction)=>{
      const updatedFlow: DynamicAction = {
        id: 0,
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
        options: [] as unknown as [MenuOption]
      };
      Object.keys(row).forEach((key: string)=>{
        updatedFlow[key as keyof DynamicAction] = apiRef.current.getCellValue(row.actionId, key);
      });
      return updatedFlow;
    });
    return newRows;
  };

  const handleOnCreate = () =>{
    const newRows:Array<DynamicAction> = getUpdatedFlowDb();
    onCreate(newRows);
  };

  const createNewRecord = () =>{
    setFlowRows((previousRows: DynamicAction[])=>(
      [
        ...previousRows,
        {
          id: 0,
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
          options: [] as unknown as [MenuOption]
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
        <StyledButton sx={{
          marginRight: "10px",
          marginBottom: "10px"
        }} onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
        <StyledButton sx={{
          marginRight: "10px",
          marginBottom: "10px"
        }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleOnChange}
          /> </StyledButton>
        <DataGrid
          apiRef={apiRef}
          rows={flowRows}
          columns={tableGridColumnDef}
          editMode="row"
          getRowId={(row: DynamicAction)=>row.actionId}
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
