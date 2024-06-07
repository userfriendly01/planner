import React, {
  useEffect, useMemo
} from "react";
import { StyledButton } from "components";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import {
  Modal, ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import "./PreviewModal.css";
import { Box } from "@mui/material";
import TableGridColumnDef from "./TableColumnDef";
import { logger } from "utils";
import { reconstructTableColumnDef } from "./PreviewUtil";
import {
  ActionRecordType, MenuOption
} from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import {
  ActionModalType, ActionModalTypeEnum
} from "../DataGrid/Action.DataGrid.Component";

interface PreviewModalProps<RecordType> {
  isOpen: boolean;
  records: Array<RecordType>;
  modalType: ActionModalType;
  maxId?: number;
  onClose: () => void;
  onDelete?: (record: Array<RecordType>) => void;
  onCreate?: (record: Array<RecordType>) => void;
  onUpdate?: (record: Array<RecordType>) => void;
  loading?: boolean;
}

const ActionPreviewModal = (props: PreviewModalProps<ActionRecordType>): JSX.Element => {
  const {
    isOpen, records, onClose, modalType , maxId , onDelete, onCreate, onUpdate, loading
  } = props;

  const apiRef =  useGridApiRef();
  const [modalRecords, setModalRecords] = React.useState<ActionRecordType[]>([]);
  const [htmlInputElements, setHtmlInputElements] = React.useState<Array<HTMLInputElement>>([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef([...TableGridColumnDef], apiRef);
  },[modalType]);

  useEffect(()=> {
    setModalRecords(records);
  }, [records]);

  useEffect(()=>{
    if (htmlInputElements.length > 0) {
      setHtmlInputElements(htmlInputElements.map((row: any, index:  number) => ({
        ...row,
        id: maxId+ index+ 1
      })));
    }
  }, [htmlInputElements]);

  const getUpdatedActionRows = () => {
    const newRows: Array<ActionRecordType> = [...modalRecords].map((row: ActionRecordType) => {
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
    // setModalRecords([...modalRecords,
    //   {
    //     id: 0,
    //     actionId: "",
    //     actionType: undefined,
    //     callFlowName: "",
    //     createTime: undefined,
    //     updateTime: undefined,
    //     speech: "",
    //     allowBargeIn: true,
    //     finishOnKey: "",
    //     minDigits: 0,
    //     maxDigits: 0,
    //     timeout: 0,
    //     repeat: {
    //       nextActionType: ActionTypeEnum.ANNOUNCEMENT
    //     },
    //     nextActionType: ActionTypeEnum.ANNOUNCEMENT,
    //     nextActionId: "",
    //     options: []
    //   }
    // ]);
  };

  const handleOnChange=(event:any)=>{
    // CsvReader(event, setUploadedForm, "DYNFLOW");
  };

  const handleOnClose =()=> {
    setModalRecords([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      takeover={["base", "sm", "md", "lg"]}
      onClose={()=>{ onClose(); }}
      size="large"
    >
      <ModalHeader>{modalType?.toUpperCase()} Flow - {modalRecords?.length} rows selected</ModalHeader>
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
          rows={modalRecords}
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
          {modalType === ActionModalTypeEnum.BulkAdd &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>handleOnCreate()}>Save</StyledButton>
          }
          <StyledButton onClick={()=>{ handleOnClose(); }}>Cancel</StyledButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export {
  ActionPreviewModal,
  PreviewModalProps
};
