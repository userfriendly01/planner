import React, {
  useMemo, useEffect, useContext, useRef
} from "react";
import {
  Modal,ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import { PhoneNumberPreviewModalColumnDef } from "./PhoneNumber.Preview.Modal.ColumnDef";
import "./PhoneNumber.Preview.Modal.css";
import { Box } from "@mui/material";
import { reconstructTableColumnDef } from "./PhoneNumber.Preview.Modal.Util";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";

import {
  PhoneNumberModalType,
  PhoneNumberModalTypeEnum
} from "../DynamicCallFlow.PhoneNumber.Container.Modal.Controller";
import { DynamicCallFlowPhoneNumberContext } from "../DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberPreviewModalHandler } from "./PhoneNumber.Preview.Modal.Handler";
import { DataGridControllerRef } from "../../common/DynamicCallFlow.Interfaces";
import { PhoneNumberXlsxReader } from "../Xlsx/PhoneNumber.Xlsx.Reader";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import { StyledButton } from "components/StyledButton";

interface PreviewModalParameters<RecordType> {
    isOpen: boolean;
    selectedRecords: Array<RecordType>;
    dataGridController: DataGridControllerRef<RecordType>;
    fieldOptions: FieldOptions;
    modalType: PhoneNumberModalType;
    maxId?: number;
    onClose: () => void;
    loading?: boolean;
}
// create handler to process batch jobs concurrently

export const PhoneNumberPreviewModal = ({
  isOpen, selectedRecords, onClose, dataGridController, fieldOptions, modalType, maxId, loading
}: PreviewModalParameters<PhoneNumberRecordType>): JSX.Element => {
  const {
    accessTokenGraph
  } = useContext(DynamicCallFlowPhoneNumberContext);

  const previewModalHandler = useRef(new PhoneNumberPreviewModalHandler(dataGridController));
  const previewModalGridApiRef = useGridApiRef();
  const [modalRecords, setModalRecords] = React.useState<PhoneNumberRecordType[]>([]);
  const [htmlInputElements, setHtmlInputElements] = React.useState<Array<HTMLInputElement>>([]);
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(() => {
    return reconstructTableColumnDef(modalType, [...PhoneNumberPreviewModalColumnDef], previewModalGridApiRef, fieldOptions);
  },[modalType]);

  useEffect(()=> {
    setModalRecords([ ...selectedRecords ]);
  }, [selectedRecords]);

  useEffect(()=>{
    if (htmlInputElements.length > 0) {
      setHtmlInputElements(htmlInputElements.map((row: any, index:  number) => ({
        ...row,
        id: maxId+ index+ 1
      })));
    }
  }, [htmlInputElements]);

  const getUpdatedPhoneNumberRows = () => {
    return modalRecords.map((row: PhoneNumberRecordType) => {
      const updatedPhoneNumberRecord: PhoneNumberRecordType = {};

      Object.keys(row).forEach((key: string)=> {
        PhoneNumberRecordUtil.setPropertyValue(updatedPhoneNumberRecord, key, previewModalGridApiRef.current.getCellValue(row.id, key));
      });

      return updatedPhoneNumberRecord;
    });
  };

  const handleOnCreate = async () =>{
    const recordsToCreate: Array<PhoneNumberRecordType> = getUpdatedPhoneNumberRows();
    await previewModalHandler.current.handleOnCreate(accessTokenGraph, recordsToCreate);
  };

  const handleOnUpdate = async () =>{
    const recordsToUpdate: Array<PhoneNumberRecordType> = getUpdatedPhoneNumberRows();
    await previewModalHandler.current.handleOnUpdate(accessTokenGraph, recordsToUpdate);
  };

  const handleOnDelete = async () => {
    const recordsToDelete: Array<PhoneNumberRecordType> = getUpdatedPhoneNumberRows();
    await previewModalHandler.current.handleOnDelete(accessTokenGraph, recordsToDelete);
  };

  const createNewRecord = () => {
    // phoneNumberRows.state = [{}];
    //TODO: Add new record, should action type be passed in to create the proper record type (i.e. legacy or dynamic?
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>)=> {
    const xlsxReaderResults = await PhoneNumberXlsxReader.getInstance().processXlsxFile(event);

    if (xlsxReaderResults.errors.length > 0) {
      dataGridController.current.alertBarController.error(xlsxReaderResults.errors.join("\n"));
    } else {
      setModalRecords(xlsxReaderResults.records);
    }
  };

  const handleOnClose =()=>{
    setModalRecords([]);
    onClose();
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        takeover={["base", "sm", "md", "lg"]}
        onClose={()=>{ handleOnClose(); }}
        size="large"
      >
        <ModalHeader>{modalType?.toUpperCase()} Flow - {modalRecords?.length} rows selected</ModalHeader>
        <ModalBody className="preview-grid-modal">
          {modalType === PhoneNumberModalTypeEnum.BulkAdd &&
                <StyledButton sx={{
                  marginRight: "10px",
                  marginBottom: "10px"
                }} onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
          }
          {(PhoneNumberModalTypeEnum.BulkAdd === modalType || PhoneNumberModalTypeEnum.BulkEdit === modalType) &&
                <StyledButton sx={{
                  marginRight: "10px",
                  marginBottom: "10px"
                }}>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                  /> </StyledButton>
          }
          <DataGrid
            apiRef={previewModalGridApiRef}
            rows={modalRecords}
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
            {modalType === PhoneNumberModalTypeEnum.BulkDelete &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnDelete(); }}>Delete</StyledButton>
            }
            {modalType === PhoneNumberModalTypeEnum.BulkAdd &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={() => handleOnCreate() }>Save</StyledButton>
            }
            {modalType === PhoneNumberModalTypeEnum.BulkEdit &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnUpdate(); }}>Update</StyledButton>
            }
            <StyledButton onClick={()=>{ handleOnClose(); }}>Cancel</StyledButton>
          </Box>
        </ModalFooter>
      </Modal>
    </div>
  );
};
