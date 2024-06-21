/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/
import {
  DataGrid,
  GridCallbackDetails,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  useGridApiRef
} from "@mui/x-data-grid";
import React, {
  useContext, useEffect, useRef, useState
} from "react";
import "./PhoneNumber.DataGrid.scss";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { PhoneNumber, PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
import { LegacyPhoneNumberFormFieldConfigs } from "../Form/Legacy.PhoneNumber.Form.FieldConfigs";
import { PhoneNumberPreviewModal } from "../PreviewModal";
import PhoneNumberDataGridColumnDef from "./PhoneNumber.DataGrid.ColumnDef";
import { PhoneNumberDataGridToolBar } from "./PhoneNumber.DataGrid.ToolBar";
import { PhoneNumberDataGridFilterModal } from "./PhoneNumber.DataGrid.Filter.Modal";
import { FieldConfigs } from "../../common/Form/Form.Field.Config";
import { PhoneNumberFormModal } from "../Form/PhoneNumber.Form.Modal";
import { EditPhoneNumberFormHandler } from "../Form/Edit.PhoneNumber.Form.Handler";
import { DynamicPhoneNumberFormFieldConfigs } from "../Form/Dynamic.PhoneNumber.Form.FieldConfigs";
import { PhoneNumberFormFieldOptionsManager } from "../Form/PhoneNumberFormFieldOptionsManager";
import { FieldOptions } from "../../common/Form/AbstractFormFieldOptionsManager";
import { listPhoneNumberRecords } from "../GraphQL/List.PhoneNumber.Records.Util";
import {
  DataGridStateProps,
  initializeDataGrid,
  sortDataGrid
} from "../../common/DataGrid/DynamicCallFlow.Common.DataGrid";
import { AddPhoneNumberFormHandler } from "../Form/Add.PhoneNumber.Form.Handler";
import {
  AlertBarController, AlertBarProps, initialAlertBarProps
} from "../../common/AlertBar.Controller";
import { DynamicCallFlowPhoneNumberContext } from "../DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberModalTypeEnum } from "../DynamicCallFlow.PhoneNumber.Container.Modal.Controller";
import { PhoneNumberDataGridFilter } from "./PhoneNumber.DataGrid.Filter";
import { PhoneNumberDataGridController } from "./PhoneNumber.DataGrid.Controller";
import { CustomToast } from "components/CustomToast";
import { CctSharedCallFlowDb } from "dynamicCallFlow/GraphQL/Legacy.PhoneNumber.Interfaces";

const DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_PAGE_NUMBER = "dynamicCallFlowPhoneNumberDataGridPageNumber";
const DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_RECORDS_PER_PAGE = "dynamicCallFlowPhoneNumberDataGridRecordsPerPage";

const PhoneNumberDataGridComponent = (): JSX.Element => {
  const {
    accessTokenGraph,
    currentOpenModal,
    modalController
  } = useContext(DynamicCallFlowPhoneNumberContext);

  // sourceRecords is the master list of all records.  It is used to update the data grid records and to update the field options.
  const [sourceRecords, setSourceRecords] = useState<Array<PhoneNumberRecordType>>([]);

  // dataGridRecords is the list of records that are displayed in the data grid.  It contains the results of when a filter is applied to sourceRecords.
  const [dataGridRecords, setDataGridRecords] = useState<Array<PhoneNumberRecordType>>([]);

  // dataGridProps stores the state of fetching data, the min and max id, and the max id.
  const [dataGridProps, setDataGridProps] = useState<DataGridStateProps>(initializeDataGrid());
  const dataGridFilter = useRef<PhoneNumberDataGridFilter>(new PhoneNumberDataGridFilter(setDataGridRecords));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_RECORDS_PER_PAGE) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_RECORDS_PER_PAGE) : 10,
    page: sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_PAGE_NUMBER) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_PAGE_NUMBER) : 1
  });
  const [selectedRecords, setSelectedRecords] = useState<Array<PhoneNumberRecordType>>([]);
  const [selectedRecord, setSelectedRecord] = useState<PhoneNumberRecordType>({} as PhoneNumberRecordType);

  // alertBarProps is used to display messages to the user.
  const [alertBarProps, setAlertBarProps] = useState<AlertBarProps>(initialAlertBarProps);
  const alertBarController = useRef<AlertBarController>(new AlertBarController(setAlertBarProps));

  const dataGridApi = useGridApiRef<GridApiCommunity>();
  const dataGridController = useRef(new PhoneNumberDataGridController(dataGridApi, dataGridFilter,
    alertBarController));

  // fieldOptions is used to store the options for the fields in the form.  Some options are static, some are derived from the values in sourceRecords.
  const [fieldOptions, setFieldOptions] = useState<FieldOptions>({} as FieldOptions);

  const [legacyPhoneNumberFormEditHandler] = useState(new EditPhoneNumberFormHandler(dataGridController));
  const [legacyPhoneNumberFormAddHandler] = useState(new AddPhoneNumberFormHandler(dataGridController));
  const [legacyFieldConfigs, setLegacyFieldConfigs] = useState<FieldConfigs>(LegacyPhoneNumberFormFieldConfigs);

  const [dynamicPhoneNumberFormEditHandler] = useState(new EditPhoneNumberFormHandler(dataGridController));
  const [dynamicPhoneNumberFormAddHandler] = useState(new AddPhoneNumberFormHandler(dataGridController));
  const [dynamicFieldConfigs, setDynamicFieldConfigs] = useState<FieldConfigs>(DynamicPhoneNumberFormFieldConfigs);


  useEffect(() => {
    const loadDataGrid = async()=> {
      alertBarController.current.info("Data loading in progress. Please wait for the complete set of data to be loaded.");
      let sortedRecords: Array<PhoneNumberRecordType>;
      let updatedDataGridProps: DataGridStateProps;

      try {
        const records = await listPhoneNumberRecords(accessTokenGraph);
        [sortedRecords, updatedDataGridProps] = sortDataGrid<PhoneNumberRecordType>(records);
      } catch (error: unknown) {
        console.log(`Error loading call flow data: ${(error as Error)?.message}`);
        alertBarController.current.error("Errors loading data.  Please check the console logs.");
      }

      setSourceRecords(sortedRecords);
      setDataGridRecords(sortedRecords);
      setDataGridProps(prevState => ({
        ...prevState,
        ...updatedDataGridProps
      }));

      const phoneNumberFormFieldOptionsManager = new PhoneNumberFormFieldOptionsManager();
      setFieldOptions(phoneNumberFormFieldOptionsManager.generateOptions(sortedRecords));
      setLegacyFieldConfigs(phoneNumberFormFieldOptionsManager.updateFieldOptionsOnFieldConfigs(legacyFieldConfigs));
      setDynamicFieldConfigs(phoneNumberFormFieldOptionsManager.updateFieldOptionsOnFieldConfigs(dynamicFieldConfigs));

      alertBarController.current.success("Data has been successfully loaded.");
    };

    loadDataGrid();
  }, []);

  useEffect(() => {
    dataGridFilter.current.sourceRecords = sourceRecords;
    dataGridController.current.sourceRecords = sourceRecords;
  }, [sourceRecords]);

  useEffect(() => {
    dataGridController.current.dataGridRecords = dataGridRecords;
  }, [dataGridRecords]);

  useEffect(() => {
    dataGridFilter.current.fieldOptions = fieldOptions;
  }, [fieldOptions]);

  useEffect(() => {
    dataGridController.current.dataGridProps = dataGridProps;
  }, [dataGridProps]);

  const handlePaginationModelChange = (model: GridPaginationModel, gridCallbackDetails: GridCallbackDetails) =>{
    sessionStorage.setItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_PAGE_NUMBER, model.page.toString());
    sessionStorage.setItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_RECORDS_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const exportDataFile = () => {
    //TODO: update download csv function
    // downloadCSV(EXPORT_FILE_PREFIX.FLOW, dataGridState.state.filteredData);
  };

  const openEditFormModal = (recordToEdit: PhoneNumberRecordType): void => {
    setSelectedRecord(recordToEdit);
    dataGridController.current.sourceRecords = sourceRecords;
    dataGridController.current.dataGridRecords = dataGridRecords;

    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(recordToEdit)) {
      modalController.current.openModal(PhoneNumberModalTypeEnum.EditLegacyPhoneNumber);
    } else {
      modalController.current.openModal(PhoneNumberModalTypeEnum.EditDynamicPhoneNumber);
    }
  };

  const handleOnClone = (): void => {
    if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(selectedRecord)) {
      (selectedRecord as PhoneNumber).phoneNumber = "";
    } else {
      (selectedRecord as CctSharedCallFlowDb).pkey = "";
    }

    setSelectedRecord({
      ...selectedRecord
    });

    dataGridController.current.sourceRecords = sourceRecords;
    dataGridController.current.dataGridRecords = dataGridRecords;

    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(selectedRecord)) {
      modalController.current.openModal(PhoneNumberModalTypeEnum.AddLegacyPhoneNumber);
    } else {
      modalController.current.openModal(PhoneNumberModalTypeEnum.AddDynamicPhoneNumber);
    }
  };

  const postFormHandler = (): void => {
    setSourceRecords([ ...dataGridController.current.sourceRecords ]);
    dataGridFilter.current.applyFilter(dataGridController.current.sourceRecords);
    modalController.current.closeModal();
  };

  /**
   * When edit modal is open and a row is edited and the user clicks save, this method is called and the record in the edit modal replaces the record in the grid
   * @param updatedPhoneNumberRecord
   */
  const postHandleOnUpdate = (updatedPhoneNumberRecord: PhoneNumberRecordType): void => {
    setSourceRecords(sourceRecords.map(phoneNumberRecord => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) !== PhoneNumberRecordUtil.getPhoneNumber(updatedPhoneNumberRecord) ? updatedPhoneNumberRecord : phoneNumberRecord));
    setDataGridRecords(dataGridRecords.map(phoneNumberRecord => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) !== PhoneNumberRecordUtil.getPhoneNumber(updatedPhoneNumberRecord) ? updatedPhoneNumberRecord : phoneNumberRecord));
  };

  const postHandleOnAdd = (newPhoneNumberRecord: PhoneNumberRecordType): void => {
    setSourceRecords( prevState => [...prevState, newPhoneNumberRecord]);
    setDataGridRecords(prevState => ([...prevState, newPhoneNumberRecord]));
  };

  /**
   * When edit modal is open for a phone record and the delete button is clicked, this method is called and the row is removed from the grid
   * @param deletedPhoneNumberRecord
   */
  const postHandleOnDelete = (deletedPhoneNumberRecord: PhoneNumberRecordType): void => {
    setSourceRecords(sourceRecords.filter(phoneNumberRecord => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) !== PhoneNumberRecordUtil.getPhoneNumber(deletedPhoneNumberRecord)));
    setDataGridRecords(dataGridRecords.filter(phoneNumberRecord => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) !== PhoneNumberRecordUtil.getPhoneNumber(deletedPhoneNumberRecord)));
  };

  const handleSelectionChanges = (gridRowSelectionModel: GridRowSelectionModel) =>{
    const selectedRecords = gridRowSelectionModel.map<PhoneNumberRecordType>((id: GridRowId) =>
      dataGridRecords.find((phoneNumberRecord: PhoneNumberRecordType)=>
        PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) === id));

    setSelectedRecords(selectedRecords);
  };

  const handleCloseAlertBar = () => {
    setAlertBarProps(initialAlertBarProps);
  };

  const handlePreviewModalOpen = (event: any) => {
    dataGridController.current.sourceRecords = sourceRecords;
    dataGridController.current.dataGridRecords = dataGridRecords;
    modalController.current.openModal(event.target.value);
  };

  const handlePreviewModalOnClose = () =>{
    dataGridApi.current.setRowSelectionModel([]);
    setSourceRecords([ ...dataGridController.current.sourceRecords ]);
    setDataGridRecords([ ...dataGridController.current.dataGridRecords ]);
    setDataGridProps( prevState => ({
      ...prevState,
      fetching: false
    }));

    modalController.current.closeModal();
  };

  function getRowId(row: PhoneNumberRecordType) {
    return PhoneNumberRecordUtil.getPhoneNumber(row);
  }

  PhoneNumberDataGridColumnDef[0].renderCell = (gridRenderCellParams: GridRenderCellParams<PhoneNumberRecordType>) =>
    (<a href="#" onClick={() => openEditFormModal(gridRenderCellParams.row)}>{`${gridRenderCellParams.value}`}</a>);

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <PhoneNumberDataGridToolBar
            isFilterModalOpen={currentOpenModal === PhoneNumberModalTypeEnum.Filter}
            dataGridFilter={dataGridFilter}
            handlePreviewModalOpen={handlePreviewModalOpen}
            exportDataFile={exportDataFile}
          />
          <DataGrid
            apiRef={dataGridApi}
            rows={dataGridRecords || []}
            columns={PhoneNumberDataGridColumnDef}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataGridProps.fetching}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowId={getRowId}
            onRowSelectionModelChange={handleSelectionChanges}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />
        </div>
      </div>
      <PhoneNumberFormModal
        isOpen={currentOpenModal === PhoneNumberModalTypeEnum.EditLegacyPhoneNumber}
        formHandler={legacyPhoneNumberFormEditHandler}
        alertBarController={alertBarController}
        fieldConfigsReactStateAction={{
          state: legacyFieldConfigs,
          setState: setLegacyFieldConfigs
        }}
        selectedRow={selectedRecord}
        handleOnClone={handleOnClone}
        postHandleOnSave={postHandleOnUpdate}
        postHandleOnDelete={postHandleOnDelete}
        postFormHandler={postFormHandler}
      />
      <PhoneNumberFormModal
        isOpen={currentOpenModal === PhoneNumberModalTypeEnum.AddLegacyPhoneNumber}
        formHandler={legacyPhoneNumberFormAddHandler}
        alertBarController={alertBarController}
        fieldConfigsReactStateAction={{
          state: legacyFieldConfigs,
          setState: setLegacyFieldConfigs
        }}
        selectedRow={selectedRecord}
        handleOnClone={handleOnClone}
        postHandleOnSave={postHandleOnAdd}
        postHandleOnDelete={postHandleOnDelete}
        postFormHandler={postFormHandler}
      />
      <PhoneNumberFormModal
        isOpen={currentOpenModal === PhoneNumberModalTypeEnum.EditDynamicPhoneNumber}
        formHandler={dynamicPhoneNumberFormEditHandler}
        alertBarController={alertBarController}
        fieldConfigsReactStateAction={{
          state: dynamicFieldConfigs,
          setState: setDynamicFieldConfigs
        }}
        selectedRow={selectedRecord}
        handleOnClone={handleOnClone}
        postHandleOnSave={postHandleOnUpdate}
        postHandleOnDelete={postHandleOnDelete}
        postFormHandler={postFormHandler}
      />
      <PhoneNumberFormModal
        isOpen={currentOpenModal === PhoneNumberModalTypeEnum.AddDynamicPhoneNumber}
        formHandler={dynamicPhoneNumberFormAddHandler}
        alertBarController={alertBarController}
        fieldConfigsReactStateAction={{
          state: dynamicFieldConfigs,
          setState: setDynamicFieldConfigs
        }}
        selectedRow={selectedRecord}
        handleOnClone={handleOnClone}
        postHandleOnSave={postHandleOnUpdate}
        postHandleOnDelete={postHandleOnDelete}
        postFormHandler={postFormHandler}
      />
      <PhoneNumberDataGridFilterModal
        isOpen={currentOpenModal === PhoneNumberModalTypeEnum.Filter}
        dataGridFilter={dataGridFilter}
      />
      <PhoneNumberPreviewModal
        isOpen={currentOpenModal === PhoneNumberModalTypeEnum.BulkAdd || currentOpenModal === PhoneNumberModalTypeEnum.BulkEdit || currentOpenModal === PhoneNumberModalTypeEnum.BulkDelete}
        selectedRecords={selectedRecords}
        dataGridController={dataGridController}
        fieldOptions={fieldOptions}
        onClose={handlePreviewModalOnClose}
        modalType={currentOpenModal}
        maxId={dataGridProps.maxId}
        loading={dataGridProps.fetching}
      />
      <CustomToast
        open={alertBarProps.open}
        onClose={handleCloseAlertBar}
        msg={alertBarProps.msg}
        severityType={alertBarProps.severityType}
        duration={alertBarProps.duration}
      />
    </div>
  );
};

export default PhoneNumberDataGridComponent;



