import React, {
  useMemo, useState, useEffect
} from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import { StyledButton } from "components/StyledButton";
import { CctSharedCallFlowDb } from "../AlohaFlow.Interfaces";
import { TableGridColumnDef } from "./TableColumnDef";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import { reconstructTableColumnDef } from "./PreviewUtil";
import { logger } from "utils/logger";
import { CsvReader } from "components/CSVReader/CsvReader";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<CctSharedCallFlowDb>;
    action: "delete" | "add" | "edit";
    maxId?: number;
    onClose: () => void;
    onDelete?: (rows: Array<CctSharedCallFlowDb>) => void;
    onCreate?: (rows: Array<CctSharedCallFlowDb>) => void;
    onUpdate?: (rows: Array<CctSharedCallFlowDb>) => void;
    loading?: boolean;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action , maxId , onDelete, onCreate, onUpdate, loading
  } = props;

  const apiRef = useGridApiRef();
  const [flowRows, setFlowRows] = useState<CctSharedCallFlowDb[]>([]);
  const [ uploadedForm, setUploadedForm ] = React.useState([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef], apiRef); },[action]);

  useEffect(()=>{
    setFlowRows(rows);
  }, [rows]);

  useEffect(()=>{
    if(uploadedForm.length>0){
      const modifiedRow = uploadedForm.map((row:any, index:  number)=>({
        ...row,
        id: maxId+ index+ 1
      }));
      setFlowRows(modifiedRow);
    }
  }, [uploadedForm]);

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
    } catch(error) {
      logger.error("Flow: Preview Modal onDelete call failed", { error }, false);
    }
  };
  const createNewRecord = () =>{
    setFlowRows((previousRows: CctSharedCallFlowDb[])=>(
      [
        ...previousRows,
        {
          id: previousRows.length>0? previousRows[previousRows.length -1 ].id +1 : maxId+1,
          pkey: "",
          content: {
            callIntent: "",
            callFlowRoute: "",
            callerType: "",
            greetingMessages: "",
            transferDestination: "",
            languageOffer: "",
            dataRequests: [],
            officeNumbers: []
          },
          accountManager: "",
          affinityVDN: "",
          brand: "",
          callDetails1: "",
          callDetails2: "",
          callFlowTemplate: "",
          callTypeDescription: "",
          channel: "",
          createTime: "",
          dialedDescription: "",
          employeeId: "",
          internetPlacement: "",
          lineOfBusiness: "",
          marketingChannel: "",
          rangeIndicator: "",
          requestID: "",
          transferCode: "",
          phoneNumberType: "",
          userDestination: "",
          whisper: ""
        }
      ]
    ));
  };

  const handleOnChange=(event:any)=>{
    CsvReader(event, setUploadedForm, "FLOW");
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
        {action === "add" &&
              <StyledButton sx={{
                marginRight: "10px",
                marginBottom: "10px"
              }} onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
        }
        {["add", "edit"].includes(action) &&
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
          getRowId={(row: CctSharedCallFlowDb)=>row.id}
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
          {action === "edit" &&
          <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnUpdate(); }}>Update</StyledButton>
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