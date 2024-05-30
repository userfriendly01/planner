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
import { CustomToast } from "components";
import { AzureSPA } from "../../../../../globals";
import React, {
  useEffect, useState
} from "react";
import {
  CALL_FLOW_PAGE_NO, CALL_FLOW_PER_PAGE
} from "utils";
import "./PhoneNumber.DataGrid.scss";
import {
  hasDuplicatePhoneNumberRecords, pkeyFilter
} from "../GraphQL/Match.PhoneNumber.Records.Util";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { PhoneNumberDataGridComponentManager } from "./PhoneNumber.DataGrid.Component.Manager";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
import { deleteOppositeRows } from "./PhoneNumber.DataGrid.Util";
import { LegacyPhoneNumberFormFieldConfigs } from "../Form/Legacy.PhoneNumber.Form.FieldConfigs";
import { BatchPhoneNumberRecord } from "../GraphQL/Batch.PhoneNumber.Records.Util";
import { PhoneNumberPreviewModal } from "../PreviewModal";
import PhoneNumberDataGridColumnDef from "./PhoneNumber.DataGrid.ColumnDef";
import { PhoneNumberDataGridToolBar } from "./PhoneNumber.DataGrid.ToolBar";
import {
  FILTER_CACHE_KEY, PhoneNumberDataGridFilterModal
} from "../Filter/PhoneNumber.DataGrid.Filter.Modal";
import {
  Field, FieldConfig, FieldConfigs, Fields
} from "../../common/Form/Form.FieldConfig.State";
import { PhoneNumberFormManager } from "../Form/PhoneNumber.Form.Manager";
import {
  PhoneNumberFormModal, PhoneNumberFormType
} from "../Form/PhoneNumber.Form.Modal";
import { EditPhoneNumberFormHandler } from "../Form/Edit.PhoneNumber.Form.Handler";
import { DynamicPhoneNumberFormFieldConfigs } from "../Form/Dynamic.PhoneNumber.Form.FieldConfigs";
import { PhoneNumberFormFieldOptionsManager } from "../Form/PhoneNumberFormFieldOptionsManager";
import {
  AlertBarProps,
  AlertBarStateManager,
  initialAlertBarProps
} from "../../common/StateManager/AlertBar.StateManager";
import {
  DataGridState, DataGridStateProps, initializeDataGrid
} from "../../common/DataGrid/DataGrid.State";
import { FieldConfigsManager } from "../../common/Form/Form.FieldConfig.StateManager";
import { FieldOptions } from "../../common/Form/AbstractFormFieldOptionsManager";
import {DataGridFilterStateProps, Filter} from "../../common/DataGrid/Abstract.DataGrid.Filter.Modal.Manager";
import {FormManagerProps, initializeFormManagerProps} from "../../common/Form/Abstract.Form.Manager";
import {PhoneNumberDataGridFilterModalManager} from "../Filter/PhoneNumber.DataGrid.Filter.Modal.Manager";

const DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PER_PAGE = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PER_PAGE";
const DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PAGE_NUMBER = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PAGE_NUMBER";

const PhoneNumberDataGridComponent = (azureSPA: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = azureSPA;
  const [dataGridProps, setDataGridProps] = useState<DataGridStateProps<PhoneNumberRecordType>>(initializeDataGrid());
  const dataGrid = new DataGridState(dataGridProps, setDataGridProps);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PER_PAGE) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PER_PAGE) : 10,
    page: sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PAGE_NUMBER) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PAGE_NUMBER) : 1
  });
  const [selectedList, setSelectedList] = useState<Array<PhoneNumberRecordType>>([]);

  const [alertBarProps, setAlertBarProps] = useState<AlertBarProps>(initialAlertBarProps);
  const alertBar = new AlertBarStateManager(alertBarProps, setAlertBarProps);
  const dataGridManager = new PhoneNumberDataGridComponentManager(dataGrid, alertBar, setPaginationModel);

  // const [legacyFieldConfigs, setLegacyFieldConfigs] = useState<FieldConfigs>(LegacyPhoneNumberFormFieldConfigs);
  // const legacyFieldConfigsManager = new FieldConfigsManager(legacyFieldConfigs, setLegacyFieldConfigs);
  //
  // const [dynamicFieldConfigs, setDynamicFieldConfigs] = useState<FieldConfigs>(DynamicPhoneNumberFormFieldConfigs);
  // const dynamicFieldConfigsManager = new FieldConfigsManager(dynamicFieldConfigs, setDynamicFieldConfigs);

  const [legacyFormManagerProps, setLegacyFormManagerProps] = useState<FormManagerProps<PhoneNumberRecordType>>(initializeFormManagerProps<PhoneNumberRecordType>(fieldOptions, LegacyPhoneNumberFormFieldConfigs);
  const legacyPhoneNumberFormManager = new PhoneNumberFormManager(legacyFormManagerProps, setLegacyFormManagerProps);

  const[dynamicFormManagerProps, setDynamicFormManagerProps] = useState<FormManagerProps<PhoneNumberRecordType>>(initializeFormManagerProps<PhoneNumberRecordType>(fieldOptions, DynamicPhoneNumberFormFieldConfigs);
  const dynamicPhoneNumberFormManager = new PhoneNumberFormManager(dynamicFormManagerProps, setDynamicFormManagerProps);

  const [fieldOptions, setFieldOptions] = useState<FieldOptions>({} as FieldOptions);
  const phoneNumberFormFieldOptionsManager = new PhoneNumberFormFieldOptionsManager(fieldOptions);
  phoneNumberFormFieldOptionsManager.register(PhoneNumberFormType.Legacy, legacyPhoneNumberFormManager.state.fieldConfigs);
  phoneNumberFormFieldOptionsManager.register(PhoneNumberFormType.Dynamic, dynamicPhoneNumberFormManager.state.fieldConfigs);

  const legacyPhoneNumberFormEditHandler = new EditPhoneNumberFormHandler(accessToken, legacyPhoneNumberFormManager, dataGridManager);
  const dynamicPhoneNumberFormEditHandler = new EditPhoneNumberFormHandler(accessToken, dynamicPhoneNumberFormManager, dataGridManager);

  const [dataGridFilterStateProps, setDataGridFilterStateProps] = useState<DataGridFilterStateProps>({ filter: {}, isModalOpen: false });
  const dataGridDataFilterModalManager = new PhoneNumberDataGridFilterModalManager(dataGrid, dataGridFilterStateProps, setDataGridFilterStateProps, alertBar);

  const apiRef = useGridApiRef<GridApiCommunity>();

  useEffect(() => {
    let phoneNumberRecords: Array<PhoneNumberRecordType> = [];
    //TODO:  Rename this function, it's not returning any values, it's loading the table
    const loadDataGrid = async()=> {

      try {
        phoneNumberRecords = await dataGridManager.loadDataGrid(accessToken);
      } catch (error: unknown) {
        // TODO: Log error
        console.log(`Error loading call flow data: ${(error as Error)?.message}`);
        alertBar.error("Errors loading data.  Please check the console logs.");
      }

      phoneNumberFormFieldOptionsManager.generate(phoneNumberRecords);
    };

    loadDataGrid();
  }, []);

  const handlePaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails<any>) =>{
    sessionStorage.setItem(CALL_FLOW_PAGE_NO, model.page.toString());
    sessionStorage.setItem(CALL_FLOW_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const handleFilterChange = (event: any) => {
    dataGridFilterStateProps.filter = {
      ...dataGridFilterStateProps,
      filter: {
        ...dataGridFilterStateProps.filter,
        [event.target.name as keyof Filter]: event.target.value
      } as Filter
    };
  };

  const exportDataFile = () => {
    //TODO: update download csv function
    // downloadCSV(EXPORT_FILE_PREFIX.FLOW, dataGridState.state.filteredData);
  };

  const cloneFormFields = (openEditModal: boolean, phoneNumberRecordToClone: PhoneNumberRecordType)=> {
    const clonedPhoneNumberRecord = {
      ...phoneNumberRecordToClone,
      pkey: "",
      phoneNumber: ""
    } as PhoneNumberRecordType;

    const clonedFormFields: Fields = {};
    Object.keys(LegacyPhoneNumberFormFieldConfigs).forEach((key: string): void => {
      const phoneNumberFormFieldConfig: FieldConfig = LegacyPhoneNumberFormFieldConfigs[key];
      clonedFormFields[phoneNumberFormFieldConfig.fieldKey] = {
        field: phoneNumberFormFieldConfig.fieldKey,
        error: false,
        required: phoneNumberFormFieldConfig.required || false
      } as Field;
    });

    dataGrid.state.isEditModalOpen = openEditModal;
    dataGrid.state.isAddModalOpen = !openEditModal;
  };

  const newOpenEditModal = (recordToEdit: PhoneNumberRecordType): void => {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(recordToEdit)) {
      legacyPhoneNumberFormManager.openFormModal(legacyPhoneNumberFormEditHandler);
    } else {
      dynamicPhoneNumberFormManager.openFormModal(dynamicPhoneNumberFormEditHandler);
    }

    dataGrid.state = {
      selectedRow: recordToEdit
    };
  };

  const openEditModal = (isEditModalOpen: boolean, isSubmitted?: boolean, row?: PhoneNumberRecordType, message?: string, rowHasBeenDeleted?: boolean, isClonedFlowRule?: boolean) => {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
      if (isClonedFlowRule) {
        cloneFormFields(isEditModalOpen, row);
      } else if (!isEditModalOpen && isSubmitted) {
        alertBar.success(message);
      }

      dataGrid.state =
        { // When edit modal is open for a phone record and the delete button is clicked, this method is called and the row is removed from the grid
          ...(!isEditModalOpen && isSubmitted && rowHasBeenDeleted) && {
            data: dataGrid.state.data.filter(phoneNumberRecord => phoneNumberRecord.id !== row.id),
            filteredItems: dataGrid.state.data.filter(phoneNumberRecord => phoneNumberRecord.id !== row.id)
          }, // When edit modal is open and a row is edited and the user clicks save, this method is called and the record in the edit modal replaces the record in the grid
          ...(!isEditModalOpen && isSubmitted && !rowHasBeenDeleted && row) && {
            data: dataGrid.state.data.map(phoneNumberRecord => phoneNumberRecord.id === row.id ? row : phoneNumberRecord),
            filteredItems: dataGrid.state.data.map(phoneNumberRecord => phoneNumberRecord.id === row.id ? row : phoneNumberRecord)
          },
          isEditModalOpen: isEditModalOpen,
          selectedRow: row
        };
    } else {
      dataGrid.state = {
        selectedRow: row
      };
    }
  };

  const handleSelectionChanges = (gridRowSelectionModel: GridRowSelectionModel) =>{
    const selectedCallFlows = gridRowSelectionModel.map((id: GridRowId) =>
      dataGrid.state.filteredData.find((phoneNumberRecord: PhoneNumberRecordType)=>
        phoneNumberRecord.id === id));

    setSelectedList(selectedCallFlows);
  };

  const handleOnBatchCreate = async(newPhoneNumberRecords: Array<PhoneNumberRecordType> ) => {
    //TODO: Can this be matched on just pkey?  Why is employeeId being checked?
    if (hasDuplicatePhoneNumberRecords(dataGrid.state.data, newPhoneNumberRecords, alertBar, pkeyFilter)) {
      return;
    }

    const batchResults = await BatchPhoneNumberRecord.create(accessToken, newPhoneNumberRecords);

    if (batchResults?.hasError) {
      alertBar.error(batchResults.alertMsg);
      return;
    }

    alertBar.success("Phone Numbers have been successfully created.");

    await deleteOppositeRows(batchResults.success, accessToken);

    setSelectedList([...batchResults.failure]);

    const filteredData = [...dataGrid.state.filteredData, ...batchResults.success];
    const dataGridRows = [...dataGrid.state.data, ...batchResults.success];

    if (filteredData?.length > 0) {
      dataGrid.state.filteredData = filteredData;
    }

    dataGrid.state = {
      data: dataGridRows,
      isPreviewModalOpen: batchResults?.hasError
    };

    apiRef.current.setRowSelectionModel([]);
  };

  const findMatchingRecordFromSearchList = (phoneNumberRecord: PhoneNumberRecordType, searchList: Array<PhoneNumberRecordType>): PhoneNumberRecordType => {
    const filteredCallFlowRecords = searchList.filter(searchListCallFlowRecord =>
      PhoneNumberRecordUtil.getPkey(searchListCallFlowRecord) === PhoneNumberRecordUtil.getPkey(phoneNumberRecord));

    if (filteredCallFlowRecords.length > 0) {
      return filteredCallFlowRecords[0];
    } else {
      return phoneNumberRecord;
    }
  };

  const handleOnBatchUpdate = async(newCallFlowRecords: Array<PhoneNumberRecordType> ) =>{
    if (hasDuplicatePhoneNumberRecords(dataGrid.state.data, newCallFlowRecords, alertBar)) {
      return;
    }

    const batchResults = await BatchPhoneNumberRecord.update(accessToken, newCallFlowRecords);

    if (batchResults?.hasError) {
      alertBar.error("Error while updating the records. ".concat(batchResults.alertMsg));
      return;
    }

    alertBar.success("Call Flow Rules have been successfully updated.");

    await deleteOppositeRows(batchResults.success, accessToken);

    setSelectedList(batchResults.failure);

    const refilteredFilteredData = dataGrid.state.filteredData.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, batchResults.success));
    const filteredData = dataGrid.state.data.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, batchResults.success));

    if (refilteredFilteredData?.length > 0) {
      dataGrid.state.filteredData = refilteredFilteredData;
    }

    dataGrid.state = {
      filteredData: filteredData,
      isPreviewModalOpen: false
    };

    apiRef.current.setRowSelectionModel(batchResults.failure.map<number>(phoneNumberRecord => phoneNumberRecord.id));
  };

  const handleOnBatchDelete = async(phoneNumberRecords: Array<PhoneNumberRecordType> ): Promise<void> => {
    const batchResults = await BatchPhoneNumberRecord.delete(accessToken, phoneNumberRecords);

    if(batchResults?.hasError) {
      alertBar.error(batchResults.alertMsg);

      return;
    } else {
      alertBar.success("Call Flow Rules have been successfully deleted.");
    }

    await deleteOppositeRows(phoneNumberRecords, accessToken);

    const selectedRowsData = batchResults?.failure?.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, dataGrid.state.filteredData));

    setSelectedList(selectedRowsData);

    const deletedIds = batchResults?.success?.map<string>(phoneNumberRecord=> PhoneNumberRecordUtil.getPkey(phoneNumberRecord));
    // Not really sure what to name filtering the dataGridState.filteredRows
    const refilteredFilteredData =
      dataGrid.state.filteredData.filter(phoneNumberRecord=> deletedIds.indexOf(PhoneNumberRecordUtil.getPkey(phoneNumberRecord)) === -1);
    const filteredData =
      dataGrid.state.data.filter(phoneNumberRecord=> deletedIds.indexOf(PhoneNumberRecordUtil.getPkey(phoneNumberRecord)) === -1);

    dataGrid.state = {
      data: filteredData,
      filteredData: refilteredFilteredData,
      isPreviewModalOpen: batchResults?.hasError || false,
      fetching: false
    };

    apiRef.current.setRowSelectionModel(batchResults.failure.map<number>(phoneNumberRecord => phoneNumberRecord.id));
  };

  // PhoneNumberColumnDef[0].renderCell = (gridRenderCellParams: GridRenderCellParams<PhoneNumberRecordType>) =>
  //   (<a href="#" onClick={() => openEditModal(true, false, gridRenderCellParams.row)}>{`${gridRenderCellParams.value}`}</a>);

  PhoneNumberDataGridColumnDef[0].renderCell = (gridRenderCellParams: GridRenderCellParams<PhoneNumberRecordType>) =>
    (<a href="#" onClick={() => newOpenEditModal(gridRenderCellParams.row)}>{`${gridRenderCellParams.value}`}</a>);

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <PhoneNumberDataGridToolBar
            dataGridManager={dataGridManager}
            exportDataFile={exportDataFile}
            matchedGroups={matchedGroups}
          />
          <DataGrid
            apiRef={apiRef}
            rows={dataGrid.state.filteredData || []}
            columns={PhoneNumberDataGridColumnDef}
            paginationModel={paginationModel}
            onPaginationModelChange={dataGridManager.handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataGrid.state.fetching}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowId={(phoneNumberRecord: PhoneNumberRecordType) => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord)}
            onRowSelectionModelChange={dataGridManager.handleSelectionChanges}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />
        </div>
      </div>

      {/*<AddPhoneNumber*/}
      {/*  accessToken={accessToken}*/}
      {/*  matchedGroups={matchedGroups}*/}
      {/*  dataGridManager={dataGridManager}*/}
      {/*  formManager={phoneNumberFormManager}*/}
      {/*/>*/}

      {/*<AddDynamicPhoneNumber*/}
      {/*  accessToken={accessToken}*/}
      {/*  matchedGroups={matchedGroups}*/}
      {/*  cloneType={cloneType}*/}
      {/*  clonedFormFields={clonedFormFieldsState.state}*/}
      {/*  dataGridManager={dataGridManager}*/}
      {/*  formManager={formManager}*/}
      {/*/>*/}

      {/*<EditPhoneNumber*/}
      {/*  accessToken={accessToken}*/}
      {/*  matchedGroups={matchedGroups}*/}
      {/*  isOpen={dataGrid.isEditModalOpen}*/}
      {/*  selectedRow={dataGrid.selectedRow}*/}
      {/*  openEditModal={openEditModal}*/}
      {/*  dataGridManager={dataGridManager}*/}
      {/*  formManager={phoneNumberFormManager}*/}
      {/*/>*/}

      {/*<EditDynamicPhoneNumber*/}
      {/*  accessToken={accessToken}*/}
      {/*  matchedGroups={matchedGroups}*/}
      {/*  isOpen={dataGrid.isEditDynamicPhoneNumberModalOpen}*/}
      {/*  selectedRow={dataGrid.selectedRow}*/}
      {/*  openEditModal={openEditModal}*/}
      {/*  dataGridManager={dataGridManager}*/}
      {/*  formManager={dynamicPhoneNumberFormManager}*/}
      {/*/>*/}

      <PhoneNumberFormModal
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        formManager={legacyPhoneNumberFormManager}
        alertBar={alertBar}
      />

      <PhoneNumberFormModal
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        formManager={dynamicPhoneNumberFormManager}
        alertBar={alertBar}
      />

      <PhoneNumberDataGridFilterModal
        dataGridDataFilterModalManager={dataGridDataFilterModalManager}
        fieldOptions={fieldOptions}
      />
      <CustomToast
        open={alertBar.open}
        onClose={alertBar.handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
        duration={alertBar.duration}
      />
      <PhoneNumberPreviewModal
        isOpen={dataGrid.state.isPreviewModalOpen}
        rows={selectedList}
        onClose={handlePreviewModalOnClose}
        action={dataGrid.state.previewModalAction}
        maxId={dataGrid.state.maxId}
        onCreate={handleOnBatchCreate}
        onUpdate={handleOnBatchUpdate}
        onDelete={handleOnBatchDelete}
        loading={dataGrid.state.fetching}
      />
    </div>
  );
};

export default PhoneNumberDataGridComponent;



