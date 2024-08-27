import React, {
  ReactElement,
  useContext,
  useEffect, useMemo
} from "react";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import {
  Modal, ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import "components/tabs/dynamicCallFlow/action/PreviewModal/Action.Preview.Modal.css";
import { Box } from "@mui/material";
import TableGridColumnDef from "components/tabs/dynamicCallFlow/action/PreviewModal/Action.Preview.Modal.ColumnDef";
import { reconstructTableColumnDef } from "components/tabs/dynamicCallFlow/action/PreviewModal/Action.Preview.Modal.Util";
import {
  ActionRecordType
} from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import {
  ActionModalType, ActionModalTypeEnum
} from "components/tabs/dynamicCallFlow/action/DataGrid/Action.DataGrid.Component";
import { ActionXlsxImporter } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Importer";
import {
  MutableRefObject
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { DynamicCallFlowActionContext } from "components/tabs/dynamicCallFlow/action/DynamicCallFlow.Action.Container";
import { ActionPreviewModalHandler } from "components/tabs/dynamicCallFlow/action/PreviewModal/Action.Preview.Modal.Handler";
import { StyledButton } from "components/StyledButton";
import { HANDLED_SUCCESSFULLY } from "components/tabs/dynamicCallFlow/common/Preview/Abstract.Preview.Modal.Handler";
import { DataGridControllerRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";

interface PreviewModalParameters<RecordType> {
  isOpen: boolean;
  dataGridController: DataGridControllerRef<RecordType>;
  previewModalHandler: MutableRefObject<ActionPreviewModalHandler>;
  modalType: ActionModalType;
  maxId?: number;
  onClose: () => void;
  loading?: boolean;
}

export const ActionPreviewModal = ({
  isOpen, onClose, dataGridController, previewModalHandler, modalType, maxId, loading
}: PreviewModalParameters<ActionRecordType>): ReactElement => {
  const {
    accessTokenGraph
  } = useContext(DynamicCallFlowActionContext);

  const previewModalGridApiRef =  useGridApiRef();
  const [modalRecords, setModalRecords] = React.useState<ActionRecordType[]>([]);
  const [htmlInputElements, setHtmlInputElements] = React.useState<Array<HTMLInputElement>>([]);

  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef([...TableGridColumnDef], previewModalGridApiRef);
  },[modalType]);

  useEffect(() => {
    setModalRecords([]);
  }, [isOpen]);

  useEffect(()=>{
    if (htmlInputElements.length > 0) {
      setHtmlInputElements(htmlInputElements.map((row: any, index:  number) => ({
        ...row,
        id: maxId+ index+ 1
      })));
    }
  }, [htmlInputElements]);

  const handleOnCreate = async () =>{
    if (await previewModalHandler.current.handleOnCreate(accessTokenGraph, modalRecords) === HANDLED_SUCCESSFULLY) {
      handleOnClose();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>)=> {
    const xlsxImporterResults = await ActionXlsxImporter.getInstance().processXlsxUpload(event);

    if (xlsxImporterResults.errors.length > 0) {
      dataGridController.current.alertBarController.error(xlsxImporterResults.errors.join("\n\r").concat("\n\rPlease check the Call Flow Configuration in the spreadsheet and try again."));
    } else {
      setModalRecords(xlsxImporterResults.records);
    }
  };

  const handleOnClose =()=> {
    onClose();
  };

  function getRowId(row: ActionRecordType) {
    return row.actionId;
  }

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
        }}>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
          /> </StyledButton>
        <DataGrid
          apiRef={previewModalGridApiRef}
          rows={modalRecords}
          columns={tableGridColumnDef}
          getRowId={getRowId}
          loading = {loading}
          isCellEditable = {() => false}
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
          {modalType === ActionModalTypeEnum.BatchCreate &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>handleOnCreate()}>Load Call Flow Config Actions</StyledButton>
          }
          <StyledButton onClick={handleOnClose}>Cancel</StyledButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};
