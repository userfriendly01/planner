import React, {
  useEffect,
  useRef,
  useState
} from "react";
import {
  AddPageFieldConfigProps,
  CctSharedCallRoutingDb,
  PreviewModalAction,
  RoutingFilter,
  RoutingMasterData,
  RoutingStateVariables
} from "../AlohaRouting.Interfaces";
import { CustomRoutingGridToolBar } from "../RoutingCustomActions/CustomRoutingGridToolBar";
import RoutingAdvanceSearch from "../RoutingCustomActions/RoutingAdvanceSearch/RoutingAdvanceSearch";
import { AddRouting } from "../RoutingCustomActions/AddRouting/AddRouting";
import { EditRouting } from "../RoutingCustomActions/EditRouting/EditRouting";
import {
  AlertBarProps,
  FormValidationRule
} from "utils/interfaces";
import {
  routingBatchDelete,
  queryRoutingData,
  retrieveRoutingData,
  routingBatchCreate,
  routingBatchUpdate
} from "services/routingTableService";
import {
  CACHED_CALL_ROUTING_PAGE_NO,
  CACHED_CALL_ROUTING_PER_PAGE,
  CACHE_FILTER_ROUTING,
  routingFields,
  routingInitRule,
  routingInitState
} from "utils/routingUtils";
import {
  EXPORT_FILE_PREFIX,
  downloadCSV,
  initializedAlertBar
} from "utils/configUtils";
import {
  DataGrid,
  GridCallbackDetails,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  useGridApiRef
} from "@mui/x-data-grid";
import { RoutingGridColumnDef } from "./GridColumnDef";
import { AzureSPA } from "globals/interfaces";
import { CustomToast } from "components/CustomToast";
import { PreviewModal } from "../PreviewModal/PreviewModal";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import { getGridMasterData } from "./GridMaster";

export const DataGridRouting = (props: AzureSPA ): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = props;

  const [state, setState] = useState<RoutingStateVariables>(routingInitState);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(CACHED_CALL_ROUTING_PER_PAGE) ? +sessionStorage.getItem(CACHED_CALL_ROUTING_PER_PAGE) : 10,
    page: sessionStorage.getItem(CACHED_CALL_ROUTING_PAGE_NO) ? +sessionStorage.getItem(CACHED_CALL_ROUTING_PAGE_NO) : 1
  });
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const [routingRule, setRoutingRule] = useState({ ...routingInitRule });
  const [clonedRule, setClonedRule] = useState(false);
  const [selectedList, setSelectedList] = useState<Array<CctSharedCallRoutingDb>>([]);
  const maxRef = useRef(0);
  const apiRef = useGridApiRef();

  useEffect(() => {
    const getTableData = async()=>{
      const routingData: CctSharedCallRoutingDb[] = [];
      const firstChunkData:any = await queryRoutingData(accessToken, null);
      const listItems = firstChunkData.data?.listCctSharedCallRoutingGlobalDbs?.items || [];
      listItems.map((item:CctSharedCallRoutingDb) => routingData.push({
        ...item,
        id: parseInt(item?.skey?.split("__")[2], 10)
      }));
      loadDataTable(routingData);
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "info",
        msg: "Data loading in progress. Please wait for the complete set of data to be loaded.",
        duration: 15000
      }));
      const result: CctSharedCallRoutingDb[] = await retrieveRoutingData(accessToken,firstChunkData);
      loadDataTable(result);
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "success",
        msg: "Successfully loaded the routing data!!"
      }));
    };
    getTableData();
  }, []);
  const getAdvanceFilter = (): { [key: string]: undefined; } => {
    let advanceFilter: { [key: string]: undefined; };
    try {
      const cachedFilter: string | null = localStorage.getItem(CACHE_FILTER_ROUTING);
      advanceFilter = JSON.parse(cachedFilter) || {};
      Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
        if (advanceFilter[key] === "" || advanceFilter[key] === null) {
          delete advanceFilter[key];
        }
      });
    } catch (e) {
      advanceFilter = {};
    }

    return advanceFilter;
  };

  const handleSearchDDChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;
    if(name === "id"){
      value = parseInt(event.target.value);
    }
    setState(
      {
        ...state,
        advanceFilter: {
          ...state.advanceFilter,
          [name]: value
        }
      });
  };


  const filterRecords = (dataRec?: CctSharedCallRoutingDb[], minId?: number, maxId?: number): CctSharedCallRoutingDb[] => {
    let {
      data, idStart, idEnd
    } = state;
    if (dataRec && dataRec !== undefined) {
      data = dataRec;
      idStart = minId;
      idEnd = maxId;
    }
    const result: CctSharedCallRoutingDb[] = data.filter((item: CctSharedCallRoutingDb) => item.id >= idStart && item.id <= idEnd);
    const advanceFilter: RoutingFilter = getAdvanceFilter();
    const advanceFilterLength: number = Object.keys(advanceFilter).length;
    if (advanceFilterLength > 0) {
      const advanceFilteredArray: Array<CctSharedCallRoutingDb> = [];
      result.forEach(item => {
        let matched = 0;
        Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
          if(key === "id" && item && item[key]){
            const itemId = item?.id.toLocaleString().toString().replace(",","");
            const advanceKey = advanceFilter[key].toString().replace(",","");
            if (itemId.includes(advanceKey)) {
              matched += 1;
            }
          }
          else if (item[key] === advanceFilter[key]) {
            matched += 1;
          }
        });
        if (advanceFilterLength === matched) {
          advanceFilteredArray.push(item);
        }
      });
      return advanceFilteredArray;
    } else {
      return result;
    }
  };

  const applyFilter = (): void =>{
    const filteredItems: CctSharedCallRoutingDb[] = filterRecords();
    setState({
      ...state,
      filteredItems,
      isAdvanceSearchModalOpen: false,
      advanceFilter: getAdvanceFilter()
    });
  };

  const loadDataTable = (result?: CctSharedCallRoutingDb[]) => {
    if (result?.length > 0 && result[0]) {
      const sortedResult: CctSharedCallRoutingDb[] = result.sort(((a: CctSharedCallRoutingDb, b: CctSharedCallRoutingDb) => a.id - b.id));
      const minId: number = sortedResult[0].id;
      const maxId: number = sortedResult[result.length - 1].id;
      const masterData: RoutingMasterData = getGridMasterData(result);
      const advanceFilter: RoutingFilter = getAdvanceFilter();
      const filteredItems: CctSharedCallRoutingDb[] = filterRecords(result, minId, maxId);
      maxRef.current = maxId;
      setState({
        ...state,
        advanceFilter,
        data: result,
        fetching: false,
        filteredItems,
        idEnd: maxId,
        idStart: minId,
        isAddModalOpen: false,
        isAdvanceSearchModalOpen: false,
        isBulkEditModalOpen: false,
        isEditModalOpen: false,
        isPreviewModalOpen: false,
        masterData,
        maxId: maxId,
        minId: minId,
        saveSuccess: false
      });
    } else {
      setState({
        ...state,
        ...(result) && {
          data: result,
          filteredItems: result
        },
        fetching: false,
        isAddModalOpen: false,
        isEditModalOpen: false,
        isBulkEditModalOpen: false,
        isAdvanceSearchModalOpen: false
      });
    }
  };

  const openAddModal = (flag: boolean,openAddModal?:boolean, row?: CctSharedCallRoutingDb) => {
    let newData: CctSharedCallRoutingDb;
    if(!openAddModal){
      setClonedRule(openAddModal);
    }
    if (!flag) {
      if (row) {
        state.data.concat(row);
        newData = row;
      }

      setAlertBar(alertBarProps => ({
        ...alertBarProps,
        open: flag,
        severityType: "success",
        msg: "New route has been successfully added."
      }));
    }
    loadDataTable([newData]);
    setState({
      ...state,
      isAddModalOpen: flag
    });
  };

  const handlePaginationModelChange = (model: GridPaginationModel, details:GridCallbackDetails<any>) =>{
    sessionStorage.setItem(CACHED_CALL_ROUTING_PAGE_NO, model.page.toString());
    sessionStorage.setItem(CACHED_CALL_ROUTING_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const handleClose = (flag: boolean) => {
    setAlertBar(alertBarProps => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const openAdvanceSearchModal = (flag: boolean) => {
    if (state.advanceFilter && flag) {
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(state.advanceFilter));
    }
    setState({
      ...state,
      isAdvanceSearchModalOpen: flag
    });
  };

  const cloneRule = (flag: boolean, row: CctSharedCallRoutingDb) => {
    setClonedRule(!flag);
    row.id = maxRef.current + 1;
    const skey = row.brand+"__"+row.channel+"__"+row.id;
    row.skey = skey.split(" ").join("").toLocaleLowerCase();
    const routeInitRule = routingFields.reduce((a: FormValidationRule, v: AddPageFieldConfigProps) => ({
      ...a,
      [v.key]: {
        error: false,
        value: v.valueGetter(row),
        required: v.required || false
      }
    }), {});
    setRoutingRule({ ...routeInitRule });
    setState((currentDataRouting: RoutingStateVariables)=>({
      ...currentDataRouting,
      isEditModalOpen: flag,
      isAddModalOpen: !flag
    }));
  };

  const openBulkEditModal = (flag: boolean) =>{
    setState((dataFlowProps: RoutingStateVariables) => ({
      ...dataFlowProps,
      isBulkEditModalOpen: flag
    }));
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallRoutingDb, message?: string, deleteRow?: boolean,type?: boolean) => {
    let newData;
    if(type){
      cloneRule(flag,row);
    }
    else if (!flag && isSubmitted) {
      if(deleteRow) {
        newData = state.data.filter(x=> x.skey !== row.skey);
      } else {
        newData = row ? state.data.map(x=> x.skey === row.skey ? row : x) : undefined;
      }
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: message,
        severityType: "success"
      }));
      loadDataTable(newData);
    }
    setState((currentDataRouting: RoutingStateVariables)=>({
      ...currentDataRouting,
      isEditModalOpen: flag,
      selectedRow: row
    }));
  };

  const openPreviewModal = (flag: boolean, action: PreviewModalAction) =>{
    setState((dataFlowProps: RoutingStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: flag,
      previewModalAction: action
    }));
  };

  const exportDataFile = () =>{
    downloadCSV(EXPORT_FILE_PREFIX.ROUTING, state.filteredItems);
  };

  const handlePreviewModalOnClose = () =>{
    setState((dataFlowProps: RoutingStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: false
    }));
    apiRef.current.setRowSelectionModel([]);
  };

  const handleSelectionChanges = (gridSelectionModel: GridRowSelectionModel) =>{
    const selectedRowsData = gridSelectionModel.map((id: GridRowId)=>state.filteredItems.find((row: CctSharedCallRoutingDb)=>row.id === id));
    setSelectedList(selectedRowsData);
  };

  const handleOnBulkCreate = async(rows: Array<CctSharedCallRoutingDb> ) =>{
    const response = await routingBatchCreate(rows, accessToken);
    if(response?.flag) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: response.alertMsg || "Error while creating the records.",
        severityType: "error"
      }));
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Routing Rules have been successfully created.",
        severityType: "success"
      }));
    }

    const filteredItems = [...state.filteredItems , ...response.success];
    const filteredData = [...state.data , ...response.success];
    setSelectedList([...response.failure]);
    setState({
      ...state,
      ...filteredItems && { filteredItems },
      data: filteredData,
      isPreviewModalOpen: response?.flag || false
    });
    apiRef.current.setRowSelectionModel([]);
  };

  const handleOnBulkUpdate = async(rows: Array<CctSharedCallRoutingDb> ) =>{
    const response = await routingBatchUpdate(rows, accessToken);
    if(response?.flag) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: response.alertMsg || "Error while updating the records.",
        severityType: "error"
      }));
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Routing Rules have been successfully updated.",
        severityType: "success"
      }));
    }
    const selectedRowsData = response?.failure;
    setSelectedList(selectedRowsData);
    const filteredItems = state.filteredItems.map(x=> {
      const fi = response.success.filter(r=> r.skey === x.skey);
      if(fi.length >0){
        return fi[0];
      }
      else{
        return x;
      }
    });
    const filteredData = state.data.map(x=> {
      const fi = response.success.filter(r=> r.skey === x.skey);
      if(fi.length >0){
        return fi[0];
      }
      else{
        return x;
      }
    });
    setState({
      ...state,
      ...filteredItems && { filteredItems },
      data: filteredData,
      isPreviewModalOpen: response?.flag || false
    });
    apiRef.current.setRowSelectionModel([]);
  };

  const handleOnBulkDelete = async (rows: Array<CctSharedCallRoutingDb> ) =>{
    const keysToDelete = rows.map(x => {
      return {
        pkey: x.pkey,
        skey: x.skey,
        id: x.id
      };
    }
    );
    const response = await routingBatchDelete(keysToDelete, accessToken);
    if(response?.flag) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error deleting records.",
        severityType: "error"
      }));
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Routing Rules have been successfully deleted.",
        severityType: "success"
      }));
    }
    const selectedRowsData = response?.failure?.map(x=>state.filteredItems.find((row: CctSharedCallRoutingDb)=>row.id === x.id));
    setSelectedList(selectedRowsData);
    const deletedIds = response?.success?.map(x => x.id);
    const filteredItems = state?.filteredItems?.filter(x=> deletedIds.indexOf(x.id) === -1);
    const filteredData = state?.data?.filter(x=> deletedIds.indexOf(x.id) === -1);
    setState({
      ...state,
      ...filteredItems && { filteredItems },
      data: filteredData,
      isPreviewModalOpen: response?.flag || false,
      fetching: false
    });
    apiRef.current.setRowSelectionModel([]);
  };

  RoutingGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (<a href="#" onClick={() => openEditModal(true, false, params.row)}>{`${params.value}`}</a>);

  return (
    <div>
      <CustomRoutingGridToolBar
        applyFilter={applyFilter}
        exportDataFile={exportDataFile}
        isAdvanceSearchOpen={state.isAdvanceSearchModalOpen}
        openAddModal={openAddModal}
        openAdvanceSearchModal={openAdvanceSearchModal}
        openEditModal={openBulkEditModal}
        openPreviewModal={openPreviewModal}
        matchedGroups={matchedGroups}
      />
      <RoutingTableBox>
        <DataGrid
          apiRef={apiRef}
          autoHeight
          checkboxSelection
          columns={RoutingGridColumnDef}
          disableRowSelectionOnClick
          getRowId={(row: CctSharedCallRoutingDb)=>row.id}
          loading={state.fetching}
          pageSizeOptions={[10, 20, 50, 100]}
          pagination
          paginationMode="client"
          paginationModel={paginationModel}
          rows={state.filteredItems}
          onPaginationModelChange={handlePaginationModelChange}
          onRowSelectionModelChange={handleSelectionChanges}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600
            }
          }}
        />
      </RoutingTableBox>
      <AddRouting
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        isOpen={state.isAddModalOpen}
        newId={maxRef.current + 1}
        openModal={openAddModal}
        cloneRouteRule = {clonedRule}
        routeRule = {routingRule}
      />
      <EditRouting
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        isOpen={state.isEditModalOpen}
        selectedRow={state.selectedRow}
        openEditModal={openEditModal}
      />
      <RoutingAdvanceSearch
        isOpen={state.isAdvanceSearchModalOpen}
        selection={state.advanceFilter}
        openModal={openAdvanceSearchModal}
        handleChange={handleSearchDDChange}
        masterData={state.masterData}
        applyFilter={applyFilter}
      />
      <CustomToast
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
        duration={alertBar.duration}
      />
      <PreviewModal
        action={state.previewModalAction}
        isOpen={state.isPreviewModalOpen}
        onClose={handlePreviewModalOnClose}
        onCreate={handleOnBulkCreate}
        onDelete={handleOnBulkDelete}
        onUpdate={handleOnBulkUpdate}
        rows={selectedList}
        maxId={maxRef.current}
        loading={state.fetching}
      />
    </div>
  );
};
