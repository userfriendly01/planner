import React, {
  useContext,
  useEffect, useMemo, useRef
} from "react";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import {
  Modal, ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import "./Action.Preview.Modal.css";
import { Box } from "@mui/material";
import TableGridColumnDef from "./Action.Preview.Modal.ColumnDef";
import { reconstructTableColumnDef } from "./Action.Preview.Modal.Util";
import {
  ActionRecordType, MenuOption
} from "../GraphQL/Action.Interfaces";
import {
  ActionModalType, ActionModalTypeEnum
} from "../DataGrid/Action.DataGrid.Component";
import { ActionXlsxReader } from "../Xlsx/Action.Xlsx.Reader";
import { DataGridControllerRef } from "../../common/DynamicCallFlow.Interfaces";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";
import { ActionPreviewModalHandler } from "./Action.Preview.Modal.Handler";
import { StyledButton } from "components/StyledButton";

interface PreviewModalParameters<RecordType> {
  isOpen: boolean;
  selectedRecords: Array<RecordType>;
  dataGridController: DataGridControllerRef<RecordType>;
  modalType: ActionModalType;
  maxId?: number;
  onClose: () => void;
  loading?: boolean;
}

export const ActionPreviewModal = ({
  isOpen, selectedRecords, onClose, dataGridController, modalType, maxId, loading
}: PreviewModalParameters<ActionRecordType>): JSX.Element => {
  const {
    accessTokenGraph
  } = useContext(DynamicCallFlowActionContext);

  const previewModalHandler = useRef(new ActionPreviewModalHandler(dataGridController));
  const previewModalGridApiRef =  useGridApiRef();
  const [modalRecords, setModalRecords] = React.useState<ActionRecordType[]>([]);
  const [htmlInputElements, setHtmlInputElements] = React.useState<Array<HTMLInputElement>>([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef([...TableGridColumnDef], previewModalGridApiRef);
  },[modalType]);

  useEffect(()=> {
    setModalRecords([...selectedRecords]);
  }, [selectedRecords]);

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
      Object.keys(row).forEach((key: string)=> {
        updatedAction[key as keyof ActionRecordType] = previewModalGridApiRef.current.getCellValue(row.actionId, key);
      });
      return updatedAction;
    });
    return newRows;
  };

  const handleOnCreate = async () =>{
    const recordsToCreate: Array<ActionRecordType> = getUpdatedActionRows();
    await previewModalHandler.current.handleOnCreate(accessTokenGraph, recordsToCreate);
  };

  const handleOnUpdate = async () =>{
    const recordsToUpdate: Array<ActionRecordType> = getUpdatedActionRows();
    await previewModalHandler.current.handleOnUpdate(accessTokenGraph, recordsToUpdate);
  };

  const handleOnDelete = async () => {
    const recordsToDelete: Array<ActionRecordType> = getUpdatedActionRows();
    await previewModalHandler.current.handleOnDelete(accessTokenGraph, recordsToDelete);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>)=> {
    const xlsxReaderResults = await ActionXlsxReader.getInstance().processXlsxFile(event);

    if (xlsxReaderResults.errors.length > 0) {
      dataGridController.current.alertBarController.error(xlsxReaderResults.errors.join("\n"));
    } else {
      setModalRecords(xlsxReaderResults.records);
    }
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
            onChange={handleFileUpload}
          /> </StyledButton>
        <DataGrid
          apiRef={previewModalGridApiRef}
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
          {modalType === ActionModalTypeEnum.BulkDelete &&
              <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnDelete(); }}>Delete</StyledButton>
          }
          {modalType === ActionModalTypeEnum.BulkAdd &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>handleOnCreate()}>Save</StyledButton>
          }
          {modalType === ActionModalTypeEnum.BulkEdit &&
              <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnUpdate(); }}>Update</StyledButton>
          }
          <StyledButton onClick={()=>{ handleOnClose(); }}>Cancel</StyledButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};
