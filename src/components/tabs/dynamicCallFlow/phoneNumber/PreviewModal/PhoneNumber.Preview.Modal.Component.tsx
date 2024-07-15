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
import {
  PhoneNumberRecordType
} from "../GraphQL/Dynamic.PhoneNumber.Interfaces";

import { DynamicCallFlowPhoneNumberContext } from "../DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberPreviewModalHandler } from "./PhoneNumber.Preview.Modal.Handler";
import { DataGridControllerRef } from "../../common/DynamicCallFlow.Interfaces";
import { PhoneNumberXlsxImporter } from "../Xlsx/Import/PhoneNumber.Xlsx.Importer";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import { StyledButton } from "components/StyledButton";
import { HANDLED_SUCCESSFULLY } from "components/tabs/dynamicCallFlow/common/Preview/Abstract.Preview.Modal.Handler";
import { PhoneNumberRecordUtil } from "dynamicCallFlow/GraphQL/PhoneNumber.Record.Util";
import {
  PhoneNumberModalType, PhoneNumberModalTypeEnum
} from "dynamicCallFlow/DynamicCallFlow.PhoneNumber.Interfaces";

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
  },[modalType, previewModalGridApiRef, fieldOptions]);

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

  const handleOnCreate = async () =>{
    if (await previewModalHandler.current.handleOnCreate(accessTokenGraph, modalRecords) === HANDLED_SUCCESSFULLY) {
      setModalRecords([]);
      onClose();
    }
  };

  const handleOnDelete = async () => {
    if (await previewModalHandler.current.handleOnDelete(accessTokenGraph, modalRecords) === HANDLED_SUCCESSFULLY) {
      // reset this modal dataGrid and close the modal
      setModalRecords([]);
      onClose();
    }
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
    const xlsxImporterResults = await PhoneNumberXlsxImporter.getInstance().processXlsxUpload(event);

    if (xlsxImporterResults.errors.length > 0) {
      dataGridController.current.alertBarController.error(xlsxImporterResults.errors.join("\n"));
    } else {
      setModalRecords(xlsxImporterResults.records);
    }
  };

  const handleOnClose =()=>{
    setModalRecords([]);
    onClose();
  };

  function getRowId(row: PhoneNumberRecordType) {
    return PhoneNumberRecordUtil.getPhoneNumber(row);
  }

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
          <Box sx={{
            marginRight: "10px",
            marginBottom: "10px"
          }}>
            {modalType === PhoneNumberModalTypeEnum.BulkAdd &&
                <StyledButton onClick={()=>{ createNewRecord(); }}>Add New +</StyledButton>
            }
            <StyledButton sx={{
              marginRight: "10px",
              marginBottom: "10px"
            }}>
              <input type="file" accept=".xlsx" onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleFileUpload(event)} />
            </StyledButton>
          </Box>
          <DataGrid
            apiRef={previewModalGridApiRef}
            rows={modalRecords}
            columns={tableGridColumnDef}
            editMode="row"
            getRowId={getRowId}
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
            <StyledButton data-test-id="ScpANXily_jfK9JzNGaJf" sx={{ marginRight: "15px" }} onClick={() => handleOnCreate() }>Save</StyledButton>
            }
            <StyledButton onClick={()=>{ handleOnClose(); }}>Cancel</StyledButton>
          </Box>
        </ModalFooter>
      </Modal>
    </div>
  );
};
