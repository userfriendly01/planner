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
} from "../../../../globals";
import React, {
  useEffect, useState
} from "react";
import {
  CACHE_FILTER_FLOW,
  CALL_FLOW_PAGE_NO,
  CALL_FLOW_PER_PAGE,
  downloadCSV,
  EXPORT_FILE_PREFIX,
  getAdvanceFilter
} from "utils";
import "./Grid.scss";
import {
  hasDuplicateCallFlowRecords, pkeyAndEmployeeIdFilter
} from "./Util/MatchCallFlowRecords.Util";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { DataGridState } from "../../../../common/DataGrid/DataGridState.Manager";
import { AlertBarState } from "../../../../common/StateManager/AlertBarState.Manager";
import { PhoneNumberDataGridManager } from "./PhoneNumberDataGrid.Manager";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/Util/PhoneNumberRecordUtil";
import { deleteOppositeRows } from "../Utils/FlowTableServiceUtil";
import {
  PhoneNumberFormFieldConfigs
} from "../Field/PhoneNumberFieldsConfig";
import {
  PreviewModalAction
} from "../DynamicCallFlowPhoneNumber.Interfaces";
import { BatchPhoneNumberRecord } from "../GraphQL/Util/BatchPhoneNumberRecord.Util";
import { PreviewModal } from "../PreviewModal";
import PhoneNumberColumnDef from "./GridColumnDef";
import {
  FormField, FormFieldConfig,
  FormFields
} from "../../../../common/FormField/FormField.Interfaces";
import { CustomPhoneNumberGridToolBar } from "../CustomActions/CustomPhoneNumberGridToolBar";
import { AddPhoneNumber } from "../CustomActions/AddPhoneNumber";
import { EditPhoneNumber } from "../CustomActions/EditPhoneNumber";
import { PhoneNumberFilterModal } from "../CustomActions/PhoneNumberFilterModal";
import { FormFieldsState } from "../../../../common/FormField/FormFieldsState.Manager";
import { Filter } from "../../../../common/DataGrid/DataGridState.Interfaces";

const PhoneNumberDataGrid = (azureSPA: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = azureSPA;

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(CALL_FLOW_PER_PAGE) ? +sessionStorage.getItem(CALL_FLOW_PER_PAGE) : 10,
    page: sessionStorage.getItem(CALL_FLOW_PAGE_NO) ? +sessionStorage.getItem(CALL_FLOW_PAGE_NO) : 1
  });

  const dataGridState: DataGridState<PhoneNumberRecordType> = new DataGridState<PhoneNumberRecordType>();
  const alertBarState: AlertBarState = new AlertBarState();
  const phoneNumberDataGridManager: PhoneNumberDataGridManager = new PhoneNumberDataGridManager(dataGridState, alertBarState);
  const clonedFormFieldsState = new FormFieldsState(PhoneNumberFormFieldConfigs);
  const [cloneType, setCloneType] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<Array<PhoneNumberRecordType>>([]);
  const apiRef = useGridApiRef<GridApiCommunity>();

  useEffect(() => {
    //TODO:  Rename this function, it's not returning any values, it's loading the table
    const loadDataGrid = async()=> {
      // alertBarState.info("Data loading in progress. Please wait for the complete set of data to be loaded.");
      console.log("Loading call flow data.");
      try {
        // console.log("Loading call flow data.");
        // const phoneNumberRecords: Array<PhoneNumberRecordType> = await listPhoneNumberRecords(accessToken);
        await phoneNumberDataGridManager.loadDataGrid(accessToken);
      } catch (error: unknown) {
        // TODO: Log error
        alertBarState.error("Errors loading data.  Please check the console logs.");
      }
      console.log("done call flow data load.");

    };

    loadDataGrid();
    // setDataGrid((dg: DataGridStateProps<PhoneNumberRecordType>) => ({
    //   ...dg,
    //   ...dataGrid
    // }));
  }, []);

  const handlePaginationModelChange = (model: GridPaginationModel, details:GridCallbackDetails<any>) =>{
    sessionStorage.setItem(CALL_FLOW_PAGE_NO, model.page.toString());
    sessionStorage.setItem(CALL_FLOW_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const handleClose = (flag: boolean) => {
    alertBarState.open = flag;
  };


  const openAddModal = (flag: boolean, isSubmitted?: boolean, phoneNumberRecord?: PhoneNumberRecordType, openCloneAddModal?: boolean) => {
    const newData: Array<PhoneNumberRecordType> = [...dataGridState.data];
    const newFilteredItems: Array<PhoneNumberRecordType> = [...dataGridState.filteredData];

    if(!openCloneAddModal) {
      setCloneType(openCloneAddModal);
    } else if (!flag && isSubmitted) {
      newData.push(phoneNumberRecord);
      newFilteredItems.push(phoneNumberRecord);
      alertBarState.success("New call flow has been successfully added.", flag);
    }

    if (!flag && isSubmitted && phoneNumberRecord) {
      dataGridState.setData(newData).setFilteredData(newFilteredItems);
    }

    dataGridState.setIsAddModalOpen(flag);
  };

  const handleFilterChange = (event: any) => {
    dataGridState.setFilter({ [event.target.name as keyof Filter]: event.target.value } as Filter);
  };

  const openFilterModal = (openFilterModel: boolean, filter?: Filter) => {
    if (filter) {
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(dataGridState.state?.filter));
      dataGridState.setFilter(filter);
    }

    dataGridState.setIsFilterModalOpen(openFilterModel);
  };

  const exportDataFile = () => {
    //TODO: update download csv function
    // downloadCSV(EXPORT_FILE_PREFIX.FLOW, dataGridState.state.filteredData);
  };

  const cloneFormFields = (openEditModal: boolean, phoneNumberRecord: PhoneNumberRecordType)=> {
    const clonedPhoneNumberRecord = {
      ...phoneNumberRecord,
      pkey: ""
    } as PhoneNumberRecordType;

    const clonedFormFields: FormFields = {};
    Object.keys(PhoneNumberFormFieldConfigs).forEach((key: string): void => {
      const phoneNumberFormFieldConfig: FormFieldConfig = PhoneNumberFormFieldConfigs[key];
      clonedFormFields[phoneNumberFormFieldConfig.key] = {
        field: phoneNumberFormFieldConfig.key,
        error: false,
        value: PhoneNumberRecordUtil.getPropertyValue(clonedPhoneNumberRecord, phoneNumberFormFieldConfig.key),
        required: phoneNumberFormFieldConfig.required || false
      } as FormField;
    });

    setCloneType(!openEditModal);
    clonedFormFieldsState.state = clonedFormFields;
    dataGridState.setIsEditModalOpen(openEditModal)
      .setIsAddModalOpen(openEditModal);
  };

  const openPreviewModal = (flag: boolean, action: PreviewModalAction) => {
    dataGridState.setIsPreviewModalOpen(flag)
      .setPreviewModalAction(action);
  };

  const openEditModal = (openEditModal: boolean, isSubmitted?: boolean, row?: PhoneNumberRecordType, message?: string, deleteRow?: boolean, isClonedFlowRule?: boolean) => {
    if (isClonedFlowRule) {
      cloneFormFields(openEditModal, row);
    } else if (!openEditModal && isSubmitted) {
      alertBarState.success(message);
    }

    dataGridState.state =
      {
        ...(!openEditModal && isSubmitted && deleteRow) && {
          data: dataGridState.state.data.filter(x=> x.id !== row.id),
          filteredItems: dataGridState.state.data.filter(x=> x.id !== row.id)
        },
        ...(!openEditModal && isSubmitted && !deleteRow && row) && {
          data: dataGridState.state.data.map(x=> x.id === row.id ? row : x),
          filteredItems: dataGridState.state.data.map(x=> x.id === row.id ? row : x)
        },
        isEditModalOpen: openEditModal,
        selectedRow: row
      };
  };

  const handlePreviewModalOnClose = () => {
    dataGridState.setIsPreviewModalOpen(false);
    apiRef.current.setRowSelectionModel([]);
  };

  const handleSelectionChanges = (gridRowSelectionModel: GridRowSelectionModel) =>{
    const selectedCallFlows = gridRowSelectionModel.map((id: GridRowId) =>
      dataGridState.state.filteredData.find((phoneNumberRecord: PhoneNumberRecordType)=>
        phoneNumberRecord.id === id));

    setSelectedList(selectedCallFlows);
  };

  const handleOnBatchCreate = async(newPhoneNumberRecords: Array<PhoneNumberRecordType> ) => {
    //TODO: Can this be matched on just pkey?  Why is employeeId being checked?
    if (hasDuplicateCallFlowRecords(dataGridState.data, newPhoneNumberRecords, alertBarState, pkeyAndEmployeeIdFilter)) {
      return;
    }

    const batchResults = await BatchPhoneNumberRecord.create(accessToken, newPhoneNumberRecords);

    if (batchResults?.hasError) {
      alertBarState.error(batchResults.alertMsg);
      return;
    }

    alertBarState.success("Phone Numbers have been successfully created.");

    await deleteOppositeRows(batchResults.success, accessToken);

    setSelectedList([...batchResults.failure]);

    const filteredData = [...dataGridState.filteredData, ...batchResults.success];
    const dataGridRows = [...dataGridState.data, ...batchResults.success];

    if (filteredData?.length > 0) {
      dataGridState.setFilteredData(filteredData);
    }

    dataGridState.setData(dataGridRows)
      .setIsPreviewModalOpen(batchResults?.hasError);

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
    if (hasDuplicateCallFlowRecords(dataGridState.data, newCallFlowRecords, alertBarState)) {
      return;
    }

    const batchResults = await BatchPhoneNumberRecord.update(accessToken, newCallFlowRecords);

    if (batchResults?.hasError) {
      alertBarState.error("Error while updating the records. ".concat(batchResults.alertMsg));
      return;
    }

    alertBarState.success("Call Flow Rules have been successfully updated.");

    await deleteOppositeRows(batchResults.success, accessToken);

    setSelectedList(batchResults.failure);

    const refilteredFilteredData = dataGridState.filteredData.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, batchResults.success));
    const filteredData = dataGridState.data.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, batchResults.success));

    if (refilteredFilteredData?.length > 0) {
      dataGridState.setFilteredData(refilteredFilteredData);
    }

    dataGridState.setData(filteredData)
      .setIsPreviewModalOpen(false);

    //TODO: Figure why it won't take this datatype
    apiRef.current.setRowSelectionModel(batchResults.failure.map<number>(phoneNumberRecord => phoneNumberRecord.id));
  };

  const handleOnBatchDelete = async(phoneNumberRecords: Array<PhoneNumberRecordType> ) =>{
    const batchResults = await BatchPhoneNumberRecord.delete(accessToken, phoneNumberRecords);

    if(batchResults?.hasError) {
      alertBarState.error(batchResults.alertMsg);

      return;
    } else {
      alertBarState.success("Call Flow Rules have been successfully deleted.");
    }

    await deleteOppositeRows(phoneNumberRecords, accessToken);

    const selectedRowsData = batchResults?.failure?.map(phoneNumberRecord=>
      findMatchingRecordFromSearchList(phoneNumberRecord, dataGridState.filteredData));

    setSelectedList(selectedRowsData);

    const deletedIds = batchResults?.success?.map<string>(phoneNumberRecord=> PhoneNumberRecordUtil.getPkey(phoneNumberRecord));
    // Not really sure what to name filtering the dataGridState.filteredRows
    const refilteredFilteredData =
      dataGridState.filteredData.filter(phoneNumberRecord=> deletedIds.indexOf(PhoneNumberRecordUtil.getPkey(phoneNumberRecord)) === -1);
    const filteredData =
      dataGridState.data.filter(phoneNumberRecord=> deletedIds.indexOf(PhoneNumberRecordUtil.getPkey(phoneNumberRecord)) === -1);

    dataGridState.setFilteredData(refilteredFilteredData)
      .setData(filteredData)
      .setIsPreviewModalOpen(batchResults?.hasError || false)
      .setFetching(false);

    apiRef.current.setRowSelectionModel(batchResults.failure.map<number>(phoneNumberRecord => phoneNumberRecord.id));
  };

  PhoneNumberColumnDef[0].renderCell = (gridRenderCellParams: GridRenderCellParams<PhoneNumberRecordType>) =>
    (<a href="#" onClick={() => openEditModal(true, false, gridRenderCellParams.row)}>{`${gridRenderCellParams.value}`}</a>);

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomPhoneNumberGridToolBar
            phoneNumberDataGridManager={phoneNumberDataGridManager}
            exportDataFile={exportDataFile}
            matchedGroups={matchedGroups}
          />
          <DataGrid
            apiRef={apiRef}
            rows={dataGridState.state.filteredData}
            columns={PhoneNumberColumnDef}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataGridState.state.fetching}
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

      <AddPhoneNumber
        phoneNumberDataGridManager={phoneNumberDataGridManager}
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        cloneType={cloneType}
        clonedFormFields={clonedFormFieldsState.state}
      />

      <EditPhoneNumber
        phoneNumberDataGridManager={phoneNumberDataGridManager}
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        selectedRow={dataGridState.state.selectedRow}
        openEditModal={openEditModal}
        dataGridStateCallFlowRecords={dataGridState.data}
      />

      <PhoneNumberFilterModal
        phoneNumberDataGridManager={phoneNumberDataGridManager}
      />
      <CustomToast
        open={alertBarState.open}
        onClose={handleClose}
        msg={alertBarState.msg}
        severityType={alertBarState.severityType}
        duration={alertBarState.duration}
      />
      <PreviewModal
        isOpen={dataGridState.state.isPreviewModalOpen}
        rows={selectedList}
        onClose={handlePreviewModalOnClose}
        action={dataGridState.state.previewModalAction}
        maxId={dataGridState.state.maxId}
        onCreate={handleOnBatchCreate}
        onUpdate={handleOnBatchUpdate}
        onDelete={handleOnBatchDelete}
        loading={dataGridState.state.fetching}
      />
    </div>
  );
};

export default PhoneNumberDataGrid;



