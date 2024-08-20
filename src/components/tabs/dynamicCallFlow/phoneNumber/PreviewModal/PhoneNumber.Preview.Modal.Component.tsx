import React, {
  useContext, useEffect, useMemo, useRef
} from "react";
import {
  Modal, ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { StyledButton } from "components/StyledButton";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import {
  PhoneNumberModalType,
  PhoneNumberModalTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Interfaces";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  DynamicCallFlowPhoneNumberContext
} from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Container";
import {
  PhoneNumberPreviewModalHandler
} from "components/tabs/dynamicCallFlow/phoneNumber/PreviewModal/PhoneNumber.Preview.Modal.Handler";
import PhoneNumberPreviewModalColumnDef
  from "components/tabs/dynamicCallFlow/phoneNumber/PreviewModal/PhoneNumber.Preview.Modal.ColumnDef";
import {
  reconstructTableColumnDef
} from "components/tabs/dynamicCallFlow/phoneNumber/PreviewModal/PhoneNumber.Preview.Modal.Util";
import { HANDLED_SUCCESSFULLY } from "components/tabs/dynamicCallFlow/common/Preview/Abstract.Preview.Modal.Handler";
import {
  PhoneNumberXlsxImporter
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Importer";
import {
  newDynamicPhoneNumberRecord,
  newLegacyPhoneNumberRecord,
  PhoneNumberRecordUtil
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import { DataGridControllerRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";

interface PreviewModalParameters<RecordType> {
    isOpen: boolean;
    selectedRecords: Array<RecordType>;
    dataGridController: DataGridControllerRef<RecordType>;
    updateSourceRecords: (sourceRecords: Array<RecordType>) => void;
    fieldOptions: FieldOptions;
    modalType: PhoneNumberModalType;
    maxId?: number;
    onClose: () => void;
}
// create handler to process batch jobs concurrently

export const PhoneNumberPreviewModal = ({
  isOpen, selectedRecords, updateSourceRecords, onClose, dataGridController, fieldOptions, modalType, maxId
}: PreviewModalParameters<PhoneNumberRecordType>): JSX.Element => {
  const {
    accessTokenGraph
  } = useContext(DynamicCallFlowPhoneNumberContext);

  const previewModalHandler = useRef(new PhoneNumberPreviewModalHandler(dataGridController));
  const dataGridApi = useGridApiRef();
  const [modalRecords, setModalRecords] = React.useState<PhoneNumberRecordType[]>([]);
  const [htmlInputElements, setHtmlInputElements] = React.useState<Array<HTMLInputElement>>([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(() => {
    return reconstructTableColumnDef(modalType, [...PhoneNumberPreviewModalColumnDef], dataGridApi, fieldOptions);
  },[modalType, dataGridApi, fieldOptions]);

  useEffect(() => {
    if (isOpen) {
      setModalRecords([ ...selectedRecords ]);
    } else {
      setModalRecords([]);
    }
  }, [isOpen]);

  useEffect(()=>{
    if (htmlInputElements.length > 0) {
      setHtmlInputElements(htmlInputElements.map((row: any, index:  number) => ({
        ...row,
        id: maxId+ index+ 1
      })));
    }
  }, [htmlInputElements]);

  const handleOnCreate = async (logicalUpdateOperation = false) => {
    const newRecords: Array<PhoneNumberRecordType> = [...modalRecords].map((row: PhoneNumberRecordType) => {
      const updatedRecord: PhoneNumberRecordType = {};
      Object.keys(row).forEach((key: string) => {
        updatedRecord[key as keyof PhoneNumberRecordType] = dataGridApi.current.getCellValue(PhoneNumberRecordUtil.getPhoneNumber(row), key);
      });
      return updatedRecord;
    });

    if (await previewModalHandler.current.handleOnCreate(accessTokenGraph, newRecords, logicalUpdateOperation) === HANDLED_SUCCESSFULLY) {
      setModalRecords([]);
      updateSourceRecords(newRecords);
      onClose();
    }
  };

  const handleOnUpdate = async () => {
    await handleOnCreate(true);
  };

  const handleOnDelete = async () => {
    if (await previewModalHandler.current.handleOnDelete(accessTokenGraph, modalRecords) === HANDLED_SUCCESSFULLY) {
      // reset this modal dataGrid and close the modal
      setModalRecords([]);
      onClose();
    }
  };

  const createDynamicPhoneNumberRecord = () => {
    setModalRecords([
      ...modalRecords,
      newDynamicPhoneNumberRecord()
    ]);
  };

  const createLegacyPhoneNumberRecord = () => {
    setModalRecords([
      ...modalRecords,
      newLegacyPhoneNumberRecord()
    ]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>)=> {
    const xlsxImporterResults = await PhoneNumberXlsxImporter.getInstance().processXlsxUpload(event);

    if (xlsxImporterResults.errors.length > 0) {
      dataGridController.current.alertBarController.error(xlsxImporterResults.errors.join("\n"));
    } else {
      setModalRecords(xlsxImporterResults.records);
    }
  };

  function getRowId(row: PhoneNumberRecordType) {
    return PhoneNumberRecordUtil.getPhoneNumber(row);
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        takeover={["base", "sm", "md", "lg"]}
        onClose={onClose}
        size="large"
      >
        <ModalHeader>{modalType?.toUpperCase()} Flow - {modalRecords?.length} rows selected</ModalHeader>
        <ModalBody className="preview-grid-modal">
          <Box sx={{
            marginRight: "10px",
            marginBottom: "10px"
          }}>
            <StyledButton sx={{
              marginRight: "10px",
              marginBottom: "10px"
            }}>
              <input type="file" accept=".xlsx" onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleFileUpload(event)} />
            </StyledButton>
            {modalType === PhoneNumberModalTypeEnum.BulkAdd &&
              <StyledButton sx={{
                marginRight: "10px",
                marginBottom: "10px"
              }} onClick={createDynamicPhoneNumberRecord}>Add Dynamic</StyledButton>
            }
            {modalType === PhoneNumberModalTypeEnum.BulkAdd &&
              <StyledButton sx={{
                marginRight: "10px",
                marginBottom: "10px"
              }} onClick={createLegacyPhoneNumberRecord}>Add Legacy</StyledButton>
            }
          </Box>
          <DataGrid
            apiRef={dataGridApi}
            rows={modalRecords || []}
            columns={tableGridColumnDef}
            editMode="row"
            getRowId={getRowId}
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
            {modalType === PhoneNumberModalTypeEnum.BulkDelete &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=> handleOnDelete() }>Delete</StyledButton>
            }
            {modalType === PhoneNumberModalTypeEnum.BulkAdd  &&
            <StyledButton data-test-id="ScpANXily_jfK9JzNGaJf" sx={{ marginRight: "15px" }} onClick={() => handleOnCreate() }>Create</StyledButton>
            }
            {modalType === PhoneNumberModalTypeEnum.BulkEdit  &&
              <StyledButton data-test-id="ScpANXily_jfK9JzNGaJf" sx={{ marginRight: "15px" }} onClick={() => handleOnUpdate() }>Update</StyledButton>
            }
            <StyledButton onClick={onClose}>Cancel</StyledButton>
          </Box>
        </ModalFooter>
      </Modal>
    </div>
  );
};
