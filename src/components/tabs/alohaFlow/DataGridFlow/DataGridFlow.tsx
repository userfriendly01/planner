/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/
import {
  DataGrid, GridRenderCellParams, GridRowId, GridRowSelectionModel, GridPaginationModel, GridCallbackDetails
} from "@mui/x-data-grid";
import { CustomToast } from "components";
import { AzureSPA } from "globals";
import React, {
  useEffect, useState
} from "react";
import {
  queryFlowData, retrieveFlowData, flowBatchDelete, batchFlowUpdate, batchFlowCreate
} from "services";
import {
  CACHE_FILTER_FLOW,
  CALL_FLOW_PAGE_NO,
  CALL_FLOW_PER_PAGE, downloadCSV,
  EXPORT_FILE_PREFIX,
  getAdvanceFilter, getGraphQLEndpoint,
  initializedAlertBar
} from "utils";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import {
  AddFlowFieldsConfigProps,
  CctSharedCallFlowDb, FlowAdvanceFilter, FlowStateVariables, PreviewModalAction
} from "../AlohaFlow.Interfaces";
import {
  AddFlow, AdvanceSearchModal, CustomFlowGridToolBar, EditFlow
} from "../CustomActions";
import { flowFields } from "../CustomActions/FlowFieldsConfig";
import "./Grid.scss";
import FlowGridColumnDef from "./GridColumnDef";
import {
  getGridMasterData
} from "./GridMaster";
import { PreviewModal } from "../PreviewModal";

const DataGridFlow = (props: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = props;

  const graphQLEndpoint = getGraphQLEndpoint();

  const flowInitState: FlowStateVariables = {
    data: [],
    filteredItems: [] ,
    advanceFilter: {},
    fetching: true,
    selectedRow: undefined,
    isEditModalOpen: false,
    isPreviewModalOpen: false,
    isAddModalOpen: false,
    isAdvanceSearchModalOpen: false,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0,
    saveSuccess: 0
  };
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(CALL_FLOW_PER_PAGE) ? +sessionStorage.getItem(CALL_FLOW_PER_PAGE) : 10,
    page: sessionStorage.getItem(CALL_FLOW_PAGE_NO) ? +sessionStorage.getItem(CALL_FLOW_PAGE_NO) : 1
  });
  const [dataFlow, setDataFlow] = useState(flowInitState);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const [clonedFlowRule, setClonedFlowRule] = useState({});
  const [cloneType, setCloneType] = useState(false);
  const [selectedList, setSelectedList] = useState<Array<CctSharedCallFlowDb>>([]);

  useEffect(() => {
    const getTableData = async()=>{
      const firstChunkData:any = await queryFlowData(accessToken, null, graphQLEndpoint);
      const listItems = firstChunkData?.data?.listCctSharedCallFlowDbs?.items || [];
      let counter =1;
      const flowData: CctSharedCallFlowDb[] = [];
      listItems.forEach((item: CctSharedCallFlowDb) => {
        if (item) {
          flowData.push({
            ...item,
            id: counter++
          });
        }
      });

      await loadDataTable(flowData);
      const result: CctSharedCallFlowDb[] = await retrieveFlowData(
        accessToken,
        graphQLEndpoint,
        firstChunkData
      );
      await loadDataTable(result);
    };
    getTableData();
  }, []);

  const handlePaginationModelChange = (model: GridPaginationModel, details:GridCallbackDetails<any>) =>{
    sessionStorage.setItem(CALL_FLOW_PAGE_NO, model.page.toString());
    sessionStorage.setItem(CALL_FLOW_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const handleSearchDDChange = (event: any) => {
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      advanceFilter: {
        ...dataFlowProps.advanceFilter,
        [event.target.name]: event.target.value
      }
    }));
  };

  const openAddModal = (flag: boolean, isSubmitted?: boolean, row?:CctSharedCallFlowDb, openCloneAddModal?: boolean) => {
    const newData: Array<CctSharedCallFlowDb> = [...dataFlow.data];
    const newFilteredItems: Array<CctSharedCallFlowDb> = [...dataFlow.filteredItems];
    if(!openCloneAddModal){
      setCloneType(openCloneAddModal);
    }else if(!flag && isSubmitted ){
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: flag,
        severityType: "success",
        msg: "New flow has been successfully added. "
      }));
      newData.push(row);
      newFilteredItems.push(row);
    }
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      ...(!flag && isSubmitted && row) && {
        data: newData,
        filteredItems: newFilteredItems
      },
      isAddModalOpen: flag
    }));
  };

  const openAdvanceSearchModal = (flag: boolean, advanceFilter?: FlowAdvanceFilter) => {
    if (advanceFilter) {
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(dataFlow?.advanceFilter));
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        advanceFilter
      }));
    }
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      isAdvanceSearchModalOpen: flag
    }));
  };

  const filterRecords = (dataRec?: CctSharedCallFlowDb[], minId?: number, maxId?: number) => {
    let {
      data, idStart, idEnd
    } = dataFlow;
    if (dataRec && dataRec !== undefined) {
      data = dataRec;
      idStart = minId;
      idEnd = maxId;
    }
    const result = data.filter(
      (item: CctSharedCallFlowDb) => item.id >= idStart && item.id <= idEnd
    );
    const advanceFilter = getAdvanceFilter(CACHE_FILTER_FLOW);
    const advanceFilterLength: number = Object.keys(advanceFilter).length;
    if (advanceFilterLength > 0) {
      const advanceFilteredArray: Array<FlowAdvanceFilter> = [];
      result.forEach(item => {
        let matched = 0;
        Object.keys(advanceFilter).forEach(key => {
          let tempItem: any = item;
          if (key === "callFlowRoute") {
            tempItem = tempItem.content;
          }
          if (key === "pkey" && tempItem && tempItem[key]) {
            if (tempItem[key].includes(advanceFilter[key])) {
              matched += 1;
            }
          } else if (tempItem && tempItem[key] === advanceFilter[key]) {
            matched += 1;
          }
        });
        if (advanceFilterLength === matched) {
          advanceFilteredArray.push(item);
        }
      });
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        filteredItems: advanceFilteredArray,
        advanceFilter
      }));
    } else {
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        filteredItems: result,
        advanceFilter
      }));
    }
  };


  const loadDataTable = async (result?: CctSharedCallFlowDb[]) => {
    if (result?.length > 0) {
      result = result.sort((a: CctSharedCallFlowDb, b: CctSharedCallFlowDb) => (a.id - b.id));
      result = result.map((item: CctSharedCallFlowDb, index: number) => ({
        ...item,
        id: index + 1
      }));
      const minId: number = result[0].id;
      const maxId: number = result[result.length - 1].id;

      const masterData = getGridMasterData(result);
      const advanceFilter: FlowAdvanceFilter = getAdvanceFilter(CACHE_FILTER_FLOW);
      const advanceFilterLength: number = Object.keys(advanceFilter).length;
      if (advanceFilterLength > 0) {
        filterRecords(result, minId, maxId);
      }
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        data: result,
        filteredItems: result,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        maxId,
        minId,
        masterData
      }));

    } else {
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        ...(result) && {
          data: result,
          filteredItems: result
        },
        fetching: false
      }));
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error in retrieving Flow record. Please check the API Key",
        severityType: "error"
      }));
    }
  };

  const exportDataFile = () =>{
    downloadCSV(EXPORT_FILE_PREFIX.FLOW, dataFlow.filteredItems);
  };

  const cloneRule=(flag:boolean,row:CctSharedCallFlowDb)=>{
    const clonedRow = {
      ...row,
      pkey: ""
    };
    const flowInitRule: FormValidationRule = flowFields.reduce((a: FormValidationRule, v: AddFlowFieldsConfigProps) => ({
      ...a,
      [v.key]: {
        error: false,
        value: v.valueGetter(clonedRow),
        required: v.required || false
      }
    }), {});
    setCloneType(!flag);
    setClonedFlowRule(flowInitRule);
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      isEditModalOpen: flag,
      isAddModalOpen: !flag
    }));
  };

  const openPreviewModal = (flag: boolean, action: PreviewModalAction) =>{
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: flag,
      previewModalAction: action
    }));
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallFlowDb, message?: string, deleteRow?: boolean, isClonedFlowRule?: boolean) => {
    if(isClonedFlowRule){
      cloneRule(flag,row);
    }
    else if (!flag && isSubmitted) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: message,
        severityType: "success"
      }));
    }
    setDataFlow((currentDataFlow: FlowStateVariables) => (
      {
        ...currentDataFlow,
        ...(!flag && isSubmitted && deleteRow) && {
          data: currentDataFlow.data.filter(x=> x.id !== row.id),
          filteredItems: currentDataFlow.data.filter(x=> x.id !== row.id)
        },
        ...(!flag && isSubmitted && !deleteRow && row) && {
          data: currentDataFlow.data.map(x=> x.id === row.id ? row : x),
          filteredItems: currentDataFlow.data.map(x=> x.id === row.id ? row : x)
        },
        isEditModalOpen: flag,
        selectedRow: row
      }
    ));
  };

  const handlePreviewModalOnClose = () =>{
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: false
    }));
  };

  const handleSelectionChanges = (gridSelectionModel: GridRowSelectionModel) =>{
    const selectedRowsData = gridSelectionModel.map((id: GridRowId)=>dataFlow.filteredItems.find((row: CctSharedCallFlowDb)=>row.pkey === id));
    setSelectedList(selectedRowsData);
  };

  const handleOnBulkCreate = async(rows: Array<CctSharedCallFlowDb> ) =>{
    const response = await batchFlowCreate(rows, accessToken, graphQLEndpoint);
    if(!response || response.errors) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error while creating the records.",
        severityType: "error"
      }));
      throw new Error("Error while creating the records.");
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Flow Rules have been successfully created.",
        severityType: "success"
      }));
    }

    const filteredItems = [...dataFlow.filteredItems, ...rows];
    const filteredData = [...dataFlow.data, ...rows];
    setSelectedList([]);
    setDataFlow({
      ...dataFlow,
      ...filteredItems && { filteredItems },
      data: filteredData,
      isPreviewModalOpen: false
    });
  };

  const handleOnBulkUpdate = async(rows: Array<CctSharedCallFlowDb> ) =>{
    const response = await batchFlowUpdate(rows, accessToken, graphQLEndpoint);
    if(!response || response.errors) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error while updating the records.",
        severityType: "error"
      }));
      throw new Error("Error while updating the records.");
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Flow Rules have been successfully updated.",
        severityType: "success"
      }));
    }

    const filteredItems = dataFlow.filteredItems.map(x=> {
      const fi = rows.filter(r=> r.pkey === x.pkey);
      if(fi.length >0){
        return fi[0];
      }
      else{
        return x;
      }
    });
    const filteredData = dataFlow.data.map(x=> {
      const fi = rows.filter(r=> r.pkey === x.pkey);
      if(fi.length >0){
        return fi[0];
      }
      else{
        return x;
      }
    });
    setSelectedList([]);
    setDataFlow({
      ...dataFlow,
      ...filteredItems && { filteredItems },
      data: filteredData,
      isPreviewModalOpen: false
    });
  };

  const handleOnBulkDelete = async(rows: Array<CctSharedCallFlowDb> ) =>{
    const keysToDelete = rows.map(x => x.pkey);
    const response = await flowBatchDelete(keysToDelete, accessToken, graphQLEndpoint);

    if(!response || response.errors) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error deleting records.",
        severityType: "error"
      }));
      throw new Error("Error deleting records.");
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Flow Rules have been successfully deleted.",
        severityType: "success"
      }));
    }
    setSelectedList([]);
    const deletedIds = rows.map(x => x.pkey);
    const filteredItems = dataFlow.filteredItems.filter(x=> deletedIds.indexOf(x.pkey) === -1);
    const filteredData = dataFlow.data.filter(x=> deletedIds.indexOf(x.pkey) === -1);

    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      filteredItems,
      data: filteredData,
      isPreviewModalOpen: false
    }));
  };

  FlowGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallFlowDb>) => (<a href="#" onClick={() => openEditModal(true, false, params.row)}>{`${params.value}`}</a>);


  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomFlowGridToolBar
            openAddModal={openAddModal}
            openPreviewModal={openPreviewModal}
            openAdvanceSearchModal={openAdvanceSearchModal}
            exportDataFile={exportDataFile}
            applyFilter={filterRecords}
            isAdvanceSearchOpen={dataFlow.isAdvanceSearchModalOpen}
          />
          <DataGrid
            rows={dataFlow.filteredItems}
            columns={FlowGridColumnDef}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataFlow.fetching}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowId={(row: CctSharedCallFlowDb)=>row.pkey}
            onRowSelectionModelChange={handleSelectionChanges}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />
        </div>
      </div>

      <AddFlow
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        isOpen={dataFlow.isAddModalOpen}
        newId={dataFlow.maxId + 1}
        openAddModal={openAddModal}
        cloneType={cloneType}
        flowRuleCloned={clonedFlowRule}
      />

      <EditFlow
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        isOpen={dataFlow.isEditModalOpen}
        selectedRow={dataFlow.selectedRow}
        openEditModal={openEditModal}
      />

      <AdvanceSearchModal
        isOpen={dataFlow.isAdvanceSearchModalOpen}
        selection={dataFlow.advanceFilter}
        openModal={openAdvanceSearchModal}
        handleChange={handleSearchDDChange}
        masterData={dataFlow.masterData}
        applyFilter={filterRecords}
        onClose={() => {
          openAdvanceSearchModal(false);
          return true;
        }}
      />
      <CustomToast
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
      />
      <PreviewModal
        isOpen={dataFlow.isPreviewModalOpen}
        rows={selectedList}
        onClose={handlePreviewModalOnClose}
        action={dataFlow.previewModalAction}
        maxId={dataFlow.maxId}
        onCreate={handleOnBulkCreate}
        onUpdate={handleOnBulkUpdate}
        onDelete={handleOnBulkDelete}
      />
    </div>
  );
};

export default DataGridFlow;

