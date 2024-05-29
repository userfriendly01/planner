import React, {
  useMemo, useEffect
} from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import { StyledButton } from "components";
// import { CctSharedCallFlowDb } from "../CallFlowPhoneNumber.Interfaces";
import { PhoneNumberPreviewModalColumnDef } from "./PhoneNumberPreviewModal.ColumnDef";
import "./PhoneNumberPreviewModal.css";
import { Box } from "@mui/material";
import { reconstructTableColumnDef } from "./PhoneNumberPreviewModal.Util";
import { logger } from "utils";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { ObjectArrayState } from "../../common/StateManager/ObjectArray.State";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumberRecord.Util";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<PhoneNumberRecordType>;
    action: "delete" | "add" | "edit";
    maxId?: number;
    onClose: () => void;
    onDelete?: (callFlowRecord: Array<PhoneNumberRecordType>) => void;
    onCreate?: (callFlowRecord: Array<PhoneNumberRecordType>) => void;
    onUpdate?: (callFlowRecord: Array<PhoneNumberRecordType>) => void;
    loading?: boolean;
}

const PhoneNumberPreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action , maxId , onDelete, onCreate, onUpdate, loading
  } = props;

  const apiRef = useGridApiRef();
  const phoneNumberRows = new ObjectArrayState<PhoneNumberRecordType>();
  const htmlInputElements = new ObjectArrayState<HTMLInputElement>();
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(() => {
    return reconstructTableColumnDef(action, [...PhoneNumberPreviewModalColumnDef], apiRef);
  },[action]);

  useEffect(()=> {
    phoneNumberRows.state = rows;
  }, [rows]);

  useEffect(()=>{
    if (htmlInputElements.state.length > 0) {
      htmlInputElements.state = htmlInputElements.state.map((row:any, index:  number)=>({
        ...row,
        id: maxId+ index+ 1
      }));
    }
  }, [htmlInputElements.state]);

  const getUpdatedPhoneNumberRows = () => {
    return phoneNumberRows.state.map((row: PhoneNumberRecordType) => {
      let updatedPhoneNumberRecord: PhoneNumberRecordType = {};

      Object.keys(row).forEach((key: string)=> {
        updatedPhoneNumberRecord = PhoneNumberRecordUtil.setPropertyValue(updatedPhoneNumberRecord, key, apiRef.current.getCellValue(row.id, key));
      });

      return updatedPhoneNumberRecord;
    });
  };

  const handleOnCreate = () =>{
    const newRows:Array<PhoneNumberRecordType> = getUpdatedPhoneNumberRows();
    onCreate(newRows);
  };

  const handleOnUpdate = () =>{
    const newRows: Array<PhoneNumberRecordType> = getUpdatedPhoneNumberRows();
    onUpdate(newRows);
  };

  const handleOnDelete = async () => {
    try {
      await onDelete(phoneNumberRows.state);
    } catch(error) {
      logger.error("Flow: Preview Modal onDelete call failed", { error }, false);
    }
  };
  const createNewRecord = () => {
    phoneNumberRows.state = [{}];
    //TODO: Add new record, should action type be passed in?
    // phoneNumberRows.state =
    //     {
    //       pkey: "",
    //       content: {
    //         callIntent: "",
    //         callFlowRoute: "",
    //         callerType: "",
    //         greetingMessages: "",
    //         transferDestination: "",
    //         languageOffer: "",
    //         dataRequests: [],
    //         officeNumbers: []
    //       },
    //       accountManager: "",
    //       affinityVDN: "",
    //       brand: "",
    //       callDetails1: "",
    //       callDetails2: "",
    //       callFlowTemplate: "",
    //       callTypeDescription: "",
    //       channel: "",
    //       createTime: "",
    //       dialedDescription: "",
    //       employeeId: "",
    //       internetPlacement: "",
    //       lineOfBusiness: "",
    //       marketingChannel: "",
    //       rangeIndicator: "",
    //       requestID: "",
    //       transferCode: "",
    //       phoneNumberType: "",
    //       userDestination: "",
    //       whisper: ""
    //     }
    //   ]
    // ));
  };

  const handleOnChange=(event:any)=>{
    // CsvReader(event, setUploadedForm, "FLOW");
  };

  const handleOnClose =()=>{
    phoneNumberRows.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>{action?.toUpperCase()} Flow - {phoneNumberRows.state.length} rows selected</ModalHeader>
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
          rows={phoneNumberRows.state}
          columns={tableGridColumnDef}
          editMode="row"
          getRowId={(row: PhoneNumberRecordType) => row.id}
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
  PhoneNumberPreviewModal,
  PreviewModalProps
};