import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import React, {
  useEffect, useMemo, useState
} from "react";
import {
  Modal, ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import { StyledButton } from "components/StyledButton";
import { CsvReader } from "components/CSVReader/CsvReader";
import { Box } from "@mui/material";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { TableGridColumnDef } from "./TableGridColumnDef";

import { reconstructTableColumnDef } from "./previewUtils";
import "./PreviewModal.css";
import { logger } from "utils/logger";

interface PreviewModalProps {
  action: "delete" | "add" | "edit"
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onDelete?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onUpdate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  rows: Array<CctSharedCallRoutingDb>;
  maxId?: number;
  loading?: boolean;
}

export const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    action,
    isOpen,
    onClose,
    onCreate,
    onDelete,
    onUpdate,
    rows,
    maxId,
    loading
  } = props;
  const apiRef = useGridApiRef();
  const [routingRows, setRoutingRows] = useState<CctSharedCallRoutingDb[]>([]);
  const [uploadedForm , setUploadedForm] = useState([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef], apiRef); },[action]);

  useEffect(()=>{
    if(action === "add"){
      updateRoutingRows(rows);
    }
    else{
      setRoutingRows(rows);
    }
  }, [rows]);

  useEffect(()=>{
    if(action === "add" && uploadedForm.length>0){
      console.log("uploadedForm: ", uploadedForm);
      updateRoutingRows(uploadedForm);
    }
  }, [uploadedForm]);

  const updateRoutingRows = (rows: Array<any>) =>{
    const modifiedRow = rows.map((row: CctSharedCallRoutingDb, index:  number)=>({
      ...row,
      id: row.id || maxId+ index+ 1
    }));
    setRoutingRows(modifiedRow);
  };

  const getUpdatedRoutingDb = () =>{
    const newRows: Array<CctSharedCallRoutingDb>=[...routingRows].map((row: CctSharedCallRoutingDb)=>{
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
      await onDelete(routingRows);
      onClose();
    } catch(error) {
      logger.error("Routing: PreviewModal onDelete failed", { error }, false);
    }
  };

  const createNewRecord = () =>{
    setRoutingRows((previousRows: CctSharedCallRoutingDb[])=>(
      [
        ...previousRows,
        {
          id: previousRows.length>0? previousRows[previousRows.length -1 ].id +1 : maxId+1,
          all: "",
          brand: "",
          pkey: "",
          skey: "",
          callIntent: "",
          callerState: "",
          callerType: "",
          channel: "",
          dayOfWeek: "",
          endTime: "",
          percentOfCallers: "",
          policyType: "",
          startTime: "",
          transferDestination: "",
          transferMessage: "",
          twilioSkill: "",
          crcSkill: "",
          priority: "",
          occupancyCheck: [],
          routingSteps: [],
          alternateTransferDestination: ""
        }
      ]
    ));
  };

  const handleUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) =>{
    CsvReader(event, setUploadedForm);
  };

  const handleOnClose = () =>{
    setRoutingRows([]);
    onClose();
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        takeover={["base", "sm", "md", "lg"]}
        onClose={()=>{ onClose(); }}
        size="large"
      >
        <ModalHeader>{action?.toUpperCase()} Routing - {routingRows.length} rows selected</ModalHeader>
        <ModalBody className="preview-grid-modal">
          <Box sx={{
            marginRight: "10px",
            marginBottom: "10px"
          }}>
            {action === "add" &&
          <StyledButton  onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
            }
            {["add", "edit"].includes(action) &&
          <StyledButton sx={{ marginLeft: "10px" }}>
            <input type="file" onChange={(event:React.ChangeEvent<HTMLInputElement>)=>handleUploadedFile(event)} />
          </StyledButton>
            }
          </Box>
          <DataGrid
            apiRef={apiRef}
            rows={routingRows}
            getRowId={(row: CctSharedCallRoutingDb)=>row.id}
            columns={tableGridColumnDef}
            editMode="row"
            loading={loading}
            isCellEditable={() => action !== "delete"}
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
    </div>
  );
};