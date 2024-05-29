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
import {
  AzureSPA
} from "../../../../../globals";
import React, {
  useEffect, useState
} from "react";
import {
  CACHE_FILTER_FLOW,
  CALL_FLOW_PAGE_NO,
  CALL_FLOW_PER_PAGE,
  downloadCSV,
  EXPORT_FILE_PREFIX
} from "utils";
import "./PhoneNumberDataGrid.scss";
import {
  hasDuplicatePhoneNumberRecords, pkeyFilter
} from "../GraphQL/PhoneNumberRecordMatch.Util";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import {
  DataGridState, Filter
} from "../../common/DataGrid/DataGrid.State";
import { AlertBarState } from "../../common/StateManager/AlertBar.State";
import { PhoneNumberDataGridManager } from "./PhoneNumberDataGrid.Manager";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumberRecord.Util";
import { deleteOppositeRows } from "./PhoneNumberDataGrid.Util";
import {
  LegacyPhoneNumberFormFieldConfigs
} from "../Form/LegacyPhoneNumberFormField.Configs";
import { BatchPhoneNumberRecord } from "../GraphQL/PhoneNumberBatchRecord.Util";
import { PhoneNumberPreviewModal } from "../PreviewModal";
import PhoneNumberDataGridColumnDef from "./PhoneNumberDataGrid.ColumnDef";
import { PhoneNumberDataGridToolBar } from "./PhoneNumberDataGrid.ToolBar";
import { PhoneNumberFilterModal } from "../CustomActions/PhoneNumberFilterModal";
import {
  Field, Fields, FormFieldConfigState, FormFieldConfig
} from "../../common/Form/FormFieldConfig.State";
import {
  PreviewModalActionType
} from "../../common/DataGrid/DataGridState.Interfaces";
import { PhoneNumberFormManager } from "../Form/PhoneNumberForm.Manager";
import {
  PhoneNumberFormModal, PhoneNumberFormType
} from "../Form/PhoneNumberForm.Modal";
import { PhoneNumberFormEditHandler } from "../Form/PhoneNumberFormEdit.Handler";

const PhoneNumberDataGrid = (azureSPA: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = azureSPA;

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(CALL_FLOW_PER_PAGE) ? +sessionStorage.getItem(CALL_FLOW_PER_PAGE) : 10,
    page: sessionStorage.getItem(CALL_FLOW_PAGE_NO) ? +sessionStorage.getItem(CALL_FLOW_PAGE_NO) : 1
  });

  const dataGrid: DataGridState<PhoneNumberRecordType> = new DataGridState<PhoneNumberRecordType>();
  const alertBar: AlertBarState = new AlertBarState();
  const dataGridManager: PhoneNumberDataGridManager = new PhoneNumberDataGridManager(dataGrid, alertBar);
  const phoneNumberFormManager = new PhoneNumberFormManager();
  const phoneNumberFormEditHandler = new PhoneNumberFormEditHandler(accessToken, phoneNumberFormManager, dataGridManager);
  const clonedFormFieldsState = new FormFieldConfigState(LegacyPhoneNumberFormFieldConfigs);
  const [cloneType, setCloneType] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<Array<PhoneNumberRecordType>>([]);
  const apiRef = useGridApiRef<GridApiCommunity>();

  useEffect(() => {
    //TODO:  Rename this function, it's not returning any values, it's loading the table
    const loadDataGrid = async()=> {
      try {
        const phoneNumberRecords = await dataGridManager.loadDataGrid(accessToken);
        phoneNumberFormManager.fieldOptions.generate(phoneNumberRecords);
      } catch (error: unknown) {
        // TODO: Log error
        console.log(`Error loading call flow data: ${(error as Error)?.message}`);
        alertBar.error("Errors loading data.  Please check the console logs.");
      }
    };

    loadDataGrid();
  }, []);

  const handlePaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails<any>) =>{
    sessionStorage.setItem(CALL_FLOW_PAGE_NO, model.page.toString());
    sessionStorage.setItem(CALL_FLOW_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const handleClose = (flag: boolean) => {
    alertBar.open = flag;
  };

  const handleFilterChange = (event: any) => {
    dataGrid.setFilter({ [event.target.name as keyof Filter]: event.target.value } as Filter);
  };

  const openFilterModal = (openFilterModel: boolean, filter?: Filter) => {
    if (filter) {
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(dataGrid.state?.filter));
      dataGrid.setFilter(filter);
    }

    dataGrid.setIsFilterModalOpen(openFilterModel);
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
      const phoneNumberFormFieldConfig: FormFieldConfig = LegacyPhoneNumberFormFieldConfigs[key];
      clonedFormFields[phoneNumberFormFieldConfig.fieldKey] = {
        field: phoneNumberFormFieldConfig.fieldKey,
        error: false,
        required: phoneNumberFormFieldConfig.required || false
      } as Field;
    });

    setCloneType(!openEditModal);
    dataGrid.setIsEditModalOpen(openEditModal)
      .setIsAddModalOpen(!openEditModal);
  };

  const openPreviewModal = (openPreviewModal: boolean, previewModalAction: PreviewModalActionType) => {
    dataGrid.setIsPreviewModalOpen(openPreviewModal)
      .setPreviewModalAction(previewModalAction);
  };

  const newOpenEditModal = (recordToEdit: PhoneNumberRecordType): void => {
    phoneNumberFormManager.switchFormType(
      PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(recordToEdit) ?
        PhoneNumberFormType.Legacy : PhoneNumberFormType.Dynamic);
    phoneNumberFormEditHandler.openModal();
    phoneNumberFormEditHandler.record = recordToEdit;
    dataGrid.state = {
      selectedRow: recordToEdit
    };
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, row?: PhoneNumberRecordType, message?: string, deleteRow?: boolean, isClonedFlowRule?: boolean) => {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(row)) {
      if (isClonedFlowRule) {
        cloneFormFields(flag, row);
      } else if (!flag && isSubmitted) {
        alertBar.success(message);
      }

      dataGrid.state =
        { // When edit modal is open for a phone record and the delete button is clicked, this method is called and the row is removed from the grid
          ...(!flag && isSubmitted && deleteRow) && {
            data: dataGrid.state.data.filter(phoneNumberRecord => phoneNumberRecord.id !== row.id),
            filteredItems: dataGrid.state.data.filter(phoneNumberRecord => phoneNumberRecord.id !== row.id)
          }, // When edit modal is open and a row is edited and the user clicks save, this method is called and the record in the edit modal replaces the record in the grid
          ...(!flag && isSubmitted && !deleteRow && row) && {
            data: dataGrid.state.data.map(phoneNumberRecord => phoneNumberRecord.id === row.id ? row : phoneNumberRecord),
            filteredItems: dataGrid.state.data.map(phoneNumberRecord => phoneNumberRecord.id === row.id ? row : phoneNumberRecord)
          },
          isEditModalOpen: flag,
          selectedRow: row
        };
    } else {
      phoneNumberFormEditHandler.openModal();
      phoneNumberFormEditHandler.record = row;
      dataGrid.state = {
        selectedRow: row
      };
    }
  };

  const handlePreviewModalOnClose = () => {
    dataGrid.setIsPreviewModalOpen(false);
    apiRef.current.setRowSelectionModel([]);
  };

  const handleSelectionChanges = (gridRowSelectionModel: GridRowSelectionModel) =>{
    const selectedCallFlows = gridRowSelectionModel.map((id: GridRowId) =>
      dataGrid.state.filteredData.find((phoneNumberRecord: PhoneNumberRecordType)=>
        phoneNumberRecord.id === id));

    setSelectedList(selectedCallFlows);
  };

  const handleOnBatchCreate = async(newPhoneNumberRecords: Array<PhoneNumberRecordType> ) => {
    //TODO: Can this be matched on just pkey?  Why is employeeId being checked?
    if (hasDuplicatePhoneNumberRecords(dataGrid.data, newPhoneNumberRecords, alertBar, pkeyFilter)) {
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

    const filteredData = [...dataGrid.filteredData, ...batchResults.success];
    const dataGridRows = [...dataGrid.data, ...batchResults.success];

    if (filteredData?.length > 0) {
      dataGrid.setFilteredData(filteredData);
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
    if (hasDuplicatePhoneNumberRecords(dataGrid.data, newCallFlowRecords, alertBar)) {
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

    const refilteredFilteredData = dataGrid.filteredData.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, batchResults.success));
    const filteredData = dataGrid.data.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, batchResults.success));

    if (refilteredFilteredData?.length > 0) {
      dataGrid.setFilteredData(refilteredFilteredData);
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
      findMatchingRecordFromSearchList(phoneNumberRecord, dataGrid.filteredData));

    setSelectedList(selectedRowsData);

    const deletedIds = batchResults?.success?.map<string>(phoneNumberRecord=> PhoneNumberRecordUtil.getPkey(phoneNumberRecord));
    // Not really sure what to name filtering the dataGridState.filteredRows
    const refilteredFilteredData =
      dataGrid.filteredData.filter(phoneNumberRecord=> deletedIds.indexOf(PhoneNumberRecordUtil.getPkey(phoneNumberRecord)) === -1);
    const filteredData =
      dataGrid.data.filter(phoneNumberRecord=> deletedIds.indexOf(PhoneNumberRecordUtil.getPkey(phoneNumberRecord)) === -1);

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
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataGrid.state.fetching}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowId={(phoneNumberRecord: PhoneNumberRecordType) => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord)}
            onRowSelectionModelChange={handleSelectionChanges}
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
        formHandler={phoneNumberFormEditHandler}
        formManager={phoneNumberFormManager}
      />

      <PhoneNumberFilterModal
        dataGridManager={dataGridManager}
        formManager={phoneNumberFormManager}
      />
      <CustomToast
        open={alertBar.open}
        onClose={handleClose}
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

export default PhoneNumberDataGrid;



