/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/
import React, {
  useEffect, useState
} from "react";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import {
  retrieveFlowData, queryFlowData
} from "services";
import {
  CACHE_FILTER_FLOW,
  CALL_FLOW_PAGE_NO,
  CALL_FLOW_PER_PAGE,
  getGraphQLEndpoint,
  initializedAlertBar,
  downloadCSV,
  EXPORT_FILE_PREFIX,
  getAdvanceFilter
} from "utils";
import { CustomToast } from "components";
import {
  AddFlowFieldsConfigProps,
  CctSharedCallFlowDb, FlowAdvanceFilter, FlowStateVariables
} from "../AlohaFlow.Interfaces";
import "./Grid.scss";
import FlowGridColumnDef from "./GridColumnDef";
import {
  getGridMasterData
} from "./GridMaster";
import GridSpinner from "./GridSpinner";
import {
  AddFlow, AdvanceSearchModal, CustomFlowGridToolBar, EditFlow
} from "../CustomActions";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import { AzureSPA } from "globals";
import { flowFields } from "../CustomActions/FlowFieldsConfig";
import { RowingOutlined } from "@mui/icons-material";

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
    isAddModalOpen: false,
    isAdvanceSearchModalOpen: false,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0,
    saveSuccess: 0,
    page: sessionStorage.getItem(CALL_FLOW_PAGE_NO) ? +sessionStorage.getItem(CALL_FLOW_PAGE_NO) : 1,
    perPage: sessionStorage.getItem(CALL_FLOW_PER_PAGE) ? +sessionStorage.getItem(CALL_FLOW_PER_PAGE) : 10
  };
  const [dataFlow, setDataFlow] = useState(flowInitState);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const [clonedFlowRule, setClonedFlowRule] = useState({});
  const [cloneType, setCloneType] = useState(false);
  useEffect(() => {
    const getTableData = async()=>{
      const firstChunkData:any = await queryFlowData(accessToken, null, graphQLEndpoint);
      const listItems = firstChunkData?.data?.listCctSharedCallFlowDbs?.items || [];
      let counter =1;
      const flowData: CctSharedCallFlowDb[] = [];
      listItems.forEach((item: CctSharedCallFlowDb) => flowData.push({
        id: counter++,
        ...item
      }));
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

  const setPage = (newPage: number) => {
    sessionStorage.setItem(CALL_FLOW_PAGE_NO, newPage.toString());
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      page: newPage
    }));
  };

  const setPerPage = (newPerPage: number) => {
    sessionStorage.setItem(CALL_FLOW_PER_PAGE, newPerPage.toString());
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      perPage: newPerPage
    }));
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
        msg: "New flow has been successfully added!! "
      }));
      const updatedRow: CctSharedCallFlowDb  = {
        ...row,
        id: dataFlow.data.length
      };
      newData.push(updatedRow);
      newFilteredItems.push(updatedRow);
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

  FlowGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallFlowDb>) => (<a href="#" onClick={() => openEditModal(true, false, params.row)}>{`${params.value}`}</a>);


  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomFlowGridToolBar
            openAddModal={openAddModal}
            openAdvanceSearchModal={openAdvanceSearchModal}
            exportDataFile={exportDataFile}
            applyFilter={filterRecords}
            isAdvanceSearchOpen={dataFlow.isAdvanceSearchModalOpen}
          />
          <DataGrid
            rows={dataFlow.filteredItems}
            columns={FlowGridColumnDef}
            page={dataFlow.page}
            pageSize={dataFlow.perPage}
            onPageChange={(newPage: number) => setPage(newPage)}
            onPageSizeChange={(newPageSize: number) => setPerPage(newPageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataFlow.fetching}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            components={
              {
                Toolbar: GridToolbar,
                LoadingOverlay: GridSpinner
              }
            }
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
    </div>
  );
};

export default DataGridFlow;

