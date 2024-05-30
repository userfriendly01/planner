import React, {
  useMemo, useEffect
} from "react";
import {
  CsvReader, StyledButton
} from "components";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import  TableGridColumnDef  from "./TableColumnDef";
import { logger } from "utils";
import { reconstructTableColumnDef } from "./PreviewUtil";
import {
  ActionRecordType, ActionTypeEnum,
  MenuOption
} from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import { ObjectArrayState } from "../../common/StateManager/ObjectArray.State";

import {PreviewModalActionType} from "../../common/Preview/Preview.Interface";

interface PreviewModalProps {
    isOpen: boolean;
    rows: Array<ActionRecordType>;
    action: PreviewModalActionType;
    onClose: () => void;
    onCreate?: (actionRecords: Array<ActionRecordType>) => void;
    loading?: boolean;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    isOpen, rows, onClose, action , onCreate, loading
  } = props;

  const apiRef =  useGridApiRef();
  const actionRows = new ObjectArrayState<ActionRecordType>();
  const [ uploadedForm, setUploadedForm ] = React.useState<any>([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef([...TableGridColumnDef], apiRef);
  },[action]);

  useEffect(()=>{
    actionRows.state = rows;
  }, [rows]);

  useEffect(()=> {
    //TODO: Update with XlsxReader upload
    if (uploadedForm.length>0) {
      // const modifiedRow = htmlInputElements.state.map((row:ActionRecordType, index: number) => ({
      //   ...row
      // }));
      // actionRows.state = htmlInputElements.state;
      // setFlowRows(modifiedRow);
    }
  }, [uploadedForm]);

  const getUpdatedActionRows = () => {
    const newRows: Array<ActionRecordType> = [...actionRows.state].map((row: ActionRecordType) => {
      const updatedAction: ActionRecordType = {
        id: 0,
        actionId: "",
        actionType: undefined,
        callFlowName: "",
        createTime: 0,
        updateTime: 0,
        speech: "",
        allowBargeIn: true,
        finishOnKey: "",
        minDigits: 0,
        maxDigits: 0,
        timeout: 0,
        repeat: {
          nextActionType: undefined
        },
        nextActionType: undefined,
        nextActionId: "",
        options: [] as unknown as MenuOption[]
      };
      Object.keys(row).forEach((key: string)=>{
        updatedAction[key as keyof ActionRecordType] = apiRef.current.getCellValue(row.actionId, key);
      });
      return updatedAction;
    });
    return newRows;
  };

  const handleOnCreate = async () =>{
    const newRows:Array<ActionRecordType> = getUpdatedActionRows();

    try {
      await onCreate(newRows);
    } catch(error) {
      logger.error("Flow: Preview Modal onDelete call failed", { error }, false);
    }
  };

  const createNewRecord = () => {
    actionRows.state =
      [
        {
          id: 0,
          actionId: "",
          actionType: undefined,
          callFlowName: "",
          createTime: undefined,
          updateTime: undefined,
          speech: "",
          allowBargeIn: true,
          finishOnKey: "",
          minDigits: 0,
          maxDigits: 0,
          timeout: 0,
          repeat: {
            nextActionType: ActionTypeEnum.ANNOUNCEMENT
          },
          nextActionType: ActionTypeEnum.ANNOUNCEMENT,
          nextActionId: "",
          options: []
        }
      ];
  };

  const handleOnChange=(event:any)=>{
    CsvReader(event, setUploadedForm, "DYNFLOW");
  };

  const handleOnClose =()=>{
    actionRows.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>{action?.toUpperCase()} Flow - {actionRows.state.length} rows selected</ModalHeader>
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
          rows={actionRows.state}
          columns={tableGridColumnDef}
          editMode="row"
          getRowId={(row: ActionRecordType)=>row.actionId}
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
